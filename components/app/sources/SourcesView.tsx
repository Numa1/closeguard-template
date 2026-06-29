"use client";

import { CSSProperties, useMemo, useState } from "react";
import { ProgressCircle } from "@heroui/react";
import {
  DataGrid,
  type DataGridColumn,
  type DataGridSortDescriptor,
  LineChart,
  Segment,
} from "@heroui-pro/react";
import { cn } from "@/lib/utils";
import { CardGlow } from "@/components/effects/CardGlow";
import { SOURCE_ICON } from "@/components/app/SourceIcon";
import { C, eur, pct, TONE } from "@/components/app/home/data";
import {
  analyzedOf,
  collectionRate,
  funnelForRange,
  revenueTrend,
  revPerLead,
  type SourceRow,
  sourcesForRange,
} from "./data";

/* Couleur de courbe par source (distinctes, légende ci-dessous). */
const SOURCE_COLOR: Record<string, string> = {
  tiktok: "#22c55e",
  instagram: "#6366f1",
  youtube: "#f59e0b",
};

/* ── Helpers ─────────────────────────────────────────── */
function StatCell({ label, value, sub, color, last }: { label: string; value: string; sub?: string; color?: string; last?: boolean }) {
  return (
    <div className={`flex flex-1 flex-col gap-0.5 px-5 py-3.5 ${!last ? "border-r" : ""}`} style={{ borderColor: "var(--cg-border)" }}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.text3 }}>{label}</span>
      <span className="text-[1.3rem] font-semibold tabular-nums leading-tight" style={{ color: color ?? C.text1 }}>{value}</span>
      {sub && <span className="text-[11px]" style={{ color: C.text3 }}>{sub}</span>}
    </div>
  );
}

function closeRateColor(r: number): "accent" | "warning" | "danger" {
  if (r >= 0.65) return "accent";
  if (r >= 0.5) return "warning";
  return "danger";
}
function lqsTone(v: number) {
  return v >= 7 ? TONE.green : v >= 5 ? TONE.amber : TONE.red;
}

function SourceLogo({ name, size = 36 }: { name: SourceRow["name"]; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size, backgroundColor: "#f1f3f5", color: C.text1 }}>
      {SOURCE_ICON[name]}
    </span>
  );
}

/* ── Source card ─────────────────────────────────────── */
function SourceCard({ s, i, total, topId }: { s: SourceRow; i: number; total: number; topId: string }) {
  const isTop = s.id === topId;
  const share = total > 0 ? Math.round((s.leads / total) * 100) : 0;
  const lt = lqsTone(s.avgLqs);
  return (
    <div
      className={cn("cg-fade-in cg-card cg-card-interactive relative p-5", isTop && "ring-1 ring-[var(--cg-cta)]")}
      style={{ "--cg-i": i } as CSSProperties}
    >
      <CardGlow />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SourceLogo name={s.name} />
          <span className="text-base font-semibold" style={{ color: C.text1 }}>{s.name}</span>
        </div>
        {isTop && (
          <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: "var(--cg-cta-soft-bg)", color: "var(--cg-cta-soft-fg)" }}>
            Top source
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-3xl font-semibold tabular-nums" style={{ color: C.text1 }}>{s.leads}</div>
          <div className="text-xs" style={{ color: C.text2 }}>leads · {share}% of total</div>
        </div>
        <div className="flex items-center gap-2.5">
          <ProgressCircle aria-label={`${pct(s.closeRate)} close rate`} color={closeRateColor(s.closeRate)} size="md" value={s.closeRate * 100}>
            <ProgressCircle.Track>
              <ProgressCircle.TrackCircle />
              <ProgressCircle.FillCircle />
            </ProgressCircle.Track>
          </ProgressCircle>
          <div className="text-right">
            <div className="text-lg font-semibold tabular-nums" style={{ color: C.text1 }}>{pct(s.closeRate)}</div>
            <div className="text-[11px]" style={{ color: C.text3 }}>close rate</div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ backgroundColor: lt.soft, color: lt.text }}>
          LQS {s.avgLqs.toFixed(1)}/10
        </span>
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ backgroundColor: "rgba(100,116,139,0.12)", color: C.slate }}>
          {s.topObjection.label} ×{s.topObjection.count}
        </span>
      </div>

      <div className="my-3 border-t" style={{ borderColor: "var(--cg-border)" }} />

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.text3 }}>Collected</div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: C.text1 }}>
            {eur(s.collected)} <span className="text-xs font-medium" style={{ color: TONE.green.text }}>{collectionRate(s)}%</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.text3 }}>Rev / lead</div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: C.text1 }}>{eur(revPerLead(s))}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Lead quality mix (barres empilées) ──────────────── */
