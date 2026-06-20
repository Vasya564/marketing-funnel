import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '@/db';
import { events } from '@/db/schema';
import { FunnelEvent } from '@/lib/events';

export const eventRepository = {
  async hasPurchased(userId: string): Promise<boolean> {
    const [row] = await getDb()
      .select({ id: events.id })
      .from(events)
      .where(
        and(
          eq(events.userId, userId),
          eq(events.type, FunnelEvent.PurchaseClicked),
        ),
      )
      .limit(1);

    return Boolean(row);
  },

  async record(args: {
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
  },

  async attachVisitorToUser(visitorId: string, userId: string): Promise<void> {
    await getDb()
      .update(events)
      .set({ userId })
      .where(and(eq(events.visitorId, visitorId), isNull(events.userId)));
  },
};
