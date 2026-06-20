'use client';

import { FunnelEvent } from './events';
import { readUtmFromLocation } from './utm';

export async function trackEvent(type: FunnelEvent): Promise<void> {
  const utm = readUtmFromLocation();

  await fetch('/api/track', {
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
