import { NextResponse } from 'next/server';
import { findApplicationByRefAndGuardianIc } from '@/lib/server/registration-store';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { applicationRef?: string; guardianIc?: string };
    const applicationRef = body.applicationRef?.trim() ?? '';
    const guardianIc = body.guardianIc?.trim() ?? '';

    if (!applicationRef || !guardianIc) {
      return NextResponse.json({ error: 'Application reference and guardian IC are required.' }, { status: 400 });
    }

    const app = await findApplicationByRefAndGuardianIc(applicationRef, guardianIc);
    if (!app) {
      return NextResponse.json({ error: 'No matching application found.' }, { status: 404 });
    }

    return NextResponse.json({
      applicationRef: app.applicationRef,
      studentName: app.studentName,
      centreName: app.centreName,
      status: app.status,
      appliedDate: app.appliedDate,
      reviewedDate: app.reviewedDate,
      reviewedBy: app.reviewedBy,
      remarks: app.remarks,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to lookup application status.' }, { status: 500 });
  }
}
