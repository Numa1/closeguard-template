"use client";

import { ReactNode } from "react";
import BorderGlow from "@/components/effects/BorderGlow";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function GlowButton({
  children,
  onClick,
  className = "",
}: GlowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-block cursor-pointer border-0 bg-transparent p-0 ${className}`}
    >
      <BorderGlow
        className="glow-button"
        glowColor="140 90 68"
        backgroundColor="#72fa91"
        borderRadius={9999}
        glowRadius={18}
        glowIntensity={1.3}
        coneSpread={25}
        colors={["#ffffff", "#bbf7d0", "#34d399"]}
      >
        <span
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium"
          style={{ color: "#04210f" }}
        >
          {children}
        </span>
      </BorderGlow>
    </button>
  );
}
