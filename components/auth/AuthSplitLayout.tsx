import { ReactNode } from "react";
import LazyPixelBlast from "@/components/effects/LazyPixelBlast";

interface AuthLayoutProps {
  rightContent: ReactNode;
}

export default function AuthLayout({ rightContent }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-[#f6f6f6] overflow-hidden">
      {/* Animated PixelBlast background */}
      <div className="absolute inset-0 z-0">
        <LazyPixelBlast
          variant="circle"
          pixelSize={3}
          color="#72fa91"
          patternScale={2}
          patternDensity={1.8}
          enableRipples
          rippleIntensityScale={1.2}
          speed={0.4}
          edgeFade={0.15}
          transparent
        />
      </div>

      {/* Centered auth content */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/60 bg-white/70 p-8 backdrop-blur-xl">
        {rightContent}
      </div>
    </div>
  );
}
