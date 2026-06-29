"use client";

import { CSSProperties, useState } from "react";
import { ChevronDown } from "@gravity-ui/icons";
import { Button, Dropdown, Label } from "@heroui/react";
import { Segment } from "@heroui-pro/react";
import { useMember } from "@/components/app/MemberContext";
import { SOURCE_ICON } from "@/components/app/SourceIcon";

import { C, CURRENT_USER, PERIOD, recentCalls } from "./data";

const SOURCES = ["All sources", "Instagram", "TikTok", "YouTube"] as const;

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
