"use client";

import { useEffect, useState } from "react";
import { SlidingNumber } from "@/components/core/sliding-number";

export function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Synchronisation avec l'horloge système (système externe) au montage —
    // cas légitime d'un setState dans un effet.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    // Évite un mismatch d'hydratation : rien tant que le client n'a pas monté.
    return <div className="h-5 w-[5.5ch]" aria-hidden />;
  }

  return (
    <div className="flex items-center gap-0.5 text-[13px] font-medium tabular-nums text-[#000102]">
      <SlidingNumber value={time.getHours()} padStart={true} />
      <span className="text-[#9ca3af]">:</span>
      <SlidingNumber value={time.getMinutes()} padStart={true} />
      <span className="text-[#9ca3af]">:</span>
      <SlidingNumber value={time.getSeconds()} padStart={true} />
    </div>
  );
}
