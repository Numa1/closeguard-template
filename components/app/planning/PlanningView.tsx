"use client";

import { CSSProperties, useMemo, useState } from "react";
import { ChevronRight } from "@gravity-ui/icons";
import { CalendarDate } from "@internationalized/date";
import { Avatar } from "@heroui/react";
import { Agenda, ListView, Segment, useAgenda } from "@heroui-pro/react";
import { CardGlow } from "@/components/effects/CardGlow";
import { C, TONE } from "@/components/app/home/data";
import {
  CAL_MONTH,
  CAL_YEAR,
  daysFromToday,
  fmtTime,
  meetings,
  type Meeting,
  type MeetingStatus,
  STATUS_META,
  toEnd,
  toStart,
} from "./data";

const DATE_DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function dayLabel(day: number): string {
  const wd = new Date(2026, 5, day).toLocaleDateString("en-US", { weekday: "short" });
  return `${wd} · June ${day}`;
}

const CHIP: Record<MeetingStatus, { bg: string; fg: string }> = {
  upcoming: { bg: "rgba(100,116,139,0.12)", fg: C.slate },
  analyzed: { bg: TONE.green.soft, fg: TONE.green.text },
  "not-analyzed": { bg: TONE.amber.soft, fg: TONE.amber.text },
};

function StatusChip({ status }: { status: MeetingStatus }) {
  const c = CHIP[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {STATUS_META[status].label}
    </span>
  );
}

