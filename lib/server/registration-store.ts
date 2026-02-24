import { promises as fs } from 'fs';
import path from 'path';
import { mockApplications } from '@/lib/mock-data/student-lifecycle';
import type { ApplicationStatus } from '@/lib/types/student-lifecycle';
import type {
  RegistrationApplicationExtended,
  RegistrationAuditRecord,
  RegistrationDocumentRecord,
  RegistrationDocumentSummary,
  RegistrationDocumentType,
  RegistrationSubmissionInput,
  ReviewAction,
} from '@/lib/types/registration-edms';
import { REQUIRED_REGISTRATION_DOCS } from '@/lib/types/registration-edms';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILES_DIR = path.join(DATA_DIR, 'edms', 'files');
const APPLICATIONS_PATH = path.join(DATA_DIR, 'registration-applications.json');
const DOCUMENTS_PATH = path.join(DATA_DIR, 'edms-documents.json');
const AUDIT_PATH = path.join(DATA_DIR, 'edms-audit.json');

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function ensureStorage() {
  await fs.mkdir(FILES_DIR, { recursive: true });
  await ensureFile(APPLICATIONS_PATH, '[]');
  await ensureFile(DOCUMENTS_PATH, '[]');
  await ensureFile(AUDIT_PATH, '[]');
}

async function ensureFile(filePath: string, initialContent: string) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, initialContent, 'utf8');
  }
}

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  await ensureStorage();
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJsonArrayAtomic<T>(filePath: string, data: T[]): Promise<void> {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tempPath, filePath);
}

function toExtendedApplication(app: typeof mockApplications[number]): RegistrationApplicationExtended {
  return {
    id: app.id,
    applicationRef: `LEGACY-${app.id.toUpperCase()}`,
    source: 'mock',
    studentName: app.studentName,
    ic: app.ic,
    dateOfBirth: app.dateOfBirth.toISOString(),
    guardianName: app.guardianName,
    guardianPhone: app.guardianPhone,
    guardianEmail: app.guardianEmail,
    centreId: app.centreId,
    centreName: app.centreName,
    educationLevel: app.educationLevel,
    subsidyCategory: app.subsidyCategory,
    status: app.status,
    appliedDate: app.appliedDate.toISOString(),
    reviewedDate: app.reviewedDate?.toISOString(),
    reviewedBy: app.reviewedBy,
    notes: app.notes,
  };
}

function buildDocSummary(documents: RegistrationDocumentRecord[]): RegistrationDocumentSummary {
  const requiredDocs = documents.filter((d) => REQUIRED_REGISTRATION_DOCS.includes(d.docType));
  const uniqueRequiredUploaded = new Set(requiredDocs.map((d) => d.docType));
  const uniqueRequiredVerified = new Set(
    requiredDocs.filter((d) => d.status === 'verified').map((d) => d.docType)
  );

  return {
    requiredCount: REQUIRED_REGISTRATION_DOCS.length,
    uploadedRequiredCount: uniqueRequiredUploaded.size,
    verifiedRequiredCount: uniqueRequiredVerified.size,
    hasAllRequired: REQUIRED_REGISTRATION_DOCS.every((type) => uniqueRequiredUploaded.has(type)),
  };
}

function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

async function nextApplicationRef(existing: RegistrationApplicationExtended[]): Promise<string> {
  const year = new Date().getFullYear();
  const seq = existing.filter((a) => a.applicationRef.startsWith(`APP-${year}-`)).length + 1;
  return `APP-${year}-${String(seq).padStart(5, '0')}`;
}

export async function listStoredApplications(): Promise<RegistrationApplicationExtended[]> {
  return readJsonArray<RegistrationApplicationExtended>(APPLICATIONS_PATH);
}

export async function listDocuments(): Promise<RegistrationDocumentRecord[]> {
  return readJsonArray<RegistrationDocumentRecord>(DOCUMENTS_PATH);
}

export async function listAuditLogs(): Promise<RegistrationAuditRecord[]> {
  return readJsonArray<RegistrationAuditRecord>(AUDIT_PATH);
}

export async function appendAudit(log: Omit<RegistrationAuditRecord, 'id' | 'timestamp'>): Promise<RegistrationAuditRecord> {
  const logs = await listAuditLogs();
  const next: RegistrationAuditRecord = {
    id: generateId('audit'),
    timestamp: new Date().toISOString(),
    ...log,
  };
  logs.unshift(next);
  await writeJsonArrayAtomic(AUDIT_PATH, logs);
  return next;
}

