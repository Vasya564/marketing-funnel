'use client';

import { useEffect, useState } from 'react';
import { Check, Star } from 'lucide-react';
import { FunnelShell } from '@/components/funnel/FunnelShell';
import { EYEBROW, PRIMARY_BUTTON } from '@/components/funnel/styles';
import { FunnelEvent } from '@/lib/events';
import { API_ROUTES } from '@/lib/routes';
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
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    trackEvent(FunnelEvent.PaywallVisited);

    fetch(API_ROUTES.funnelStatus, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((status: { purchased: boolean } | null) => {
        setPurchased(Boolean(status?.purchased));
        setChecking(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setChecking(false);
        }
      });

    return () => controller.abort();
  }, []);

  async function handlePay() {
    setProcessing(true);
    await trackEvent(FunnelEvent.PurchaseClicked);
    setProcessing(false);
    setPurchased(true);
  }

  if (checking) {
    return (
      <FunnelShell currentStep={3}>
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-4 h-8 w-3/4 rounded bg-white/10" />
          <div className="mt-3 h-4 w-full rounded bg-white/10" />

          <div className="mt-6 space-y-3">
            {Array.from({ length: PLAN_FEATURES.length }).map((_, index) => (
              <div key={index} className="h-4 w-2/3 rounded bg-white/10" />
            ))}
          </div>

          <div className="mx-auto mt-6 h-10 w-24 rounded bg-white/10" />
          <div className="mt-6 h-12 w-full rounded-2xl bg-white/10" />
          <div className="mx-auto mt-4 h-3 w-48 rounded bg-white/10" />
        </div>
      </FunnelShell>
    );
  }

  if (purchased) {
    return (
      <FunnelShell currentStep={3}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500">
            <Check className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">
            Welcome aboard!
          </h1>
          <p className="mt-2 text-white/60">
            Your subscription is active. We&apos;ve sent your personalized plan
            to your inbox — let&apos;s get started.
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
