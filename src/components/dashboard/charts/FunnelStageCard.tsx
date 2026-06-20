import type { FunnelStage } from '@/lib/metrics';

export function FunnelStageCard({ stage }: { stage: FunnelStage }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors duration-150 hover:bg-white/[0.06]">
      <p className="text-sm text-white/50">{stage.label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{stage.count}</p>
      <p className="mt-1 text-xs text-white/35">
        {stage.conversionFromPrevious === null
          ? 'Entry stage'
          : `${stage.conversionFromPrevious}% from previous`}
      </p>
    </div>
  );
}
