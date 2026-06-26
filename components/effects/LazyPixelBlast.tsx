"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type OriginalPixelBlast from "./PixelBlast";

/* PixelBlast tire three.js + postprocessing (~moteur WebGL). On le charge
   uniquement côté client, après hydratation, pour ne pas alourdir le JS initial.
   Ce wrapper "use client" permet de l'utiliser aussi depuis un Server Component
   (ssr:false étant interdit dans les Server Components). */
const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

type PixelBlastProps = ComponentProps<typeof OriginalPixelBlast>;

export default function LazyPixelBlast(props: PixelBlastProps) {
  return <PixelBlast {...props} />;
}
