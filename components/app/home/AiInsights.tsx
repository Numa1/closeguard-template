"use client";

import { CSSProperties } from "react";
import { ChevronRight } from "@gravity-ui/icons";
import { Alert, Card } from "@heroui/react";

import { CardGlow } from "@/components/effects/CardGlow";
import { useMember } from "@/components/app/MemberContext";
import { aiInsightsFor, C, Severity } from "./data";

const SEVERITY_STATUS: Record<Severity, "danger" | "warning" | "success"> = {
  danger: "danger",
  warning: "warning",
  success: "success",
};

export default function AiInsights() {
  const { scope } = useMember();
  const insights = aiInsightsFor(scope);
  return (
    <Card className="cg-card cg-card-interactive relative h-full overflow-hidden">
      <CardGlow />
      <Card.Content className="p-6">
        <div className="cg-fade mb-4 flex flex-wrap items-center gap-x-2 gap-y-1" style={{ "--cg-i": 0 } as CSSProperties}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(114,250,145,0.18)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0b5c2e]">
            <SparkIcon /> Closium AI
          </span>
          <h2 className="text-sm font-semibold tracking-[-0.01em] text-[#000102]">
            Priority recommendations
          </h2>
          <span className="ml-auto hidden text-[11px] text-[#6b7280] sm:block">Analyzed 2h ago</span>
        </div>

        <div className="flex flex-col gap-3">
          {insights.map((it, i) => (
            <div key={it.title} className="cg-fade" style={{ "--cg-i": 1 + i } as CSSProperties}>
            <Alert status={SEVERITY_STATUS[it.severity]}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{it.title}</Alert.Title>
                <Alert.Description>{it.detail}</Alert.Description>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[12px] font-medium text-[#374151] shadow-[0_0_0_1px_rgba(16,24,40,0.06)]">
                    → {it.action}
                  </span>
                  <span
                    className="rounded-md px-2 py-1 text-[12px] font-semibold"
                    style={{ backgroundColor: "rgba(34,197,94,0.12)", color: C.greenDark }}
                  >
                    {it.impact}
                  </span>
                </div>
              </Alert.Content>
              <button
                type="button"
                className="flex shrink-0 items-center self-start rounded-lg p-1 text-[#9ca3af] transition-colors hover:text-[#6b7280]"
              >
                <ChevronRight className="size-4" />
              </button>
            </Alert>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}

function SparkIcon() {
  return (
    <svg fill="currentColor" height="12" viewBox="0 0 24 24" width="12">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
    </svg>
  );
}
