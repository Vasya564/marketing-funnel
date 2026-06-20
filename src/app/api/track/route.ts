import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureVisitor, recordEvent, startVisit } from '@/db/funnel';
import { verifyUserToken } from '@/lib/jwt';
import { DIRECT_SOURCE, FunnelEvent } from '@/lib/events';
import {
  AUTH_COOKIE,
  VISITOR_COOKIE,
  VISITOR_MAX_AGE,
  VISIT_COOKIE,
  VISIT_MAX_AGE,
  cookieOptions,
} from '@/lib/cookies';
import { UtmParams } from '@/lib/utm';

const trackSchema = z.object({
  type: z.enum([
    FunnelEvent.QuizStarted,
    FunnelEvent.PaywallVisited,
    FunnelEvent.PurchaseClicked,
  ]),
  utmSource: z.string().trim().min(1).optional(),
  utmMedium: z.string().trim().min(1).optional(),
  utmCampaign: z.string().trim().min(1).optional(),
});

type TrackBody = z.infer<typeof trackSchema>;

function toUtm(body: TrackBody): UtmParams {
  return {
    source: body.utmSource ?? DIRECT_SOURCE,
    medium: body.utmMedium ?? null,
    campaign: body.utmCampaign ?? null,
  };
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = trackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const jar = await cookies();
  const visitorId = jar.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();
  await ensureVisitor(visitorId);

  const token = jar.get(AUTH_COOKIE)?.value;
  const userId = token ? await verifyUserToken(token) : null;

  const { type } = parsed.data;
  const existingVisitId =
    type === FunnelEvent.QuizStarted ? null : jar.get(VISIT_COOKIE)?.value;
  const visitId =
    existingVisitId ??
    (await startVisit({ visitorId, userId, utm: toUtm(parsed.data) }));

  await recordEvent({ visitId, visitorId, userId, type });

  jar.set(VISITOR_COOKIE, visitorId, cookieOptions(VISITOR_MAX_AGE));
  jar.set(VISIT_COOKIE, visitId, cookieOptions(VISIT_MAX_AGE));

  return NextResponse.json({ ok: true });
}
