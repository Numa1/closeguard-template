"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

/* ── Listener mutualisé ─────────────────────────────────────────────
   Plusieurs <GlowingEffect/> sont montés simultanément (≈1 par carte).
   Au lieu d'un listener `pointermove`/`scroll` par instance, on en pose
   UN seul au niveau module et on diffuse l'évènement aux abonnés. */
type GlowSubscriber = (e: PointerEvent | null) => void;
const glowSubscribers = new Set<GlowSubscriber>();
let glowListening = false;
let lastPointerEvent: PointerEvent | null = null;

function dispatchGlow(e: PointerEvent | null) {
  glowSubscribers.forEach((fn) => fn(e));
}
function handleSharedPointerMove(e: PointerEvent) {
  lastPointerEvent = e;
  dispatchGlow(e);
}
function handleSharedScroll() {
  dispatchGlow(lastPointerEvent);
}
function subscribeGlow(fn: GlowSubscriber): () => void {
  glowSubscribers.add(fn);
  if (!glowListening && typeof window !== "undefined") {
    document.body.addEventListener("pointermove", handleSharedPointerMove, { passive: true });
    window.addEventListener("scroll", handleSharedScroll, { passive: true });
    glowListening = true;
  }
  return () => {
    glowSubscribers.delete(fn);
    if (glowSubscribers.size === 0 && glowListening) {
      document.body.removeEventListener("pointermove", handleSharedPointerMove);
      window.removeEventListener("scroll", handleSharedScroll);
      glowListening = false;
    }
  };
}

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);
    const isVisibleRef = useRef(true);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;
        // Carte hors écran : on ne calcule rien (pas de reflow inutile).
        if (!isVisibleRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          const targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const element = containerRef.current;

      // Ne calcule que les cartes visibles à l'écran.
      let observer: IntersectionObserver | undefined;
      if (element && typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
          ([entry]) => {
            isVisibleRef.current = entry?.isIntersecting ?? true;
          },
          { rootMargin: "100px" }
        );
        observer.observe(element);
      }

      // Abonnement au listener mutualisé (1 seul pour toutes les instances).
      const unsubscribe = subscribeGlow((e) => handleMove(e ?? undefined));

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        observer?.disconnect();
        unsubscribe();
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #72fa91 10%, #72fa9100 20%),
                radial-gradient(circle at 40% 40%, #ffffff 5%, #ffffff00 15%),
                radial-gradient(circle at 60% 60%, #34d399 10%, #34d39900 20%),
                radial-gradient(circle at 40% 60%, #bbf7d0 10%, #bbf7d000 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #72fa91 0%,
                  #ffffff calc(25% / var(--repeating-conic-gradient-times)),
                  #34d399 calc(50% / var(--repeating-conic-gradient-times)),
                  #bbf7d0 calc(75% / var(--repeating-conic-gradient-times)),
                  #72fa91 calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
