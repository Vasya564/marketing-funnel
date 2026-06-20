import { getDb } from '@/db';
import { visitors } from '@/db/schema';

export const visitorRepository = {
  async ensure(visitorId: string): Promise<void> {
    await getDb()
      .insert(visitors)
      .values({ id: visitorId })
      .onConflictDoNothing();
  },
};
