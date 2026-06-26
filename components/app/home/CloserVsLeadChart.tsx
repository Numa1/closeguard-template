"use client";

import { Card } from "@heroui/react";

import { C, closerVsLead7, DayScore, leadQualityAvg } from "./data";

const H = 190;
const MAX = 10;
const CES = C.green;
const LQS = C.slate;
const Y_TICKS = [10, 7.5, 5, 2.5, 0];
const y = (v: number) => H - (v / MAX) * H;

function avg(rows: DayScore[], key: "ces" | "lqs") {
  const vals = rows.map((r) => r[key]).filter((v): v is number => v != null);
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

const rows = closerVsLead7;
const gap = (avg(rows, "ces") - avg(rows, "lqs")).toFixed(1);

export default function CloserVsLeadChart() {
  return (
    <Card className="cg-card">
      <Card.Header className="px-6 pb-2 pt-6">
        <Card.Title className="text-sm font-semibold tracking-[-0.01em]">
          Closer performance vs lead quality
        </Card.Title>
        <Card.Description className="text-[13px] text-[#6b7280]">
          Closer score (CES) vs lead score (LQS) · avg lead quality {leadQualityAvg.toLocaleString("en-US")}/10 · last 7 days
        </Card.Description>
        <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-[rgba(34,197,94,0.12)] px-2 py-0.5 text-[12px] font-semibold text-[#15803d]">
          +{gap} pts above lead quality on average
        </span>
      </Card.Header>

      <Card.Content className="px-6 pb-5 pt-2">
        <div className="flex">
          <div className="flex flex-col justify-between pr-2 text-right text-[11px] text-[#6b7280]" style={{ height: H }}>
            {Y_TICKS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative" style={{ height: H }}>
              {Y_TICKS.map((t) => (
                <div key={t} className="absolute inset-x-0 border-t border-dashed border-black/[0.06]" style={{ top: y(t) }} />
              ))}
              <div className="absolute inset-0 flex">
                {rows.map((d) => {
                  if (d.ces == null || d.lqs == null) {
                    return (
                      <div key={d.day} className="flex flex-1 flex-col items-center justify-center gap-0.5" title="No calls that day">
                        <span className="text-[#94a3b8]">—</span>
                        <span className="text-[11px] text-[#9ca3af]">none</span>
                      </div>
                    );
                  }
                  const yc = y(d.ces);
                  const yl = y(d.lqs);
                  const top = Math.min(yc, yl);
                  const height = Math.abs(yc - yl);
                  const over = d.ces >= d.lqs;
                  return (
                    <div key={d.day} className="relative flex-1" title={`${d.day} · CES ${d.ces} / LQS ${d.lqs}`}>
                      <div
                        className="absolute left-1/2 w-1 -translate-x-1/2 rounded-full"
                        style={{ top, height, backgroundColor: over ? "rgba(34,197,94,0.35)" : "rgba(245,158,11,0.4)" }}
                      />
                      <Dot color={CES} top={yc} />
                      <Dot color={LQS} top={yl} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 flex text-center text-[11px] text-[#6b7280]">
              {rows.map((d) => (
                <span key={d.day} className="flex-1">{d.day}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-5 text-[12px]">
          <Legend color={CES} label="CES — closer score" />
          <Legend color={LQS} label="LQS — lead quality" />
        </div>
      </Card.Content>
    </Card>
  );
}

function Dot({ color, top }: { color: string; top: number }) {
  return (
    <span
      className="absolute left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
      style={{ top, backgroundColor: color }}
    />
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[#6b7280]">{label}</span>
    </div>
  );
}