function StatCell({ label, value, color, last }: { label: string; value: string; color?: string; last?: boolean }) {
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

export default function PlanningView() {
  const [view, setView] = useState<string>("calendar");
  const [range, setRange] = useState<string>("30d");
  const [agendaDate, setAgendaDate] = useState<CalendarDate>(
    () => new CalendarDate(CAL_YEAR, CAL_MONTH, 29),
  );

  /* ── Calendar : events Agenda (read-only, couleur = statut), date contrôlée ── */
  const events = useMemo(
    () =>
      meetings.map((m) => ({
        id: m.id,
        title: m.prospect,
        start: toStart(m),
        end: toEnd(m),
        color: STATUS_META[m.status].color,
        isReadOnly: true,
        status: m.status === "upcoming" ? ("unconfirmed" as const) : ("confirmed" as const),
      })),
    [],
  );
  const agenda = useAgenda({ events, view: "month", date: agendaDate, onDateChange: setAgendaDate });

  /* ── List : filtrée par plage + groupée par jour ── */
  const rangeFiltered = useMemo(() => {
    const max = DATE_DAYS[range];
    return meetings.filter((m) => {
      const d = daysFromToday(m);
      return d < 0 || d <= max; // à venir toujours inclus
    });
  }, [range]);

  const groups = useMemo(() => {
    const byDay = new Map<number, Meeting[]>();
    [...rangeFiltered]
      .sort((a, b) => a.day - b.day || a.hour - b.hour)
      .forEach((m) => {
        if (!byDay.has(m.day)) byDay.set(m.day, []);
        byDay.get(m.day)!.push(m);
      });
    return [...byDay.entries()];
  }, [rangeFiltered]);

  /* ── KPIs contextuels : vue Calendrier = mois affiché · vue Liste = plage ── */
  const kpiMeetings =
    view === "calendar"
      ? agendaDate.year === CAL_YEAR && agendaDate.month === CAL_MONTH
        ? meetings
        : []
      : rangeFiltered;
  const stats = {
    total: kpiMeetings.length,
    upcoming: kpiMeetings.filter((m) => m.status === "upcoming").length,
    analyzed: kpiMeetings.filter((m) => m.status === "analyzed").length,
  };

  const scopeLabel =
    view === "calendar"
      ? new Date(agendaDate.year, agendaDate.month - 1, 1).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : range === "7d"
        ? "Last 7 days"
        : range === "90d"
          ? "Last 90 days"
          : "Last 30 days";

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="cg-fade flex flex-wrap items-end justify-between gap-4" style={{ "--cg-base": 0, "--cg-i": 0 } as CSSProperties}>
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#000102]">Planning</h1>
          <p className="mt-0.5 text-[13px]" style={{ color: C.text2 }}>
            Calls synced from your integrations · {scopeLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {view === "list" && (
            <Segment selectedKey={range} size="sm" variant="ghost" onSelectionChange={(k) => setRange(String(k))}>
              <Segment.Item id="7d">7d</Segment.Item>
              <Segment.Item id="30d">30d</Segment.Item>
              <Segment.Item id="90d">90d</Segment.Item>
            </Segment>
          )}
          <Segment selectedKey={view} size="sm" onSelectionChange={(k) => setView(String(k))}>
            <Segment.Item id="calendar">Calendar</Segment.Item>
            <Segment.Item id="list">List</Segment.Item>
          </Segment>
        </div>
      </div>

      {/* KPI strip */}
      <div className="cg-fade cg-card relative flex flex-wrap" style={{ "--cg-base": 2, "--cg-i": 0 } as CSSProperties}>
        <StatCell label="Total meetings" value={String(stats.total)} />
        <StatCell label="Upcoming" value={String(stats.upcoming)} color={stats.upcoming ? C.slate : C.text1} />
        <StatCell label="Analyzed" value={String(stats.analyzed)} color={stats.analyzed ? TONE.green.text : C.text1} last />
      </div>

      {/* Content */}
      {view === "calendar" ? (
        <div className="cg-fade cg-card cg-card-interactive relative p-4" style={{ "--cg-base": 4, "--cg-i": 0 } as CSSProperties}>
          <CardGlow />
          <Agenda {...agenda}>
            <Agenda.Header>
              <Agenda.Heading />
              <Agenda.Navigation>
                <Agenda.NavButton slot="previous" />
                <Agenda.TodayButton />
                <Agenda.NavButton slot="next" />
              </Agenda.Navigation>
            </Agenda.Header>
            <Agenda.Body>
              <Agenda.MonthGrid>
                {agenda.visibleWeeks.map((week, i) => {
                  const rowLayout = agenda.getMonthRowLayout(week);
                  return (
                    <Agenda.MonthRow key={i} spanningRowCount={rowLayout.rowCount}>
                      {rowLayout.items.map((item) => (
                        <Agenda.MonthSpanningEvent
                          key={item.event.id}
                          event={item.event}
                          colStart={item.colStart}
                          colSpan={item.colSpan}
                          row={item.row}
                        />
                      ))}
                      {week.map((day, colIdx) => (
                        <Agenda.MonthCell key={day.toString()} date={day} spanningRowCount={rowLayout.rowCountPerCol[colIdx] ?? 0}>
                          {agenda.getPerCellEvents(day, week).map((event) => (
                            <Agenda.MonthEvent key={event.id} event={event} />
                          ))}
                        </Agenda.MonthCell>
                      ))}
                    </Agenda.MonthRow>
                  );
                })}
              </Agenda.MonthGrid>
            </Agenda.Body>
          </Agenda>
        </div>
      ) : (
        <div className="cg-fade flex flex-col gap-5" style={{ "--cg-base": 4, "--cg-i": 0 } as CSSProperties}>
          {groups.length === 0 && (
            <p className="py-10 text-center text-sm" style={{ color: C.text3 }}>
              No meetings in this range.
            </p>
          )}
          {groups.map(([day, dayMeetings]) => (
            <div key={day}>
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="text-sm font-semibold" style={{ color: C.text1 }}>
                  {dayLabel(day)}
                </span>
                <span className="text-xs tabular-nums" style={{ color: C.text3 }}>
                  {dayMeetings.length}
                </span>
              </div>
              <div className="cg-card relative px-2 py-1">
                <ListView aria-label={`Meetings on June ${day}`} variant="secondary" items={dayMeetings} selectionMode="none">
                  {(m: Meeting) => (
                    <ListView.Item
                      id={m.id}
                      textValue={m.prospect}
                      href={m.status === "analyzed" && m.callId ? `/calls/${m.callId}` : undefined}
                      className={
                        m.status === "analyzed"
                          ? "rounded-lg [&]:hover:bg-black/[0.04]"
                          : "cursor-default! [&]:hover:bg-transparent"
                      }
                    >
                      <ListView.ItemContent>
                        <Avatar size="sm">
                          <Avatar.Fallback>{initials(m.prospect)}</Avatar.Fallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <ListView.Title>{m.prospect}</ListView.Title>
                          <ListView.Description>
                            {m.email} · {fmtTime(m)} · {m.source}
                          </ListView.Description>
                        </div>
                      </ListView.ItemContent>
                      <ListView.ItemAction>
                        <div className="flex items-center gap-2">
                          <StatusChip status={m.status} />
                          {m.status === "analyzed" && (
                            <ChevronRight className="size-4" style={{ color: C.text3 }} />
                          )}
                        </div>
                      </ListView.ItemAction>
                    </ListView.Item>
                  )}
                </ListView>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
