"use client";

import React, { useState } from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { FOUNDERS, TECHNICAL_TENETS, PROJECTS } from "../../data/studioData";

const mono = "'JetBrains Mono', monospace";
const sans = "'Space Grotesk', sans-serif";

const INK   = "#f8fafc";
const MID   = "#cbd5e1";
const MUTED = "#64748b";
const AMBER = "#f59e0b";
const BLUE  = "#3b82f6";
const CYAN  = "#06b6d4";

const TagPill: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <span
    style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 6,
      fontFamily: mono,
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      border: `1px solid ${active ? AMBER : "rgba(245, 158, 11, 0.3)"}`,
      color: active ? "#ffffff" : AMBER,
      background: active ? AMBER : "rgba(245, 158, 11, 0.08)",
      boxShadow: active ? "0 0 12px rgba(245, 158, 11, 0.4)" : "none",
      transition: "all 0.2s ease",
    }}
  >
    {label}
  </span>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    style={{
      fontFamily: mono,
      fontSize: 11,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: AMBER,
      margin: "0 0 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <span style={{ display: "inline-block", width: 24, height: 1.5, background: AMBER }} />
    {children}
  </p>
);

const Rule: React.FC = () => (
  <div style={{ width: "100%", height: 1, background: "rgba(255, 255, 255, 0.12)", margin: "20px 0" }} />
);

// ─── Interactive 3D Project Carousel Component inside Zone 2 ─────────────────

function ProjectCarousel3D() {
  const [activeProjIndex, setActiveProjIndex] = useState(0);
  const project = PROJECTS[activeProjIndex] ?? PROJECTS[0];

  return (
    <div style={{ marginTop: 12 }}>
      {/* Cards carousel selector tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {PROJECTS.slice(0, 4).map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setActiveProjIndex(idx)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${activeProjIndex === idx ? AMBER : "rgba(255,255,255,0.15)"}`,
              background: activeProjIndex === idx ? "rgba(245, 158, 11, 0.18)" : "rgba(15, 23, 42, 0.6)",
              color: activeProjIndex === idx ? "#ffffff" : MID,
              fontFamily: sans,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            0{idx + 1}. {p.title}
          </button>
        ))}
      </div>

      {/* Main active project showcase card */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(16px)",
          border: `1px solid rgba(245, 158, 11, 0.3)`,
          borderRadius: 16,
          padding: "24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.15)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontFamily: mono, fontSize: 11, color: AMBER, marginBottom: 8 }}>
            FEATURED CASE STUDY · {project.year}
          </div>
          <h3 style={{ fontFamily: sans, fontSize: 24, fontWeight: 800, color: INK, margin: "0 0 12px" }}>
            {project.title}
          </h3>
          <p style={{ fontFamily: sans, fontSize: 13, lineHeight: 1.6, color: MID, margin: "0 0 16px" }}>
            {project.description}
          </p>

          {project.metrics && (
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 6,
                background: "rgba(6, 182, 212, 0.12)",
                border: "1px solid rgba(6, 182, 212, 0.4)",
                color: CYAN,
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              ⚡ {project.metrics}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tags.slice(0, 4).map((t) => (
              <TagPill key={t} label={t} />
            ))}
          </div>
        </div>

        {/* Project Thumbnail Image */}
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
          <img
            src={project.image}
            alt={project.title}
            style={{ width: "100%", height: 210, objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 50%, rgba(15,23,42,0.9) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── 4 Scroll Panels Definition ───────────────────────────────────────────────

type PanelDef = {
  id: string;
  label: string;
  render: (p: { onContact: () => void; onWork: () => void }) => React.ReactNode;
};

const PANELS: PanelDef[] = [
  // Zone 1 — Hero Entrance
  {
    id: "hero",
    label: "Main Entrance",
    render: ({ onContact, onWork }) => (
      <div>
        <Eyebrow>›_ BYTEBROTHERS TECH STUDIO</Eyebrow>
        <h1
          style={{
            fontFamily: sans,
            fontWeight: 900,
            color: INK,
            fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            margin: "0 0 24px",
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          }}
        >
          WE BUILD THE<br />
          <span style={{ color: AMBER, textShadow: "0 0 20px rgba(245,158,11,0.5)" }}>INFRASTRUCTURE</span><br />
          BEHIND <span style={{ color: BLUE }}>AI-NATIVE</span> PRODUCTS
        </h1>
        <Rule />
        <p style={{ fontFamily: sans, fontSize: 16, lineHeight: 1.7, color: MID, maxWidth: 440, margin: "0 0 32px" }}>
          Custom WebGL engines, distributed full-stack systems, and AI platforms engineered for speed —
          by two founders, zero account managers.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button
            onClick={onContact}
            style={{
              padding: "14px 30px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: sans,
              fontSize: 14,
              fontWeight: 800,
              color: "#000000",
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              boxShadow: "0 4px 24px rgba(245,158,11,0.45)",
              transition: "transform 0.15s, boxShadow 0.15s",
            }}
          >
            Book Discovery Call →
          </button>
          <button
            onClick={onWork}
            style={{
              padding: "14px 26px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: sans,
              fontSize: 14,
              fontWeight: 700,
              color: INK,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              transition: "border-color 0.15s",
            }}
          >
            Explore Interactive Room ↓
          </button>
        </div>
      </div>
    ),
  },

  // Zone 2 — Project Carousel Showcase
  {
    id: "projects",
    label: "Project Showcase",
    render: () => (
      <div>
        <Eyebrow>02 — PORTFOLIO & TECH STACK</Eyebrow>
        <h2 style={{ fontFamily: sans, fontWeight: 900, fontSize: "clamp(2rem, 3.8vw, 3.2rem)", color: INK, margin: "0 0 8px" }}>
          ENGINEERED <span style={{ color: AMBER }}>SYSTEMS</span>
        </h2>
        <p style={{ fontFamily: sans, fontSize: 14, color: MID, margin: "0 0 16px" }}>
          Interactive floating portfolio cards cycling production platforms built for global clients.
        </p>
        <ProjectCarousel3D />
      </div>
    ),
  },

  // Zone 3 — Founders Wall & Tenets
  {
    id: "founders",
    label: "Founders & Tenets",
    render: () => (
      <div>
        <Eyebrow>03 — THE FOUNDERS & ARCHITECTURE</Eyebrow>
        <h2 style={{ fontFamily: sans, fontWeight: 900, fontSize: "clamp(2rem, 3.8vw, 3.2rem)", color: INK, margin: "0 0 24px" }}>
          MEET THE <span style={{ color: AMBER }}>FOUNDERS</span>
        </h2>

        {/* Founders Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {FOUNDERS.map((f) => (
            <div
              key={f.id}
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                borderRadius: 14,
                padding: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <img
                  src={f.avatar}
                  alt={f.name}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${AMBER}` }}
                />
                <div>
                  <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 16, color: INK }}>{f.name}</div>
                  <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: AMBER, marginTop: 2 }}>
                    {f.role}
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: sans, fontSize: 12, lineHeight: 1.6, color: MID, margin: "0 0 12px" }}>{f.bio}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {f.specialties.slice(0, 3).map((s) => (
                  <TagPill key={s} label={s} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core Tenets Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {TECHNICAL_TENETS.map((t) => (
            <div
              key={t.number}
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "12px",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: AMBER }}>{t.number}</div>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 12, color: INK, margin: "4px 0" }}>{t.title}</div>
              <p style={{ fontFamily: sans, fontSize: 10, lineHeight: 1.4, color: MUTED, margin: 0 }}>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Zone 4 — Client Testimonials & Final CTA
  {
    id: "cta",
    label: "Client Testimonials & Contact",
    render: ({ onContact }) => (
      <div>
        <Eyebrow>04 — READY TO BUILD?</Eyebrow>
        <h2 style={{ fontFamily: sans, fontWeight: 900, fontSize: "clamp(2.4rem, 4.5vw, 4rem)", color: INK, margin: "0 0 16px" }}>
          LET'S BUILD <span style={{ color: AMBER }}>THE NEXT</span> SYSTEM.
        </h2>
        <Rule />
        <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.7, color: MID, maxWidth: "42ch", margin: "0 0 28px" }}>
          Direct access to the founders — no account managers, no junior handoffs. High-performance software delivered on schedule.
        </p>

        {/* Availability Specs Table */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            borderRadius: 14,
            padding: "20px",
            marginBottom: 28,
            maxWidth: 420,
          }}
        >
          {[
            ["AVAILABILITY", "Q3 / Q4 2026 ACTIVE"],
            ["RESPONSE TIME", "< 2 HOURS"],
            ["FOUNDERS", "SYED & HAMID KAMAL"],
            ["DELIVERY", "WEEKLY SPRINT DEMOS"],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 10, color: MUTED, letterSpacing: "0.1em" }}>{label}</span>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 12, color: AMBER, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                {val}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onContact}
          style={{
            padding: "16px 36px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontFamily: sans,
            fontSize: 16,
            fontWeight: 800,
            color: "#000000",
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            boxShadow: "0 6px 32px rgba(245,158,11,0.5)",
            transition: "transform 0.15s",
          }}
        >
          Book Discovery Call →
        </button>
      </div>
    ),
  },
];

interface HomeScrollPanelsProps {
  onContact: () => void;
  onWork: () => void;
}

export const HomeScrollPanels: React.FC<HomeScrollPanelsProps> = ({ onContact, onWork }) => {
  const scrollProgress = useScrollProgress();
  const TOTAL_PANELS = PANELS.length; // 4
  const band = 1 / TOTAL_PANELS;

  const opacities = PANELS.map((_, i) => {
    const centre = band * i + band / 2;
    const eff = i === 0
      ? Math.max(scrollProgress, centre)
      : i === PANELS.length - 1
        ? Math.min(scrollProgress, centre)
        : scrollProgress;
    const dist = Math.abs(eff - centre);
    return Math.max(0, 1 - dist / (band * 0.52));
  });

  const activePanelIndex = opacities.reduce((best, op, i) => (op > opacities[best] ? i : best), 0);

  return (
    <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
      {/* Scroll track length: 550vh for smooth navigation inside room */}
      <div id="scroll-track" style={{ height: "550vh" }} />

      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            paddingLeft: "clamp(40px, 7vw, 100px)",
            paddingRight: "clamp(40px, 7vw, 100px)",
            paddingTop: "60px",
            opacity: opacities[i],
            zIndex: 2,
            pointerEvents: "none",
            transition: "opacity 0.25s ease",
          }}
        >
          <div style={{ pointerEvents: "auto", width: "100%", maxWidth: i === 1 || i === 2 ? 880 : 640 }}>
            {panel.render({ onContact, onWork })}
          </div>
        </div>
      ))}

      {/* Room HUD Bar */}
      <div
        style={{
          position: "fixed",
          bottom: "1.8rem",
          left: "clamp(40px, 7vw, 100px)",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: MUTED,
          pointerEvents: "none",
        }}
      >
        <span style={{ color: AMBER, fontWeight: 800 }}>ZONE 0{activePanelIndex + 1}</span>
        <span>/ 0{TOTAL_PANELS}</span>
        <div style={{ width: 100, height: 2, background: "rgba(255,255,255,0.15)", position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${scrollProgress * 100}%`,
              background: AMBER,
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <span style={{ fontSize: 10, color: MID }}>{PANELS[activePanelIndex]?.label}</span>
      </div>

      {/* Scroll indicator prompt */}
      <div
        style={{
          position: "fixed",
          top: "5.5rem",
          right: "clamp(32px, 6vw, 80px)",
          zIndex: 3,
          fontFamily: mono,
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: AMBER,
          pointerEvents: "none",
          opacity: scrollProgress < 0.03 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        Scroll to enter office ↓
      </div>
    </div>
  );
};

export default HomeScrollPanels;
