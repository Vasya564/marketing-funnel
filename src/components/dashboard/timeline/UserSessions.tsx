'use client';

import { useState } from 'react';
import type { UserTimeline } from '@/server/repositories/analyticsRepository';
import { SessionListItem } from './SessionListItem';
import { SessionTimeline } from './SessionTimeline';

export function UserSessions({ timeline }: { timeline: UserTimeline }) {
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(
    timeline.visits[0]?.id ?? null,
  );

  const selectedVisit =
    timeline.visits.find((visit) => visit.id === selectedVisitId) ?? null;
  const selectedEvents = timeline.events.filter(
    (event) => event.visitId === selectedVisitId,
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 shrink-0 space-y-2 overflow-y-auto border-r border-white/10 p-4">
        <p className="px-1 pb-1 text-xs font-semibold tracking-wide text-white/30 uppercase">
          Sessions ({timeline.visits.length})
        </p>
        {timeline.visits.map((visit, index) => (
          <SessionListItem
            key={visit.id}
            visit={visit}
            index={index}
            eventCount={
              timeline.events.filter((event) => event.visitId === visit.id)
                .length
            }
            active={visit.id === selectedVisitId}
            onSelect={() => setSelectedVisitId(visit.id)}
          />
        ))}
      </aside>

      <section className="flex-1 overflow-y-auto p-6">
        {selectedVisit ? (
          <SessionTimeline visit={selectedVisit} events={selectedEvents} />
        ) : (
          <p className="text-sm text-white/40">
            Select a session to view its events.
          </p>
        )}
      </section>
    </div>
  );
}
