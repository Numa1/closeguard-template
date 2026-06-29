// Dashboard mock data (front-only — the backend will provide real data)
// Single coherent window: May 21 → Jun 21 · 142 calls analyzed

export const CURRENT_USER = { firstName: "Numa", fullName: "Numa Agnz" };

/* ─── Strict semantic palette ────────────────────── */
// green = positive / brand · red = negative · amber = attention · slate = neutral
export const C = {
  text1: "#000102",
  textStrong: "#374151", // gris encre intermédiaire (titres custom, prénom welcome)
  text2: "#6b7280",
  text3: "#9ca3af",
  track: "#eceef0",
  green: "#22c55e",
  greenDark: "#15803d",
  greenSoft: "#72fa91",
  // rampe verte ordonnée (foncé → clair) — source unique pour charts/legendes
  green1: "#15803d",
  green2: "#22c55e",
  green3: "#4ade80",
  green4: "#72fa91",
  green5: "#86efac",
  green6: "#bbf7d0",
  green7: "#d1fae5",
  amber: "#f59e0b",
  amberDark: "#b45309",
  red: "#ef4444",
  redDark: "#dc2626",
  slate: "#64748b",
  slateLight: "#94a3b8",
};

/* Tons sémantiques unifiés — source unique pour vert/ambre/rouge.
   text = teinte foncée lisible · solid = remplissage vif · soft = fond léger.
   À utiliser partout (chips statut, scores, issues) pour l'homogénéité. */
export type ToneKey = "green" | "amber" | "red";
export const TONE: Record<ToneKey, { solid: string; text: string; soft: string }> = {
  green: { solid: C.green, text: C.greenDark, soft: "rgba(34,197,94,0.12)" },
  amber: { solid: C.amber, text: C.amberDark, soft: "rgba(245,158,11,0.14)" },
  red: { solid: C.red, text: C.redDark, soft: "rgba(239,68,68,0.12)" },
};

/* Hauteur commune des 3 charts diagnostic — garantit l'alignement des bas de carte */
export const CHART_H = 200;

export const PERIOD = { label: "May 21 – Jun 21", calls: 142 };

const spark = (a: number[]) => a.map((value) => ({ value }));

/* en-US formatters (deterministic regardless of runtime locale) */
export const eur = (n: number) => "€" + n.toLocaleString("en-US");
export const pct = (n: number) => `${Math.round(n * 100)}%`;

/* ─── Hero: Closium Score ────────────────────────── */
export const hero = {
  score: 7.0,
  delta: "+0.4",
  objective: 8.0,
  teamAvg: 6.4,
  topCloser: 8.9,
};

/* ─── AI recommendations ─────────────────────────── */
export type Severity = "danger" | "warning" | "success";
export interface AiInsight {
  severity: Severity;
  title: string;
  detail: string;
  action: string;
  impact: string; // pre-formatted (EUR or multiplier)
}
export const aiInsights: AiInsight[] = [
  {
    severity: "danger",
    title: "7 deals lost on price after minute 40",
    detail: "Pricing is brought up too late, with no prior value anchoring.",
    action: "Add a “value anchoring” step before pricing",
    impact: "+€1,200/mo",
  },
  {
    severity: "warning",
    title: "“Trust” objection resolved only 58% of the time",
    detail: "Closers don't surface enough proof and client references.",
    action: "Add 2 case studies to the closing script",
    impact: "+€900/mo",
  },
  {
    severity: "success",
    title: "Calls over 45 min close 1.8× more often",
    detail: "Discovery depth correlates strongly with closing.",
    action: "Roll out the long discovery script to the team",
    impact: "1.8× close rate",
  },
];

