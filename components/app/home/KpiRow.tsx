"use client";

import { AreaChart, KPI } from "@heroui-pro/react";

import { sparkDown, sparkUp } from "./data";

type Trend = "up" | "down" | "neutral";

interface KpiCardProps {
  id: string;
  title: string;
  value: number;
  style?: "decimal" | "percent";
  maxFrac?: number;
  trend: Trend;
  delta: string;
  color: string;
  data: { value: number }[];
}

function KpiCard({
  id,
  title,
  value,
  style = "decimal",
  maxFrac = 0,
  trend,
  delta,
  color,
  data,
}: KpiCardProps) {
  return (
    <KPI className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <KPI.Header>
        <KPI.Title>{title}</KPI.Title>
      </KPI.Header>
      <KPI.Content>
        <KPI.Value maximumFractionDigits={maxFrac} style={style} value={value} />
        <KPI.Trend trend={trend}>{delta}</KPI.Trend>
      </KPI.Content>
      <div className="-mx-5 -mb-5 mt-2">
        <AreaChart
          data={data}
          height={80}
          margin={{ bottom: 0, left: 0, right: 0, top: 4 }}
        >
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <AreaChart.Area
            dataKey="value"
            dot={false}
            fill={`url(#${id})`}
            stroke={color}
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </div>
    </KPI>
  );
}

export default function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <KpiCard
        id="kpi-leads"
        title="Qualité des leads"
        value={5.7}
        maxFrac={1}
        trend="up"
        delta="+4%"
        color="var(--accent)"
        data={sparkUp}
      />
      <KpiCard
        id="kpi-closing"
        title="Taux de closing"
        value={0.72}
        style="percent"
        trend="up"
        delta="+6%"
        color="var(--accent)"
        data={sparkUp}
      />
      <KpiCard
        id="kpi-wasted"
        title="Deals gâchés"
        value={0.11}
        style="percent"
        trend="down"
        delta="-2%"
        color="var(--color-danger)"
        data={sparkDown}
      />
      <KpiCard
        id="kpi-calls"
        title="Appels analysés"
        value={32}
        trend="up"
        delta="+12"
        color="var(--accent)"
        data={sparkUp}
      />
    </div>
  );
}
