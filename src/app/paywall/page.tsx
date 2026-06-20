import { cookies } from 'next/headers';
import { PaywallView } from '@/components/funnel/PaywallView';
import { funnelService } from '@/server/services/funnelService';
import { verifyUserToken } from '@/lib/jwt';
import { AUTH_COOKIE } from '@/lib/cookies';

export const dynamic = 'force-dynamic';

export default async function PaywallPage() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  const userId = token ? await verifyUserToken(token) : null;
  const purchased = userId ? await funnelService.hasPurchased(userId) : false;

  return <PaywallView initialPurchased={purchased} />;
}
