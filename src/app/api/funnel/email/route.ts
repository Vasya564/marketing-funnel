import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createUser,
  ensureVisitor,
  findUserByEmail,
  getVisit,
  linkVisitorToUser,
  recordEvent,
  startVisit,
} from '@/db/funnel';
import { signUserToken } from '@/lib/jwt';
import { DIRECT_SOURCE, FunnelEvent } from '@/lib/events';
import {
  AUTH_COOKIE,
  AUTH_MAX_AGE,
  VISITOR_COOKIE,
  VISITOR_MAX_AGE,
  VISIT_COOKIE,
  VISIT_MAX_AGE,
  cookieOptions,
} from '@/lib/cookies';
import { UtmParams } from '@/lib/utm';

const emailSchema = z.object({ email: z.email() });

const DIRECT_UTM: UtmParams = {
  source: DIRECT_SOURCE,
  medium: null,
  campaign: null,
};

async function firstTouchFromVisit(visitId: string): Promise<UtmParams> {
  const visit = await getVisit(visitId);

  if (!visit) {
    return DIRECT_UTM;
  }

  return {
    source: visit.source,
    medium: visit.utmMedium,
    campaign: visit.utmCampaign,
  };
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = emailSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  const jar = await cookies();
  const visitorId = jar.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();
  await ensureVisitor(visitorId);

  const visitId =
    jar.get(VISIT_COOKIE)?.value ??
    (await startVisit({ visitorId, userId: null, utm: DIRECT_UTM }));

  const existingUser = await findUserByEmail(email);
  const userId =
    existingUser?.id ??
    (await createUser({ email, utm: await firstTouchFromVisit(visitId) }));

  await linkVisitorToUser(visitorId, userId);
  await recordEvent({
    visitId,
    visitorId,
    userId,
    type: FunnelEvent.EmailSubmitted,
  });

  const token = await signUserToken(userId);

  jar.set(VISITOR_COOKIE, visitorId, cookieOptions(VISITOR_MAX_AGE));
  jar.set(VISIT_COOKIE, visitId, cookieOptions(VISIT_MAX_AGE));
  jar.set(AUTH_COOKIE, token, cookieOptions(AUTH_MAX_AGE));

  return NextResponse.json({ ok: true, returning: Boolean(existingUser) });
}
