'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ActivityPoint } from '@/server/repositories/analyticsRepository';
import {
  AXIS_TICK,
  GRID_STROKE,
  TOOLTIP_CURSOR,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from '@/lib/dashboard/chartColors';

const ENTRIES_COLOR = '#8b5cf6';
const COMPLETIONS_COLOR = '#34d399';

export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-white/40">No activity yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16 }}>
        <defs>
          <linearGradient id="entriesArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ENTRIES_COLOR} stopOpacity={0.4} />
            <stop offset="100%" stopColor={ENTRIES_COLOR} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="completionsArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COMPLETIONS_COLOR} stopOpacity={0.4} />
            <stop offset="100%" stopColor={COMPLETIONS_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={GRID_STROKE}
        />
        <XAxis
          dataKey="date"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={TOOLTIP_CURSOR}
          contentStyle={TOOLTIP_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8a8aa3' }} />
        <Area
          type="monotone"
          dataKey="entries"
          name="Entries"
          stroke={ENTRIES_COLOR}
          fill="url(#entriesArea)"
          strokeWidth={2}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="completions"
          name="Completions"
          stroke={COMPLETIONS_COLOR}
          fill="url(#completionsArea)"
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
