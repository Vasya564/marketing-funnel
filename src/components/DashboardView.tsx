'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  AttributionRow,
  DashboardData,
  SourceRow,
} from '@/db/analytics';

const BAR_COLOR = '#4f46e5';
const ATTRIBUTION_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function AttributionChart({ rows }: { rows: AttributionRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-400">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} />
        <YAxis type="category" dataKey="source" width={90} />
        <Tooltip />
        <Bar dataKey="users" radius={[0, 4, 4, 0]}>
          {rows.map((row, index) => (
            <Cell
              key={row.source}
              fill={ATTRIBUTION_COLORS[index % ATTRIBUTION_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function SourcesTable({ rows }: { rows: SourceRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-400">No data yet.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-slate-500">
          <th className="pb-2 font-medium">Source</th>
          <th className="pb-2 text-right font-medium">Entries</th>
          <th className="pb-2 text-right font-medium">Completions</th>
          <th className="pb-2 text-right font-medium">Conversion</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.source} className="border-t border-slate-100">
            <td className="py-2 text-slate-900">{row.source}</td>
            <td className="py-2 text-right text-slate-700">{row.entries}</td>
            <td className="py-2 text-right text-slate-700">{row.completions}</td>
            <td className="py-2 text-right text-slate-700">{row.conversion}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DashboardView({ data }: { data: DashboardData }) {
  const { funnel, overallConversion, audience, sources, firstTouch, lastTouch } =
    data;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">
            Funnel Analytics
          </h1>
          <p className="mt-1 text-slate-600">
            Overall conversion: <strong>{overallConversion}%</strong>
          </p>
        </header>

        <Card title="Funnel">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {funnel.map((stage) => (
              <div key={stage.key} className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{stage.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stage.count}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {stage.conversionFromPrevious === null
                    ? 'Entry stage'
                    : `${stage.conversionFromPrevious}% from previous`}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={funnel}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">New visits</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {audience.newVisits}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Returning visits</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {audience.returningVisits}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Anonymous visits</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">
              {audience.anonymousVisits}
            </p>
          </div>
        </div>

        <Card title="Traffic sources">
          <SourcesTable rows={sources} />
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="First-touch attribution">
            <AttributionChart rows={firstTouch} />
          </Card>
          <Card title="Last-touch attribution">
            <AttributionChart rows={lastTouch} />
          </Card>
        </div>
      </div>
    </main>
  );
}
