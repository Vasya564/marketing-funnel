import { and, eq, isNull } from 'drizzle-orm';
import { getDb } from '@/db';
import { visits } from '@/db/schema';
import { UtmParams } from '@/lib/utm';

export const visitRepository = {
  async start(args: {
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
  },

  async getById(visitId: string) {
    const [visit] = await getDb()
      .select()
      .from(visits)
      .where(eq(visits.id, visitId))
      .limit(1);

    return visit ?? null;
  },

  async attachVisitorToUser(visitorId: string, userId: string): Promise<void> {
    await getDb()
      .update(visits)
      .set({ userId })
      .where(and(eq(visits.visitorId, visitorId), isNull(visits.userId)));
  },
};
