"use client";

import { CSSProperties } from "react";
import { Card } from "@heroui/react";
import { ChartTooltip, ComposedChart, TrendChip } from "@heroui-pro/react";
import { CardGlow } from "@/components/effects/CardGlow";
import { TextShimmer } from "@/components/core/text-shimmer";
import { useMember } from "@/components/app/MemberContext";
import { C, CHART_H, eur, PERIOD, revenueFor, revenueObjectiveFor, revenueTotalsFor } from "./data";

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs" style={{ color: C.text2 }}>{label}</span>
    </div>
  );
}

export default function ClosedRevenueChart() {
  const { scope } = useMember();
  const totals = revenueTotalsFor(scope);
  const objective = revenueObjectiveFor(scope);
  const chartData = revenueFor(scope).map((d) => ({ ...d, objective }));

  return (
    <Card className="cg-card cg-card-interactive relative w-full">
      <CardGlow />
      <Card.Header className="cg-fade flex-row items-start justify-between gap-2" style={{ "--cg-i": 0 } as CSSProperties}>
        <div>
          <Card.Title className="text-sm font-semibold tracking-[-0.01em]">Closed revenue</Card.Title>
          <Card.Description className="text-xs" style={{ color: C.text2 }}>
            Contracted vs collected · {scope.isTeam ? PERIOD.label : scope.label}
          </Card.Description>
        </div>
        <TrendChip trend={scope.trend}>{totals.delta}</TrendChip>
      </Card.Header>

      <Card.Content className="flex flex-col gap-4">
        <div className="cg-fade flex items-end justify-between" style={{ "--cg-i": 1 } as CSSProperties}>
          <div className="flex items-end gap-2">
            <TextShimmer as="span" duration={2.5} repeatDelay={4} className="text-2xl font-semibold tabular-nums">
              {eur(totals.collected)}
            </TextShimmer>
            <span className="mb-0.5 text-xs" style={{ color: C.text2 }}>
              collected · {totals.ratePct}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LegendDot color={C.green} label="Collected" />
            <LegendDot color={C.slate} label="Contracted" />
          </div>
        </div>

        <div className="cg-fade" style={{ "--cg-i": 2 } as CSSProperties}>
        <ComposedChart data={chartData} height={CHART_H}>
          <defs>
            <linearGradient id="rev-contracted" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={C.slate} stopOpacity={0.18} />
              <stop offset="100%" stopColor={C.slate} stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="rev-collected" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={C.green} stopOpacity={0.28} />
              <stop offset="100%" stopColor={C.green} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <ComposedChart.Grid vertical={false} />
          <ComposedChart.XAxis dataKey="day" tickMargin={8} />
          <ComposedChart.YAxis
            domain={[0, "auto"]}
            tickFormatter={(v: number) => (v >= 1000 ? `€${v / 1000}k` : `€${v}`)}
            width={48}
          />

          <ComposedChart.Line
            dataKey="objective"
            dot={false}
            legendType="none"
            tooltipType="none"
            name="Daily target"
            stroke={C.slateLight}
            strokeDasharray="5 4"
            strokeWidth={1.5}
            type="monotone"
          />

          <ComposedChart.Area
            dataKey="contracted"
            dot={false}
            fill="url(#rev-contracted)"
            name="Contracted"
            stroke={C.slate}
            strokeWidth={1.75}
            type="monotone"
          />

          <ComposedChart.Area
            dataKey="collected"
            dot={false}
            fill="url(#rev-collected)"
            name="Collected"
            stroke={C.green}
            strokeWidth={2.25}
            type="monotone"
          />

          <ComposedChart.Tooltip
            content={({ active, label, payload }) => {
              if (!active || !payload?.length) return null;
              const visible = payload.filter((e) => e.dataKey !== "objective");
              return (
                <ChartTooltip>
                  <ChartTooltip.Header>{label}</ChartTooltip.Header>
                  {visible.map((entry) => (
                    <ChartTooltip.Item key={String(entry.dataKey)}>
                      <ChartTooltip.Indicator
                        color={entry.color ?? (entry as { stroke?: string }).stroke}
                      />
                      <ChartTooltip.Label>{entry.name}</ChartTooltip.Label>
                      <ChartTooltip.Value>{eur(Number(entry.value))}</ChartTooltip.Value>
                    </ChartTooltip.Item>
                  ))}
                </ChartTooltip>
              );
            }}
          />
        </ComposedChart>
        </div>

        <p className="cg-fade text-xs" style={{ color: C.text2, "--cg-i": 3 } as CSSProperties}>
          <span className="font-semibold" style={{ color: C.greenDark }}>
            {totals.ratePct}%
          </span>{" "}
          of contracted already collected{scope.isTeam ? " — healthy cash flow." : "."}
        </p>
      </Card.Content>
    </Card>
  );
}
