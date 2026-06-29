// Mock data for the Planning page (/planning). Front-only.
// Fenêtre : juin 2026, "aujourd'hui" = 29 juin (aligné sur la date système du mock).
import { CalendarDateTime } from "@internationalized/date";

export type MeetingStatus = "upcoming" | "analyzed" | "not-analyzed";
export type MeetingSource = "Calendly" | "Cal.com" | "iClosed";

export interface Meeting {
  id: string;
  prospect: string;
  email: string;
  source: MeetingSource;
  day: number; // June 2026
  hour: number;
  minute: number;
  durationMin: number;
  status: MeetingStatus;
  callId?: string; // si analyzed → lien vers /calls/[id]
}

export const CAL_YEAR = 2026;
export const CAL_MONTH = 6;
const TODAY = 29;

export const STATUS_META: Record<MeetingStatus, { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "#64748b" },
  analyzed: { label: "Analyzed", color: "#22c55e" },
  "not-analyzed": { label: "Not analyzed", color: "#f59e0b" },
};

export const meetings: Meeting[] = [
  // Analyzed début de mois (remplit le calendrier)
  { id: "m12", prospect: "Chiara Romano", email: "chiara.romano@studio.it", source: "Cal.com", day: 5, hour: 15, minute: 55, durationMin: 53, status: "analyzed", callId: "4586913" },
  { id: "m13", prospect: "Amara Diallo", email: "amara.d@gmail.com", source: "Calendly", day: 8, hour: 17, minute: 0, durationMin: 41, status: "analyzed", callId: "4586916" },
  { id: "m14", prospect: "Lucia Ferraro", email: "lucia@ferraro.co", source: "iClosed", day: 10, hour: 14, minute: 25, durationMin: 58, status: "analyzed", callId: "4586918" },
  { id: "m15", prospect: "Sofia Reyes", email: "sofia.reyes@gmail.com", source: "Calendly", day: 12, hour: 9, minute: 50, durationMin: 55, status: "analyzed", callId: "4586920" },
  // Analyzed (passé, reliés à des appels existants)
  { id: "m1", prospect: "Celeste Bossota", email: "celeste@maison-b.fr", source: "Calendly", day: 16, hour: 14, minute: 0, durationMin: 50, status: "analyzed", callId: "4586926" },
  { id: "m2", prospect: "Ilhyam Babu", email: "ilhyam.babu@gmail.com", source: "Cal.com", day: 18, hour: 16, minute: 45, durationMin: 56, status: "analyzed", callId: "4586928" },
  { id: "m3", prospect: "Denilson Sylla", email: "d.sylla@scale.io", source: "Calendly", day: 20, hour: 11, minute: 30, durationMin: 30, status: "analyzed", callId: "4586929" },
  { id: "m4", prospect: "Marcus Vinter", email: "marcus@vinter.co", source: "iClosed", day: 21, hour: 10, minute: 20, durationMin: 44, status: "analyzed", callId: "4586925" },
  { id: "m5", prospect: "Nina Petrova", email: "nina.p@outlook.com", source: "Calendly", day: 24, hour: 13, minute: 45, durationMin: 49, status: "analyzed", callId: "4586915" },
  // Not analyzed (passé, non traité)
  { id: "m6", prospect: "Yasmine Toure", email: "yasmine.toure@gmail.com", source: "Calendly", day: 25, hour: 17, minute: 30, durationMin: 40, status: "not-analyzed" },
  { id: "m7", prospect: "Hugo Lambert", email: "hugo@lambert-dev.fr", source: "Cal.com", day: 26, hour: 9, minute: 0, durationMin: 30, status: "not-analyzed" },
  { id: "m8", prospect: "Priya Nadar", email: "priya.nadar@gmail.com", source: "Calendly", day: 27, hour: 15, minute: 15, durationMin: 45, status: "not-analyzed" },
  // Upcoming (futur)
  { id: "m9", prospect: "Lucas Moreau", email: "lucas.moreau@gmail.com", source: "Calendly", day: 30, hour: 11, minute: 0, durationMin: 45, status: "upcoming" },
  { id: "m10", prospect: "Emma Schmidt", email: "emma.schmidt@web.de", source: "iClosed", day: 30, hour: 15, minute: 30, durationMin: 30, status: "upcoming" },
  { id: "m11", prospect: "Karim Benali", email: "karim@benali.io", source: "Calendly", day: 30, hour: 17, minute: 0, durationMin: 45, status: "upcoming" },
];

export const toStart = (m: Meeting) => new CalendarDateTime(CAL_YEAR, CAL_MONTH, m.day, m.hour, m.minute);
export const toEnd = (m: Meeting) => toStart(m).add({ minutes: m.durationMin });

/** Récence relative (TODAY = 29 juin) — négatif = à venir. */
export const daysFromToday = (m: Meeting) => TODAY - m.day;

export const fmtTime = (m: Meeting) =>
  `${String(m.hour).padStart(2, "0")}:${String(m.minute).padStart(2, "0")}`;
