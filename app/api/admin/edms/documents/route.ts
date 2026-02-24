import { NextResponse } from 'next/server';
import { listDocumentsFiltered } from '@/lib/server/registration-store';
import type { RegistrationDocumentType } from '@/lib/types/registration-edms';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationRef = searchParams.get('applicationRef') ?? undefined;
    const docType = (searchParams.get('docType') as RegistrationDocumentType | null) ?? undefined;
    const status = (searchParams.get('status') as 'uploaded' | 'verified' | 'rejected' | null) ?? undefined;

    const documents = await listDocumentsFiltered({ applicationRef, docType, status });
    return NextResponse.json({ documents });
  } catch {
    return NextResponse.json({ error: 'Failed to load EDMS documents.' }, { status: 500 });
  }
}