export async function listApplicationsMerged(): Promise<RegistrationApplicationExtended[]> {
  const stored = await listStoredApplications();
  const docs = await listDocuments();
  const mockExtended = mockApplications.map(toExtendedApplication);

  const merged = [...stored, ...mockExtended].map((app) => {
    const appDocs = docs.filter((d) => d.applicationId === app.id);
    return {
      ...app,
      documents: appDocs,
      documentSummary: buildDocSummary(appDocs),
    };
  });

  return merged.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
}

export async function findApplicationByRefAndGuardianIc(applicationRef: string, guardianIc: string): Promise<RegistrationApplicationExtended | null> {
  const apps = await listStoredApplications();
  const docs = await listDocuments();
  const app = apps.find(
    (item) => item.applicationRef.toLowerCase() === applicationRef.toLowerCase() && (item.guardianIc ?? '').trim() === guardianIc.trim()
  );
  if (!app) return null;
  const appDocs = docs.filter((d) => d.applicationId === app.id);
  return {
    ...app,
    documents: appDocs,
    documentSummary: buildDocSummary(appDocs),
  };
}

export async function createRegistrationApplication(params: {
  input: RegistrationSubmissionInput;
  filesByType: Partial<Record<RegistrationDocumentType, File[]>>;
  ipAddress?: string;
}): Promise<{ application: RegistrationApplicationExtended; documents: RegistrationDocumentRecord[] }> {
  await ensureStorage();

  const { input, filesByType, ipAddress } = params;
  const missingRequired = REQUIRED_REGISTRATION_DOCS.filter((type) => !(filesByType[type] && filesByType[type]!.length > 0));
  if (missingRequired.length > 0) {
    throw new Error(`Missing required documents: ${missingRequired.join(', ')}`);
  }

  const allFiles = Object.values(filesByType).flat().filter(Boolean) as File[];
  const overLimit = allFiles.find((file) => file.size > MAX_FILE_BYTES);
  if (overLimit) {
    throw new Error(`File too large: ${overLimit.name}`);
  }

  const applications = await listStoredApplications();
  const docs = await listDocuments();
  const applicationId = generateId('app');
  const applicationRef = await nextApplicationRef(applications);
  const now = new Date().toISOString();

  const newApp: RegistrationApplicationExtended = {
    id: applicationId,
    applicationRef,
    source: 'self_service',
    studentName: input.studentName,
    ic: input.ic,
    dateOfBirth: input.dateOfBirth,
    guardianName: input.guardianName,
    guardianPhone: input.guardianPhone,
    guardianEmail: input.guardianEmail,
    guardianIc: input.guardianIc,
    centreId: input.centreId,
    centreName: input.centreName,
    educationLevel: input.educationLevel,
    subsidyCategory: input.subsidyCategory,
    status: 'submitted',
    appliedDate: now,
    notes: input.notes,
  };

  const appDir = path.join(FILES_DIR, applicationId);
  await fs.mkdir(appDir, { recursive: true });

  const savedDocs: RegistrationDocumentRecord[] = [];

  for (const [docType, files] of Object.entries(filesByType) as Array<[RegistrationDocumentType, File[] | undefined]>) {
    for (const file of files ?? []) {
      const docId = generateId('doc');
      const originalName = safeName(file.name || 'file');
      const storedName = `${docId}-${originalName}`;
      const fullPath = path.join(appDir, storedName);
      const relativePath = path.join('edms', 'files', applicationId, storedName);
      const bytes = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(fullPath, bytes);

      const record: RegistrationDocumentRecord = {
        id: docId,
        applicationId,
        applicationRef,
        docType,
        originalName: file.name,
        storedName,
        relativePath,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        status: 'uploaded',
        uploadedAt: now,
        uploadedBy: input.guardianName,
      };
      docs.push(record);
      savedDocs.push(record);

      await appendAudit({
        actorType: 'guardian',
        actorName: input.guardianName,
        action: 'document_uploaded',
        entityType: 'document',
        entityId: docId,
        ipAddress,
        notes: `Uploaded ${docType}`,
      });
    }
  }

  applications.push(newApp);
  await writeJsonArrayAtomic(APPLICATIONS_PATH, applications);
  await writeJsonArrayAtomic(DOCUMENTS_PATH, docs);

  await appendAudit({
    actorType: 'guardian',
    actorName: input.guardianName,
    action: 'application_submitted',
    entityType: 'application',
    entityId: applicationId,
    ipAddress,
    notes: `Reference ${applicationRef}`,
  });

  return {
    application: {
      ...newApp,
      documents: savedDocs,
      documentSummary: buildDocSummary(savedDocs),
    },
    documents: savedDocs,
  };
}

