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
    <section className="relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#030712] selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 3D WebGL Canvas Layer (z-0) */}
      <HeroCanvas />

      {/* Left-side gradient mask — ensures text is always readable over the 3D scene */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent" />

      {/* 2D Typography & UI Layer (z-10, pointer-events-none base) */}
      <HeroText 
        onOpenRfq={onOpenRfq} 
        onExploreServices={onExploreServices} 
      />

      {/* Bottom gradient for smooth blending into page content below */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-10" />
      {/* Top gradient for smooth blending under the Navbar */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#030712]/60 to-transparent z-10" />
      
    </section>
  );
};

export default Hero;
