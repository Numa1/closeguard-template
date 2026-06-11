"use client";

import { ReactNode } from "react";
import BorderGlow from "@/components/effects/BorderGlow";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const THEME_COLORS: Record<string, { bg: string; colors: [string, string, string]; fg: string }> = {
  "1": { bg: "#72fa91", colors: ["#ffffff", "#bbf7d0", "#34d399"], fg: "#04210f" },
  "2": { bg: "#7301ff", colors: ["#ffffff", "#d4a8ff", "#9a5eff"], fg: "#ffffff" },
};

export default function GlowButton({
  children,
  onClick,
  className = "",
}: GlowButtonProps) {
  const theme = useCurrentTheme();
  const t = THEME_COLORS[theme] ?? THEME_COLORS["1"];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-block cursor-pointer border-0 bg-transparent p-0 ${className}`}
    >
      <BorderGlow
        className="glow-button"
        glowColor="140 90 68"
        backgroundColor={t.bg}
        borderRadius={9999}
        glowRadius={18}
        glowIntensity={1.3}
        coneSpread={25}
        colors={t.colors}
      >
        <span
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium"
          style={{ color: t.fg }}
        >
          {children}
        </span>
      </BorderGlow>
    </button>
  );
}
