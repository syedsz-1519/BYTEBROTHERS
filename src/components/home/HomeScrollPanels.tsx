"use client";

// ─── HomeScrollPanels.tsx ─────────────────────────────────────────────────────
// Fixed DOM overlay panels driven by scrollProgress.
// Each bay maps to a 1/N scroll band — panel fades in at band centre.
// No R3F Html portals — pure DOM above the WebGL canvas.

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { FOUNDERS, TECHNICAL_TENETS, PROJECTS } from "../../data/studioData";
import { NUM_BAYS } from "./HomeCorridor";

// ─── Panel content definitions (7 bays) ──────────────────────────────────────
// Each panel renders real semantic DOM — <h2>, <p>, lists etc.

type PanelDef = {
  id: string;
  label: string;
  render: (props: { onContact: () => void; onWork: () => void }) => React.ReactNode;
};

const PANELS: PanelDef[] = [
  // Bay 0 — Hero headline
  {
    id: "hero",
    label: "›_ systems, engineered.",
    render: ({ onContact, onWork }) => (
      <div className="space-y-6 max-w-[560px]">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase" style={{ color: "#2f7bff" }}>
          ›_ systems, engineered.
        </p>
        <h1
          className="font-display font-bold leading-[1.03]"
          style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", color: "#f5f7fa", letterSpacing: "-0.025em" }}
        >
          WE BUILD THE{" "}
          <span style={{ color: "#2f7bff" }}>INFRASTRUCTURE</span>{" "}
          BEHIND AI-NATIVE PRODUCTS
        </h1>
        <p style={{ fontSize: "17px", color: "#8b93a1", lineHeight: 1.65, maxWidth: "460px" }}>
          Custom WebGL, full-stack systems, and AI platforms engineered for scale.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={onContact}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-semibold transition-all active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg,#2f7bff 0%,#5ea1ff 100%)",
              color: "#f5f7fa",
              boxShadow: "0 0 24px rgba(47,123,255,0.30)",
            }}
          >
            Book Discovery Call →
          </button>
          <button
            onClick={onWork}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-medium transition-all active:scale-[0.97]"
            style={{
              color: "#f5f7fa",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(5,6,8,0.55)",
              backdropFilter: "blur(8px)",
            }}
          >
            View Systems Built →
          </button>
        </div>
      </div>
    ),
  },

  // Bay 1 — Four tenets
  {
    id: "tenets",
    label: "Core philosophy",
    render: () => (
      <div className="space-y-6 max-w-[600px]">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "#2f7bff" }}>
            // CORE PHILOSOPHY
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl" style={{ color: "#f5f7fa", letterSpacing: "-0.02em" }}>
            Our Architectural Tenets
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {TECHNICAL_TENETS.map((t) => (
            <div
              key={t.number}
              className="p-4 rounded-xl space-y-1.5"
              style={{ background: "rgba(5,6,8,0.75)", border: "1px solid rgba(47,123,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              <div className="font-mono text-lg font-bold" style={{ color: "#2f7bff" }}>{t.number}</div>
              <div className="font-display font-semibold text-sm" style={{ color: "#f5f7fa" }}>{t.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: "#8b93a1" }}>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Bays 2-4 — Three case studies (first 3 projects)
  ...PROJECTS.slice(0, 3).map((proj, i) => ({
    id: proj.id,
    label: `Selected work — 0${i + 1}`,
    render: () => (
      <div className="space-y-5 max-w-[540px]">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "#2f7bff" }}>
            Selected Work — {String(i + 1).padStart(2, "0")} &nbsp;·&nbsp; {proj.type} · {proj.year}
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl" style={{ color: "#f5f7fa", letterSpacing: "-0.02em" }}>
            {proj.title}
          </h2>
        </div>
        <p className="text-base md:text-lg leading-relaxed" style={{ color: "#8b93a1", maxWidth: "44ch" }}>
          {proj.description}
        </p>
        {proj.metrics && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
            style={{ background: "rgba(47,123,255,0.06)", border: "1px solid rgba(47,123,255,0.18)", color: "#2f7bff" }}
          >
            {proj.metrics}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {proj.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wide"
              style={{ background: "rgba(47,123,255,0.08)", border: "1px solid rgba(47,123,255,0.20)", color: "#5ea1ff" }}
            >
              {tag}
            </span>
          ))}
        </div>
        {proj.details && (
          <div className="space-y-2 pt-1">
            <p className="text-xs" style={{ color: "#8b93a1" }}>
              <span style={{ color: "#f5f7fa", fontWeight: 600 }}>Challenge: </span>
              {proj.details.challenge}
            </p>
            <p className="text-xs" style={{ color: "#8b93a1" }}>
              <span style={{ color: "#f5f7fa", fontWeight: 600 }}>Solution: </span>
              {proj.details.solution}
            </p>
          </div>
        )}
      </div>
    ),
  })) as PanelDef[],

  // Bay 5 — Founders
  {
    id: "founders",
    label: "The architects",
    render: () => (
      <div className="space-y-6 max-w-[600px]">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "#2f7bff" }}>
            // THE ARCHITECTS
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl" style={{ color: "#f5f7fa", letterSpacing: "-0.02em" }}>
            Meet the Founders
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FOUNDERS.map((f) => (
            <div
              key={f.id}
              className="p-5 rounded-xl space-y-3"
              style={{ background: "rgba(5,6,8,0.75)", border: "1px solid rgba(0,229,255,0.10)", backdropFilter: "blur(8px)" }}
            >
              <div>
                <div className="font-display font-bold text-base" style={{ color: "#f5f7fa" }}>{f.name}</div>
                <div className="font-mono text-[10px] tracking-wider uppercase mt-0.5" style={{ color: "#2f7bff" }}>{f.role}</div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#8b93a1" }}>{f.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.specialties.slice(0, 3).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded font-mono text-[9px] uppercase"
                    style={{ background: "rgba(47,123,255,0.08)", border: "1px solid rgba(47,123,255,0.18)", color: "#5ea1ff" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Bay 6 — CTA
  {
    id: "cta",
    label: "Start a project",
    render: ({ onContact }) => (
      <div className="space-y-6 max-w-[520px]">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "#2f7bff" }}>
            // READY TO BUILD?
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl" style={{ color: "#f5f7fa", letterSpacing: "-0.02em" }}>
            Let's build the<br />next system.
          </h2>
        </div>
        <p className="text-base md:text-lg leading-relaxed" style={{ color: "#8b93a1", maxWidth: "40ch" }}>
          Open for freelance and studio collaborations. Book a direct discovery call — no account managers, no junior handoffs.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onContact}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-display text-[15px] font-semibold transition-all active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg,#2f7bff 0%,#5ea1ff 100%)",
              color: "#f5f7fa",
              boxShadow: "0 0 28px rgba(47,123,255,0.35)",
            }}
          >
            Book Discovery Call →
          </button>
        </div>
        <p className="font-mono text-[11px] tracking-wider" style={{ color: "#8b93a1" }}>
          studio@bytebrothers.dev
        </p>
      </div>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface HomeScrollPanelsProps {
  onContact: () => void;
  onWork:    () => void;
}

export const HomeScrollPanels: React.FC<HomeScrollPanelsProps> = ({ onContact, onWork }) => {
  const scrollProgress = useScrollProgress();
  const band = 1 / NUM_BAYS;

  // Compute per-panel opacity from scroll band
  const opacities = PANELS.map((_, i) => {
    const centre = band * i + band / 2;
    const dist   = Math.abs(scrollProgress - centre);
    return Math.max(0, 1 - dist / (band * 0.62));
  });

  // HUD counter: which bay is most visible
  const activeBay = opacities.reduce((best, op, i) => op > opacities[best] ? i : best, 0);

  return (
    <div className="relative pointer-events-none" style={{ zIndex: 2 }}>
      {/* Scroll track — its height defines total scroll range */}
      <div id="scroll-track" style={{ height: `${NUM_BAYS * 120}vh` }} />

      {/* Fixed panels */}
      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          className="fixed inset-0 flex flex-col justify-center pointer-events-none"
          style={{ opacity: opacities[i], paddingLeft: "8vw", paddingRight: "8vw", zIndex: 2 }}
        >
          <div className="pointer-events-auto">
            {panel.render({ onContact, onWork })}
          </div>
        </div>
      ))}

      {/* HUD bottom-left */}
      <div
        className="fixed flex items-center gap-3.5 font-mono text-xs tracking-wider uppercase pointer-events-none"
        style={{ bottom: "2.4rem", left: "8vw", zIndex: 3, color: "#8b93a1" }}
      >
        <span>{String(activeBay + 1).padStart(2, "0")} / {String(NUM_BAYS).padStart(2, "0")}</span>
        <div className="relative overflow-hidden" style={{ width: 120, height: 1, background: "rgba(244,244,245,0.12)" }}>
          <div
            className="absolute left-0 top-0 h-full transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%`, background: "#2f7bff" }}
          />
        </div>
        <span style={{ color: "#4a4a52" }}>{PANELS[activeBay]?.label}</span>
      </div>

      {/* Scroll cue — fades out after first 3% scroll */}
      <div
        className="fixed font-mono text-xs tracking-wider uppercase pointer-events-none transition-opacity duration-400"
        style={{
          top: "2.4rem", right: "8vw", zIndex: 3,
          color: "#8b93a1",
          opacity: scrollProgress < 0.03 ? 1 : 0,
        }}
      >
        Scroll to walk in ↓
      </div>
    </div>
  );
};

export default HomeScrollPanels;
