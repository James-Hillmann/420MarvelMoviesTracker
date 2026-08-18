"use client";

import { Profile, PROFILES } from "@/lib/profiles";

/** Full-screen "who's watching?" gate, shown until a profile is picked. */
export default function ProfilePicker({ onPick }: { onPick: (p: Profile) => void }) {
  return (
    <div className="picker-overlay">
      <div className="text-center">
        <div className="mb-2 text-[11px] uppercase tracking-[0.5em] text-white/40">Road to Doomsday</div>
        <h1 className="f-bebas mb-10 text-3xl tracking-[0.2em] text-white/90 sm:text-4xl">
          WHO&apos;S WATCHING?
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              className="picker-card"
              style={{ "--aura": p.color } as React.CSSProperties}
              onClick={() => onPick(p)}
            >
              <span className="picker-name">{p.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-10 text-[11px] uppercase tracking-[0.25em] text-white/30">
          each crew gets its own trail
        </p>
      </div>
    </div>
  );
}
