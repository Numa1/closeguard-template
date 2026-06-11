"use client";

import { Calendar, ChevronDown } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { Segment } from "@heroui-pro/react";

export default function OverviewHeader() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[#6b7280]">
          Données sur tous les clients
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[#000102]">Overview</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-[#000102] shadow-sm">
          <Calendar className="size-4 text-[#6b7280]" />
          <span>01.12.2023</span>
          <span className="text-[#6b7280]">→</span>
          <span>01.12.2024</span>
        </div>
        <Segment defaultSelectedKey="30d" size="sm" variant="ghost">
          <Segment.Item id="7d">7 j</Segment.Item>
          <Segment.Item id="30d">30 j</Segment.Item>
          <Segment.Item id="90d">90 j</Segment.Item>
        </Segment>
        <Button
          variant="secondary"
          className="bg-white text-[#000102] shadow-sm"
          onPress={() => {}}
        >
          Tous les closers
          <ChevronDown className="size-4" />
        </Button>
      </div>
    </div>
  );
}
