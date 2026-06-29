"use client";

import { CSSProperties, ReactNode, useCallback, useMemo, useState } from "react";
import {
  Briefcase,
  ChartColumn,
  CircleFill,
  Funnel,
  LayoutColumns3,
  Person,
  PersonPlus,
  Persons,
  Sliders,
  Star,
  TagDollar,
  Target,
  TriangleExclamation,
} from "@gravity-ui/icons";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  Label,
  ProgressCircle,
} from "@heroui/react";
import {
  AreaChart,
  DataGrid,
  type DataGridColumn,
  type DataGridSelection,
  type DataGridSortDescriptor,
} from "@heroui-pro/react";
import { CardGlow } from "@/components/effects/CardGlow";
import { GooeyInput } from "@/components/effects/GooeyInput";
import { useMember } from "@/components/app/MemberContext";
import { TrendBadge } from "./TrendBadge";
import {
  C,
  type Closer,
  closers,
  eur,
  pct,
  scopeForCloser,
  TEAM_SCOPE,
  teamScoreAvg,
  TONE,
} from "./data";

/* -------------------------------------------------------------------------------------------------
 * Sparkline data (déterministe, par closer)
 * -----------------------------------------------------------------------------------------------*/
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function trendSparkline(seed: number, dir: Closer["trend"]): { value: number }[] {
  const drift = dir === "up" ? 1.4 : dir === "down" ? -1.4 : 0;
  let v = 38 + seededRandom(seed * 3) * 24;
  const points: { value: number }[] = [{ value: v }];
  for (let i = 1; i < 14; i++) {
    const noise = (seededRandom(seed * 13 + i * 7) - 0.5) * 9;
    v = Math.max(10, Math.min(90, v + drift + noise));
    points.push({ value: v });
  }
  return points;
}

const sparkByCloser: Record<string, { value: number }[]> = Object.fromEntries(
  closers.map((c, i) => [c.name, trendSparkline(i + 1, c.trend)]),
);

/* -------------------------------------------------------------------------------------------------
 * Colonnes
 * -----------------------------------------------------------------------------------------------*/
type ColumnId = "name" | "role" | "score" | "closing" | "wasted" | "atStake" | "trend";

const ALL_COLUMNS: ColumnId[] = [
  "name",
  "role",
  "score",
  "closing",
  "wasted",
  "atStake",
  "trend",
];

const COLUMN_LABELS: Record<ColumnId, string> = {
  name: "Closer",
  role: "Role",
  score: "Score",
  closing: "Close rate",
  wasted: "Wasted",
  atStake: "At risk",
  trend: "Trend",
};

/* Icône par champ — réutilisée dans les menus Sort et Columns. */
const FIELD_ICON: Record<ColumnId, ReactNode> = {
  name: <Person className="size-4" />,
  role: <Briefcase className="size-4" />,
  score: <Star className="size-4" />,
  closing: <Target className="size-4" />,
  wasted: <TriangleExclamation className="size-4" />,
  atStake: <TagDollar className="size-4" />,
  trend: <ChartColumn className="size-4" />,
};

