import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { funnelService } from '@/server/services/funnelService';
import { signUserToken } from '@/lib/jwt';
import {
  AUTH_COOKIE,
  AUTH_MAX_AGE,
  VISITOR_COOKIE,
  VISITOR_MAX_AGE,
  VISIT_COOKIE,
  VISIT_MAX_AGE,
  cookieOptions,
} from '@/lib/cookies';
import { emailSchema } from '@/lib/validation';

const bodySchema = z.object({ email: emailSchema });

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  const jar = await cookies();
  const visitorId = jar.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();
  const existingVisitId = jar.get(VISIT_COOKIE)?.value ?? null;

  const { userId, returning, visitId } = await funnelService.captureEmail({
    email,
    visitorId,
    visitId: existingVisitId,
  });

  const tokenValue = await signUserToken(userId);

  jar.set(VISITOR_COOKIE, visitorId, cookieOptions(VISITOR_MAX_AGE));
  jar.set(VISIT_COOKIE, visitId, cookieOptions(VISIT_MAX_AGE));
  jar.set(AUTH_COOKIE, tokenValue, cookieOptions(AUTH_MAX_AGE));

  return NextResponse.json({ ok: true, returning });
}
