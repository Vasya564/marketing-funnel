'use client';

import { useState } from 'react';
import type { DashboardData } from '@/server/repositories/analyticsRepository';
import type { DashboardFilters } from '@/lib/filters';
import { BrandMark } from '@/components/BrandMark';
import { useFilterNav } from './hooks/useFilterNav';
import { ActivityChart } from './charts/ActivityChart';
import { AttributionChart } from './charts/AttributionChart';
import { FunnelSection } from './charts/FunnelSection';
import { SourcesTable } from './tables/SourcesTable';
import { UsersTable } from './tables/UsersTable';
import { FilterBar } from './filters/FilterBar';
import { Card } from './common/Card';
import { StatCard } from './common/StatCard';
import { UserTimelinePanel } from './timeline/UserTimelinePanel';
import { SURFACE } from '@/lib/dashboard/theme';
import { cn } from '@/lib/cn';

export function DashboardView({
  data,
  filters,
  sourceOptions,
}: {
  data: DashboardData;
  filters: DashboardFilters;
  sourceOptions: string[];
}) {
  const { setParam } = useFilterNav();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const selectSource = (source: string) => setParam('source', source);

  return (
    <main className="relative min-h-screen bg-[#07070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/3 h-[460px] w-[460px] rounded-full bg-violet-600/15 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl gap-6 px-6 py-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-10 space-y-6">
            <div className="flex items-center gap-2">
              <BrandMark />
              <span className="text-sm font-semibold tracking-wide text-white/80">
                PathFinder
              </span>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-2xl font-bold text-transparent">
                Funnel Analytics
              </h1>
              <p className="mt-1 text-sm text-white/50">
                Conversion{' '}
                <span className="font-semibold text-violet-300">
                  {data.overallConversion}%
                </span>
              </p>
            </div>
            <div className={cn(SURFACE, 'p-5')}>
              <FilterBar filters={filters} sourceOptions={sourceOptions} />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="lg:hidden">
            <FilterBar filters={filters} sourceOptions={sourceOptions} />
          </div>

          <Card title="Activity over time">
            <ActivityChart data={data.activity} />
          </Card>

          <FunnelSection funnel={data.funnel} />

          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              label="New visits"
              value={data.audience.newVisits}
              accent="bg-violet-400"
            />
            <StatCard
              label="Returning visits"
              value={data.audience.returningVisits}
              accent="bg-sky-400"
            />
            <StatCard
              label="Anonymous visits"
              value={data.audience.anonymousVisits}
              accent="bg-white/30"
            />
          </div>

          <Card title="Traffic sources">
            <SourcesTable rows={data.sources} onSelectSource={selectSource} />
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="First-touch attribution">
              <AttributionChart
                rows={data.firstTouch}
                onSelectSource={selectSource}
              />
            </Card>
            <Card title="Last-touch attribution">
              <AttributionChart
                rows={data.lastTouch}
                onSelectSource={selectSource}
              />
            </Card>
          </div>

          <Card title="Users (click a row for the full journey)">
            <UsersTable users={data.users} onSelect={setSelectedUserId} />
          </Card>
        </div>
      </div>

      {selectedUserId ? (
        <UserTimelinePanel
          key={selectedUserId}
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      ) : null}
    </main>
  );
}
