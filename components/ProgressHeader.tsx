"use client";

import { useEffect, useState } from "react";
import { DOOMSDAY_DATE } from "@/lib/timeline";

interface Props {
  watchedMovies: number;
  totalMovies: number;
  watchedShows: number;
  totalShows: number;
  orderMode: "release" | "chrono";
  onOrderChange: (mode: "release" | "chrono") => void;
}

function useCountdown(target: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return null;
  const ms = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  const secs = Math.floor((ms % 60_000) / 1000);
  return { days, hours, mins, secs };
}

export default function ProgressHeader({
  watchedMovies,
  totalMovies,
  watchedShows,
  totalShows,
  orderMode,
  onOrderChange,
}: Props) {
  const cd = useCountdown(DOOMSDAY_DATE);
  const remaining = totalMovies - watchedMovies;
  const pct = totalMovies ? (watchedMovies / totalMovies) * 100 : 0;

  let pace: string | null = null;
  if (cd && remaining > 0 && cd.days > 0) {
    const daysPer = cd.days / remaining;
    pace =
      daysPer >= 1.5
        ? `≈ 1 movie every ${Math.floor(daysPer)} days to make it`
        : daysPer >= 0.9
          ? "≈ 1 movie a day to make it — get moving!"
          : `≈ ${Math.ceil(1 / daysPer)} movies a day needed — assemble!`;
  } else if (remaining === 0) {
    pace = "Caught up. Doomsday awaits.";
  }

  return (
    <header className="relative z-40 border-b border-white/10 bg-black/55 backdrop-blur-md sm:sticky sm:top-0">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1.5 px-3 py-2 sm:gap-y-2 sm:px-4 sm:py-3">
        {/* row 1 on mobile: title + countdown */}
        <h1 className="hdr-title text-xl sm:text-3xl">ROAD TO DOOMSDAY</h1>

        <div className="ml-auto text-right leading-tight sm:order-3 sm:ml-0" suppressHydrationWarning>
          {cd ? (
            <>
              <div className="font-mono text-sm tabular-nums text-white/90 sm:text-xl">
                {cd.days}
                <span className="text-white/40">d </span>
                {String(cd.hours).padStart(2, "0")}
                <span className="text-white/40">h </span>
                {String(cd.mins).padStart(2, "0")}
                <span className="text-white/40">m </span>
                <span className="hidden sm:inline">
                  {String(cd.secs).padStart(2, "0")}
                  <span className="text-white/40">s</span>
                </span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[color:var(--doom-green)]/80 sm:text-[10px]">
                until Doomsday
              </div>
            </>
          ) : (
            <div className="h-8 w-32 sm:h-9 sm:w-40" />
          )}
        </div>

        {/* row 2 on mobile: full-width progress bar */}
        <div className="order-3 w-full min-w-0 sm:order-2 sm:w-auto sm:min-w-[160px] sm:flex-1">
          <div className="mb-1 flex items-baseline justify-between text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-[11px]">
            <span>
              <span className="text-white/95">{watchedMovies}</span> / {totalMovies} movies
            </span>
            <span>
              side quest {watchedShows}/{totalShows}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          {pace && <div className="mt-1 text-[10px] tracking-wide text-white/45 sm:text-[11px]">{pace}</div>}
        </div>

        {/* row 3 on mobile: order toggle */}
        <div className="order-4 flex gap-2">
          <button
            className={`toggle-btn ${orderMode === "release" ? "active" : ""}`}
            onClick={() => onOrderChange("release")}
          >
            Release
          </button>
          <button
            className={`toggle-btn ${orderMode === "chrono" ? "active" : ""}`}
            onClick={() => onOrderChange("chrono")}
          >
            Chronological
          </button>
        </div>
      </div>
    </header>
  );
}
