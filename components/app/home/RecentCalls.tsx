"use client";

import { CSSProperties } from "react";
import { ChevronDown } from "@gravity-ui/icons";
import { Accordion, Avatar, Button, Card, Chip } from "@heroui/react";

import { CardGlow } from "@/components/effects/CardGlow";
import { useMember } from "@/components/app/MemberContext";
import { C, recentCalls, type CallStatus } from "./data";

const STATUS_LABEL: Record<CallStatus, string> = {
  hard: "Hard to Close",
  closable: "Closable",
  not: "Not Closable",
  poor: "Poorly Executed",
};

const STATUS_COLOR: Record<CallStatus, "success" | "warning" | "danger"> = {
  hard: "warning",
  closable: "success",
  not: "danger",
  poor: "danger",
};

function scoreColor(score: number): string {
  if (score >= 7) return C.green;
  if (score >= 5) return C.amber;
  return C.red;
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score);
  const pct = Math.round((score / 10) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 shrink-0 text-sm font-semibold tabular-nums" style={{ color }}>
        {score.toFixed(1)}
      </span>
      <div className="h-1.5 w-14 overflow-hidden rounded-full" style={{ backgroundColor: C.track }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function RecentCalls() {
  const { scope } = useMember();
  const calls = scope.isTeam
    ? recentCalls
    : recentCalls.filter((c) => c.closer === scope.label);
  return (
    <Card className="cg-card cg-card-interactive relative w-full min-w-0">
      <CardGlow />
      <Card.Header className="cg-fade flex-row items-center justify-between" style={{ "--cg-i": 0 } as CSSProperties}>
        <div>
          <Card.Title className="text-sm font-semibold tracking-[-0.01em]">Recent Calls</Card.Title>
          <Card.Description className="text-xs" style={{ color: C.text2 }}>
            Latest analyzed conversations
          </Card.Description>
        </div>
        <Button size="sm" variant="ghost">View all →</Button>
      </Card.Header>

      <Card.Content className="px-4 pb-4 pt-0">
        {calls.length === 0 && (
          <p className="py-6 text-center text-sm" style={{ color: C.text3 }}>
            No recent calls for {scope.label}.
          </p>
        )}
        <Accordion hideSeparator className="w-full">
          {calls.map((call, i) => {
            const initials = call.closer
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Accordion.Item
                key={call.name}
                id={call.name}
                className="cg-fade"
                style={{ "--cg-i": 1 + i } as CSSProperties}
              >
                <Accordion.Heading>
                  <Accordion.Trigger className="flex w-full items-center gap-3 py-3 text-left">
                    <Avatar size="sm">
                      <Avatar.Fallback>{initials}</Avatar.Fallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium" style={{ color: C.text1 }}>
                          {call.name}
                        </span>
                        {call.isNew && (
                          <Chip color="success" size="sm" variant="soft">NEW</Chip>
                        )}
                      </div>
                      <span className="text-xs" style={{ color: C.text2 }}>
                        {call.closer} · {call.date} · {call.duration}
                      </span>
                    </div>

                    <div className="hidden w-28 shrink-0 flex-col items-end gap-1.5 sm:flex">
                      <ScoreBar score={call.score} />
                      <Chip color={STATUS_COLOR[call.status]} size="sm" variant="soft">
                        {STATUS_LABEL[call.status]}
                      </Chip>
                    </div>

                    <Accordion.Indicator>
                      <ChevronDown className="size-4" />
                    </Accordion.Indicator>
                  </Accordion.Trigger>
                </Accordion.Heading>

                <Accordion.Panel>
                  <Accordion.Body className="pb-4 pt-1">
                    <div className="mb-3 flex items-center gap-3 sm:hidden">
                      <ScoreBar score={call.score} />
                      <Chip color={STATUS_COLOR[call.status]} size="sm" variant="soft">
                        {STATUS_LABEL[call.status]}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <p
                          className="text-[11px] font-semibold uppercase tracking-[0.06em]"
                          style={{ color: C.text3 }}
                        >
                          Blocking Objection
                        </p>
                        <p className="mt-0.5 text-sm font-medium" style={{ color: C.text1 }}>
                          {call.objection}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-[11px] font-semibold uppercase tracking-[0.06em]"
                          style={{ color: C.text3 }}
                        >
                          Real Outcome
                        </p>
                        <p
                          className="mt-0.5 text-sm font-semibold"
                          style={{ color: call.closed ? C.greenDark : C.red }}
                        >
                          {call.closed ? "Closed" : "Not Closed"}
                        </p>
                      </div>

                      <div className="flex items-end">
                        <Button size="sm" variant="secondary">
                          View full analysis →
                        </Button>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Card.Content>
    </Card>
  );
}
