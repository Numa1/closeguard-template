"use client";

import { CSSProperties, ReactNode } from "react";
import { KPI } from "@heroui-pro/react";
import Ticker from "@/components/animata/text/ticker";
import { CardGlow } from "@/components/effects/CardGlow";
import { useMember } from "@/components/app/MemberContext";
import { eur, Kpi, kpisFor, pct } from "./data";

function fmt(k: Kpi): string {
  if (k.format === "currency") return eur(k.value);
  if (k.format === "percent") return pct(k.value);
  return k.value.toLocaleString("en-US");
}

/* Inline SVG icons — légers, pas de dépendance supplémentaire */
function TargetGlyph() {
  return (
    <svg fill="none" height="16" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
function EuroGlyph() {
  return (
    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
      <path d="M16 6.5a6 6 0 1 0 0 11M5 10.5h8M5 13.5h8" />
    </svg>
  );
}
function WarnGlyph() {
  return (
    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
      <path d="M12 3 2 20h20L12 3zM12 9v5M12 17.5v.5" />
    </svg>
  );
}
function BoltGlyph() {
  return (
    <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" />
    </svg>
  );
}

const ICONS: Record<string, ReactNode> = {
  closing:   <TargetGlyph />,
  recover:   <EuroGlyph />,
  wasted:    <WarnGlyph />,
  objection: <BoltGlyph />,
};

function KpiCard({ k }: { k: Kpi }) {
  // "up" = good for business (green), "down" = bad (red) — matches HeroUI TrendChip color convention
  const trendDir = k.good ? "up" : "down";

  return (
    <KPI className="cg-card cg-card-interactive">
      <KPI.Header>
        <KPI.Icon status={k.status}>
          {ICONS[k.id] ?? <TargetGlyph />}
        </KPI.Icon>
        <KPI.Title>{k.title}</KPI.Title>
      </KPI.Header>

      <KPI.Content className="grid-cols-[1fr_auto] items-end">
        <div className="flex flex-col gap-1">
          <KPI.Value value={k.value}>
            {() => <Ticker value={fmt(k)} delay={120} />}
          </KPI.Value>
          {k.delta ? (
            <div className="flex items-center gap-1.5">
              <KPI.Trend trend={trendDir}>{k.delta}</KPI.Trend>
            </div>
          ) : null}
        </div>
        <KPI.Chart
          color={k.color}
          data={k.spark}
          height={56}
          strokeWidth={1.5}
        />
      </KPI.Content>

      <KPI.Footer className="text-xs text-[var(--cg-text-2)]">{k.footer}</KPI.Footer>
    </KPI>
  );
}

export default function KpiCards() {
  const { scope } = useMember();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpisFor(scope).map((k, i) => (
        <div key={k.id} className="cg-fade-in relative rounded-[1rem]" style={{ "--cg-i": i } as CSSProperties}>
          <CardGlow />
          <KpiCard k={k} />
        </div>
      ))}
    </div>
  );
}
