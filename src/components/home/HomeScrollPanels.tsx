"use client";

import React from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { FOUNDERS, TECHNICAL_TENETS, PROJECTS } from "../../data/studioData";
import { NUM_BAYS } from "./HomeCorridor";

// ── Design tokens (white bg, dark text, blue accents) ────────────────────────
const C = {
  blue:    "#2f7bff",
  blueBr:  "#5ea1ff",
  blueD:   "#1a4fa8",
  black:   "#0a0e17",
  dark:    "#0d1117",
  mid:     "#1e2432",
  muted:   "#3a4557",
  white:   "#ffffff",
  offW:    "#f8fafc",
  card:    "rgba(255,255,255,0.92)",
  border:  "rgba(47,123,255,0.18)",
};

// ── Shared card style ─────────────────────────────────────────────────────────
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: "14px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 4px 24px rgba(47,123,255,0.08), 0 1px 4px rgba(0,0,0,0.06)",
  ...extra,
});

// ── Tag pill ──────────────────────────────────────────────────────────────────
const TagPill: React.FC<{ label: string }> = ({ label }) => (
  <span style={{
    padding: "2px 8px", borderRadius: "6px", fontSize: "10px",
    fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase",
    letterSpacing: "0.06em", background: "rgba(47,123,255,0.08)",
    border: `1px solid rgba(47,123,255,0.22)`, color: C.blueD,
  }}>{label}</span>
);

// ─── Panel definitions ────────────────────────────────────────────────────────
type PanelDef = {
  id: string;
  label: string;
  render: (p: { onContact: () => void; onWork: () => void }) => React.ReactNode;
};

const PANELS: PanelDef[] = [

  // ── Bay 0: Hero ────────────────────────────────────────────────────────────
  {
    id: "hero", label: "›_ systems, engineered.",
    render: ({ onContact, onWork }) => (
      <div style={{ maxWidth: 580 }}>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.blue, marginBottom: 20 }}>
          ›_ systems, engineered.
        </p>
        <h1 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
          fontSize: "clamp(2.4rem,5.5vw,4.5rem)", lineHeight: 1.02,
          letterSpacing: "-0.03em", color: C.black, marginBottom: 20 }}>
          WE BUILD THE{" "}
          <span style={{ color: C.blue }}>INFRASTRUCTURE</span>
          {" "}BEHIND{" "}
          <span style={{ color: C.blueD }}>AI-NATIVE</span>
          {" "}PRODUCTS
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: C.mid, maxWidth: 460, marginBottom: 32 }}>
          Custom WebGL, full-stack systems, and AI platforms engineered for scale —
          by two founders, zero account managers.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={onContact} style={{
            padding: "13px 28px", borderRadius: 12, fontFamily: "Space Grotesk,sans-serif",
            fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none",
            background: `linear-gradient(135deg,${C.blue},${C.blueBr})`, color: "#fff",
            boxShadow: `0 4px 20px rgba(47,123,255,0.35)`,
          }}>Book Discovery Call →</button>
          <button onClick={onWork} style={{
            padding: "13px 24px", borderRadius: 12, fontFamily: "Space Grotesk,sans-serif",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            background: "rgba(255,255,255,0.85)", color: C.dark,
            border: `1px solid rgba(47,123,255,0.25)`,
          }}>View Systems Built ↓</button>
        </div>
      </div>
    ),
  },

  // ── Bay 1: Tenets ──────────────────────────────────────────────────────────
  {
    id: "tenets", label: "Core philosophy",
    render: () => (
      <div style={{ maxWidth: 620 }}>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
          letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 8 }}>
          // CORE PHILOSOPHY
        </p>
        <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3.2rem)",
          letterSpacing: "-0.025em", color: C.black, marginBottom: 24 }}>
          Our Engineering Tenets
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TECHNICAL_TENETS.map((t) => (
            <div key={t.number} style={{ ...card({ padding: "18px 20px" }) }}>
              <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 22,
                fontWeight: 800, color: C.blue, marginBottom: 6 }}>{t.number}</div>
              <div style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 700,
                fontSize: 14, color: C.black, marginBottom: 6 }}>{t.title}</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: C.mid, margin: 0 }}>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── Bays 2-4: Case studies ─────────────────────────────────────────────────
  ...PROJECTS.slice(0, 3).map((proj, i) => ({
    id: proj.id,
    label: `Selected work — 0${i + 1}`,
    render: () => (
      <div style={{ maxWidth: 580 }}>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
          letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 8 }}>
          SELECTED WORK — {String(i + 1).padStart(2, "0")} · {proj.type} · {proj.year}
        </p>
        {/* Project image from CDN */}
        <div style={{
          width: "100%", height: 180, borderRadius: 14, overflow: "hidden",
          marginBottom: 16, border: `1px solid ${C.border}`,
          boxShadow: "0 2px 16px rgba(47,123,255,0.10)",
        }}>
          <img src={proj.image} alt={proj.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
          fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.025em",
          color: C.black, marginBottom: 10 }}>{proj.title}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: C.mid, maxWidth: "44ch", marginBottom: 14 }}>
          {proj.description}
        </p>
        {proj.metrics && (
          <div style={{ ...card({ display: "inline-flex", alignItems: "center", padding: "6px 14px",
            marginBottom: 12, fontSize: 12, fontFamily: "JetBrains Mono,monospace", color: C.blueD }) }}>
            📈 {proj.metrics}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {proj.tags.slice(0, 4).map(tag => <TagPill key={tag} label={tag} />)}
        </div>
      </div>
    ),
  })) as PanelDef[],

  // ── Bay 5: Founders ────────────────────────────────────────────────────────
  {
    id: "founders", label: "The architects",
    render: () => (
      <div style={{ maxWidth: 620 }}>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
          letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 8 }}>
          // THE ARCHITECTS
        </p>
        <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
          fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.025em",
          color: C.black, marginBottom: 20 }}>
          Meet the Founders
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {FOUNDERS.map((f) => (
            <div key={f.id} style={card({ padding: "18px 20px" })}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <img src={f.avatar} alt={f.name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
                    border: `2px solid ${C.border}` }} />
                <div>
                  <div style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 700,
                    fontSize: 15, color: C.black }}>{f.name}</div>
                  <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9,
                    letterSpacing: "0.15em", textTransform: "uppercase", color: C.blue }}>{f.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: C.mid, marginBottom: 12 }}>{f.bio}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {f.specialties.slice(0, 3).map(s => <TagPill key={s} label={s} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── Bay 6: CTA ─────────────────────────────────────────────────────────────
  {
    id: "cta", label: "Start a project",
    render: ({ onContact }) => (
      <div style={{ maxWidth: 560 }}>
        <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
          letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 8 }}>
          // READY TO BUILD?
        </p>
        <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
          fontSize: "clamp(2rem,4vw,3.4rem)", letterSpacing: "-0.025em",
          color: C.black, marginBottom: 16 }}>
          Let's build the<br />next system.
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: C.mid, maxWidth: "38ch", marginBottom: 28 }}>
          Open for freelance and studio collaborations. Direct access to the founders.
          No account managers, no junior handoffs.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <button onClick={onContact} style={{
            padding: "15px 32px", borderRadius: 12, fontFamily: "Space Grotesk,sans-serif",
            fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none",
            background: `linear-gradient(135deg,${C.blue},${C.blueBr})`, color: "#fff",
            boxShadow: `0 6px 28px rgba(47,123,255,0.38)`,
          }}>Book Discovery Call →</button>
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11,
            color: C.muted, margin: 0 }}>studio@bytebrothers.dev</p>
        </div>
      </div>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface HomeScrollPanelsProps { onContact: () => void; onWork: () => void; }

