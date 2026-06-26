"use client";

import { CSSProperties } from "react";
import { Card } from "@heroui/react";
import LazyPixelBlast from "@/components/effects/LazyPixelBlast";
import { CardGlow } from "@/components/effects/CardGlow";
import AnimatedWaveIcon from "@/components/AnimatedWaveIcon";
import GlowButton from "@/components/GlowButton";
import WaveReveal from "@/components/animata/text/wave-reveal";
import { useMember } from "@/components/app/MemberContext";
import { C, hero, PERIOD, type Scope, teamScoreAvg } from "./data";

/* ── Narrative copy ──────────────────────────────────── */
function headline(scope: Scope): string {
  const toTarget = +(hero.objective - scope.score).toFixed(1);
  if (scope.isTeam) {
    return toTarget > 0
      ? `Your team is ${toTarget} pt below the ${hero.objective.toFixed(1)} target`
      : `Your team exceeded the target by ${Math.abs(toTarget).toFixed(1)} pt`;
  }
  return toTarget > 0
    ? `${scope.label.split(" ")[0]} is ${toTarget} pt below the ${hero.objective.toFixed(1)} target`
    : `${scope.label.split(" ")[0]} exceeded the target by ${Math.abs(toTarget).toFixed(1)} pt`;
}

function phrase(scope: Scope): string {
  if (scope.isTeam) {
    const wastedPct = Math.round(scope.wasted * 100);
    return `Price objections cost 7 deals this period · ${wastedPct}% of prospects wasted · €${scope.atStake.toLocaleString("en-US")} still recoverable`;
  }
  const gap = +(scope.score - teamScoreAvg).toFixed(1);
  const vs = gap >= 0 ? `+${gap} vs team avg` : `${gap} vs team avg`;
  const wastedPct = Math.round(scope.wasted * 100);
  return `${wastedPct}% of prospects wasted · ${vs} · €${scope.atStake.toLocaleString("en-US")} at risk this period`;
}

function primaryCta(scope: Scope): string {
  return scope.isTeam ? "Analyze lost deals" : `Review ${scope.label.split(" ")[0]}'s calls`;
}

/* Pill de tendance visible sur fond sombre (remplace TrendChip, peu lisible ici) */
function TrendPill({ trend, delta }: { trend: "up" | "down" | "neutral"; delta: string }) {
  const conf =
    trend === "up"
      ? { color: C.greenSoft, bg: "rgba(114,250,145,0.18)", arrow: "↑" }
      : trend === "down"
        ? { color: "#fca5a5", bg: "rgba(248,113,113,0.18)", arrow: "↓" }
        : { color: "rgba(255,255,255,0.7)", bg: "rgba(255,255,255,0.1)", arrow: "→" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ background: conf.bg, color: conf.color }}
    >
      <span aria-hidden>{conf.arrow}</span>
      {delta}
      <span className="font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
        vs prev 7d
      </span>
    </span>
  );
}

