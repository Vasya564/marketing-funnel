import { DIRECT_SOURCE } from './events';

export type UtmParams = {
  source: string;
  medium: string | null;
  campaign: string | null;
};

export function parseUtm(params: URLSearchParams): UtmParams {
  return {
    source: params.get('utm_source') || DIRECT_SOURCE,
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
  };
}

export function readUtmFromLocation(): UtmParams {
  if (typeof window === 'undefined') {
    return { source: DIRECT_SOURCE, medium: null, campaign: null };
  }

  return parseUtm(new URLSearchParams(window.location.search));
}
