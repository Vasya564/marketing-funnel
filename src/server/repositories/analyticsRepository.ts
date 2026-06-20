import { getRawSql } from '@/db';
import { FunnelEvent } from '@/lib/events';
import { ResolvedFilters } from '@/lib/filters';

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

export type UserRow = {
  id: string;
  email: string;
  firstTouch: string;
  lastTouch: string | null;
  visits: number;
  purchased: boolean;
};

export type ActivityPoint = {
  date: string;
  entries: number;
  completions: number;
};

export type DashboardData = {
  funnel: FunnelStage[];
  overallConversion: number;
  audience: AudienceBreakdown;
  sources: SourceRow[];
  firstTouch: AttributionRow[];
  lastTouch: AttributionRow[];
  activity: ActivityPoint[];
  users: UserRow[];
};

const RANKED_VISITS =
  'with v as (select *, row_number() over (partition by user_id order by started_at asc) as visit_rank from visits)';

function rate(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 1000) / 10;
}

function placeholder(params: unknown[], value: unknown): string {
  params.push(value);
  return `$${params.length}`;
}

function visitWhere(
  filters: ResolvedFilters,
  params: unknown[],
  { includeAudience }: { includeAudience: boolean },
): string {
  const clauses: string[] = [];

  if (filters.from) {
    clauses.push(`v.started_at >= ${placeholder(params, filters.from)}`);
  }

  if (filters.source) {
    clauses.push(`v.source = ${placeholder(params, filters.source)}`);
  }

  if (includeAudience && filters.audience === 'new') {
    clauses.push('v.visit_rank = 1 and v.user_id is not null');
  }

  if (includeAudience && filters.audience === 'returning') {
    clauses.push('v.visit_rank > 1');
  }

  return clauses.length ? `where ${clauses.join(' and ')}` : '';
}

function dateWhere(
  column: string,
  filters: ResolvedFilters,
  params: unknown[],
): string {
  if (!filters.from) {
    return '';
  }

  return `where ${column} >= ${placeholder(params, filters.from)}`;
}

async function stageCounts(
  filters: ResolvedFilters,
): Promise<Record<string, number>> {
  const params: unknown[] = [];
  const where = visitWhere(filters, params, { includeAudience: true });
  const rows = (await getRawSql().query(
    `${RANKED_VISITS}
     select e.type, count(*)::int as count
     from events e join v on v.id = e.visit_id
     ${where}
     group by e.type`,
    params,
  )) as { type: string; count: number }[];

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
    const previous = index === 0 ? null : (counts[stages[index - 1].key] ?? 0);

    return {
      key: stage.key,
      label: stage.label,
      count,
      conversionFromPrevious: previous === null ? null : rate(count, previous),
    };
  });
}

async function audienceBreakdown(
  filters: ResolvedFilters,
): Promise<AudienceBreakdown> {
  const params: unknown[] = [];
  const where = visitWhere(filters, params, { includeAudience: false });
  const [row] = (await getRawSql().query(
    `${RANKED_VISITS}
     select
       count(*) filter (where user_id is null)::int as anonymous,
       count(*) filter (where visit_rank = 1 and user_id is not null)::int as new_visits,
       count(*) filter (where visit_rank > 1)::int as returning_visits
     from v
     ${where}`,
    params,
  )) as { anonymous: number; new_visits: number; returning_visits: number }[];

  return {
    newVisits: row?.new_visits ?? 0,
    returningVisits: row?.returning_visits ?? 0,
    anonymousVisits: row?.anonymous ?? 0,
  };
}

async function trafficSources(filters: ResolvedFilters): Promise<SourceRow[]> {
  const params: unknown[] = [];
  const purchase = placeholder(params, FunnelEvent.PurchaseClicked);
  const where = visitWhere(filters, params, { includeAudience: true });
  const rows = (await getRawSql().query(
    `${RANKED_VISITS},
     purchased as (select distinct visit_id from events where type = ${purchase})
     select
       v.source,
       count(*)::int as entries,
       count(*) filter (where p.visit_id is not null)::int as completions
     from v
     left join purchased p on p.visit_id = v.id
     ${where}
     group by v.source
     order by entries desc`,
    params,
  )) as { source: string; entries: number; completions: number }[];

  return rows.map((row) => ({
    source: row.source,
    entries: row.entries,
    completions: row.completions,
    conversion: rate(row.completions, row.entries),
  }));
}

async function firstTouchAttribution(
  filters: ResolvedFilters,
): Promise<AttributionRow[]> {
  const params: unknown[] = [];
  const where = dateWhere('created_at', filters, params);
  const rows = (await getRawSql().query(
    `select first_touch_source as source, count(*)::int as users
     from users
     ${where}
     group by first_touch_source
     order by users desc`,
    params,
  )) as AttributionRow[];

  return rows;
}

