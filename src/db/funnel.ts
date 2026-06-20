import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from './index';
import { events, users, visitors, visits } from './schema';
import { UtmParams } from '@/lib/utm';

export async function ensureVisitor(visitorId: string): Promise<void> {
  await getDb()
    .insert(visitors)
    .values({ id: visitorId })
    .onConflictDoNothing();
}

export async function startVisit(args: {
  visitorId: string;
  userId: string | null;
  utm: UtmParams;
}): Promise<string> {
  const [visit] = await getDb()
    .insert(visits)
    .values({
      visitorId: args.visitorId,
      userId: args.userId,
      source: args.utm.source,
      utmMedium: args.utm.medium,
      utmCampaign: args.utm.campaign,
    })
    .returning({ id: visits.id });

  return visit.id;
}

export async function recordEvent(args: {
  visitId: string;
  visitorId: string;
  userId: string | null;
  type: string;
}): Promise<void> {
  await getDb().insert(events).values({
    visitId: args.visitId,
    visitorId: args.visitorId,
    userId: args.userId,
    type: args.type,
  });
}

export async function getVisit(visitId: string) {
  const [visit] = await getDb()
    .select()
    .from(visits)
    .where(eq(visits.id, visitId))
    .limit(1);

  return visit ?? null;
}

export async function findUserByEmail(email: string) {
  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function createUser(args: {
  email: string;
  utm: UtmParams;
}): Promise<string> {
  const [user] = await getDb()
    .insert(users)
    .values({
      email: args.email,
      firstTouchSource: args.utm.source,
      firstTouchMedium: args.utm.medium,
      firstTouchCampaign: args.utm.campaign,
    })
    .returning({ id: users.id });

  return user.id;
}

export async function linkVisitorToUser(
  visitorId: string,
  userId: string,
): Promise<void> {
  const db = getDb();

  await Promise.all([
    db
      .update(visits)
      .set({ userId })
      .where(and(eq(visits.visitorId, visitorId), isNull(visits.userId))),
    db
      .update(events)
      .set({ userId })
      .where(and(eq(events.visitorId, visitorId), isNull(events.userId))),
  ]);
}
