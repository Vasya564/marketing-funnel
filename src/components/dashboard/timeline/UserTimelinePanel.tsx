'use client';

import { useUserTimeline } from '@/components/dashboard/hooks/useUserTimeline';
import { TimelineSkeleton } from '@/components/dashboard/feedback/TimelineSkeleton';
import { UserJourneyHeader } from './UserJourneyHeader';
import { UserSessions } from './UserSessions';

export function UserTimelinePanel({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const { timeline, loading } = useUserTimeline(userId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d16] text-white shadow-2xl">
        <UserJourneyHeader timeline={timeline} onClose={onClose} />

        {loading ? (
          <TimelineSkeleton />
        ) : !timeline ? (
          <p className="p-6 text-sm text-white/40">Not found.</p>
        ) : (
          <UserSessions timeline={timeline} />
        )}
      </div>
    </div>
  );
}
