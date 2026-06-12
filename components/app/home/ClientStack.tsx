"use client";

import { useState } from "react";
import { Card } from "@heroui/react";
import Stack from "@/components/effects/Stack";
import PixelCard from "@/components/effects/PixelCard";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";

const PIXEL_COLORS: Record<string, string> = {
  "1": "#bbf7d0,#86efac,#72fa91",
  "2": "#e9ddff,#b89aff,#7301ff",
};

interface Client {
  name: string;
  date: string;
  closed: boolean;
  amount: string;
  source: string;
}

const clients: Client[] = [
  { name: "Youssoupha Diang", date: "9 juin", closed: false, amount: "—", source: "Meta Ads" },
  { name: "Dan Songo", date: "10 juin", closed: false, amount: "—", source: "Référence" },
  { name: "Serge Nyogola", date: "11 juin", closed: true, amount: "3 100 €", source: "Cold call" },
  { name: "Estelle Marchand", date: "12 juin", closed: true, amount: "4 200 €", source: "LinkedIn" },
];

function ClientTile({ client }: { client: Client }) {
  const accent = client.closed ? "#22c55e" : "#ef4444";
  return (
    <div className="flex h-full w-full select-none flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white p-5 shadow-2xl">
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: client.closed
              ? "rgba(34,197,94,0.12)"
              : "rgba(239,68,68,0.10)",
            color: client.closed ? "#15803d" : "#dc2626",
          }}
        >
          {client.closed ? "Signé" : "Perdu"}
        </span>
        <span className="size-2.5 rounded-full" style={{ backgroundColor: accent }} />
      </div>

      <div>
        <p className="text-lg font-semibold leading-tight text-[#000102]">
          {client.name}
        </p>
        <p className="text-sm text-[#6b7280]">{client.source}</p>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-sm text-[#9ca3af]">{client.date}</span>
        <span className="text-base font-semibold tabular-nums text-[#000102]">
          {client.amount}
        </span>
      </div>
    </div>
  );
}

export default function ClientStack() {
  const theme = useCurrentTheme();
  const [swaps, setSwaps] = useState(0);

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Pixels en arrière-plan de toute la carte (burst au swap) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <PixelCard
          noHover
          noFocus
          trigger={swaps}
          autoHideDelay={650}
          gap={6}
          speed={45}
          colors={PIXEL_COLORS[theme] ?? PIXEL_COLORS["1"]}
        />
      </div>

      <Card.Content className="relative z-10 flex flex-col items-center gap-10 p-6 sm:flex-row sm:items-start sm:justify-center">
        <div className="min-w-0 sm:pt-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#9ca3af]">
            Derniers clients
          </p>
          <h3 className="mt-1 text-lg font-medium text-[#000102]">
            Signés &amp; perdus
          </h3>
          <p className="mt-2 max-w-[15rem] text-sm text-[#6b7280]">
            Un aperçu de vos derniers deals analysés. Faites défiler la pile.
          </p>
        </div>

        <div className="shrink-0" style={{ width: 240, height: 240 }}>
          <Stack
            sensitivity={120}
            sendToBackOnClick
            autoplay
            autoplayDelay={2400}
            pauseOnHover
            onSwap={() => setSwaps((n) => n + 1)}
            cards={clients.map((c, i) => (
              <ClientTile key={i} client={c} />
            ))}
          />
        </div>
      </Card.Content>
    </Card>
  );
}