/* ─── 4 KPIs (manager reading order) ─────────────── */
export type KpiStatus = "success" | "warning" | "danger";
export interface Kpi {
  id: string;
  title: string;
  value: number;
  format: "percent" | "currency" | "decimal";
  dir: "up" | "down"; // actual direction of the metric
  good: boolean; // is the change good for the business?
  delta: string;
  status: KpiStatus;
  color: string;
  spark: { value: number }[];
  footer: string;
}
export const kpis: Kpi[] = [
  {
    id: "closing",
    title: "Close rate",
    value: 0.75,
    format: "percent",
    dir: "up",
    good: true,
    delta: "+6 pts",
    status: "success",
    color: C.green,
    spark: spark([60, 62, 64, 63, 68, 70, 72, 75]),
    footer: "29 deals signed of 39 decided",
  },
  {
    id: "recover",
    title: "Money at stake",
    value: 4800,
    format: "currency",
    dir: "down",
    good: true,
    delta: "−12%",
    status: "warning",
    color: C.amber,
    spark: spark([7200, 6800, 6400, 6000, 5600, 5200, 5000, 4800]),
    footer: "€1,900 recovered · €58k/yr at stake",
  },
  {
    id: "wasted",
    title: "Wasted deals",
    value: 0.23,
    format: "percent",
    dir: "down",
    good: true,
    delta: "−2 pts",
    status: "warning",
    color: C.amber,
    spark: spark([31, 30, 28, 27, 26, 25, 24, 23]),
    footer: "9 qualified prospects lost",
  },
  {
    id: "objection",
    title: "Top objection",
    value: 0.5,
    format: "percent",
    dir: "up",
    good: false,
    delta: "+4 pts",
    status: "danger",
    color: C.red,
    spark: spark([42, 44, 45, 46, 47, 48, 49, 50]),
    footer: "50% of lost deals",
  },
];

/* ─── Chart: Revenue (contracted vs collected) ───── */
export const revenueObjective = 1300; // daily target
export const closedRevenue = [
  { day: "05/24", contracted: 400, collected: 350 },
  { day: "05/27", contracted: 1200, collected: 1100 },
  { day: "05/30", contracted: 900, collected: 900 },
  { day: "06/02", contracted: 2000, collected: 1750 },
  { day: "06/05", contracted: 1500, collected: 1500 },
  { day: "06/08", contracted: 700, collected: 650 },
  { day: "06/11", contracted: 1800, collected: 1700 },
  { day: "06/14", contracted: 2100, collected: 2000 },
  { day: "06/17", contracted: 1300, collected: 1250 },
  { day: "06/20", contracted: 1600, collected: 1500 },
];
export const revenueTotals = { contracted: 22400, collected: 21700, ratePct: 97, delta: "+12%" };

/* ─── Chart: Objections (frequency × resolution) ── */
export interface Objection {
  cat: string;
  volume: number; // number of calls where the objection appears
  resolution: number; // resolution rate 0..1
}
// total volume = 142 (consistent with the window)
export const objections: Objection[] = [
  { cat: "Price", volume: 66, resolution: 0.78 },
  { cat: "Trust", volume: 31, resolution: 0.58 },
  { cat: "Timing", volume: 24, resolution: 0.82 },
  { cat: "Authority", volume: 12, resolution: 0.5 },
  { cat: "Value", volume: 6, resolution: 0.91 },
  { cat: "Other", volume: 3, resolution: 0.6 },
  { cat: "Think", volume: 19, resolution: 0.43 },
];

/* ─── List: Recent calls ─────────────────────────── */
export type CallStatus = "hard" | "closable" | "not" | "poor";
export interface RecentCall {
  name: string;
  isNew?: boolean;
  closer: string;
  date: string;
  duration: string;
  score: number;
  status: CallStatus;
  objection: string;
  closed: boolean;
  valueEur: number;
}
export const recentCalls: RecentCall[] = [
  { name: "Celeste Bossota", isNew: true, closer: "Sofia Marchetti", date: "Jun 21", duration: "53 min", score: 6.7, status: "hard", objection: "Price", closed: true, valueEur: 1200 },
  { name: "Denilson Sylla", isNew: true, closer: "Karim Benali", date: "Jun 20", duration: "30 min", score: 7.3, status: "closable", objection: "None", closed: true, valueEur: 800 },
  { name: "Ilhyam Babu", closer: "Clement Woffa", date: "Jun 18", duration: "56 min", score: 7.7, status: "closable", objection: "Price", closed: true, valueEur: 1500 },
  { name: "ludovic baral", closer: "Tomas Silva", date: "Jun 18", duration: "52 min", score: 3.6, status: "not", objection: "Price", closed: false, valueEur: 0 },
  { name: "Adele Djadja", closer: "Lea Nguyen", date: "Jun 16", duration: "50 min", score: 6.9, status: "closable", objection: "Trust", closed: true, valueEur: 950 },
];

