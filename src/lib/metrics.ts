import { FunnelEvent } from './events';

export type FunnelStage = {
  key: string;
  label: string;
  count: number;
  conversionFromPrevious: number | null;
};

const FUNNEL_STAGES = [
  { key: FunnelEvent.QuizStarted, label: 'Quiz started' },
  { key: FunnelEvent.EmailSubmitted, label: 'Email submitted' },
  { key: FunnelEvent.PaywallVisited, label: 'Paywall visited' },
  { key: FunnelEvent.PurchaseClicked, label: 'Purchase clicked' },
];

export function rate(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 1000) / 10;
}

export function buildFunnel(counts: Record<string, number>): FunnelStage[] {
  return FUNNEL_STAGES.map((stage, index) => {
    const count = counts[stage.key] ?? 0;
    const previous =
      index === 0 ? null : (counts[FUNNEL_STAGES[index - 1].key] ?? 0);

    return {
      key: stage.key,
      label: stage.label,
      count,
      conversionFromPrevious: previous === null ? null : rate(count, previous),
    };
  });
}
