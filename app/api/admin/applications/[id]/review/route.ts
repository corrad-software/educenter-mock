import { NextResponse } from 'next/server';
import { reviewApplication } from '@/lib/server/registration-store';
import type { ReviewAction } from '@/lib/types/registration-edms';

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
    const body = await request.json() as { action?: ReviewAction; remarks?: string; reviewerName?: string };

    if (!body.action || !['approve', 'reject'].includes(body.action)) {
      return NextResponse.json({ error: 'Invalid review action.' }, { status: 400 });
    }

    const app = await reviewApplication({
      applicationId: id,
      action: body.action,
      remarks: body.remarks,
      reviewerName: body.reviewerName,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ application: app });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to review application.';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
