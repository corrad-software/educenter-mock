import { NextResponse } from 'next/server';
import { listApplicationsMerged } from '@/lib/server/registration-store';

export async function GET() {
  try {
    const applications = await listApplicationsMerged();
    return NextResponse.json({ applications });
  } catch {
    return NextResponse.json({ error: 'Failed to load applications.' }, { status: 500 });
  }
}