async function lastTouchAttribution(
  filters: ResolvedFilters,
): Promise<AttributionRow[]> {
  const params: unknown[] = [];
  const where = dateWhere('started_at', filters, params);
  const rows = (await getRawSql().query(
    `select source, count(*)::int as users
     from (
       select source, row_number() over (partition by user_id order by started_at desc) as rn
       from visits
       where user_id is not null
       ${where ? `and ${where.replace('where ', '')}` : ''}
     ) latest
     where rn = 1
     group by source
     order by users desc`,
    params,
  )) as AttributionRow[];

  return rows;
}

async function userList(filters: ResolvedFilters): Promise<UserRow[]> {
  const params: unknown[] = [];
  const purchase = placeholder(params, FunnelEvent.PurchaseClicked);
  const existsWhere = visitWhere(filters, params, { includeAudience: true });
  const userDate = filters.from
    ? `and u.created_at >= ${placeholder(params, filters.from)}`
    : '';

  const rows = (await getRawSql().query(
    `${RANKED_VISITS}
     select
       u.id,
       u.email,
       u.first_touch_source as "firstTouch",
       (select source from visits lv where lv.user_id = u.id order by started_at desc limit 1) as "lastTouch",
       (select count(*)::int from visits cv where cv.user_id = u.id) as visits,
       exists(select 1 from events e where e.user_id = u.id and e.type = ${purchase}) as purchased
     from users u
     where exists (select 1 from v where v.user_id = u.id ${existsWhere ? `and ${existsWhere.replace('where ', '')}` : ''})
     ${userDate}
     order by u.created_at desc
     limit 100`,
    params,
  )) as UserRow[];

  return rows;
}

export type TimelineVisit = {
  id: string;
  source: string;
  utmMedium: string | null;
  utmCampaign: string | null;
  startedAt: string;
};

export type TimelineEvent = {
  type: string;
  visitId: string;
  createdAt: string;
};

export type UserTimeline = {
  email: string;
  firstTouch: string;
  createdAt: string;
  visits: TimelineVisit[];
  events: TimelineEvent[];
};

export async function getSourceOptions(): Promise<string[]> {
  const rows = (await getRawSql()`
    select distinct source from visits order by source
  `) as { source: string }[];

  return rows.map((row) => row.source);
}

export async function getUserTimeline(
  userId: string,
): Promise<UserTimeline | null> {
  const sql = getRawSql();

  const [user] = (await sql.query(
    `select email, first_touch_source as first_touch, created_at
     from users where id = $1`,
    [userId],
  )) as { email: string; first_touch: string; created_at: string }[];

  if (!user) {
    return null;
  }

  const [visits, events] = await Promise.all([
    sql
      .query(
        `select id, source, utm_medium as "utmMedium", utm_campaign as "utmCampaign", started_at as "startedAt"
         from visits where user_id = $1 order by started_at asc`,
        [userId],
      )
      .then((rows) => rows as TimelineVisit[]),
    sql
      .query(
        `select type, visit_id as "visitId", created_at as "createdAt"
         from events where user_id = $1 order by created_at asc`,
        [userId],
      )
      .then((rows) => rows as TimelineEvent[]),
  ]);

  return {
    email: user.email,
    firstTouch: user.first_touch,
    createdAt: user.created_at,
    visits,
    events,
  };
}

async function activityOverTime(
  filters: ResolvedFilters,
): Promise<ActivityPoint[]> {
  const params: unknown[] = [];
  const quizStarted = placeholder(params, FunnelEvent.QuizStarted);
  const purchaseClicked = placeholder(params, FunnelEvent.PurchaseClicked);
  const where = visitWhere(filters, params, { includeAudience: true });
  const rows = (await getRawSql().query(
    `${RANKED_VISITS}
     select
       to_char(date_trunc('day', e.created_at), 'YYYY-MM-DD') as date,
       count(*) filter (where e.type = ${quizStarted})::int as entries,
       count(*) filter (where e.type = ${purchaseClicked})::int as completions
     from events e join v on v.id = e.visit_id
     ${where}
     group by 1
     order by 1`,
    params,
  )) as ActivityPoint[];

  return rows;
}

export async function getDashboardData(
  filters: ResolvedFilters,
): Promise<DashboardData> {
  const [counts, audience, sources, firstTouch, lastTouch, activity, users] =
    await Promise.all([
      stageCounts(filters),
      audienceBreakdown(filters),
      trafficSources(filters),
      firstTouchAttribution(filters),
      lastTouchAttribution(filters),
      activityOverTime(filters),
      userList(filters),
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
    activity,
    users,
  };
}
