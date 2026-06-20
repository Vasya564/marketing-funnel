import { describe, expect, it } from 'vitest';
import { parseFilters, resolveFilters } from './filters';

describe('parseFilters', () => {
  it('defaults to all-time, no source, no audience', () => {
    expect(parseFilters({})).toEqual({
      range: 'all',
      source: null,
      audience: null,
    });
  });

  it('keeps valid values', () => {
    expect(
      parseFilters({ range: '7d', source: 'google', audience: 'returning' }),
    ).toEqual({ range: '7d', source: 'google', audience: 'returning' });
  });

  it('takes the first value of an array param', () => {
    expect(parseFilters({ source: ['google', 'facebook'] }).source).toBe(
      'google',
    );
  });

  it('falls back to defaults for invalid values', () => {
    const filters = parseFilters({ range: 'bogus', audience: 'bogus' });

    expect(filters.range).toBe('all');
    expect(filters.audience).toBeNull();
  });
});

describe('resolveFilters', () => {
  it('resolves all-time to a null from', () => {
    expect(
      resolveFilters({ range: 'all', source: null, audience: null }).from,
    ).toBeNull();
  });

  it('resolves a relative range to an ISO timestamp in the past', () => {
    const { from } = resolveFilters({
      range: '7d',
      source: null,
      audience: null,
    });

    expect(from).not.toBeNull();
    expect(new Date(from as string).getTime()).toBeLessThan(Date.now());
  });

  it('passes source and audience through', () => {
    const resolved = resolveFilters({
      range: 'all',
      source: 'google',
      audience: 'new',
    });

    expect(resolved.source).toBe('google');
    expect(resolved.audience).toBe('new');
  });
});
