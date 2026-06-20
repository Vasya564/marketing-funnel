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
import type { AttributionRow } from '@/server/repositories/analyticsRepository';
import {
  ATTRIBUTION_COLORS,
  AXIS_TICK,
  GRID_STROKE,
  TOOLTIP_CURSOR,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from '@/lib/dashboard/chartColors';

export function AttributionChart({
  rows,
  onSelectSource,
}: {
  rows: AttributionRow[];
  onSelectSource: (source: string) => void;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/40">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 4, right: 12, bottom: 4, left: 0 }}
        onClick={(state) => {
          const label = state?.activeLabel;
          if (label) {
            onSelectSource(String(label));
          }
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke={GRID_STROKE}
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="source"
          width={64}
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
        <Bar
          dataKey="users"
          radius={[0, 4, 4, 0]}
          isAnimationActive={false}
          className="cursor-pointer"
        >
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
