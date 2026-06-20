import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { funnelService } from '@/server/services/funnelService';
import { verifyUserToken } from '@/lib/jwt';
import { AUTH_COOKIE } from '@/lib/cookies';

export async function GET() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  const userId = token ? await verifyUserToken(token) : null;

  const purchased = userId ? await funnelService.hasPurchased(userId) : false;

  return NextResponse.json({ purchased });
}