export const HomeScrollPanels: React.FC<HomeScrollPanelsProps> = ({ onContact, onWork }) => {
  const scrollProgress = useScrollProgress();
  const band = 1 / NUM_BAYS;

  const opacities = PANELS.map((_, i) => {
    const centre = band * i + band / 2;
    // For Bay 0: at scroll=0 we want full opacity, so clamp the effective scroll
    // position to never be "before" Bay 0's visible window.
    // For the last bay: same treatment at scroll=1.
    const effectiveProgress = i === 0
      ? Math.max(scrollProgress, centre)
      : i === PANELS.length - 1
        ? Math.min(scrollProgress, centre)
        : scrollProgress;
    const dist = Math.abs(effectiveProgress - centre);
    return Math.max(0, 1 - dist / (band * 0.55));
  });

  const activeBay = opacities.reduce((best, op, i) => op > opacities[best] ? i : best, 0);

  return (
    <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
      {/* Scroll track */}
      <div id="scroll-track" style={{ height: `${NUM_BAYS * 120}vh` }} />

      {/* Fixed panels */}
      {PANELS.map((panel, i) => (
        <div key={panel.id} style={{
          position: "fixed", inset: 0,
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingLeft: "8vw", paddingRight: "8vw",
          opacity: opacities[i], zIndex: 2, pointerEvents: "none",
        }}>
          <div style={{ pointerEvents: "auto" }}>
            {panel.render({ onContact, onWork })}
          </div>
        </div>
      ))}

      {/* HUD — bottom left */}
      <div style={{
        position: "fixed", bottom: "2rem", left: "8vw", zIndex: 3,
        display: "flex", alignItems: "center", gap: 14,
        fontFamily: "JetBrains Mono,monospace", fontSize: 11,
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: C.mid, pointerEvents: "none",
      }}>
        <span style={{ color: C.blue, fontWeight: 700 }}>
          {String(activeBay + 1).padStart(2, "0")}
        </span>
        <span style={{ color: C.muted }}>/ {String(NUM_BAYS).padStart(2, "0")}</span>
        <div style={{ width: 100, height: 1, background: "rgba(47,123,255,0.15)", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${scrollProgress * 100}%`, background: C.blue,
            transition: "width 0.1s linear",
          }} />
        </div>
        <span style={{ color: C.muted, fontSize: 10 }}>{PANELS[activeBay]?.label}</span>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "fixed", top: "5.5rem", right: "8vw", zIndex: 3,
        fontFamily: "JetBrains Mono,monospace", fontSize: 11,
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: C.mid, pointerEvents: "none",
        opacity: scrollProgress < 0.03 ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}>
        Scroll to walk in ↓
      </div>
    </div>
  );
};

export default HomeScrollPanels;
