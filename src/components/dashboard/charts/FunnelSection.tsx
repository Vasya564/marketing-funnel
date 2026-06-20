'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FunnelStage } from '@/lib/metrics';
import {
  AXIS_TICK,
  BAR_COLOR,
  GRID_STROKE,
  TOOLTIP_CURSOR,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
} from '@/lib/dashboard/chartColors';
import { Card } from '@/components/dashboard/common/Card';
import { FunnelStageCard } from './FunnelStageCard';

export function FunnelSection({ funnel }: { funnel: FunnelStage[] }) {
  return (
    <Card title="Funnel">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {funnel.map((stage) => (
          <FunnelStageCard key={stage.key} stage={stage} />
        ))}
      </div>
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={funnel}>
            <defs>
              <linearGradient id="funnelBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor={BAR_COLOR} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={GRID_STROKE}
            />
            <XAxis
              dataKey="label"
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
            <Bar
              dataKey="count"
              fill="url(#funnelBar)"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