const QUALITY = [
  { key: "hq" as const, label: "Highly qualified", color: C.green1 },
  { key: "qualified" as const, label: "Qualified", color: C.green3 },
  { key: "challenging" as const, label: "Challenging", color: C.amber },
  { key: "unqualified" as const, label: "Unqualified", color: C.red },
];

function QualityMix({ rows }: { rows: SourceRow[] }) {
  return (
    <div className="cg-fade cg-card relative flex flex-col gap-4 p-5" style={{ "--cg-i": 1 } as CSSProperties}>
      <div>
        <h2 className="text-sm font-semibold tracking-[-0.01em]" style={{ color: C.text1 }}>Lead quality mix</h2>
        <p className="text-xs" style={{ color: C.text2 }}>Quality breakdown of analyzed leads per source.</p>
      </div>
      <div className="flex flex-col gap-3.5">
        {rows.map((s) => {
          const a = analyzedOf(s);
          return (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: C.text1 }}>{s.name}</span>
                <span className="text-xs tabular-nums" style={{ color: C.text3 }}>{a} analyzed</span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: C.track }}>
                {QUALITY.map((q) =>
                  s[q.key] > 0 ? (
                    <div key={q.key} title={`${q.label}: ${s[q.key]}`} style={{ width: `${(s[q.key] / a) * 100}%`, backgroundColor: q.color }} />
                  ) : null,
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
        {QUALITY.map((q) => (
          <div key={q.key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: q.color }} />
            <span className="text-xs" style={{ color: C.text2 }}>{q.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Revenue by source (BarChart) ────────────────────── */
function RevenueChart({ rows }: { rows: SourceRow[] }) {
  const data = revenueTrend(rows);
  return (
    <div className="cg-fade cg-card relative flex flex-col gap-3 p-5" style={{ "--cg-i": 0 } as CSSProperties}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-[-0.01em]" style={{ color: C.text1 }}>Collected revenue by source</h2>
          <p className="text-xs" style={{ color: C.text2 }}>Trend over the period.</p>
        </div>
        <div className="flex items-center gap-3">
          {rows.map((s) => (
            <span key={s.id} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: SOURCE_COLOR[s.id] ?? C.slate }} />
              <span className="text-xs" style={{ color: C.text2 }}>{s.name}</span>
            </span>
          ))}
        </div>
      </div>
      <LineChart data={data} height={210}>
        <LineChart.Grid vertical={false} />
        <LineChart.XAxis dataKey="label" tickMargin={8} />
        <LineChart.YAxis tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}k`} width={42} />
        {rows.map((s) => (
          <LineChart.Line
            key={s.id}
            dataKey={s.id}
            name={s.name}
            stroke={SOURCE_COLOR[s.id] ?? C.slate}
            strokeWidth={2}
            type="monotone"
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
        <LineChart.Tooltip content={<LineChart.TooltipContent valueFormatter={(v) => eur(Number(v))} />} />
      </LineChart>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default function SourcesView() {
  const [range, setRange] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState<DataGridSortDescriptor>({ column: "collected", direction: "descending" });

  /* Tout dérive de la plage sélectionnée. */
  const rows = useMemo(() => sourcesForRange(range), [range]);
  const fnl = useMemo(() => funnelForRange(rows), [rows]);
  const totalLeads = useMemo(() => rows.reduce((a, s) => a + s.leads, 0), [rows]);
  const topId = useMemo(() => rows.reduce((a, b) => (b.collected > a.collected ? b : a), rows[0]).id, [rows]);

  const sorted = useMemo(() => {
    const col = sortDescriptor.column as keyof SourceRow;
    if (!col) return rows;
    return [...rows].sort((a, b) => {
      const av = a[col];
      const bv = b[col];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [rows, sortDescriptor]);

  const columns = useMemo<DataGridColumn<SourceRow>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Source",
        allowsSorting: true,
        isRowHeader: true,
        cell: (s) => (
          <div className="flex items-center gap-2.5">
            <SourceLogo name={s.name} size={28} />
            <span className="text-sm font-semibold" style={{ color: C.text1 }}>{s.name}</span>
          </div>
        ),
      },
      { id: "leads", accessorKey: "leads", header: "Leads", align: "center", allowsSorting: true },
      {
        id: "closeRate",
        accessorKey: "closeRate",
        header: "Close rate",
        allowsSorting: true,
        cell: (s) => (
          <div className="flex items-center gap-2">
            <span className="w-9 text-sm font-semibold tabular-nums" style={{ color: C.text1 }}>{pct(s.closeRate)}</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ backgroundColor: C.track }}>
              <div className="h-full rounded-full" style={{ width: `${s.closeRate * 100}%`, backgroundColor: C.green }} />
            </div>
          </div>
        ),
      },
      { id: "showRate", accessorKey: "showRate", header: "Show rate", allowsSorting: true, cell: (s) => <span className="text-sm tabular-nums" style={{ color: C.text2 }}>{pct(s.showRate)}</span> },
      { id: "avgLqs", accessorKey: "avgLqs", header: "Avg LQS", align: "center", allowsSorting: true, cell: (s) => <span className="text-sm font-medium tabular-nums" style={{ color: lqsTone(s.avgLqs).text }}>{s.avgLqs.toFixed(1)}</span> },
      { id: "objection", header: "Top objection", cell: (s) => <span className="text-sm" style={{ color: C.text2 }}>{s.topObjection.label} <span style={{ color: C.text3 }}>×{s.topObjection.count}</span></span> },
      { id: "contracted", accessorKey: "contracted", header: "Contracted", align: "end", allowsSorting: true, cell: (s) => <span className="text-sm tabular-nums" style={{ color: C.text2 }}>{eur(s.contracted)}</span> },
      {
        id: "collected",
        accessorKey: "collected",
        header: "Collected",
        align: "end",
        allowsSorting: true,
        cell: (s) => <span className="text-sm font-medium tabular-nums" style={{ color: C.text1 }}>{eur(s.collected)} <span className="text-xs" style={{ color: TONE.green.text }}>{collectionRate(s)}%</span></span>,
      },
      { id: "revLead", header: "Rev / lead", align: "end", cell: (s) => <span className="text-sm tabular-nums" style={{ color: C.text2 }}>{eur(revPerLead(s))}</span> },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <section className="cg-fade flex flex-wrap items-end justify-between gap-4" style={{ "--cg-base": 0, "--cg-i": 0 } as CSSProperties}>
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#000102]">Sources</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: C.text2 }}>Which channels bring the best leads — and close the most.</p>
        </div>
        <Segment selectedKey={range} size="sm" variant="ghost" onSelectionChange={(k) => setRange(String(k))}>
          <Segment.Item id="7d">7d</Segment.Item>
          <Segment.Item id="30d">30d</Segment.Item>
          <Segment.Item id="90d">90d</Segment.Item>
          <Segment.Item id="all">All time</Segment.Item>
        </Segment>
      </section>

      {/* Funnel KPIs */}
      <section className="cg-fade cg-card relative flex flex-wrap" style={{ "--cg-base": 2, "--cg-i": 0 } as CSSProperties}>
        <StatCell label="Total leads" value={String(fnl.leads)} sub={`${fnl.upcoming} upcoming`} />
        <StatCell label="Show rate" value={pct(fnl.shows / fnl.leads)} sub={`${fnl.shows} / ${fnl.leads}`} />
        <StatCell label="Close rate" value={pct(fnl.shows ? fnl.closed / fnl.shows : 0)} sub={`${fnl.closed} / ${fnl.shows}`} />
        <StatCell label="Contracted" value={eur(fnl.contracted)} sub="signed" />
        <StatCell label="Collected" value={eur(fnl.collected)} sub={`${fnl.contracted ? Math.round((fnl.collected / fnl.contracted) * 100) : 0}% of contracted`} color={TONE.green.text} last />
      </section>

      {/* Source cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3" style={{ "--cg-base": 4 } as CSSProperties}>
        {rows.map((s, i) => (
          <SourceCard key={s.id} s={s} i={i} total={totalLeads} topId={topId} />
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2" style={{ "--cg-base": 7 } as CSSProperties}>
        <RevenueChart rows={rows} />
        <QualityMix rows={rows} />
      </section>

      {/* Detailed breakdown */}
      <section className="cg-fade" style={{ "--cg-base": 10, "--cg-i": 0 } as CSSProperties}>
        <div className="cg-card cg-card-interactive relative">
          <CardGlow />
          <div className="px-5 pb-2 pt-4">
            <h2 className="text-sm font-semibold tracking-[-0.01em]" style={{ color: C.text1 }}>Breakdown by source</h2>
            <p className="text-xs" style={{ color: C.text2 }}>All metrics, sortable.</p>
          </div>
          <div className="px-3 pb-3">
            <DataGrid
              aria-label="Sources breakdown"
              variant="secondary"
              columns={columns}
              data={sorted}
              getRowId={(s) => s.id}
              selectionMode="none"
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
              contentClassName="min-w-[820px]"
              className="[&_.table-root]:rounded-none [&_.table-root]:border-0 [&_.table-root]:bg-transparent [&_.table-root]:shadow-none [&_.table__column:first-child]:rounded-l-lg [&_.table__column:last-child]:rounded-r-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