/* ─── Closer leaderboard ─────────────────────────── */
export type CloserTag = "top" | "coach" | null;
export type Role = "Setter" | "Closer";
export interface Closer {
  name: string;
  role: Role;
  score: number;
  closing: number;
  wasted: number;
  atStake: number;
  trend: "up" | "down" | "neutral";
  delta: string;
  tag: CloserTag;
}
export const closers: Closer[] = [
  { name: "Sofia Marchetti", role: "Closer", score: 8.9, closing: 0.84, wasted: 0.08, atStake: 2100, trend: "up", delta: "+0.6", tag: "top" },
  { name: "Karim Benali", role: "Setter", score: 7.6, closing: 0.78, wasted: 0.15, atStake: 3100, trend: "up", delta: "+0.3", tag: null },
  { name: "Clement Woffa", role: "Closer", score: 7.0, closing: 0.72, wasted: 0.21, atStake: 4800, trend: "neutral", delta: "0.0", tag: null },
  { name: "Lea Nguyen", role: "Setter", score: 6.4, closing: 0.66, wasted: 0.24, atStake: 5200, trend: "down", delta: "-0.4", tag: null },
  { name: "Tomas Silva", role: "Closer", score: 5.5, closing: 0.58, wasted: 0.31, atStake: 7300, trend: "down", delta: "-0.7", tag: "coach" },
];
export const teamScoreAvg = 6.4;

/* ─── Scope (active member switcher) ─────────────── */
export interface Scope {
  id: string;
  label: string;
  sublabel: string;
  score: number;
  closing: number;
  wasted: number;
  atStake: number;
  delta: string;
  trend: "up" | "down" | "neutral";
  isTeam: boolean;
}

export const TEAM_SCOPE: Scope = {
  id: "all",
  label: "All team",
  sublabel: "Whole team",
  score: hero.score,
  closing: 0.75,
  wasted: 0.23,
  atStake: 4800,
  delta: hero.delta,
  trend: "up",
  isTeam: true,
};

export function scopeForCloser(c: Closer): Scope {
  return {
    id: c.name,
    label: c.name,
    sublabel: c.role,
    score: c.score,
    closing: c.closing,
    wasted: c.wasted,
    atStake: c.atStake,
    delta: c.delta,
    trend: c.trend,
    isTeam: false,
  };
}

export const SCOPES: Scope[] = [TEAM_SCOPE, ...closers.map(scopeForCloser)];

const sparkById: Record<string, { value: number }[]> = Object.fromEntries(kpis.map((k) => [k.id, k.spark]));

/** KPI set scoped to the active member (team = the rich default set). */
export function kpisFor(s: Scope): Kpi[] {
  if (s.isTeam) return kpis;
  const wastedBad = s.wasted >= 0.25;
  return [
    { id: "closing", title: "Close rate", value: s.closing, format: "percent", dir: "up", good: true, delta: "", status: "success", color: C.green, spark: sparkById.closing, footer: `${s.sublabel} · this month` },
    { id: "recover", title: "Money at stake", value: s.atStake, format: "currency", dir: "down", good: true, delta: "", status: "warning", color: C.amber, spark: sparkById.recover, footer: "Outstanding to recover" },
    { id: "wasted", title: "Wasted deals", value: s.wasted, format: "percent", dir: "down", good: !wastedBad, delta: "", status: wastedBad ? "danger" : "success", color: wastedBad ? C.red : C.green, spark: sparkById.wasted, footer: "Of qualified prospects" },
    { id: "objection", title: "Top objection", value: 0.5, format: "percent", dir: "up", good: false, delta: "", status: "danger", color: C.red, spark: sparkById.objection, footer: "Most common blocker" },
  ];
}

/* ─── Chart: Closer performance vs lead quality ──── */
export interface DayScore {
  day: string;
  ces: number | null;
  lqs: number | null;
}
export const closerVsLead7: DayScore[] = [
  { day: "Mon", ces: 6.7, lqs: 6.7 },
  { day: "Tue", ces: 8.5, lqs: 5.0 },
  { day: "Wed", ces: null, lqs: null },
  { day: "Thu", ces: 5.2, lqs: 5.5 },
  { day: "Fri", ces: 7.0, lqs: 5.6 },
  { day: "Sat", ces: null, lqs: null },
  { day: "Sun", ces: 7.6, lqs: 4.5 },
];
export const leadQualityAvg = 5.6;

/* ─── Scoped chart & insight helpers ────────────────── */

// Objection resolution rates per closer [Price, Trust, Timing, Authority, Value, Other, Think]
const CLOSER_OBJ_RATES: Record<string, number[]> = {
  "Sofia Marchetti": [0.92, 0.85, 0.90, 0.75, 0.95, 0.80, 0.72],
  "Karim Benali":    [0.85, 0.78, 0.88, 0.65, 0.90, 0.70, 0.60],
  "Clement Woffa":   [0.75, 0.70, 0.82, 0.58, 0.88, 0.65, 0.50],
  "Lea Nguyen":      [0.68, 0.62, 0.78, 0.48, 0.85, 0.60, 0.42],
  "Tomas Silva":     [0.52, 0.45, 0.70, 0.35, 0.78, 0.50, 0.30],
};

