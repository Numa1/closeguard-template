"use client";

import { Headphones, Target, Thunderbolt } from "@gravity-ui/icons";
import AnimatedWaveIcon from "@/components/AnimatedWaveIcon";
import CloseGuardLogo from "@/components/CloseGuardLogo";
import GlowButton from "@/components/GlowButton";
import Logo2 from "@/components/Logo2";
import Logo3 from "@/components/Logo3";
import CardSwap, { Card } from "@/components/effects/CardSwap";
import PixelBlast from "@/components/effects/PixelBlast";
import Silk from "@/components/effects/Silk";
import LightRays from "@/components/effects/LightRays";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";

const HERO_THEMES: Record<
  string,
  {
    bg: string;
    scrim: string;
    pixelColor: string;
    chipBg: string;
    logoColor: string;
  }
> = {
  "1": {
    bg: "#0b140b",
    scrim:
      "linear-gradient(90deg, #0b140b 0%, rgba(11,20,11,0.92) 26%, rgba(11,20,11,0.55) 46%, transparent 66%)",
    pixelColor: "#72fa91",
    chipBg: "#000000",
    logoColor: "#72fa91",
  },
  "2": {
    bg: "#0a0118",
    scrim:
      "linear-gradient(90deg, #0a0118 0%, rgba(10,1,24,0.92) 26%, rgba(10,1,24,0.55) 46%, transparent 66%)",
    pixelColor: "#7301ff",
    chipBg: "#ececf0",
    logoColor: "#7301ff",
  },
  "3": {
    bg: "#111729",
    scrim:
      "linear-gradient(90deg, #111729 0%, rgba(17,23,41,0.92) 26%, rgba(17,23,41,0.55) 46%, transparent 66%)",
    pixelColor: "#2664ec",
    chipBg: "#ffffff",
    logoColor: "#2664ec",
  },
};

function CardInner({
  icon,
  title,
  body,
  chipBg,
  logoColor,
  theme,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  chipBg: string;
  logoColor: string;
  theme: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: chipBg }}
      >
        {theme === "2" ? (
          <Logo2 className="h-5 w-auto" style={{ color: logoColor }} />
        ) : theme === "3" ? (
          <Logo3 className="h-6 w-auto" style={{ color: logoColor }} />
        ) : (
          <CloseGuardLogo className="h-6 w-auto" style={{ color: logoColor }} />
        )}
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
  const theme = useCurrentTheme();
  const t = HERO_THEMES[theme] ?? HERO_THEMES["1"];

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-7 shadow-sm md:h-[300px]"
      style={{ backgroundColor: t.bg }}
    >
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        {theme === "2" ? (
          <Silk
            speed={4}
            scale={1.2}
            color="#3d00a0"
            noiseIntensity={1.2}
            rotation={0}
          />
        ) : theme === "3" ? (
          <LightRays
            raysOrigin="top-center"
            raysColor="#aac4ff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            pulsating={false}
            fadeDistance={1.4}
            saturation={1}
          />
        ) : (
          <PixelBlast
            variant="circle"
            pixelSize={3}
            color={t.pixelColor}
            patternScale={2}
            patternDensity={1.2}
            enableRipples
            rippleIntensityScale={1.1}
            speed={0.4}
            edgeFade={0.2}
            transparent
          />
        )}
      </div>

      {/* left scrim for text readability */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: t.scrim }}
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
              chipBg={t.chipBg}
              logoColor={t.logoColor}
              theme={theme}
            />
          </Card>
          <Card className={cardClass}>
            <CardInner
              icon={<Thunderbolt className="size-5" />}
              title="Objections détectées"
              body="Prix · Timing · Confiance."
              chipBg={t.chipBg}
              logoColor={t.logoColor}
              theme={theme}
            />
          </Card>
          <Card className={cardClass}>
            <CardInner
              icon={<Target className="size-5" />}
              title="Closer Score"
              body="7,1 / 10 de performance."
              chipBg={t.chipBg}
              logoColor={t.logoColor}
              theme={theme}
            />
          </Card>
        </CardSwap>
      </div>
    </div>
  );
}
