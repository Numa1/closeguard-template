"use client";

import { GlowingEffect } from "./GlowingEffect";

/* Paramètres standard du contour lumineux pour toutes les cartes du dashboard.
   Source unique → cohérence garantie entre composants.
   À placer comme premier enfant d'une carte `relative rounded-[…]`. */
export function CardGlow() {
  return (
    <GlowingEffect
      spread={40}
      glow
      disabled={false}
      proximity={64}
      inactiveZone={0.01}
      borderWidth={2}
    />
  );
}
