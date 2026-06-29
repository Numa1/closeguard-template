// Mock data for the Call Analysis list (/calls). Front-only.
import { CallStatus, ToneKey } from "@/components/app/home/data";

export type CallSource = "Instagram" | "TikTok" | "YouTube";

export interface Call {
  id: string;
  prospect: string;
  closer: string;
  date: string; // "Jun 21"
  time: string; // "14:30"
  duration: string; // "53 min"
  durationMin: number;
  score: number; // 0..10
  status: CallStatus;
  objection: string; // "Price" | "Trust" | … | "None"
  closed: boolean;
  valueEur: number; // 0 if not closed
  source: CallSource;
  isNew?: boolean;
}

/* Métadonnées de statut — source unique (réutilisée liste + détail).
   `tone` pointe vers la palette sémantique unifiée (voir TONE dans home/data). */
export const STATUS_META: Record<CallStatus, { label: string; tone: ToneKey }> = {
  closable: { label: "Closable", tone: "green" },
  hard: { label: "Hard to Close", tone: "amber" },
  poor: { label: "Poorly Executed", tone: "red" },
  not: { label: "Not Closable", tone: "red" },
};

/* Onglets de filtre (ordre d'affichage). */
export const STATUS_TABS: { id: "all" | CallStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "closable", label: "Closable" },
  { id: "hard", label: "Hard to Close" },
  { id: "poor", label: "Poorly Executed" },
  { id: "not", label: "Not Closable" },
];

export const calls: Call[] = [
  { id: "4586930", prospect: "Celeste Bossota", closer: "Sofia Marchetti", date: "Jun 21", time: "15:10", duration: "53 min", durationMin: 53, score: 6.7, status: "hard", objection: "Price", closed: true, valueEur: 1200, source: "Instagram", isNew: true },
  { id: "4586929", prospect: "Denilson Sylla", closer: "Karim Benali", date: "Jun 20", time: "11:30", duration: "30 min", durationMin: 30, score: 7.3, status: "closable", objection: "None", closed: true, valueEur: 800, source: "TikTok", isNew: true },
  { id: "4586928", prospect: "Ilhyam Babu", closer: "Clement Woffa", date: "Jun 18", time: "16:45", duration: "56 min", durationMin: 56, score: 7.7, status: "closable", objection: "Price", closed: true, valueEur: 1500, source: "YouTube" },
  { id: "4586927", prospect: "Ludovic Baral", closer: "Tomas Silva", date: "Jun 18", time: "09:15", duration: "52 min", durationMin: 52, score: 3.6, status: "not", objection: "Price", closed: false, valueEur: 0, source: "Instagram" },
  { id: "4586926", prospect: "Adele Djadja", closer: "Lea Nguyen", date: "Jun 16", time: "14:00", duration: "50 min", durationMin: 50, score: 6.9, status: "closable", objection: "Trust", closed: true, valueEur: 950, source: "TikTok" },
  { id: "4586925", prospect: "Marcus Vinter", closer: "Sofia Marchetti", date: "Jun 16", time: "10:20", duration: "44 min", durationMin: 44, score: 8.2, status: "closable", objection: "None", closed: true, valueEur: 1800, source: "YouTube" },
  { id: "4586924", prospect: "Yasmine Toure", closer: "Karim Benali", date: "Jun 15", time: "17:30", duration: "38 min", durationMin: 38, score: 5.4, status: "hard", objection: "Timing", closed: false, valueEur: 0, source: "Instagram" },
  { id: "4586923", prospect: "Olivier Mercier", closer: "Clement Woffa", date: "Jun 14", time: "13:05", duration: "61 min", durationMin: 61, score: 7.1, status: "closable", objection: "Authority", closed: true, valueEur: 1100, source: "TikTok" },
  { id: "4586922", prospect: "Priya Nadar", closer: "Lea Nguyen", date: "Jun 13", time: "11:00", duration: "29 min", durationMin: 29, score: 4.2, status: "poor", objection: "Trust", closed: false, valueEur: 0, source: "YouTube" },
  { id: "4586921", prospect: "Tom Janssen", closer: "Tomas Silva", date: "Jun 13", time: "15:40", duration: "47 min", durationMin: 47, score: 5.0, status: "hard", objection: "Price", closed: false, valueEur: 0, source: "Instagram" },
  { id: "4586920", prospect: "Sofia Reyes", closer: "Sofia Marchetti", date: "Jun 12", time: "09:50", duration: "55 min", durationMin: 55, score: 8.6, status: "closable", objection: "None", closed: true, valueEur: 2100, source: "YouTube" },
  { id: "4586919", prospect: "Daniel Okonkwo", closer: "Karim Benali", date: "Jun 11", time: "16:10", duration: "33 min", durationMin: 33, score: 6.1, status: "closable", objection: "Timing", closed: true, valueEur: 700, source: "TikTok" },
  { id: "4586918", prospect: "Lucia Ferraro", closer: "Clement Woffa", date: "Jun 10", time: "14:25", duration: "58 min", durationMin: 58, score: 6.8, status: "hard", objection: "Price", closed: true, valueEur: 1300, source: "Instagram" },
  { id: "4586917", prospect: "Hugo Lambert", closer: "Lea Nguyen", date: "Jun 09", time: "10:35", duration: "26 min", durationMin: 26, score: 3.9, status: "not", objection: "Authority", closed: false, valueEur: 0, source: "TikTok" },
  { id: "4586916", prospect: "Amara Diallo", closer: "Tomas Silva", date: "Jun 08", time: "17:00", duration: "41 min", durationMin: 41, score: 5.7, status: "hard", objection: "Think", closed: false, valueEur: 0, source: "YouTube" },
  { id: "4586915", prospect: "Nina Petrova", closer: "Sofia Marchetti", date: "Jun 07", time: "13:45", duration: "49 min", durationMin: 49, score: 7.9, status: "closable", objection: "Trust", closed: true, valueEur: 1450, source: "Instagram" },
  { id: "4586914", prospect: "Felix Braun", closer: "Karim Benali", date: "Jun 06", time: "11:15", duration: "36 min", durationMin: 36, score: 4.8, status: "poor", objection: "Price", closed: false, valueEur: 0, source: "YouTube" },
  { id: "4586913", prospect: "Chiara Romano", closer: "Clement Woffa", date: "Jun 05", time: "15:55", duration: "53 min", durationMin: 53, score: 7.4, status: "closable", objection: "None", closed: true, valueEur: 1250, source: "TikTok" },
];

export const CLOSER_NAMES = [...new Set(calls.map((c) => c.closer))];
export const SOURCE_NAMES = [...new Set(calls.map((c) => c.source))];

export function getCall(id: string): Call | undefined {
  return calls.find((c) => c.id === id);
}

/* Récence relative — la fenêtre mock se termine au 21 juin (= "aujourd'hui"). */
const LATEST_DAY = 21;
export function daysAgo(c: Call): number {
  const d = parseInt(c.date.replace(/\D/g, ""), 10) || LATEST_DAY;
  return LATEST_DAY - d;
}

/* "Review by exception" : appel non conclu ou score faible. */
export const isException = (c: Call) => !c.closed || c.score < 5;
