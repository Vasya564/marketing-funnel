'use client';

import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FunnelShell } from '@/components/funnel/FunnelShell';
import { EYEBROW, PRIMARY_BUTTON } from '@/components/funnel/styles';
import { API_ROUTES, ROUTES } from '@/lib/routes';
import { isValidEmail } from '@/lib/validation';

export default function EmailCapturePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setSubmitting(true);

    const response = await fetch(API_ROUTES.funnelEmail, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }

    router.push(ROUTES.paywall);
  }

  return (
    <FunnelShell currentStep={2}>
      <p className={EYEBROW}>Almost there</p>
      <h1 className="mt-3 text-2xl font-bold text-white">
        Where should we send your plan?
      </h1>
      <p className="mt-2 text-white/60">
        Enter your email to unlock your personalized results.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(changeEvent) => setEmail(changeEvent.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/30 transition outline-none focus:border-violet-400/60 focus:bg-white/[0.07]"
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button type="submit" disabled={submitting} className={PRIMARY_BUTTON}>
          {submitting ? 'Submitting…' : 'Continue'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-white/40">
        We&apos;ll never share your email. Unsubscribe anytime.
      </p>
    </FunnelShell>
  );
}
