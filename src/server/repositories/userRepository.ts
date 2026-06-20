import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { UtmParams } from '@/lib/utm';

export const userRepository = {
  async findByEmail(email: string) {
    const [user] = await getDb()
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  },

  async create(args: { email: string; utm: UtmParams }): Promise<string> {
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
  },
};
