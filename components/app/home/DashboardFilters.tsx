"use client";

import { CSSProperties, ReactNode, useState } from "react";
import { ChevronDown, Globe } from "@gravity-ui/icons";
import { Button, Dropdown, Label } from "@heroui/react";
import { Segment } from "@heroui-pro/react";
import { useMember } from "@/components/app/MemberContext";

import { C, CURRENT_USER, PERIOD, recentCalls } from "./data";

/* Logos de plateformes — inline (absents de @gravity-ui/icons), monochrome
   currentColor pour rester cohérent avec le reste du menu. */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.36 2.3 1.65 3.68 3.88 3.83v2.57c-1.29.13-2.42-.29-3.74-1.09v4.96c0 5.3-5.78 6.96-8.1 3.16-1.49-2.45-.57-6.74 4.23-6.91v2.71c-.37.06-.76.15-1.12.27-1.07.36-1.68 1.04-1.51 2.24.32 2.29 4.52 2.97 4.17-1.51V3h2.19Z" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.3 26.3 0 0 0 22 12a26.3 26.3 0 0 0-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

const SOURCES = ["All sources", "Instagram", "TikTok", "YouTube"] as const;
const SOURCE_ICON: Record<string, ReactNode> = {
  "All sources": <Globe className="size-4 shrink-0" />,
  Instagram: <InstagramIcon />,
  TikTok: <TikTokIcon />,
  YouTube: <YouTubeIcon />,
};

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const newCallsCount = recentCalls.filter((c) => c.isNew).length;

export default function DashboardFilters() {
  const { scope } = useMember();
  const [period, setPeriod] = useState("30d");
  const [source, setSource] = useState("All sources");

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {/* Welcome greeting */}
        <div
          className="cg-fade mb-1.5 flex items-center gap-2 text-[12px]"
          style={{ color: C.text3, "--cg-i": 0 } as CSSProperties}
        >
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: C.greenSoft }}
          />
          <span>
            {timeGreeting()},{" "}
            <span className="font-semibold" style={{ color: C.text1 }}>
              {CURRENT_USER.firstName}
            </span>
            {" "}·{" "}
            {newCallsCount > 0 ? (
              <>
                <span className="font-medium" style={{ color: C.text1 }}>
                  {newCallsCount} new call{newCallsCount > 1 ? "s" : ""}
                </span>{" "}
                to review since your last session
              </>
            ) : (
              <>Welcome back to Closium</>
            )}
          </span>
        </div>

        {/* Title + period */}
        <div className="cg-fade" style={{ "--cg-i": 1 } as CSSProperties}>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#000102]">
            Dashboard
          </h1>
          <p className="mt-0.5 text-[13px] text-[#6b7280]">
            {scope.isTeam ? (
              <>
                {PERIOD.label} ·{" "}
                <b className="font-semibold tabular-nums text-[#000102]">
                  {PERIOD.calls}
                </b>{" "}
                calls analyzed
              </>
            ) : (
              <>
                Viewing{" "}
                <b className="font-semibold text-[#000102]">{scope.label}</b>{" "}
                · {scope.sublabel}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Period + source filters */}
      <div
        className="cg-fade flex flex-wrap items-center gap-2"
        style={{ "--cg-i": 2 } as CSSProperties}
      >
        <Segment
          selectedKey={period}
          size="sm"
          variant="ghost"
          onSelectionChange={(k) => setPeriod(String(k))}
        >
          <Segment.Item id="7d">7d</Segment.Item>
          <Segment.Item id="30d">30d</Segment.Item>
          <Segment.Item id="90d">90d</Segment.Item>
        </Segment>

        <Dropdown>
          <Button className="cg-card h-9 text-[#000102]" size="sm" variant="secondary">
            {SOURCE_ICON[source]}
            {source}
            <ChevronDown className="size-4 text-[#9ca3af]" />
          </Button>
          <Dropdown.Popover className="min-w-[190px]" placement="bottom end">
            <Dropdown.Menu onAction={(k) => setSource(String(k))}>
              {SOURCES.map((s) => (
                <Dropdown.Item key={s} id={s} textValue={s}>
                  {SOURCE_ICON[s]}
                  <Label>{s}</Label>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
}
