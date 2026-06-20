'use client';

import { FunnelEvent } from './events';
import { readUtmFromLocation } from './utm';
import { API_ROUTES } from './routes';

export async function trackEvent(type: FunnelEvent): Promise<void> {
  const utm = readUtmFromLocation();

  await fetch(API_ROUTES.track, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      type,
      utmSource: utm.source,
      utmMedium: utm.medium ?? undefined,
      utmCampaign: utm.campaign ?? undefined,
    }),
  });
}
