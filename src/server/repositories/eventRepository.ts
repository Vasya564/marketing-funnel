import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '@/db';
import { events } from '@/db/schema';

export const eventRepository = {
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
