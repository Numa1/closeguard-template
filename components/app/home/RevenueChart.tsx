"use client";

import { Card } from "@heroui/react";
import { AreaChart } from "@heroui-pro/react";

import { revenueSeries } from "./data";

export default function RevenueChart() {
  return (
    <Card className="rounded-2xl bg-white shadow-sm">
      <Card.Header className="flex flex-row items-start justify-between px-5 pb-1 pt-5">
        <div>
          <Card.Title className="text-sm">Revenu signé</Card.Title>
          <Card.Description className="text-xs text-[#6b7280]">
            12 derniers mois
          </Card.Description>
        </div>
        <span className="text-lg font-semibold tabular-nums text-[#000102]">
          112 450 €
        </span>
      </Card.Header>
      <Card.Content className="px-3 pb-4 pt-2">
        <AreaChart data={revenueSeries} height={220}>
          <defs>
            <linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <AreaChart.Grid vertical={false} />
          <AreaChart.XAxis dataKey="month" tickMargin={8} />
          <AreaChart.YAxis
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            width={32}
          />
          <AreaChart.Area
            dataKey="revenue"
            dot={false}
            fill="url(#rev-fill)"
            name="Revenu"
            stroke="var(--accent)"
            strokeWidth={2.5}
            type="monotone"
          />
          <AreaChart.Tooltip content={<AreaChart.TooltipContent />} />
        </AreaChart>
      </Card.Content>
    </Card>
  );
}
