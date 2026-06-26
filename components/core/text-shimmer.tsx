"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* Composants motion créés une seule fois (niveau module) — éviter
   `motion.create()` au render (recrée le composant à chaque rendu). */
const MOTION_TAGS = {
  p: motion.p,
  span: motion.span,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const;
type MotionTag = keyof typeof MOTION_TAGS;

export type TextShimmerProps = {
  children: string;
  as?: MotionTag;
  className?: string;
  duration?: number;
  spread?: number;
  repeatDelay?: number;
};

export function TextShimmer({
  children,
  as = "p",
  className,
  duration = 2,
  spread = 2,
  repeatDelay = 0,
}: TextShimmerProps) {
  const MotionComponent = MOTION_TAGS[as] ?? motion.p;

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
        "text-transparent [--base-color:#22c55e] [--base-gradient-color:#ffffff]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        "dark:[--base-color:#22c55e] dark:[--base-gradient-color:#ffffff]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
        repeatDelay,
      }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}