export default function ClosersTable() {
  const { scope, setScope } = useMember();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState<DataGridSortDescriptor>({
    column: "score",
    direction: "descending",
  });
  // Côte à côte avec Recent Calls : on n'affiche par défaut que les colonnes
  // cœur (Role et Trend restent activables via le menu « Columns »).
  const [visibleColumns, setVisibleColumns] = useState<DataGridSelection>(
    new Set<ColumnId>(["name", "score", "closing", "atStake"]),
  );

  /* Sélection ⇄ membre actif : sélectionner une ligne = focaliser le dashboard sur ce closer. */
  const selectedKeys = useMemo<DataGridSelection>(
    () => (scope.isTeam ? new Set<string>() : new Set([scope.id])),
    [scope],
  );

  const handleSelectionChange = useCallback(
    (keys: DataGridSelection) => {
      if (keys === "all") return;
      const key = [...keys][0] as string | undefined;
      const c = key ? closers.find((x) => x.name === key) : undefined;
      setScope(c ? scopeForCloser(c) : TEAM_SCOPE);
    },
    [setScope],
  );

  const filtered = useMemo(() => {
    let result = closers;
    if (roleFilter !== "all") {
      result = result.filter((c) => c.role.toLowerCase() === roleFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q),
      );
    }
    return result;
  }, [roleFilter, search]);

  const sorted = useMemo(() => {
    if (!sortDescriptor.column) return filtered;
    return [...filtered].sort((a, b) => {
      const col = sortDescriptor.column as keyof Closer;
      const av = a[col];
      const bv = b[col];
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filtered, sortDescriptor]);

  const visibleColumnSet = useMemo(
    () => (visibleColumns === "all" ? new Set(ALL_COLUMNS) : (visibleColumns as Set<string>)),
    [visibleColumns],
  );

  const columns = useMemo<DataGridColumn<Closer>[]>(() => {
    const all: DataGridColumn<Closer>[] = [
      {
        id: "name",
        accessorKey: "name",
        header: "Closer",
        allowsSorting: true,
        isRowHeader: true,
        cell: (c) => <CloserCell closer={c} />,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        allowsSorting: true,
        cell: (c) => (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium"
            style={{ backgroundColor: "rgba(100,116,139,0.12)", color: C.slate }}
          >
            {c.role}
          </span>
        ),
      },
      {
        id: "score",
        accessorKey: "score",
        header: "Score",
        align: "center",
        allowsSorting: true,
        cell: (c) => (
          <span className="font-semibold tabular-nums" style={{ color: C.text1 }}>
            {c.score.toLocaleString("en-US", { minimumFractionDigits: 1 })}
          </span>
        ),
      },
      {
        id: "closing",
        accessorKey: "closing",
        header: "Close rate",
        allowsSorting: true,
        cell: (c) => <CloseRateCell value={c.closing} />,
      },
      {
        id: "wasted",
        accessorKey: "wasted",
        header: "Wasted",
        allowsSorting: true,
        cell: (c) => (
          <span
            className="tabular-nums"
            style={{ color: c.wasted >= 0.25 ? C.redDark : C.text2 }}
          >
            {pct(c.wasted)}
          </span>
        ),
      },
      {
        id: "atStake",
        accessorKey: "atStake",
        header: "At risk",
        align: "end",
        allowsSorting: true,
        cell: (c) => (
          <span
            className="font-medium tabular-nums"
            style={{ color: c.atStake >= 5000 ? C.amberDark : C.text2 }}
          >
            {eur(c.atStake)}
          </span>
        ),
      },
      {
        id: "trend",
        header: "Trend",
        align: "end",
        cell: (c) => <TrendCell closer={c} />,
      },
    ];
    return all.filter((col) => visibleColumnSet.has(col.id));
  }, [visibleColumnSet]);

  return (
    <div className="cg-card cg-card-interactive relative min-w-0">
      <CardGlow />

      {/* Header + toolbar */}
      <div
        className="cg-fade flex flex-wrap items-center gap-x-6 gap-y-3 px-6 pb-3 pt-4"
        style={{ "--cg-i": 0 } as CSSProperties}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-[-0.01em]" style={{ color: C.text1 }}>
              Closers
            </h2>
            <Chip size="sm" variant="soft">
              {closers.length}
            </Chip>
          </div>
          <p className="text-xs" style={{ color: C.text2 }}>
            Who performs, who to coach · team avg {teamScoreAvg.toLocaleString("en-US")}
          </p>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/* Search — même composant que la navbar (à gauche des filtres) */}
          <GooeyInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search…"
            collapsedWidth={42}
            expandedWidth={200}
            expandedOffset={40}
          />

          {/* Filter (role) */}
          <Dropdown>
            <Button size="sm" variant="secondary" className="text-[#374151]! [&_svg]:text-[#374151]!">
              <Funnel />
              Filter
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu
                selectedKeys={new Set([roleFilter])}
                selectionMode="single"
                onSelectionChange={(keys) => setRoleFilter(([...keys][0] as string) ?? "all")}
              >
                <Dropdown.Item id="all" textValue="All">
                  <Persons className="size-4" />
                  <Label>All roles</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="closer" textValue="Closer">
                  <Person className="size-4" />
                  <Label>Closer</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="setter" textValue="Setter">
                  <PersonPlus className="size-4" />
                  <Label>Setter</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {/* Sort */}
          <Dropdown>
            <Button size="sm" variant="secondary" className="text-[#374151]! [&_svg]:text-[#374151]!">
              <Sliders />
              Sort
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu
                selectedKeys={sortDescriptor.column ? new Set([sortDescriptor.column]) : new Set()}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const key = [...keys][0] as string | undefined;
                  if (!key) return;
                  setSortDescriptor({
                    column: key,
                    direction:
                      sortDescriptor.column === key && sortDescriptor.direction === "ascending"
                        ? "descending"
                        : "ascending",
                  });
                }}
              >
                <Dropdown.Item id="name" textValue="Closer">
                  {FIELD_ICON.name}
                  <Label>Closer</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="score" textValue="Score">
                  {FIELD_ICON.score}
                  <Label>Score</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="closing" textValue="Close rate">
                  {FIELD_ICON.closing}
                  <Label>Close rate</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="wasted" textValue="Wasted">
                  {FIELD_ICON.wasted}
                  <Label>Wasted</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
                <Dropdown.Item id="atStake" textValue="At risk">
                  {FIELD_ICON.atStake}
                  <Label>At risk</Label>
                  <Dropdown.ItemIndicator />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          {/* Columns */}
          <Dropdown>
            <Button size="sm" variant="secondary" className="text-[#374151]! [&_svg]:text-[#374151]!">
              <LayoutColumns3 />
              Columns
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu
                disallowEmptySelection
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {ALL_COLUMNS.map((id) => (
                  <Dropdown.Item key={id} id={id} textValue={COLUMN_LABELS[id]}>
                    {FIELD_ICON[id]}
                    <Label>{COLUMN_LABELS[id]}</Label>
                    <Dropdown.ItemIndicator />
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      {/* DataGrid — aplati + inset (ne touche pas les bords de la carte) */}
      <div className="cg-fade px-3 pb-3" style={{ "--cg-i": 1 } as CSSProperties}>
        <DataGrid
          aria-label="Closers leaderboard"
          variant="secondary"
          columns={columns}
          data={sorted}
          getRowId={(c) => c.name}
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          contentClassName="min-w-[420px]"
          className="[&_.table-root]:rounded-none [&_.table-root]:border-0 [&_.table-root]:bg-transparent [&_.table-root]:shadow-none [&_.table__column:first-child]:rounded-l-lg [&_.table__column:last-child]:rounded-r-lg"
          renderEmptyState={() => "No closers match your filters."}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Cellules
 * -----------------------------------------------------------------------------------------------*/
function CloserCell({ closer }: { closer: Closer }) {
  const initials = closer.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2.5">
      <Avatar size="sm">
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar>
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-semibold" style={{ color: C.text1 }}>
          {closer.name}
        </span>
        {closer.tag && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: closer.tag === "top" ? TONE.green.soft : TONE.amber.soft,
              color: closer.tag === "top" ? TONE.green.text : TONE.amber.text,
            }}
          >
            <CircleFill width={6} />
            {closer.tag === "top" ? "Top" : "Coach"}
          </span>
        )}
      </div>
    </div>
  );
}

