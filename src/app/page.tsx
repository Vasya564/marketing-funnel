'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FunnelEvent } from '@/lib/events';
import { trackEvent } from '@/lib/track-client';

export default function QuizStartPage() {
  const router = useRouter();

  useEffect(() => {
    trackEvent(FunnelEvent.QuizStarted);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          2-minute quiz
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Find your ideal learning path
        </h1>
        <p className="mt-3 text-slate-600">
          Answer a few quick questions and get a personalized plan built just
          for you.
        </p>
        <button
          type="button"
          onClick={() => router.push('/email')}
          className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700"
        >
          Start the quiz
        </button>
      </div>
    </main>
  );
}
