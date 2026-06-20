import { getRawSql } from './index';
import { FunnelEvent } from '@/lib/events';

export type FunnelStage = {
  key: string;
  label: string;
  count: number;
  conversionFromPrevious: number | null;
};

export type SourceRow = {
  source: string;
  entries: number;
  completions: number;
  conversion: number;
};

export type AttributionRow = { source: string; users: number };

export type AudienceBreakdown = {
  newVisits: number;
  returningVisits: number;
  anonymousVisits: number;
};

export type DashboardData = {
  funnel: FunnelStage[];
  overallConversion: number;
  audience: AudienceBreakdown;
  sources: SourceRow[];
  firstTouch: AttributionRow[];
  lastTouch: AttributionRow[];
};

function rate(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 1000) / 10;
}

async function stageCounts(): Promise<Record<string, number>> {
  const rows = (await getRawSql()`
    select type, count(*)::int as count
    from events
    group by type
  `) as { type: string; count: number }[];

  return Object.fromEntries(rows.map((row) => [row.type, row.count]));
}

function buildFunnel(counts: Record<string, number>): FunnelStage[] {
  const stages = [
    { key: FunnelEvent.QuizStarted, label: 'Quiz started' },
    { key: FunnelEvent.EmailSubmitted, label: 'Email submitted' },
    { key: FunnelEvent.PaywallVisited, label: 'Paywall visited' },
    { key: FunnelEvent.PurchaseClicked, label: 'Purchase clicked' },
  ];

  return stages.map((stage, index) => {
    const count = counts[stage.key] ?? 0;
    const previous = index === 0 ? null : counts[stages[index - 1].key] ?? 0;

    return {
      key: stage.key,
      label: stage.label,
      count,
      conversionFromPrevious: previous === null ? null : rate(count, previous),
    };
  });
}

async function audienceBreakdown(): Promise<AudienceBreakdown> {
  const [row] = (await getRawSql()`
    select
      count(*) filter (where user_id is null)::int as anonymous,
      count(*) filter (where rn = 1)::int as new_visits,
      count(*) filter (where rn > 1)::int as returning_visits
    from (
      select
        user_id,
        case
          when user_id is null then null
          else row_number() over (partition by user_id order by started_at asc)
        end as rn
      from visits
    ) ranked
  `) as { anonymous: number; new_visits: number; returning_visits: number }[];

  return {
    newVisits: row?.new_visits ?? 0,
    returningVisits: row?.returning_visits ?? 0,
    anonymousVisits: row?.anonymous ?? 0,
  };
}

async function trafficSources(): Promise<SourceRow[]> {
  const rows = (await getRawSql()`
    select
      v.source,
      count(*)::int as entries,
      count(*) filter (where completed.visit_id is not null)::int as completions
    from visits v
    left join (
      select distinct visit_id from events where type = ${FunnelEvent.PurchaseClicked}
    ) completed on completed.visit_id = v.id
    group by v.source
    order by entries desc
  `) as { source: string; entries: number; completions: number }[];

  return rows.map((row) => ({
    source: row.source,
    entries: row.entries,
    completions: row.completions,
    conversion: rate(row.completions, row.entries),
  }));
}

async function firstTouchAttribution(): Promise<AttributionRow[]> {
  const rows = (await getRawSql()`
    select first_touch_source as source, count(*)::int as users
    from users
    group by first_touch_source
    order by users desc
  `) as AttributionRow[];

  return rows;
}

async function lastTouchAttribution(): Promise<AttributionRow[]> {
  const rows = (await getRawSql()`
    select source, count(*)::int as users
    from (
      select
        source,
        row_number() over (partition by user_id order by started_at desc) as rn
      from visits
      where user_id is not null
    ) latest
    where rn = 1
    group by source
    order by users desc
  `) as AttributionRow[];

  return rows;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [counts, audience, sources, firstTouch, lastTouch] = await Promise.all([
    stageCounts(),
    audienceBreakdown(),
    trafficSources(),
    firstTouchAttribution(),
    lastTouchAttribution(),
  ]);

  const funnel = buildFunnel(counts);
  const entries = funnel[0]?.count ?? 0;
  const completions = funnel[funnel.length - 1]?.count ?? 0;

  return {
    funnel,
    overallConversion: rate(completions, entries),
    audience,
    sources,
    firstTouch,
    lastTouch,
  };
}