export async function reviewApplication(params: {
  applicationId: string;
  action: ReviewAction;
  remarks?: string;
  reviewerName?: string;
  ipAddress?: string;
}): Promise<RegistrationApplicationExtended> {
  const applications = await listStoredApplications();
  const docs = await listDocuments();
  const idx = applications.findIndex((item) => item.id === params.applicationId);

  if (idx < 0) {
    throw new Error('Application not found');
  }

  const current = applications[idx];
  const appDocs = docs.filter((d) => d.applicationId === params.applicationId);
  const summary = buildDocSummary(appDocs);

  if (params.action === 'approve' && !summary.hasAllRequired) {
    throw new Error('Cannot approve: required documents are incomplete');
  }

  if (params.action === 'reject' && !params.remarks?.trim()) {
    throw new Error('Rejection remarks are required');
  }

  const nextStatus: ApplicationStatus = params.action === 'approve' ? 'approved' : 'rejected';
  const updated: RegistrationApplicationExtended = {
    ...current,
    status: nextStatus,
    reviewedDate: new Date().toISOString(),
    reviewedBy: params.reviewerName ?? 'Centre Admin',
    remarks: params.remarks,
  };

  applications[idx] = updated;
  await writeJsonArrayAtomic(APPLICATIONS_PATH, applications);

  await appendAudit({
    actorType: 'admin',
    actorName: params.reviewerName ?? 'Centre Admin',
    action: params.action === 'approve' ? 'application_approved' : 'application_rejected',
    entityType: 'application',
    entityId: params.applicationId,
    before: { status: current.status },
    after: { status: updated.status },
    ipAddress: params.ipAddress,
    notes: params.remarks,
  });

  return {
    ...updated,
    documents: appDocs,
    documentSummary: summary,
  };
}

export async function verifyDocument(params: {
  documentId: string;
  status: 'verified' | 'rejected';
  remarks?: string;
  reviewerName?: string;
  ipAddress?: string;
}): Promise<RegistrationDocumentRecord> {
  const docs = await listDocuments();
  const idx = docs.findIndex((d) => d.id === params.documentId);
  if (idx < 0) {
    throw new Error('Document not found');
  }

  const before = docs[idx];
  const next: RegistrationDocumentRecord = {
    ...before,
    status: params.status,
    remarks: params.remarks,
    updatedAt: new Date().toISOString(),
  };
  docs[idx] = next;
  await writeJsonArrayAtomic(DOCUMENTS_PATH, docs);

  await appendAudit({
    actorType: 'admin',
    actorName: params.reviewerName ?? 'Centre Admin',
    action: params.status === 'verified' ? 'document_verified' : 'document_rejected',
    entityType: 'document',
    entityId: params.documentId,
    before: { status: before.status },
    after: { status: next.status },
    ipAddress: params.ipAddress,
    notes: params.remarks,
  });

  return next;
}

export async function resolveDocumentPath(documentId: string): Promise<{ document: RegistrationDocumentRecord; absolutePath: string } | null> {
  const docs = await listDocuments();
  const document = docs.find((d) => d.id === documentId);
  if (!document) return null;
  const absolutePath = path.join(DATA_DIR, document.relativePath);
  return { document, absolutePath };
}

export async function listDocumentsFiltered(filters: {
  applicationRef?: string;
  docType?: RegistrationDocumentType;
  status?: 'uploaded' | 'verified' | 'rejected';
}): Promise<RegistrationDocumentRecord[]> {
  const docs = await listDocuments();
  return docs
    .filter((doc) => (filters.applicationRef ? doc.applicationRef.toLowerCase().includes(filters.applicationRef.toLowerCase()) : true))
    .filter((doc) => (filters.docType ? doc.docType === filters.docType : true))
    .filter((doc) => (filters.status ? doc.status === filters.status : true))
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export { MAX_FILE_BYTES, REQUIRED_REGISTRATION_DOCS };
