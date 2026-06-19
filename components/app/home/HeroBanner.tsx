"use client";

import { Headphones, Target, Thunderbolt } from "@gravity-ui/icons";
import AnimatedWaveIcon from "@/components/AnimatedWaveIcon";
import CloseGuardLogo from "@/components/CloseGuardLogo";
import GlowButton from "@/components/GlowButton";
import CardSwap, { Card } from "@/components/effects/CardSwap";
import PixelBlast from "@/components/effects/PixelBlast";

const BG = "#0b140b";
const SCRIM =
  "linear-gradient(90deg, #0b140b 0%, rgba(11,20,11,0.92) 26%, rgba(11,20,11,0.55) 46%, transparent 66%)";
const LOGO_COLOR = "#72fa91";
const CHIP_BG = "#000000";

function CardInner({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: CHIP_BG }}
      >
        <CloseGuardLogo className="h-6 w-auto" style={{ color: LOGO_COLOR }} />
      </span>
      <div>
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--cg-cta)" }}>{icon}</span>
          <p className="text-lg font-semibold text-[#000102]">{title}</p>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">{body}</p>
      </div>
    </div>
  );
}

const cardClass =
  "border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-md";

export default function HeroBanner() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-7 shadow-sm md:h-[300px]"
      style={{ backgroundColor: BG }}
    >
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <PixelBlast
          variant="circle"
          pixelSize={3}
          color="#72fa91"
          patternScale={2}
          patternDensity={1.2}
          enableRipples
          rippleIntensityScale={1.1}
          speed={0.4}
          edgeFade={0.2}
          transparent
        />
      </div>

      {/* left scrim for text readability */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: SCRIM }}
      />

      <div className="relative z-10 flex max-w-md flex-col items-start text-left md:h-full md:justify-center">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--cg-cta)" }}
        >
          Démo
        </p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-white">
          Closez plus, perdez moins.
        </h2>
        <p className="mt-2 text-sm text-white/60">
          L&apos;IA analyse chaque appel commercial.
        </p>
        <GlowButton className="mt-4" onClick={() => {}}>
          <AnimatedWaveIcon className="size-4" />
          Analyser un appel
        </GlowButton>
      </div>

      {/* Swapping cards (desktop only) */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
        <CardSwap
          width={560}
          height={340}
          cardDistance={56}
          verticalDistance={56}
          delay={3500}
          skewAmount={5}
        >
          <Card className={cardClass}>
            <CardInner
              icon={<Headphones className="size-5" />}
              title="Diagnostic d'appel"
              body="Qualité, exécution & objections."
            />
          </Card>
          <Card className={cardClass}>
            <CardInner
              icon={<Thunderbolt className="size-5" />}
              title="Objections détectées"
              body="Prix · Timing · Confiance."
            />
          </Card>
          <Card className={cardClass}>
            <CardInner
              icon={<Target className="size-5" />}
              title="Closer Score"
              body="7,1 / 10 de performance."
            />
          </Card>
        </CardSwap>
      </div>
    </div>
  );
}