function closeRateColor(v: number): "accent" | "warning" | "danger" {
  if (v >= 0.7) return "accent";
  if (v >= 0.55) return "warning";
  return "danger";
}

function CloseRateCell({ value }: { value: number }) {
  const color = closeRateColor(value);
  const textColor = color === "accent" ? C.greenDark : color === "warning" ? C.amberDark : C.redDark;
  return (
    <div className="flex items-center gap-2">
      <ProgressCircle
        aria-label={`${pct(value)} close rate`}
        color={color}
        size="sm"
        value={value * 100}
      >
        <ProgressCircle.Track>
          <ProgressCircle.TrackCircle />
          <ProgressCircle.FillCircle />
        </ProgressCircle.Track>
      </ProgressCircle>
      <span className="tabular-nums" style={{ color: textColor }}>
        {pct(value)}
      </span>
    </div>
  );
}

let sparkGradientId = 0;

function TrendCell({ closer }: { closer: Closer }) {
  const id = useMemo(() => `closer-spark-${++sparkGradientId}`, []);
  const data = sparkByCloser[closer.name] ?? [];

  return (
    <div className="flex items-center justify-end gap-3">
      <div
        className="w-[84px] overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <AreaChart data={data} height={32} margin={{ bottom: 0, left: 0, right: 0, top: 2 }}>
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <AreaChart.Area
            dataKey="value"
            dot={false}
            fill={`url(#${id})`}
            isAnimationActive={false}
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            type="monotone"
          />
        </AreaChart>
      </div>
      <TrendBadge trend={closer.trend}>{closer.delta}</TrendBadge>
    </div>
  );
}
