"use client";

import React from "react";
import { HeroText } from "./HeroText";
import { NodeGraph } from "./NodeGraph";

interface HeroProps {
  onOpenRfq: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRfq, onExploreServices }) => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        // Account for fixed navbar (~64px) + generous vertical breathing room
        minHeight: "calc(100svh - 0px)",
        paddingTop: "clamp(100px, 12vh, 140px)",
        paddingBottom: "clamp(64px, 8vh, 96px)",
        backgroundColor: "var(--bg-primary)",
      }}
      aria-label="Hero — ByteBrothers"
    >
      {/* Subtle ambient radial glow behind the node graph */}
      <div
        className="pointer-events-none absolute right-0 top-0 w-[55%] h-full"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 75% 40%, rgba(0,229,255,0.055) 0%, rgba(139,92,246,0.035) 50%, transparent 80%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* ── Content grid ─────────────────────────────────────────────────── */}
      <div
        className="relative mx-auto grid items-center gap-8 lg:gap-0 px-6 sm:px-10 lg:px-16"
        style={{
          maxWidth: "1200px",
          gridTemplateColumns: "1fr",  // mobile: stacked
          zIndex: 1,
        }}
      >
        {/*
          Two-column on ≥lg: left 55% text, right 45% graph.
          We use a manual flex split rather than CSS grid columns so the
          graph can be absolutely sized without affecting text reflow.
        */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0 w-full">

          {/* ── Left column — text ───────────────────────────────────────── */}
          <div
            className="w-full lg:pr-12"
            style={{ flex: "0 0 55%" }}
          >
            <HeroText
              onBookCall={onOpenRfq}
              onViewWork={onExploreServices}
            />
          </div>

          {/* ── Right column — node graph ─────────────────────────────────── */}
          <div
            className="w-full relative"
            style={{
              flex: "0 0 45%",
              // Height: scale with viewport, tall enough to let the graph breathe
              height: "clamp(320px, 45vw, 560px)",
            }}
            aria-hidden="true"
          >
            {/* Faint border/card treatment so the graph region reads as distinct */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                border: "1px solid rgba(0,229,255,0.07)",
                background: "rgba(0,229,255,0.015)",
              }}
            />
            <NodeGraph className="absolute inset-0 rounded-2xl" />
          </div>

        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: "80px",
          background: "linear-gradient(to bottom, transparent, var(--bg-primary))",
          zIndex: 2,
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default Hero;
