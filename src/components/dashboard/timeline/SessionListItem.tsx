'use client';

import type { TimelineVisit } from '@/server/repositories/analyticsRepository';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/format';

export function SessionListItem({
  visit,
  index,
  eventCount,
  active,
  onSelect,
}: {
  visit: TimelineVisit;
  index: number;
  eventCount: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-xl border px-3 py-3 text-left transition-all duration-150',
        active
          ? 'border-violet-400/40 bg-violet-500/10'
          : 'border-transparent hover:bg-white/[0.05]',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          Session {index + 1}
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
          {eventCount}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-violet-300/80">{visit.source}</p>
      <p className="text-xs text-white/35">{formatDateTime(visit.startedAt)}</p>
    </button>
  );
}
