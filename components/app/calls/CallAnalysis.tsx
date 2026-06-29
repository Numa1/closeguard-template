"use client";

import { CSSProperties, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowsRotateRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  Ellipsis,
  Eye,
  Funnel,
  Headphones,
  Person,
} from "@gravity-ui/icons";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import {
  DataGrid,
  type DataGridColumn,
  type DataGridSortDescriptor,
  Segment,
} from "@heroui-pro/react";
import AnimatedWaveIcon from "@/components/AnimatedWaveIcon";
import GlowButton from "@/components/GlowButton";
import { CardGlow } from "@/components/effects/CardGlow";
import { GooeyInput } from "@/components/effects/GooeyInput";
import { SOURCE_ICON } from "@/components/app/SourceIcon";
import { C, eur, TONE, type ToneKey } from "@/components/app/home/data";
import {
  type Call,
  calls,
  CLOSER_NAMES,
  daysAgo,
  isException,
  SOURCE_NAMES,
  STATUS_META,
} from "./data";

const PAGE_SIZE = 8;

const TABS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "review", label: "Needs review" },
  { id: "closable", label: "Closable" },
  { id: "hard", label: "Hard to Close" },
  { id: "poor", label: "Poorly Executed" },
  { id: "not", label: "Not Closable" },
];

const DATE_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

function scoreTone(score: number): ToneKey {
  if (score >= 7) return "green";
  if (score >= 5) return "amber";
  return "red";
}

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function ScoreBar({ score }: { score: number }) {
  const t = TONE[scoreTone(score)];
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 shrink-0 text-sm font-semibold tabular-nums" style={{ color: t.text }}>
        {score.toFixed(1)}
      </span>
      <div className="h-1.5 w-14 overflow-hidden rounded-full" style={{ backgroundColor: C.track }}>
        <div className="h-full rounded-full" style={{ width: `${(score / 10) * 100}%`, backgroundColor: t.solid }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Call["status"] }) {
  const m = STATUS_META[status];
  const t = TONE[m.tone];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: t.soft, color: t.text }}
    >
      {m.label}
    </span>
  );
}

function StatCell({
  label,
  value,
  color,
  last,
}: {
  label: string;
  value: string;
  color?: string;
  last?: boolean;
}) {
  return (
    <div className={`flex flex-1 flex-col gap-0.5 px-5 py-3.5 ${!last ? "border-r" : ""}`} style={{ borderColor: "var(--cg-border)" }}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.text3 }}>
        {label}
      </span>
      <span className="text-[1.15rem] font-semibold tabular-nums leading-tight" style={{ color: color ?? C.text1 }}>
        {value}
      </span>
    </div>
  );
}

