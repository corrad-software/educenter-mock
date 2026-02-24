import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import { appendAudit, resolveDocumentPath } from '@/lib/server/registration-store';

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);
    const resolved = await resolveDocumentPath(id);
    if (!resolved) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    const bytes = await fs.readFile(resolved.absolutePath);

    await appendAudit({
      actorType: 'admin',
      actorName: 'Centre Admin',
      action: 'document_viewed',
      entityType: 'document',
      entityId: id,
      ipAddress: getClientIp(request),
      notes: `Viewed ${resolved.document.originalName}`,
    });

    await appendAudit({
      actorType: 'admin',
      actorName: 'Centre Admin',
      action: 'document_downloaded',
      entityType: 'document',
      entityId: id,
      ipAddress: getClientIp(request),
      notes: `Downloaded ${resolved.document.originalName}`,
    });

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': resolved.document.mimeType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(resolved.document.originalName)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to download document.' }, { status: 500 });
  }
}
