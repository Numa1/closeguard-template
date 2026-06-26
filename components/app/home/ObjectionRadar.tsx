"use client";

import { CSSProperties } from "react";
import { Card } from "@heroui/react";
import { ChartTooltip, RadarChart } from "@heroui-pro/react";
import { CardGlow } from "@/components/effects/CardGlow";
import { useMember } from "@/components/app/MemberContext";
import { C, CHART_H, objectionsFor, PERIOD } from "./data";

const RADAR_COLOR = C.greenSoft;

const DOT_COLORS = [
  C.green1,
  C.green2,
  C.green3,
  C.green4,
  C.green5,
  C.green6,
  C.green7,
];

export default function ObjectionRadar() {
  const { scope } = useMember();
  const scopedObj = objectionsFor(scope);

  const totalVolume = scopedObj.reduce((s, o) => s + o.volume, 0);
  const sorted = [...scopedObj].sort((a, b) => b.resolution - a.resolution);
  const radarData = scopedObj.map((o) => ({
    category: o.cat,
    resolution: Math.round(o.resolution * 100),
    volume: o.volume,
  }));

  return (
    <Card className="cg-card cg-card-interactive relative w-full">
      <CardGlow />
      <Card.Header className="cg-fade" style={{ "--cg-i": 0 } as CSSProperties}>
        <Card.Title className="text-sm font-semibold tracking-[-0.01em]">Objection radar</Card.Title>
        <Card.Description className="text-xs" style={{ color: C.text2 }}>
          Distribution across categories
        </Card.Description>
      </Card.Header>

      <Card.Content className="grid grid-cols-2 gap-0">
        <div className="cg-fade" style={{ "--cg-i": 1 } as CSSProperties}>
        <RadarChart data={radarData} height={CHART_H}>
          <RadarChart.Grid />
          <RadarChart.AngleAxis dataKey="category" tick={{ fontSize: 10 }} />
          <RadarChart.Radar
            dataKey="resolution"
            dot={{ fill: RADAR_COLOR, r: 3, strokeWidth: 0 }}
            fill={RADAR_COLOR}
            fillOpacity={0.18}
            name="Resolution"
            stroke={RADAR_COLOR}
            strokeWidth={2}
          />
          <RadarChart.Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const pt = payload[0]?.payload as { category?: string; resolution?: number; volume?: number } | undefined;
              return (
                <ChartTooltip>
                  {pt?.category && <ChartTooltip.Header>{pt.category}</ChartTooltip.Header>}
                  <ChartTooltip.Item>
                    <ChartTooltip.Indicator color={RADAR_COLOR} />
                    <ChartTooltip.Label>Resolution</ChartTooltip.Label>
                    <ChartTooltip.Value>{pt?.resolution ?? "—"}%</ChartTooltip.Value>
                  </ChartTooltip.Item>
                  <ChartTooltip.Item>
                    <ChartTooltip.Label>Calls</ChartTooltip.Label>
                    <ChartTooltip.Value>{pt?.volume ?? "—"}</ChartTooltip.Value>
                  </ChartTooltip.Item>
                </ChartTooltip>
              );
            }}
          />
        </RadarChart>
        </div>

        <div className="flex flex-col justify-center gap-2.5 border-l pl-5" style={{ borderColor: "var(--cg-border)" }}>
          {sorted.map((o, i) => {
            const resPct = Math.round(o.resolution * 100);
            return (
              <div
                key={o.cat}
                className="cg-fade flex items-center justify-between"
                style={{ "--cg-i": 2 + i } as CSSProperties}
              >
                <div className="flex items-center gap-1.5">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: DOT_COLORS[i] ?? C.green }} />
                  <span className="text-xs" style={{ color: C.text2 }}>{o.cat}</span>
                </div>
                <span className="text-xs font-semibold tabular-nums" style={{ color: C.green }}>{resPct}%</span>
              </div>
            );
          })}
          <p
            className="cg-fade mt-1 border-t pt-2 text-xs"
            style={{ borderColor: "var(--cg-border)", color: C.text2, "--cg-i": 2 + sorted.length } as CSSProperties}
          >
            <span className="font-semibold" style={{ color: C.text1 }}>{totalVolume}</span> calls · {PERIOD.label}
          </p>
        </div>
      </Card.Content>
    </Card>
  );
}
