"use client";

import React from "react";
import { HeroText } from "./HeroText";
import { CircuitScene3D } from "./CircuitScene3D";

interface HeroProps {
  onOpenRfq: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRfq, onExploreServices }) => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "var(--void, #050608)" }}
      aria-label="Hero — ByteBrothers"
    >
      {/* ── 3D circuit — absolute, fills entire viewport ─────────────────── */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <CircuitScene3D className="w-full h-full" />
      </div>

      {/* ── Gradient veil — keeps left/centre text area legible ──────────── */}
      {/* Darker toward the text column, transparent toward the edges        */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          background: [
            // Dense dark veil behind text column — boosted opacity for readability
            "radial-gradient(ellipse 65% 80% at 28% 48%, rgba(5,6,8,0.96) 0%, rgba(5,6,8,0.78) 55%, rgba(5,6,8,0.35) 80%)",
            // Full-screen base tint so text is never lost against bright 3D scene
            "linear-gradient(to right, rgba(5,6,8,0.72) 0%, rgba(5,6,8,0.35) 60%, rgba(5,6,8,0.10) 100%)",
            // Soft bottom fade into next section
            "linear-gradient(to bottom, rgba(5,6,8,0.25) 0%, transparent 30%, transparent 60%, rgba(5,6,8,0.97) 100%)",
          ].join(", "),
        }}
        aria-hidden="true"
      />

      {/* ── DOM text — floats above the 3D scene ─────────────────────────── */}
      <div
        className="relative flex items-center"
        style={{
          zIndex: 2,
          minHeight: "100svh",
          paddingTop:    "clamp(96px, 13vh, 148px)",
          paddingBottom: "clamp(64px, 9vh, 112px)",
        }}
      >
        <div
          className="w-full mx-auto px-6 sm:px-10 lg:px-16"
          style={{ maxWidth: "780px" }}
        >
          <HeroText
            onBookCall={onOpenRfq}
            onViewWork={onExploreServices}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
