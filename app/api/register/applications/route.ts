import { NextResponse } from 'next/server';
import { createRegistrationApplication, MAX_FILE_BYTES, REQUIRED_REGISTRATION_DOCS } from '@/lib/server/registration-store';
import type { RegistrationDocumentType, RegistrationSubmissionInput } from '@/lib/types/registration-edms';

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const input: RegistrationSubmissionInput = {
      studentName: String(formData.get('studentName') ?? '').trim(),
      ic: String(formData.get('ic') ?? '').trim(),
      dateOfBirth: String(formData.get('dateOfBirth') ?? '').trim(),
      guardianName: String(formData.get('guardianName') ?? '').trim(),
      guardianPhone: String(formData.get('guardianPhone') ?? '').trim(),
      guardianEmail: String(formData.get('guardianEmail') ?? '').trim(),
      guardianIc: String(formData.get('guardianIc') ?? '').trim(),
      centreId: String(formData.get('centreId') ?? '').trim(),
      centreName: String(formData.get('centreName') ?? '').trim(),
      educationLevel: String(formData.get('educationLevel') ?? '').trim() as RegistrationSubmissionInput['educationLevel'],
      subsidyCategory: String(formData.get('subsidyCategory') ?? '').trim() as RegistrationSubmissionInput['subsidyCategory'],
      notes: String(formData.get('notes') ?? '').trim() || undefined,
    };

    const requiredFields: Array<keyof RegistrationSubmissionInput> = [
      'studentName', 'ic', 'dateOfBirth', 'guardianName', 'guardianPhone', 'guardianEmail',
      'guardianIc', 'centreId', 'centreName', 'educationLevel', 'subsidyCategory',
    ];

    const missingField = requiredFields.find((key) => !input[key]);
    if (missingField) {
      return NextResponse.json({ error: `Missing required field: ${missingField}` }, { status: 400 });
    }

    const filesByType: Partial<Record<RegistrationDocumentType, File[]>> = {
      birth_cert: [],
      student_ic: [],
      guardian_ic: [],
      address_proof: [],
      other: [],
    };

    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File) || value.size === 0) continue;
      if (value.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `File exceeds 10MB limit: ${value.name}` }, { status: 400 });
      }

      if (key in filesByType) {
        (filesByType[key as RegistrationDocumentType] as File[]).push(value);
      }
    }

    const missingRequiredDocs = REQUIRED_REGISTRATION_DOCS.filter((docType) => !(filesByType[docType] && filesByType[docType]!.length > 0));
    if (missingRequiredDocs.length > 0) {
      return NextResponse.json(
        { error: 'Missing required documents', missingDocuments: missingRequiredDocs },
        { status: 400 }
      );
    }

    const result = await createRegistrationApplication({
      input,
      filesByType,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({
      applicationRef: result.application.applicationRef,
      applicationId: result.application.id,
      status: result.application.status,
      documentCount: result.documents.length,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit registration';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
