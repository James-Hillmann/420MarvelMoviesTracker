"use client";

import { useEffect, useMemo, useState } from "react";
import { celebrate } from "@/lib/confetti";
import { COUNTED_MOVIES, Entry, moviesInOrder, SHOWS } from "@/lib/timeline";
import { useProgress } from "@/lib/useProgress";
import Board from "./Board";
import DetailModal from "./DetailModal";
import ProgressHeader from "./ProgressHeader";
import SagaBackground from "./SagaBackground";

export default function TrackerApp() {
  const { watched, toggle } = useProgress();
  const [orderMode, setOrderMode] = useState<"release" | "chrono">("release");
  const [selected, setSelected] = useState<Entry | null>(null);

  // phones get a roomier 2-wide snake so wordmarks don't wrap into mush
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const movieCols = isMobile ? 2 : 3;

  const movieOrder = useMemo(() => moviesInOrder(orderMode), [orderMode]);

  const watchedMovies = COUNTED_MOVIES.filter((e) => watched[e.id]).length;
  const watchedShows = SHOWS.filter((e) => watched[e.id]).length;
  const doomGlow = COUNTED_MOVIES.length ? watchedMovies / COUNTED_MOVIES.length : 0;

  const upNextMovie = movieOrder.find((e) => !watched[e.id])?.id ?? null;
  const upNextShow = SHOWS.find((e) => !watched[e.id])?.id ?? null;

  const handleToggle = async (entry: Entry) => {
    const nowWatched = await toggle(entry.id);
    if (nowWatched) celebrate(entry.wm.aura);
  };

  return (
    <div className="relative min-h-screen">
      <SagaBackground />

      <ProgressHeader
        watchedMovies={watchedMovies}
        totalMovies={COUNTED_MOVIES.length}
        watchedShows={watchedShows}
        totalShows={SHOWS.length}
        orderMode={orderMode}
        onOrderChange={setOrderMode}
      />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
          {/* movies — the main quest */}
          <section className="min-w-0 lg:flex-[3]">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="f-bebas text-lg tracking-[0.35em] text-white/70">THE MOVIES</h2>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                {orderMode === "release" ? "release order" : "in-universe timeline"}
              </span>
            </div>
            <Board
              entries={movieOrder}
              cols={movieCols}
              watched={watched}
              upNextId={upNextMovie}
              showPhases={orderMode === "release"}
              finaleId="doomsday"
              doomGlow={doomGlow}
              layoutKey={`movies-${orderMode}-${movieCols}`}
              wordmarkBase={isMobile ? 1.2 : 1.35}
              onSelect={setSelected}
              onQuickToggle={handleToggle}
            />
          </section>

          {/* shows — the side quest */}
          <aside className="min-w-0 lg:flex-[2] lg:border-l lg:border-white/10 lg:pl-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="f-bebas text-lg tracking-[0.35em] text-white/70">SIDE QUEST · TV</h2>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                {watchedShows}/{SHOWS.length}
              </span>
            </div>
            <p className="mb-5 text-xs leading-relaxed text-white/40">
              The shows don&apos;t count toward the Doomsday clock — knock them out whenever.
              The first six are the Netflix era: semi-canon, skippable, but great.
            </p>
            <Board
              entries={SHOWS}
              cols={2}
              watched={watched}
              upNextId={upNextShow}
              layoutKey="shows"
              wordmarkBase={isMobile ? 1.0 : 1.15}
              onSelect={setSelected}
              onQuickToggle={handleToggle}
            />
          </aside>
        </div>

        <footer className="mt-20 text-center text-[11px] uppercase tracking-[0.3em] text-white/25">
          James &amp; Deniz vs. the Multiverse · data from TMDB
        </footer>
      </main>

      {selected && (
        <DetailModal
          entry={selected}
          watched={Boolean(watched[selected.id])}
          onToggle={handleToggle}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
