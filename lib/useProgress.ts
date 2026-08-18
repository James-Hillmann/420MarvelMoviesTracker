"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WatchedMap = Record<string, number>;

/**
 * Shared progress state for one profile — talks to /api/progress (Redis when
 * deployed, local file in dev).  Optimistic updates, refetch on focus + a slow
 * poll so everyone viewing the same board stays in sync.
 */
export function useProgress(profile: string | null) {
  const [watched, setWatchedMap] = useState<WatchedMap>({});
  const [loaded, setLoaded] = useState(false);
  const inFlight = useRef(0);

  const refresh = useCallback(async () => {
    if (!profile) return;
    try {
      const res = await fetch(`/api/progress?profile=${encodeURIComponent(profile)}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { watched: WatchedMap };
      // don't clobber optimistic state while a toggle is mid-flight
      if (inFlight.current === 0) setWatchedMap(data.watched);
      setLoaded(true);
    } catch {
      /* offline — keep whatever we have */
    }
  }, [profile]);

  // reset instantly when switching profiles so boards never bleed together
  useEffect(() => {
    setWatchedMap({});
    setLoaded(false);
  }, [profile]);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    const poll = setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(poll);
    };
  }, [refresh]);

  const toggle = useCallback(
    async (id: string) => {
      if (!profile) return false;
      const nowWatched = !watched[id];
      setWatchedMap((m) => {
        const next = { ...m };
        if (nowWatched) next[id] = Date.now();
        else delete next[id];
        return next;
      });
      inFlight.current += 1;
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, id, watched: nowWatched }),
        });
        if (res.ok) {
          const data = (await res.json()) as { watched: WatchedMap };
          setWatchedMap(data.watched);
        }
      } catch {
        /* keep optimistic state; next refresh reconciles */
      } finally {
        inFlight.current -= 1;
      }
      return nowWatched;
    },
    [watched, profile],
  );

  return { watched, loaded, toggle };
}
