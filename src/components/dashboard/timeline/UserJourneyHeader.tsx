import { X } from 'lucide-react';
import type { UserTimeline } from '@/server/repositories/analyticsRepository';
import { formatDateTime } from '@/lib/format';

export function UserJourneyHeader({
  timeline,
  onClose,
}: {
  timeline: UserTimeline | null;
  onClose: () => void;
}) {
  return (
    <header className="flex items-start justify-between border-b border-white/10 px-6 py-4">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {timeline?.email ?? 'User journey'}
        </h2>
        {timeline ? (
          <p className="mt-0.5 text-sm text-white/40">
            First touch:{' '}
            <span className="text-violet-300">{timeline.firstTouch}</span> ·
            Joined {formatDateTime(timeline.createdAt)}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-white/40 transition-colors hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );
}