function RowActions({ id, onView }: { id: string; onView: () => void }) {
  return (
    <Dropdown>
      <Button isIconOnly size="sm" variant="ghost" aria-label="Actions" className="[&_svg]:text-[#9ca3af]">
        <Ellipsis />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(k) => {
            if (k === "view") onView();
            else if (k === "copy") navigator.clipboard?.writeText(`#${id}`);
          }}
        >
          <Dropdown.Item id="view" textValue="View analysis">
            <Eye className="size-4" />
            <Label>View analysis</Label>
          </Dropdown.Item>
          <Dropdown.Item id="reanalyze" textValue="Re-analyze">
            <ArrowsRotateRight className="size-4" />
            <Label>Re-analyze</Label>
          </Dropdown.Item>
          <Dropdown.Item id="copy" textValue="Copy ID">
            <Copy className="size-4" />
            <Label>Copy ID</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export default function CallAnalysis() {
  const router = useRouter();
  const [tab, setTab] = useState<string>("all");
  const [closer, setCloser] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [search, setSearch] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<DataGridSortDescriptor>({
    column: "date",
    direction: "descending",
  });
  const [page, setPage] = useState(0);

  const resetPage = useCallback(() => setPage(0), []);

  /* Scope = tous les filtres SAUF l'onglet de statut (sert aux KPIs + compteurs). */
  const scoped = useMemo(() => {
    let r = calls;
    if (closer !== "all") r = r.filter((c) => c.closer === closer);
    if (source !== "all") r = r.filter((c) => c.source === source);
    const max = DATE_DAYS[dateRange];
    if (max) r = r.filter((c) => daysAgo(c) <= max);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((c) => c.prospect.toLowerCase().includes(q) || c.closer.toLowerCase().includes(q));
    }
    return r;
  }, [closer, source, dateRange, search]);

  const tabCount = useCallback(
    (id: string) => {
      if (id === "all") return scoped.length;
      if (id === "review") return scoped.filter(isException).length;
      return scoped.filter((c) => c.status === id).length;
    },
    [scoped],
  );

  const filtered = useMemo(() => {
    if (tab === "all") return scoped;
    if (tab === "review") return scoped.filter(isException);
    return scoped.filter((c) => c.status === tab);
  }, [scoped, tab]);

  const stats = useMemo(() => {
    const n = scoped.length;
    const closed = scoped.filter((c) => c.closed);
    const avg = n ? scoped.reduce((s, c) => s + c.score, 0) / n : 0;
    const value = closed.reduce((s, c) => s + c.valueEur, 0);
    return {
      total: n,
      avg,
      closeRate: n ? Math.round((closed.length / n) * 100) : 0,
      value,
      review: scoped.filter(isException).length,
    };
  }, [scoped]);

  const sorted = useMemo(() => {
    const col = sortDescriptor.column as keyof Call;
    if (!col) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[col];
      const bv = b[col];
      const cmp =
        typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filtered, sortDescriptor]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const hasActiveFilters =
    tab !== "all" || closer !== "all" || source !== "all" || dateRange !== "30d" || search !== "";

  const clearFilters = useCallback(() => {
    setTab("all");
    setCloser("all");
    setSource("all");
    setDateRange("30d");
    setSearch("");
    resetPage();
  }, [resetPage]);

  const columns = useMemo<DataGridColumn<Call>[]>(
    () => [
      {
        id: "prospect",
        accessorKey: "prospect",
        header: "Prospect",
        allowsSorting: true,
        isRowHeader: true,
        cell: (c) => (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <Avatar.Fallback>{initials(c.prospect)}</Avatar.Fallback>
            </Avatar>
            <span className="truncate text-sm font-semibold" style={{ color: C.text1 }}>
              {c.prospect}
            </span>
            {c.isNew && (
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: "var(--cg-cta-soft-bg)", color: "var(--cg-cta-soft-fg)" }}
              >
                New
              </span>
            )}
          </div>
        ),
      },
      { id: "closer", accessorKey: "closer", header: "Closer", allowsSorting: true },
      {
        id: "source",
        accessorKey: "source",
        header: "Source",
        align: "center",
        cell: (c) => (
          <span className="flex items-center justify-center" style={{ color: C.text2 }} title={c.source} aria-label={c.source}>
            {SOURCE_ICON[c.source]}
          </span>
        ),
      },
      {
        id: "date",
        accessorKey: "date",
        header: "Date",
        allowsSorting: true,
        cell: (c) => (
          <div className="leading-tight whitespace-nowrap">
            <div className="text-sm tabular-nums" style={{ color: C.text2 }}>
              {c.date} · {c.time}
            </div>
            <div className="text-xs tabular-nums" style={{ color: C.text3 }}>
              {c.duration}
            </div>
          </div>
        ),
      },
      { id: "score", accessorKey: "score", header: "Score", allowsSorting: true, cell: (c) => <ScoreBar score={c.score} /> },
      { id: "status", accessorKey: "status", header: "Status", allowsSorting: true, cell: (c) => <StatusBadge status={c.status} /> },
      {
        id: "closed",
        accessorKey: "closed",
        header: "Outcome",
        cell: (c) => (
          <span className="text-sm font-semibold" style={{ color: c.closed ? TONE.green.text : TONE.red.text }}>
            {c.closed ? "Closed" : "Not closed"}
          </span>
        ),
      },
      {
        id: "valueEur",
        accessorKey: "valueEur",
        header: "Value",
        align: "end",
        allowsSorting: true,
        cell: (c) => (
          <span className="font-medium tabular-nums" style={{ color: c.closed ? C.text1 : C.text3 }}>
            {c.closed ? eur(c.valueEur) : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        align: "end",
        cell: (c) => <RowActions id={c.id} onView={() => router.push(`/calls/${c.id}`)} />,
      },
    ],
    [router],
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="cg-fade flex flex-wrap items-end justify-between gap-4" style={{ "--cg-base": 0, "--cg-i": 0 } as CSSProperties}>
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#000102]">Call analysis</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: C.text2 }}>
            Review by exception · newest first
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Segment selectedKey={dateRange} size="sm" variant="ghost" onSelectionChange={(k) => { setDateRange(String(k)); resetPage(); }}>
            <Segment.Item id="7d">7d</Segment.Item>
            <Segment.Item id="30d">30d</Segment.Item>
            <Segment.Item id="90d">90d</Segment.Item>
          </Segment>
          <GlowButton onClick={() => {}}>
            <AnimatedWaveIcon className="size-4" />
            <span>Analyze a call</span>
          </GlowButton>
        </div>
      </div>

      {/* KPI strip */}
      <div className="cg-fade cg-card relative flex flex-wrap" style={{ "--cg-base": 2, "--cg-i": 0 } as CSSProperties}>
        <StatCell label="Calls" value={String(stats.total)} />
        <StatCell label="Avg score" value={stats.total ? stats.avg.toFixed(1) : "—"} color={stats.total ? TONE[scoreTone(stats.avg)].text : undefined} />
        <StatCell label="Close rate" value={`${stats.closeRate}%`} />
        <StatCell label="Pipeline closed" value={eur(stats.value)} />
        <StatCell label="Needs review" value={String(stats.review)} color={stats.review ? TONE.amber.text : C.text1} last />
      </div>

      {/* Card */}
      <div className="cg-card cg-card-interactive relative" style={{ "--cg-base": 4 } as CSSProperties}>
        <CardGlow />

        {/* Toolbar */}
        <div className="cg-fade flex flex-wrap items-center gap-x-4 gap-y-3 px-5 pb-3 pt-4" style={{ "--cg-i": 0 } as CSSProperties}>
          {/* Tabs + counts */}
          <div className="flex flex-wrap gap-1">
            {TABS.map((t) => {
              const active = tab === t.id;
              const count = tabCount(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setTab(t.id); resetPage(); }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
                  style={active ? { backgroundColor: "var(--cg-cta-soft-bg)", color: "var(--cg-cta-soft-fg)" } : { color: C.text2 }}
                >
                  {t.label}
                  <span className="text-[11px] tabular-nums" style={{ opacity: active ? 0.8 : 0.55 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {hasActiveFilters && (
              <Button size="sm" variant="ghost" className="text-[#6b7280]!" onPress={clearFilters}>
                Clear
              </Button>
            )}
            <GooeyInput value={search} onValueChange={(v) => { setSearch(v); resetPage(); }} placeholder="Search…" collapsedWidth={42} expandedWidth={200} expandedOffset={40} />

            {/* Closer filter */}
            <Dropdown>
              <Button size="sm" variant="secondary" className="text-[#374151]! [&_svg]:text-[#374151]!">
                <Funnel />
                {closer === "all" ? "All closers" : closer}
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  selectedKeys={new Set([closer])}
                  selectionMode="single"
                  onSelectionChange={(keys) => { setCloser(([...keys][0] as string) ?? "all"); resetPage(); }}
                >
                  <Dropdown.Item id="all" textValue="All closers">
                    <Person className="size-4" />
                    <Label>All closers</Label>
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                  {CLOSER_NAMES.map((name) => (
                    <Dropdown.Item key={name} id={name} textValue={name}>
                      <Person className="size-4" />
                      <Label>{name}</Label>
                      <Dropdown.ItemIndicator />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>

            {/* Source filter */}
            <Dropdown>
              <Button size="sm" variant="secondary" className="text-[#374151]! [&_svg]:text-[#374151]!">
                {source === "all" ? SOURCE_ICON["All sources"] : SOURCE_ICON[source]}
                {source === "all" ? "All sources" : source}
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  selectedKeys={new Set([source])}
                  selectionMode="single"
                  onSelectionChange={(keys) => { setSource(([...keys][0] as string) ?? "all"); resetPage(); }}
                >
                  <Dropdown.Item id="all" textValue="All sources">
                    {SOURCE_ICON["All sources"]}
                    <Label>All sources</Label>
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                  {SOURCE_NAMES.map((name) => (
                    <Dropdown.Item key={name} id={name} textValue={name}>
                      {SOURCE_ICON[name]}
                      <Label>{name}</Label>
                      <Dropdown.ItemIndicator />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>

        {/* Table */}
        <div className="cg-fade cg-rows-cascade px-3 pb-2" style={{ "--cg-i": 1 } as CSSProperties}>
          <DataGrid
            key={`${tab}-${closer}-${source}-${dateRange}-${safePage}`}
            aria-label="Calls"
            variant="secondary"
            columns={columns}
            data={pageRows}
            getRowId={(c) => c.id}
            selectionMode="none"
            onRowAction={(key) => router.push(`/calls/${key}`)}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            contentClassName="min-w-[820px]"
            className="cursor-pointer [&_.table-root]:rounded-none [&_.table-root]:border-0 [&_.table-root]:bg-transparent [&_.table-root]:shadow-none [&_.table__column:first-child]:rounded-l-lg [&_.table__column:last-child]:rounded-r-lg"
            renderEmptyState={() => (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Headphones className="size-8" style={{ color: "#d1d5db" }} />
                <p className="text-sm" style={{ color: C.text2 }}>
                  No calls match your filters.
                </p>
                {hasActiveFilters && (
                  <Button size="sm" variant="secondary" onPress={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 pb-4 pt-1">
          <span className="text-xs" style={{ color: C.text3 }}>
            {sorted.length === 0
              ? "0 results"
              : `${safePage * PAGE_SIZE + 1}–${Math.min(sorted.length, (safePage + 1) * PAGE_SIZE)} of ${sorted.length}`}
          </span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" isDisabled={safePage === 0} onPress={() => setPage((p) => Math.max(0, p - 1))} aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-2 text-xs tabular-nums" style={{ color: C.text2 }}>
              {safePage + 1} / {pageCount}
            </span>
            <Button size="sm" variant="ghost" isDisabled={safePage >= pageCount - 1} onPress={() => setPage((p) => Math.min(pageCount - 1, p + 1))} aria-label="Next page">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
