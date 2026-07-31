"use client";

import React from "react";
import { HeroCanvas } from "./HeroCanvas";
import { HeroText } from "./HeroText";

interface HeroProps {
  /** Callback for opening the Terminal RFQ / Contact form */
  onOpenRfq: () => void;
  /** Callback for navigating to the services tab/page */
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRfq, onExploreServices }) => {
  return (
    <section className="relative w-full h-[100svh] min-h-[650px] overflow-hidden bg-[#030712] selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* 3D WebGL Canvas Layer (z-0) */}
      <HeroCanvas />

      {/* Top subtle backdrop gradient for header integration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 z-[5] bg-gradient-to-b from-[#030712] via-[#030712]/70 to-transparent" />

      {/* 2D Typography & UI Layer (z-10, pointer-events-none base) */}
      <HeroText
        onOpenRfq={onOpenRfq}
        onExploreServices={onExploreServices}
      />

      {/* Bottom gradient blending seamlessly into the section below */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[var(--bg-primary)] via-[#030712]/80 to-transparent z-10" />

    </section>
  );
};

export default Hero;
