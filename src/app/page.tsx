'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { FunnelShell } from '@/components/funnel/FunnelShell';
import { EYEBROW, PRIMARY_BUTTON } from '@/components/funnel/styles';
import { FunnelEvent } from '@/lib/events';
import { ROUTES } from '@/lib/routes';
import { trackEvent } from '@/lib/track-client';

export default function QuizStartPage() {
  const router = useRouter();

  useEffect(() => {
    trackEvent(FunnelEvent.QuizStarted);
  }, []);

  return (
    <FunnelShell currentStep={1}>
      <p className={EYEBROW}>2-minute quiz</p>
      <h1 className="mt-3 text-3xl leading-tight font-bold text-white">
        Find your ideal learning path
      </h1>
      <p className="mt-3 text-white/60">
        Answer a few quick questions and get a personalized plan built around
        your goals.
      </p>

      <ul className="mt-6 space-y-2 text-sm text-white/70">
        {[
          'Tailored to your goal',
          'Takes under 2 minutes',
          'Used by 12,000+ learners',
        ].map((benefit) => (
          <li key={benefit} className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-violet-400" />
            {benefit}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => router.push(ROUTES.email)}
        className={`mt-8 ${PRIMARY_BUTTON}`}
      >
        Start the quiz
      </button>
    </FunnelShell>
  );
}
