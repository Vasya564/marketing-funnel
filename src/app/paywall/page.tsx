'use client';

import { useEffect, useState } from 'react';
import { FunnelEvent } from '@/lib/events';
import { trackEvent } from '@/lib/track-client';

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
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">You&apos;re in!</h1>
          <p className="mt-2 text-slate-600">
            Thanks for your purchase. This is a mock checkout — no payment was
            taken.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          Premium plan
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Unlock your full plan
        </h1>
        <p className="mt-2 text-slate-600">
          Get unlimited access to your personalized roadmap.
        </p>
        <div className="mt-6 text-4xl font-bold text-slate-900">
          $49<span className="text-base font-medium text-slate-500">/mo</span>
        </div>
        <button
          type="button"
          onClick={handlePay}
          disabled={processing}
          className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {processing ? 'Processing…' : 'Pay now'}
        </button>
        <p className="mt-3 text-xs text-slate-400">Mock checkout · no real charge</p>
      </div>
    </main>
  );
}
