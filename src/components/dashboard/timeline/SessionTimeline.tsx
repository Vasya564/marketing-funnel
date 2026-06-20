'use client';

import type {
  TimelineEvent,
  TimelineVisit,
} from '@/server/repositories/analyticsRepository';
import { EVENT_LABELS } from '@/lib/events';
import { formatDateTime, formatTime } from '@/lib/format';

function visitTitle(visit: TimelineVisit): string {
  return [visit.source, visit.utmMedium, visit.utmCampaign]
    .filter(Boolean)
    .join(' · ');
}

export function SessionTimeline({
  visit,
  events,
}: {
  visit: TimelineVisit;
  events: TimelineEvent[];
}) {
  return (
    <div>
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-base font-semibold text-white">
          {visitTitle(visit)}
        </h3>
        <p className="mt-0.5 text-sm text-white/40">
          {formatDateTime(visit.startedAt)}
        </p>
      </div>

      {events.length === 0 ? (
        <p className="mt-6 text-sm text-white/40">No events in this session.</p>
      ) : (
        <ol className="mt-6 space-y-0">
          {events.map((event, index) => (
            <li
              key={`${event.type}-${event.createdAt}`}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400 ring-4 ring-violet-500/15" />
                {index < events.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-white/10" />
                ) : null}
              </div>
              <div className="flex flex-1 items-start justify-between">
                <span className="text-sm font-medium text-white/85">
                  {EVENT_LABELS[event.type] ?? event.type}
                </span>
                <span className="text-xs text-white/35">
                  {formatTime(event.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
