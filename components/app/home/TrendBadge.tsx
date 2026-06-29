import { ReactNode } from "react";
import { C, TONE } from "./data";

type Trend = "up" | "down" | "neutral";

const MAP: Record<Trend, { bg: string; fg: string; arrow: string }> = {
  up: { bg: TONE.green.soft, fg: TONE.green.text, arrow: "↑" },
  down: { bg: TONE.red.soft, fg: TONE.red.text, arrow: "↓" },
  neutral: { bg: "rgba(100,116,139,0.12)", fg: C.slate, arrow: "→" },
};

/* Pill de tendance unifiée (remplace HeroUI TrendChip) — couleurs depuis TONE. */
export function TrendBadge({ trend, children }: { trend: Trend; children: ReactNode }) {
  const m = MAP[trend];
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums"
      style={{ backgroundColor: m.bg, color: m.fg }}
    >
      <span aria-hidden>{m.arrow}</span>
      {children}
    </span>
  );
}
