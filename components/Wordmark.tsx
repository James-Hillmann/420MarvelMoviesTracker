"use client";

import { Entry, FontKey } from "@/lib/timeline";

const FONT_CLASS: Record<FontKey, string> = {
  anton: "f-anton",
  bebas: "f-bebas",
  bangers: "f-bangers",
  russo: "f-russo",
  blackops: "f-blackops",
  cinzel: "f-cinzel",
  creepster: "f-creepster",
  orbitron: "f-orbitron",
  monoton: "f-monoton",
};

/** fonts cycled per-letter for the Loki "chaos" effect */
const CHAOS_FONTS: FontKey[] = ["cinzel", "bangers", "orbitron", "bebas", "creepster", "anton"];

export default function Wordmark({ entry, base = 1.35 }: { entry: Entry; base?: number }) {
  const { wm } = entry;
  const size = `${(base * (wm.scale ?? 1)).toFixed(2)}rem`;

  if (wm.chaos) {
    return (
      <span style={{ fontSize: size, lineHeight: 1.02, textTransform: "uppercase" }} aria-label={entry.title}>
        {entry.title.split("").map((ch, i) => (
          <span
            key={i}
            className={`wordmark ${FONT_CLASS[CHAOS_FONTS[i % CHAOS_FONTS.length]]}`}
            style={{
              backgroundImage: wm.gradient,
              display: "inline-block",
              transform: `rotate(${((i % 3) - 1) * 6}deg) translateY(${((i % 2) - 0.5) * 3}px)`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className={`wordmark ${FONT_CLASS[wm.font]}`}
      style={{ backgroundImage: wm.gradient, fontSize: size }}
    >
      {entry.title}
    </span>
  );
}