/* ── Stat strip (horizontal, bottom bar) ─────────────── */
function StatCell({
  label,
  value,
  sub,
  accent,
  warn,
  last,
  animI,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  warn?: boolean;
  last?: boolean;
  animI?: number;
}) {
  const color = accent ? C.green : warn ? C.amber : "rgba(255,255,255,0.88)";
  return (
    <div
      className={`cg-fade flex flex-1 flex-col gap-0.5 px-5 py-4 ${!last ? "border-r" : ""}`}
      style={{ borderColor: "var(--cg-border-dark)", "--cg-i": animI } as CSSProperties}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.06em]"
        style={{ color: "rgba(255,255,255,0.28)" }}
      >
        {label}
      </span>
      <span
        className="text-[1.1rem] font-semibold tabular-nums leading-tight"
        style={{ color }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.30)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

function ProgressCell({ score, objective, animI }: { score: number; objective: number; animI?: number }) {
  const pct = Math.min(100, Math.round((score / objective) * 100));
  const over = score >= objective;
  const remaining = +(objective - score).toFixed(1);
  return (
    <div className="cg-fade flex flex-[2] flex-col justify-center gap-2 px-5 py-4" style={{ "--cg-i": animI } as CSSProperties}>
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.06em]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Progress to target
        </span>
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: over ? C.green : "rgba(255,255,255,0.55)" }}
        >
          {pct}%
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: over
              ? "linear-gradient(90deg,#22c55e,#72fa91)"
              : "linear-gradient(90deg,rgba(114,250,145,0.45),rgba(114,250,145,0.75))",
          }}
        />
      </div>
      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>
        {over
          ? `✓ ${Math.abs(remaining)} pt above target`
          : `${remaining} pt remaining`}
      </span>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function DashboardHero() {
  const { scope } = useMember();

  return (
    <Card
      className="relative overflow-hidden border-0"
      style={{ background: "#080d08", borderRadius: "var(--cg-radius)" }}
    >
      <CardGlow />

      {/* PixelBlast — côté droit, zone sans texte */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.38,
          maskImage:
            "linear-gradient(to left, black 0%, black 38%, transparent 72%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, black 38%, transparent 72%)",
        }}
      >
        <LazyPixelBlast
          variant="circle"
          pixelSize={4}
          color="#72fa91"
          patternScale={2}
          patternDensity={0.95}
          enableRipples={false}
          speed={0.4}
          edgeFade={0.3}
          transparent
        />
      </div>

      <Card.Content className="relative p-0">
        {/* ── TOP: narrative content ─── */}
        <div className="flex flex-col gap-5 px-7 pb-5 pt-6">
          {/* Period */}
          <div className="cg-fade flex items-center gap-2" style={{ "--cg-i": 0 } as CSSProperties}>
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {PERIOD.label} · {PERIOD.calls} calls analyzed
              {!scope.isTeam && (
                <span style={{ color: "rgba(255,255,255,0.20)" }}>
                  {" "}· {scope.sublabel}
                </span>
              )}
            </span>
          </div>

          {/* Score + trend */}
          <div className="cg-fade flex flex-col gap-1.5" style={{ "--cg-i": 1 } as CSSProperties}>
            <div className="flex items-baseline gap-3">
              <span
                className="text-[3.5rem] font-semibold leading-none tracking-[-0.03em]"
                style={{ color: "#ffffff" }}
              >
                {scope.score.toFixed(1)}
              </span>
              <span
                className="text-[1.4rem] font-light"
                style={{ color: "rgba(255,255,255,0.20)" }}
              >
                /10
              </span>
              <TrendPill trend={scope.trend} delta={scope.delta} />
            </div>

            <WaveReveal
              key={scope.id}
              text={headline(scope)}
              duration="700ms"
              className="justify-start whitespace-pre-wrap px-0 text-left text-[1.05rem] font-semibold leading-snug text-white/90 md:px-0 md:text-[1.05rem]"
            />
          </div>

          {/* Phrase */}
          <p
            className="cg-fade text-[12.5px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.38)", "--cg-i": 2 } as CSSProperties}
          >
            {phrase(scope)}
          </p>

          {/* CTA — même bouton signature que la sidebar */}
          <div className="cg-fade flex items-center gap-3" style={{ "--cg-i": 3 } as CSSProperties}>
            <GlowButton onClick={() => {}}>
              <AnimatedWaveIcon className="size-4" />
              <span>{primaryCta(scope)}</span>
            </GlowButton>
          </div>
        </div>

        {/* ── BOTTOM: stat strip, full width ─── */}
        <div
          className="flex border-t backdrop-blur-md"
          style={{
            borderColor: "var(--cg-border-dark)",
            background: "rgba(10,16,10,0.55)",
          }}
        >
          <StatCell
            label="Target"
            value={hero.objective.toFixed(1)}
            sub={
              scope.score >= hero.objective
                ? "✓ Reached"
                : `${(+(hero.objective - scope.score).toFixed(1))} pt to go`
            }
            animI={4}
          />
          <StatCell
            label="Team avg"
            value={hero.teamAvg.toFixed(1)}
            sub={
              !scope.isTeam
                ? scope.score >= hero.teamAvg
                  ? "↑ above avg"
                  : "↓ below avg"
                : undefined
            }
            animI={5}
          />
          <StatCell
            label="Top closer"
            value={hero.topCloser.toFixed(1)}
            sub="Sofia Marchetti"
            accent
            animI={6}
          />
          <ProgressCell score={scope.score} objective={hero.objective} animI={7} />
        </div>
      </Card.Content>
    </Card>
  );
}
