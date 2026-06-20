export type DateRange = 'today' | '7d' | '30d' | 'all';
export type Audience = 'new' | 'returning';

export type DashboardFilters = {
  range: DateRange;
  source: string | null;
  audience: Audience | null;
};

export type ResolvedFilters = {
  from: string | null;
  source: string | null;
  audience: Audience | null;
};

export const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'all', label: 'All time' },
];

const RANGE_DAYS: Record<Exclude<DateRange, 'all' | 'today'>, number> = {
  '7d': 7,
  '30d': 30,
};

function isDateRange(value: string | null): value is DateRange {
  return (
    value === 'today' || value === '7d' || value === '30d' || value === 'all'
  );
}

function isAudience(value: string | null): value is Audience {
  return value === 'new' || value === 'returning';
}

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | null {
  const single = Array.isArray(value) ? value[0] : value;
  return single ?? null;
}

export function parseFilters(params: RawSearchParams): DashboardFilters {
  const range = first(params.range);
  const audience = first(params.audience);

  return {
    range: isDateRange(range) ? range : 'all',
    source: first(params.source),
    audience: isAudience(audience) ? audience : null,
  };
}

export function resolveFilters(filters: DashboardFilters): ResolvedFilters {
  return {
    from: rangeToFrom(filters.range),
    source: filters.source,
    audience: filters.audience,
  };
}

function rangeToFrom(range: DateRange): string | null {
  if (range === 'all') {
    return null;
  }

  const now = new Date();

  if (range === 'today') {
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return startOfDay.toISOString();
  }

  const from = new Date(
    now.getTime() - RANGE_DAYS[range] * 24 * 60 * 60 * 1000,
  );
  return from.toISOString();
}
