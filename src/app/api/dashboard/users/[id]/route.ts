import { NextRequest, NextResponse } from 'next/server';
import { getUserTimeline } from '@/server/repositories/analyticsRepository';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const timeline = await getUserTimeline(id);

  if (!timeline) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(timeline);
}
