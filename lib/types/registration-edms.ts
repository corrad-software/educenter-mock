import type { ApplicationStatus, StudentApplication } from '@/lib/types/student-lifecycle';
import type { EducationLevel, SubsidyCategory } from '@/lib/types';

export type RegistrationDocumentType =
  | 'birth_cert'
  | 'student_ic'
  | 'guardian_ic'
  | 'address_proof'
  | 'other';

export type RegistrationDocumentStatus = 'uploaded' | 'verified' | 'rejected';

export type RegistrationSource = 'self_service' | 'internal' | 'mock';

export interface RegistrationDocumentRecord {
  id: string;
  applicationId: string;
  applicationRef: string;
  docType: RegistrationDocumentType;
  originalName: string;
  storedName: string;
  relativePath: string;
  mimeType: string;
  size: number;
  status: RegistrationDocumentStatus;
  remarks?: string;
  uploadedAt: string;
  uploadedBy: string;
  updatedAt?: string;
}

export interface RegistrationDocumentSummary {
  requiredCount: number;
  uploadedRequiredCount: number;
  verifiedRequiredCount: number;
  hasAllRequired: boolean;
}

export interface RegistrationApplicationExtended {
  id: string;
  applicationRef: string;
  source: RegistrationSource;
  studentName: string;
  ic: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianIc?: string;
  centreId: string;
  centreName: string;
  educationLevel: EducationLevel;
  subsidyCategory: SubsidyCategory;
  status: ApplicationStatus;
  appliedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  notes?: string;
  remarks?: string;
  documents?: RegistrationDocumentRecord[];
  documentSummary?: RegistrationDocumentSummary;
}

export interface RegistrationAuditRecord {
  id: string;
  timestamp: string;
  actorType: 'guardian' | 'admin' | 'system';
  actorId?: string;
  actorName?: string;
  action:
    | 'application_submitted'
    | 'application_review_started'
    | 'application_approved'
    | 'application_rejected'
    | 'document_uploaded'
    | 'document_viewed'
    | 'document_downloaded'
    | 'document_verified'
    | 'document_rejected';
  entityType: 'application' | 'document';
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  notes?: string;
}

export interface RegistrationSubmissionInput {
  studentName: string;
  ic: string;
  dateOfBirth: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianIc: string;
  centreId: string;
  centreName: string;
  educationLevel: EducationLevel;
  subsidyCategory: SubsidyCategory;
  notes?: string;
}

export type ReviewAction = 'approve' | 'reject';

export const REQUIRED_REGISTRATION_DOCS: RegistrationDocumentType[] = [
  'birth_cert',
  'student_ic',
  'guardian_ic',
  'address_proof',
];

export type LegacyStudentApplication = StudentApplication;