export function objectionsFor(s: Scope): Objection[] {
  if (s.isTeam) return objections;
  const rates = CLOSER_OBJ_RATES[s.id];
  if (!rates) return objections;
  const ratio = s.closing / 0.75;
  return objections.map((o, i) => ({
    ...o,
    volume: Math.max(1, Math.round(o.volume * ratio * 0.2)),
    resolution: rates[i] ?? o.resolution,
  }));
}

export function revenueFor(s: Scope): typeof closedRevenue {
  if (s.isTeam) return closedRevenue;
  const ratio = (s.closing / 0.75) * 0.22;
  return closedRevenue
    .filter((_, i) => [0, 2, 4, 6, 8, 9].includes(i))
    .map((d) => ({
      ...d,
      contracted: Math.round(d.contracted * ratio),
      collected: Math.round(d.collected * ratio),
    }));
}

export function revenueObjectiveFor(s: Scope): number {
  if (s.isTeam) return revenueObjective;
  return Math.round(revenueObjective * (s.closing / 0.75) * 0.22);
}

export function revenueTotalsFor(s: Scope) {
  if (s.isTeam) return revenueTotals;
  const data = revenueFor(s);
  const contracted = data.reduce((sum, d) => sum + d.contracted, 0);
  const collected = data.reduce((sum, d) => sum + d.collected, 0);
  const ratePct = contracted > 0 ? Math.round((collected / contracted) * 100) : 0;
  return { contracted, collected, ratePct, delta: s.delta };
}

const CLOSER_INSIGHTS: Record<string, AiInsight[]> = {
  "Sofia Marchetti": [
    { severity: "success", title: "Best close rate on the team (84%)", detail: "Sofia closes 84% of qualified prospects — sets the team benchmark.", action: "Pair with Tomas for shadowing sessions", impact: "Team +8%" },
    { severity: "warning", title: "Authority objection resolved 75%", detail: "Struggles with multi-stakeholder decisions.", action: "Add a stakeholder mapping script", impact: "+€400/mo" },
  ],
  "Karim Benali": [
    { severity: "warning", title: "Price objection resolved 85% — room to grow", detail: "Value anchoring could be stronger before pricing disclosure.", action: "Use the updated value anchoring script", impact: "+€300/mo" },
    { severity: "success", title: "Call duration trending up (+8 min avg)", detail: "Discovery depth improving vs last month.", action: "Keep current discovery pace", impact: "1.2× close rate" },
  ],
  "Clement Woffa": [
    { severity: "warning", title: "€4,800 at stake — deal rescue needed", detail: "Wasted deals increased from 18% to 21% this period.", action: "Review 3 lost deals with manager", impact: "+€2,000" },
    { severity: "danger", title: "“Think it over” handled 50% of the time", detail: "Prospects stalling without strong urgency framing.", action: "Add urgency anchoring to closing script", impact: "+€800/mo" },
  ],
  "Lea Nguyen": [
    { severity: "danger", title: "Close rate dropped 8 pts to 66%", detail: "3 consecutive deals lost on authority objection.", action: "Review authority escalation flow", impact: "+€1,400/mo" },
    { severity: "warning", title: "Wasted deal rate at 24% — above threshold", detail: "Spending time on unqualified leads.", action: "Apply stricter qualification criteria", impact: "−3h/week" },
  ],
  "Tomas Silva": [
    { severity: "danger", title: "€7,300 at stake — highest on team", detail: "Only 58% close rate on qualified deals this period.", action: "Immediate coaching session scheduled", impact: "+€4,000" },
    { severity: "danger", title: "“Think it over” resolved only 30%", detail: "No urgency framework used in 7 of 9 lost calls.", action: "Practice urgency + anchoring script daily", impact: "+€2,200/mo" },
    { severity: "warning", title: "Call score trending down (−0.7 pts)", detail: "Discovery phase getting shorter (avg 12 min vs 20 min target).", action: "Extend discovery to at least 20 min", impact: "+0.5 score" },
  ],
};

export function aiInsightsFor(s: Scope): AiInsight[] {
  if (s.isTeam) return aiInsights;
  return CLOSER_INSIGHTS[s.id] ?? aiInsights.slice(0, 2);
}
