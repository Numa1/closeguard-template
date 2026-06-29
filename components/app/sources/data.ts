// Mock data for the Sources × Performance page (/sources). Front-only.
import type { CallSource } from "@/components/app/calls/data";

export interface SourceRow {
  id: string;
  name: CallSource; // "Instagram" | "TikTok" | "YouTube" (clé des logos SourceIcon)
  leads: number;
  upcoming: number;
  closeRate: number; // 0..1
  showRate: number; // 0..1
  avgLqs: number; // /10
  topObjection: { label: string; count: number };
  topCloser: { name: string; rate: number; ratio: string } | null;
  contracted: number;
  collected: number;
  // Lead quality mix (counts) — total = analyzed
  hq: number;
  qualified: number;
  challenging: number;
  unqualified: number;
}

export const sources: SourceRow[] = [
  {
    id: "tiktok",
    name: "TikTok",
    leads: 56,
    upcoming: 2,
    closeRate: 0.68,
    showRate: 0.45,
    avgLqs: 5.9,
    topObjection: { label: "Price", count: 37 },
    topCloser: { name: "Clément Woffa", rate: 0.68, ratio: "17/25" },
    contracted: 11950,
    collected: 11050,
    hq: 4,
    qualified: 7,
    challenging: 10,
    unqualified: 4,
  },
  {
    id: "instagram",
    name: "Instagram",
    leads: 60,
    upcoming: 2,
    closeRate: 0.64,
    showRate: 0.37,
    avgLqs: 5.1,
    topObjection: { label: "Price", count: 33 },
    topCloser: { name: "Clément Woffa", rate: 0.64, ratio: "14/22" },
    contracted: 9550,
    collected: 8850,
    hq: 1,
    qualified: 5,
    challenging: 12,
    unqualified: 4,
  },
  {
    id: "youtube",
    name: "YouTube",
    leads: 6,
    upcoming: 0,
    closeRate: 1.0,
    showRate: 0.17,
    avgLqs: 8.2,
    topObjection: { label: "Price", count: 2 },
    topCloser: null,
    contracted: 800,
    collected: 800,
    hq: 1,
    qualified: 0,
    challenging: 0,
    unqualified: 0,
  },
];

export const analyzedOf = (s: SourceRow) => s.hq + s.qualified + s.challenging + s.unqualified;
export const collectionRate = (s: SourceRow) =>
  s.contracted > 0 ? Math.round((s.collected / s.contracted) * 100) : 0;
export const revPerLead = (s: SourceRow) => (s.leads > 0 ? Math.round(s.contracted / s.leads) : 0);

/* ── Plage de temps fonctionnelle ──────────────────────────────────
   `sources` ci-dessus = "all time" (base). Les autres plages sont des
   sous-ensembles (volumes croissants 7d<30d<90d<all) avec taux légèrement
   meilleurs sur le récent. Tout (KPIs, cartes, charts, table) en dérive. */
const RANGE_FACTOR: Record<string, number> = { "7d": 0.28, "30d": 0.78, "90d": 0.95, all: 1 };
const RANGE_RATE_DELTA: Record<string, number> = { "7d": 0.03, "30d": 0.01, "90d": 0, all: 0 };
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const round50 = (n: number) => Math.round(n / 50) * 50;

export function sourcesForRange(range: string): SourceRow[] {
  const f = RANGE_FACTOR[range] ?? 1;
  const d = RANGE_RATE_DELTA[range] ?? 0;
  return sources.map((s) => ({
    ...s,
    leads: Math.max(1, Math.round(s.leads * f)),
    upcoming: range === "7d" || range === "30d" ? s.upcoming : 0,
    closeRate: clamp01(s.closeRate + d),
    showRate: clamp01(s.showRate + d),
    avgLqs: Math.max(0, Math.min(10, +(s.avgLqs + d * 8).toFixed(1))),
    contracted: round50(s.contracted * f),
    collected: round50(s.collected * f),
    hq: Math.round(s.hq * f),
    qualified: Math.round(s.qualified * f),
    challenging: Math.round(s.challenging * f),
    unqualified: Math.round(s.unqualified * f),
  }));
}

/* Tendance du revenu collecté par source (courbes) — déterministe.
   Chaque point ≈ revenu collecté de la période ; la somme ≈ total collecté de la source. */
const TREND_BUCKETS = ["May 24", "May 31", "Jun 7", "Jun 14", "Jun 21", "Jun 28"];
const wob = (n: number) => {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
};
export function revenueTrend(rows: SourceRow[]): Record<string, number | string>[] {
  return TREND_BUCKETS.map((label, b) => {
    const point: Record<string, number | string> = { label };
    rows.forEach((s, si) => {
      const w = 0.1 + b * 0.025 + (wob(si * 7 + b * 3) - 0.5) * 0.05;
      point[s.id] = Math.max(0, Math.round(s.collected * w));
    });
    return point;
  });
}

export function funnelForRange(rows: SourceRow[]) {
  const leads = rows.reduce((a, s) => a + s.leads, 0);
  return {
    leads,
    upcoming: rows.reduce((a, s) => a + s.upcoming, 0),
    shows: Math.round(rows.reduce((a, s) => a + s.leads * s.showRate, 0)),
    closed: Math.round(rows.reduce((a, s) => a + s.leads * s.showRate * s.closeRate, 0)),
    contracted: rows.reduce((a, s) => a + s.contracted, 0),
    collected: rows.reduce((a, s) => a + s.collected, 0),
  };
}
