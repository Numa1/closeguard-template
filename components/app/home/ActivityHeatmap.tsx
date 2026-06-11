"use client";

import { Card } from "@heroui/react";

const WEEKS = 18;
const DAYS = 7;

// green intensity ramp (level 0 = empty)
const COLORS = ["#edf0f2", "#c7f7d5", "#86efac", "#34d399", "#15803d"];

const DAY_LABELS = ["Lun", "", "Mer", "", "Ven", "", ""];

const MONTHS = [
  { name: "Fév", weeks: 3 },
  { name: "Mars", weeks: 4 },
  { name: "Avr", weeks: 4 },
  { name: "Mai", weeks: 5 },
  { name: "Juin", weeks: 2 },
];

// deterministic pseudo-random so SSR and client match (no Math.random)
function rand(w: number, d: number) {
  const s = Math.abs(Math.sin((w * 7 + d) * 12.9898) * 43758.5453);
  return s - Math.floor(s);
}

function levelAt(w: number, d: number) {
  const r = rand(w, d);
  if (d >= 5) return r < 0.6 ? 0 : Math.min(Math.floor(r * 3), 2); // weekends quieter
  return Math.floor(r * 5);
}

// precompute grid + total once at module level
const GRID: { level: number; count: number }[][] = [];
let TOTAL = 0;
for (let w = 0; w < WEEKS; w++) {
  const col: { level: number; count: number }[] = [];
  for (let d = 0; d < DAYS; d++) {
    const level = levelAt(w, d);
    const count = level === 0 ? 0 : level * 2 + Math.floor(rand(w, d) * 3);
    TOTAL += count;
    col.push({ level, count });
  }
  GRID.push(col);
}

const CELL = 13; // px (cell + gap pitch handled by gap classes)

export default function ActivityHeatmap() {
  return (
    <Card className="rounded-2xl bg-white shadow-sm">
      <Card.Header className="flex flex-row items-start justify-between px-5 pb-1 pt-5">
        <div>
          <Card.Title className="text-sm">Activité des closers</Card.Title>
          <Card.Description className="text-xs text-[#6b7280]">
            Appels analysés par jour
          </Card.Description>
        </div>
        <span className="text-sm text-[#6b7280]">
          <b className="font-semibold text-[#000102] tabular-nums">{TOTAL}</b>{" "}
          appels sur la période
        </span>
      </Card.Header>

      <Card.Content className="px-5 pb-5 pt-3">
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col gap-2">
            {/* month labels */}
            <div className="flex pl-9 text-[10px] text-[#9ca3af]">
              {MONTHS.map((m) => (
                <div key={m.name} style={{ width: m.weeks * CELL }}>
                  {m.name}
                </div>
              ))}
            </div>

            {/* day labels + grid */}
            <div className="flex gap-2">
              <div className="flex w-7 flex-col gap-[3px]">
                {DAY_LABELS.map((l, i) => (
                  <div
                    key={i}
                    className="flex h-2.5 items-center text-[10px] leading-none text-[#9ca3af]"
                  >
                    {l}
                  </div>
                ))}
              </div>

              <div className="flex gap-[3px]">
                {GRID.map((col, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {col.map((cell, d) => (
                      <div
                        key={d}
                        className="size-2.5 rounded-[3px]"
                        style={{ backgroundColor: COLORS[cell.level] }}
                        title={
                          cell.count === 0
                            ? "Aucun appel"
                            : `${cell.count} appels analysés`
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-[#9ca3af]">
          <span>Moins</span>
          {COLORS.map((c) => (
            <span
              key={c}
              className="size-2.5 rounded-[3px]"
              style={{ backgroundColor: c }}
            />
          ))}
          <span>Plus</span>
        </div>
      </Card.Content>
    </Card>
  );
}
