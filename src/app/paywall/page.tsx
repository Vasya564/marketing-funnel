'use client';

import { useEffect, useState } from 'react';
import { Check, Star } from 'lucide-react';
import { FunnelShell } from '@/components/funnel/FunnelShell';
import { EYEBROW, PRIMARY_BUTTON } from '@/components/funnel/styles';
import { FunnelEvent } from '@/lib/events';
import { trackEvent } from '@/lib/track-client';

const PLAN_FEATURES = [
  'Your personalized learning roadmap',
  'Unlimited practice projects',
  'Progress tracking & mentor feedback',
  'Cancel anytime — no questions asked',
];

export default function PaywallPage() {
  const [purchased, setPurchased] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    trackEvent(FunnelEvent.PaywallVisited);
  }, []);

  async function handlePay() {
    setProcessing(true);
    await trackEvent(FunnelEvent.PurchaseClicked);
    setProcessing(false);
    setPurchased(true);
  }

  if (purchased) {
    return (
      <FunnelShell currentStep={3}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500">
            <Check className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            You&apos;re in!
          </h1>
          <p className="mt-2 text-white/60">
            Thanks for your purchase. This is a mock checkout — no payment was
            taken.
          </p>
        </div>
      </FunnelShell>
    );
  }

  return (
    <FunnelShell currentStep={3}>
      <p className={EYEBROW}>Your personal plan</p>
      <h1 className="mt-3 text-3xl font-bold text-white">
        Unlock your full roadmap
      </h1>
      <p className="mt-2 text-white/60">
        Everything you need to reach your goal, in one place.
      </p>

      <ul className="mt-6 space-y-3">
        {PLAN_FEATURES.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-white/80"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline justify-center gap-1">
        <span className="text-4xl font-bold text-white">$49</span>
        <span className="text-sm font-medium text-white/50">/month</span>
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={processing}
        className={`mt-6 ${PRIMARY_BUTTON}`}
      >
        {processing ? 'Processing…' : 'Get my plan'}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
        <span className="flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            />
          ))}
        </span>
        <span>Loved by 12,000+ learners · Cancel anytime</span>
      </div>
    </FunnelShell>
  );
}
