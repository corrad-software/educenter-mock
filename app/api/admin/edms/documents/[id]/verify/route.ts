import { NextResponse } from 'next/server';
import { verifyDocument } from '@/lib/server/registration-store';

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim();
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);
    const body = await request.json() as { status?: 'verified' | 'rejected'; remarks?: string; reviewerName?: string };

    if (!body.status || !['verified', 'rejected'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid verification status.' }, { status: 400 });
    }

    const document = await verifyDocument({
      documentId: id,
      status: body.status,
      remarks: body.remarks,
      reviewerName: body.reviewerName,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ document });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify document.';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
