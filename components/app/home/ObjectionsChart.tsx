"use client";

import { CSSProperties } from "react";
import { Card, Chip } from "@heroui/react";
import { BarChart, ChartTooltip } from "@heroui-pro/react";
import { Cell } from "recharts";
import { CardGlow } from "@/components/effects/CardGlow";
import { useMember } from "@/components/app/MemberContext";
import { C, CHART_H, objectionsFor } from "./data";

function resColor(r: number): string {
  if (r >= 0.80) return C.green1;
  if (r >= 0.65) return C.green2;
  if (r >= 0.50) return C.green3;
  return C.green5;
}

export default function ObjectionsChart() {
  const { scope } = useMember();
  const scopedObj = objectionsFor(scope);

  const chartData = scopedObj.map((o) => ({
    cat: o.cat,
    resolution: Math.round(o.resolution * 100),
    volume: o.volume,
    color: resColor(o.resolution),
  }));

  const worstObj = scopedObj.reduce((a, b) => (a.resolution < b.resolution ? a : b));
  const avgResolution = Math.round(
    (scopedObj.reduce((s, o) => s + o.resolution, 0) / scopedObj.length) * 100,
  );

  return (
    <Card className="cg-card cg-card-interactive relative w-full">
      <CardGlow />
      <Card.Header className="cg-fade flex-row items-center justify-between" style={{ "--cg-i": 0 } as CSSProperties}>
        <div>
          <Card.Title className="text-sm font-semibold tracking-[-0.01em]">Objection resolution rate</Card.Title>
          <Card.Description className="text-xs" style={{ color: C.text2 }}>
            Success rate per objection type
          </Card.Description>
        </div>
        <Chip color="warning" size="sm" variant="soft">
          Avg {avgResolution}%
        </Chip>
      </Card.Header>

      <Card.Content>
        <div className="cg-fade" style={{ "--cg-i": 1 } as CSSProperties}>
        <BarChart data={chartData} height={CHART_H}>
          <BarChart.Grid vertical={false} />
          <BarChart.XAxis dataKey="cat" tickMargin={8} />
          <BarChart.YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v: number) => `${v}%`}
            width={36}
          />
          <BarChart.Bar barSize={20} dataKey="resolution" radius={[8, 8, 8, 8]}>
            {chartData.map((entry) => (
              <Cell key={entry.cat} fill={entry.color} />
            ))}
          </BarChart.Bar>
          <BarChart.Tooltip
            content={({ active, label, payload }) => {
              if (!active || !payload?.length) return null;
              const obj = scopedObj.find((o) => o.cat === label);
              return (
                <ChartTooltip>
                  <ChartTooltip.Header>{label}</ChartTooltip.Header>
                  <ChartTooltip.Item>
                    <ChartTooltip.Indicator color={payload[0].fill as string} />
                    <ChartTooltip.Label>Resolution</ChartTooltip.Label>
                    <ChartTooltip.Value>{payload[0].value}%</ChartTooltip.Value>
                  </ChartTooltip.Item>
                  {obj && (
                    <ChartTooltip.Item>
                      <ChartTooltip.Label>Calls</ChartTooltip.Label>
                      <ChartTooltip.Value>{obj.volume}</ChartTooltip.Value>
                    </ChartTooltip.Item>
                  )}
                </ChartTooltip>
              );
            }}
          />
        </BarChart>
        </div>

        <p className="cg-fade mt-2 text-xs" style={{ color: C.text2, "--cg-i": 2 } as CSSProperties}>
          <span className="font-semibold" style={{ color: C.text1 }}>{worstObj.cat}</span> is the
          hardest to resolve ({Math.round(worstObj.resolution * 100)}%) — coaching priority.
        </p>
      </Card.Content>
    </Card>
  );
}
