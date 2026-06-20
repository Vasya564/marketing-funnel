import { describe, expect, it } from 'vitest';
import { buildFunnel, rate } from './metrics';
import { FunnelEvent } from './events';

describe('rate', () => {
  it('returns 0 when denominator is 0', () => {
    expect(rate(5, 0)).toBe(0);
  });

  it('returns a percentage rounded to one decimal', () => {
    expect(rate(2, 3)).toBe(66.7);
    expect(rate(1, 8)).toBe(12.5);
  });

  it('returns 100 for full conversion', () => {
    expect(rate(10, 10)).toBe(100);
  });
});

describe('buildFunnel', () => {
  const counts = {
    [FunnelEvent.QuizStarted]: 100,
    [FunnelEvent.EmailSubmitted]: 50,
    [FunnelEvent.PaywallVisited]: 25,
    [FunnelEvent.PurchaseClicked]: 10,
  };

  it('produces all four stages in order', () => {
    const funnel = buildFunnel(counts);

    expect(funnel.map((stage) => stage.key)).toEqual([
      FunnelEvent.QuizStarted,
      FunnelEvent.EmailSubmitted,
      FunnelEvent.PaywallVisited,
      FunnelEvent.PurchaseClicked,
    ]);
  });

  it('has no conversion for the entry stage', () => {
    expect(buildFunnel(counts)[0].conversionFromPrevious).toBeNull();
  });

  it('computes conversion from the previous stage', () => {
    const funnel = buildFunnel(counts);

    expect(funnel[1].conversionFromPrevious).toBe(50);
    expect(funnel[2].conversionFromPrevious).toBe(50);
    expect(funnel[3].conversionFromPrevious).toBe(40);
  });

  it('defaults missing counts to 0', () => {
    const funnel = buildFunnel({});

    expect(funnel.every((stage) => stage.count === 0)).toBe(true);
    expect(funnel[1].conversionFromPrevious).toBe(0);
  });
});
