'use client';

import { useEffect, useState } from 'react';
import type { UserTimeline } from '@/server/repositories/analyticsRepository';

export function useUserTimeline(userId: string) {
  const [timeline, setTimeline] = useState<UserTimeline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const origin = window.location.origin;

    fetch(`${origin}/api/dashboard/users/${userId}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: UserTimeline | null) => {
        setTimeline(data);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [userId]);

  return { timeline, loading };
}
