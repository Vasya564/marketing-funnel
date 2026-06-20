import { describe, expect, it } from 'vitest';
import { parseUtm } from './utm';
import { DIRECT_SOURCE } from './events';

describe('parseUtm', () => {
  it('reads all three utm params', () => {
    const params = new URLSearchParams(
      '?utm_source=google&utm_medium=cpc&utm_campaign=spring',
    );

    expect(parseUtm(params)).toEqual({
      source: 'google',
      medium: 'cpc',
      campaign: 'spring',
    });
  });

  it('falls back to direct when source is absent', () => {
    expect(parseUtm(new URLSearchParams('')).source).toBe(DIRECT_SOURCE);
  });

  it('returns null for missing medium and campaign', () => {
    const utm = parseUtm(new URLSearchParams('?utm_source=google'));

    expect(utm.medium).toBeNull();
    expect(utm.campaign).toBeNull();
  });
});
