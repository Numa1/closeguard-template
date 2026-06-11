"use client";

import { useEffect, useState } from "react";
import CloseGuardLogo from "@/components/CloseGuardLogo";
import PixelBlast from "@/components/effects/PixelBlast";

const DURATION = 3000;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;

    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / DURATION, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // let the fade-out transition play, then unmount
        window.setTimeout(() => setVisible(false), 450);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const done = progress >= 1;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#080d08] transition-opacity duration-500 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* PixelBlast develops as loading progresses — subtle, masked to the centre */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06 + progress * 0.26,
          maskImage:
            "radial-gradient(circle at 50% 50%, black 0%, black 18%, transparent 50%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 0%, black 18%, transparent 50%)",
        }}
      >
        <PixelBlast
          variant="circle"
          pixelSize={3}
          color="#72fa91"
          patternScale={2}
          patternDensity={0.9}
          enableRipples={false}
          speed={0.4}
          edgeFade={0.5}
          transparent
        />
      </div>

      {/* centered animated logo + progress */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <CloseGuardLogo className="h-20 w-auto text-white" />
        <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#72fa91] transition-[width] duration-100 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
