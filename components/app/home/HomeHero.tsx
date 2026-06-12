"use client";

import { Card } from "@heroui/react";
import { RadialChart, TrendChip } from "@heroui-pro/react";
import PixelCard from "@/components/effects/PixelCard";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";

const SCORE = 7.1;
const MAX = 10;

const PIXEL_COLORS: Record<string, string> = {
  "1": "#bbf7d0,#86efac,#72fa91",
  "2": "#e9ddff,#b89aff,#7301ff",
  "3": "#bcd0fa,#84a9f4,#2664ec",
};

export default function HomeHero() {
  const theme = useCurrentTheme();
  const data = [{ name: "Score", value: SCORE, fill: "var(--accent)" }];

  return (
    <Card className="relative h-full overflow-hidden rounded-2xl bg-white shadow-sm">
      <PixelCard
        gap={6}
        speed={40}
        colors={PIXEL_COLORS[theme] ?? PIXEL_COLORS["1"]}
      >
        <Card.Content className="flex h-full flex-col items-center justify-between gap-4 p-6">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-medium text-[#6b7280]">
              CloseGuard Score
            </span>
            <TrendChip trend="up">+32,4%</TrendChip>
          </div>

          <div className="relative my-1">
            <RadialChart
              barSize={14}
              data={data}
              endAngle={-45}
              height={170}
              innerRadius="74%"
              outerRadius="100%"
              startAngle={225}
              width={190}
            >
              <RadialChart.AngleAxis
                angleAxisId={0}
                domain={[0, MAX]}
                tick={false}
                type="number"
              />
              <RadialChart.Bar
                background
                angleAxisId={0}
                cornerRadius={12}
                dataKey="value"
              />
            </RadialChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="whitespace-nowrap text-4xl font-semibold tabular-nums text-[#000102]">
                {SCORE.toFixed(1)}
                <span className="ml-0.5 text-xl text-[#9ca3af]">/{MAX}</span>
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-[#6b7280]">
            Performance globale des appels sur la période
          </p>
        </Card.Content>
      </PixelCard>
    </Card>
  );
}
