"use client";

import React, { useState, useEffect } from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { FOUNDERS, TECHNICAL_TENETS, PROJECTS, Project } from "../../data/studioData";

const mono = "'JetBrains Mono', monospace";
const sans = "'Space Grotesk', sans-serif";

const AMBER       = "#f59e0b";
const AMBER_BRIGHT = "#fbbf24";
const BLUE        = "#3b82f6";
const CYAN        = "#38bdf8";
const WHITE       = "#ffffff";
const MUTED       = "#94a3b8";

// ── Floating Spatial Air Style Keyframes ──────────────────────────────────────
const SPATIAL_STYLES = `
@keyframes airFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-7px); }
}

@keyframes textGlowPulse {
  0%, 100% { text-shadow: 0 0 16px rgba(245, 158, 11, 0.7), 0 0 32px rgba(245, 158, 11, 0.3), 0 3px 6px rgba(0,0,0,0.95); }
  50% { text-shadow: 0 0 28px rgba(245, 158, 11, 0.95), 0 0 50px rgba(56, 189, 248, 0.5), 0 3px 6px rgba(0,0,0,0.95); }
}

@keyframes cyanGlowPulse {
  0%, 100% { text-shadow: 0 0 16px rgba(56, 189, 248, 0.7), 0 2px 8px rgba(0,0,0,0.95); }
  50% { text-shadow: 0 0 30px rgba(56, 189, 248, 0.95), 0 0 55px rgba(59, 130, 246, 0.6), 0 2px 8px rgba(0,0,0,0.95); }
}

@keyframes carouselSlideIn {
  from { opacity: 0; transform: scale(0.97) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes pulseBeacon {
  0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  50% { transform: scale(1.15); opacity: 0.85; box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
}
`;

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
      border: `1px solid ${active ? AMBER : "rgba(245, 158, 11, 0.35)"}`,
      color: active ? WHITE : AMBER_BRIGHT,
      background: active ? AMBER : "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(6px)",
      boxShadow: active ? "0 0 16px rgba(245, 158, 11, 0.4)" : "0 2px 6px rgba(0,0,0,0.4)",
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
      color: AMBER_BRIGHT,
      margin: "0 0 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      textShadow: "0 0 12px rgba(245, 158, 11, 0.7), 0 2px 8px rgba(0,0,0,0.9)",
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#22c55e",
        animation: "pulseBeacon 2s infinite ease-in-out",
      }}
    />
    <span style={{ display: "inline-block", width: 24, height: 1.5, background: AMBER_BRIGHT, boxShadow: "0 0 8px #f59e0b" }} />
    {children}
  </p>
);

const Rule: React.FC = () => (
  <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, rgba(245, 158, 11, 0.4), rgba(56, 189, 248, 0.2), transparent)", margin: "20px 0" }} />
);

// ─── Floating Text & Image Air Carousel Component ──────────────────────────────

function ProjectAirCarousel() {
  const [activeProjIndex, setActiveProjIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const project: Project = PROJECTS[activeProjIndex] ?? PROJECTS[0];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveProjIndex((prev) => (prev + 1) % PROJECTS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setActiveProjIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setActiveProjIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  return (
    <div style={{ marginTop: 8, animation: "airFloat 5s ease-in-out infinite" }}>
      {/* Air Carousel Navigation Controls Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        {/* Project Selector Tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {PROJECTS.slice(0, 6).map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveProjIndex(idx);
                setIsAutoPlaying(false);
              }}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: `1px solid ${activeProjIndex === idx ? AMBER : "rgba(255, 255, 255, 0.15)"}`,
                background: activeProjIndex === idx ? "rgba(245, 158, 11, 0.25)" : "rgba(15, 23, 42, 0.55)",
                backdropFilter: "blur(10px)",
                color: activeProjIndex === idx ? AMBER_BRIGHT : WHITE,
                fontFamily: sans,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                boxShadow: activeProjIndex === idx ? "0 0 18px rgba(245, 158, 11, 0.4)" : "0 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              0{idx + 1}. {p.title}
            </button>
          ))}
        </div>

        {/* Prev / Next & Autoplay Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => {
              setIsAutoPlaying(!isAutoPlaying);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: isAutoPlaying ? "rgba(34, 197, 94, 0.15)" : "rgba(15, 23, 42, 0.6)",
              color: isAutoPlaying ? "#4ade80" : MUTED,
              fontFamily: mono,
              fontSize: 10,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            {isAutoPlaying ? "AUTOPLAY ON" : "PAUSED"}
          </button>
          <button
            onClick={() => {
              handlePrev();
              setIsAutoPlaying(false);
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(8px)",
              color: WHITE,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(0,0,0,0.6)",
              transition: "transform 0.15s, borderColor 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = AMBER;
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245, 158, 11, 0.4)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            ‹
          </button>
          <button
            onClick={() => {
              handleNext();
              setIsAutoPlaying(false);
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(8px)",
              color: WHITE,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(0,0,0,0.6)",
              transition: "transform 0.15s, borderColor 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = AMBER;
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245, 158, 11, 0.4)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Main Active Spatial Hologram Air Card */}
      <div
        key={project.id}
        style={{
          background: "rgba(10, 14, 23, 0.65)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: `1px solid rgba(245, 158, 11, 0.45)`,
          borderRadius: 20,
          padding: "24px 28px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 0 35px rgba(245, 158, 11, 0.15)",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 28,
          alignItems: "center",
          animation: "carouselSlideIn 0.4s ease-out",
        }}
      >
        {/* Left Info Column */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: mono,
              fontSize: 11,
              color: AMBER_BRIGHT,
              marginBottom: 8,
              textShadow: "0 0 10px rgba(245, 158, 11, 0.6)",
            }}
          >
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 4,
                background: "rgba(245, 158, 11, 0.2)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
              }}
            >
              {project.category}
            </span>
            <span>· {project.year}</span>
          </div>

          <h3
            style={{
              fontFamily: sans,
              fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
              fontWeight: 900,
              color: WHITE,
              margin: "0 0 12px",
              lineHeight: 1.15,
              textShadow: "0 0 20px rgba(255,255,255,0.3), 0 3px 10px rgba(0,0,0,0.9)",
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontFamily: sans,
              fontSize: 14,
              lineHeight: 1.65,
              color: "#cbd5e1",
              margin: "0 0 18px",
              textShadow: "0 2px 8px rgba(0,0,0,0.95)",
            }}
          >
            {project.description}
          </p>

          {project.metrics && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                color: CYAN,
                fontFamily: mono,
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 16,
                boxShadow: "0 0 16px rgba(56, 189, 248, 0.25)",
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

        {/* Right Floating Image Frame Column */}
        <div
          style={{
            position: "relative",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            boxShadow: "0 12px 35px rgba(0,0,0,0.9), 0 0 25px rgba(245, 158, 11, 0.2)",
            background: "#000",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(10, 14, 23, 0.8)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: AMBER_BRIGHT,
              fontFamily: mono,
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            AIR 3D SHOWCASE
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Glitch Typing Headline Floating Directly in Air ──────────────────────────

function AirAnimatedHeadline() {
  const LINES = ["WE BUILD THE", "INFRASTRUCTURE", "BEHIND AI-NATIVE", "PRODUCTS"];
  const TOTAL = LINES.reduce((acc, l) => acc + l.length, 0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= TOTAL) return;
    const t = setTimeout(() => setCount((c) => c + 1), 45);
    return () => clearTimeout(t);
  }, [count, TOTAL]);

  let remaining = count;
  const visible = LINES.map((line) => {
    if (remaining <= 0) return "";
    const show = Math.min(remaining, line.length);
    remaining -= show;
    return line.slice(0, show);
  });

  const done = (lineIdx: number) => visible[lineIdx].length === LINES[lineIdx].length;

  return (
    <h1
      style={{
        fontFamily: sans,
        fontWeight: 900,
        color: WHITE,
        fontSize: "clamp(2.4rem, 5.2vw, 4.6rem)",
        lineHeight: 1.05,
        letterSpacing: "-0.035em",
        margin: "0 0 24px",
        textShadow: "0 4px 20px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,1)",
      }}
    >
      {visible[0]}
      {done(0) && (
        <>
          <br />
          <span
            style={{
              color: AMBER_BRIGHT,
              animation: "textGlowPulse 3s infinite ease-in-out",
            }}
          >
            {visible[1]}
          </span>
        </>
      )}
      {done(1) && (
        <>
          <br />
          BEHIND{" "}
          <span
            style={{
              color: CYAN,
              animation: "cyanGlowPulse 3s infinite ease-in-out",
            }}
          >
            {visible[2].replace("BEHIND ", "")}
          </span>
        </>
      )}
      {done(2) && (
        <>
          <br />
          {visible[3]}
        </>
      )}
      {count < TOTAL && (
        <span style={{ color: AMBER_BRIGHT, animation: "pulseBeacon 0.8s infinite ease-in-out" }}>▎</span>
      )}
    </h1>
  );
}

type PanelDef = {
  id: string;
  label: string;
  render: (p: { onContact: () => void; onWork: () => void }) => React.ReactNode;
};

const PANELS: PanelDef[] = [
  // Zone 1 — Hero Entrance Floating Directly in 3D Air (NO CARD CONTAINER)
  {
    id: "hero",
    label: "Main Entrance",
    render: ({ onContact, onWork }) => (
      <div
        style={{
          background: "transparent",
          maxWidth: 740,
          animation: "airFloat 6s ease-in-out infinite",
        }}
      >
        <Eyebrow>›_ BYTEBROTHERS TECH STUDIO</Eyebrow>
        
        <AirAnimatedHeadline />

        <Rule />

        <p
          style={{
            fontFamily: sans,
            fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
            lineHeight: 1.65,
            color: "#e2e8f0",
            maxWidth: 560,
            margin: "0 0 32px",
            textShadow: "0 2px 12px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.95)",
            fontWeight: 400,
          }}
        >
          Custom WebGL engines, distributed full-stack systems, and AI platforms engineered for speed —
          by two founders, zero account managers.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* Book Discovery Call CTA */}
          <button
            onClick={onContact}
            style={{
              padding: "16px 36px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontFamily: sans,
              fontSize: 15,
              fontWeight: 800,
              color: "#ffffff",
              background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
              boxShadow: "0 0 30px rgba(245, 158, 11, 0.5), 0 8px 30px rgba(0, 0, 0, 0.7)",
              transition: "transform 0.2s, boxShadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.02)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 45px rgba(245, 158, 11, 0.8), 0 12px 35px rgba(0, 0, 0, 0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px) scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(245, 158, 11, 0.5), 0 8px 30px rgba(0, 0, 0, 0.7)";
            }}
          >
            Book Discovery Call →
          </button>

          {/* Explore Interactive Room CTA */}
          <button
            onClick={onWork}
            style={{
              padding: "16px 30px",
              borderRadius: 12,
              cursor: "pointer",
              fontFamily: sans,
              fontSize: 15,
              fontWeight: 700,
              color: WHITE,
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
              transition: "transform 0.2s, borderColor 0.2s, background 0.2s",
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = AMBER_BRIGHT;
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(15, 23, 42, 0.85)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255, 255, 255, 0.25)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(15, 23, 42, 0.65)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
            }}
          >
            Explore Interactive Room ↓
          </button>
        </div>
      </div>
    ),
  },

  // Zone 2 — Spatial Text & Image Carousel Floating in Air
  {
    id: "projects",
    label: "Project Showcase",
    render: () => (
      <div>
        <Eyebrow>02 — PORTFOLIO & TECH STACK</Eyebrow>
        <h2
          style={{
            fontFamily: sans,
            fontWeight: 900,
            fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
            color: WHITE,
            margin: "0 0 6px",
            textShadow: "0 4px 20px rgba(0,0,0,0.95)",
          }}
        >
          ENGINEERED <span style={{ color: AMBER_BRIGHT, animation: "textGlowPulse 3s infinite ease-in-out" }}>SYSTEMS</span>
        </h2>
        <p
          style={{
            fontFamily: sans,
            fontSize: 14,
            color: "#cbd5e1",
            margin: "0 0 16px",
            textShadow: "0 2px 8px rgba(0,0,0,0.95)",
          }}
        >
          Interactive floating portfolio cards cycling production platforms built for global clients.
        </p>
        <ProjectAirCarousel />
      </div>
    ),
  },

  // Zone 3 — Founders Wall & Tenets Floating in Air
  {
    id: "founders",
    label: "Founders & Tenets",
    render: () => (
      <div style={{ animation: "airFloat 6s ease-in-out infinite" }}>
        <Eyebrow>03 — THE FOUNDERS & ARCHITECTURE</Eyebrow>
        <h2
          style={{
            fontFamily: sans,
            fontWeight: 900,
            fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
            color: WHITE,
            margin: "0 0 20px",
            textShadow: "0 4px 20px rgba(0,0,0,0.95)",
          }}
        >
          MEET THE <span style={{ color: AMBER_BRIGHT, animation: "textGlowPulse 3s infinite ease-in-out" }}>FOUNDERS</span>
        </h2>

        {/* Founders Air Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
          {FOUNDERS.map((f) => (
            <div
              key={f.id}
              style={{
                background: "rgba(10, 14, 23, 0.65)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                borderRadius: 16,
                padding: "20px",
                boxShadow: "0 12px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(245, 158, 11, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <img
                  src={f.avatar}
                  alt={f.name}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${AMBER_BRIGHT}`, boxShadow: "0 0 14px rgba(245,158,11,0.5)" }}
                />
                <div>
                  <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 16, color: WHITE, textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{f.name}</div>
                  <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: AMBER_BRIGHT, marginTop: 2 }}>
                    {f.role}
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: sans, fontSize: 12, lineHeight: 1.6, color: "#cbd5e1", margin: "0 0 12px" }}>{f.bio}</p>
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
                background: "rgba(10, 14, 23, 0.55)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 12,
                padding: "12px",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: AMBER_BRIGHT }}>{t.number}</div>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 12, color: WHITE, margin: "4px 0" }}>{t.title}</div>
              <p style={{ fontFamily: sans, fontSize: 10, lineHeight: 1.4, color: MUTED, margin: 0 }}>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Zone 4 — Client Testimonials & Final CTA Floating in Air
  {
    id: "cta",
    label: "Client Testimonials & Contact",
    render: ({ onContact }) => (
      <div
        style={{
          background: "rgba(10, 14, 23, 0.65)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          borderRadius: 20,
          padding: "32px 40px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(245, 158, 11, 0.15)",
          maxWidth: 640,
          animation: "airFloat 6s ease-in-out infinite",
        }}
      >
        <Eyebrow>04 — READY TO BUILD?</Eyebrow>
        <h2 style={{ fontFamily: sans, fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 3.6rem)", color: WHITE, margin: "0 0 16px", textShadow: "0 4px 20px rgba(0,0,0,0.95)" }}>
          LET'S BUILD <span style={{ color: AMBER_BRIGHT, animation: "textGlowPulse 3s infinite ease-in-out" }}>THE NEXT</span> SYSTEM.
        </h2>
        <Rule />
        <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.7, color: "#cbd5e1", maxWidth: "42ch", margin: "0 0 24px" }}>
          Direct access to the founders — no account managers, no junior handoffs. High-performance software delivered on schedule.
        </p>

        {/* Availability Specs Table */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
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
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 10, color: MUTED, letterSpacing: "0.1em" }}>{label}</span>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 12, color: AMBER_BRIGHT, display: "flex", alignItems: "center", gap: 6 }}>
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
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontFamily: sans,
            fontSize: 16,
            fontWeight: 800,
            color: "#ffffff",
            background: "linear-gradient(135deg, #d97706, #f59e0b)",
            boxShadow: "0 0 35px rgba(245, 158, 11, 0.6), 0 8px 30px rgba(0, 0, 0, 0.8)",
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
  const TOTAL_PANELS = PANELS.length;
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
  return (
    <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
      <style>{SPATIAL_STYLES}</style>
      <div id="scroll-track" style={{ height: "550vh" }} />

      {PANELS.map((panel, i) => (
        <div
          key={panel.id}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            paddingLeft: "clamp(30px, 6vw, 90px)",
            paddingRight: "clamp(30px, 6vw, 90px)",
            paddingTop: "60px",
            opacity: opacities[i],
            zIndex: 2,
            pointerEvents: "none",
            transition: "opacity 0.3s ease",
          }}
        >
          <div style={{ pointerEvents: "auto", width: "100%", maxWidth: i === 1 || i === 2 ? 940 : 740 }}>
            {panel.render({ onContact, onWork })}
          </div>
        </div>
      ))}

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
          color: AMBER_BRIGHT,
          pointerEvents: "none",
          opacity: scrollProgress < 0.03 ? 1 : 0,
          transition: "opacity 0.5s ease",
          background: "rgba(10, 14, 23, 0.6)",
          backdropFilter: "blur(8px)",
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px solid rgba(245, 158, 11, 0.3)",
          boxShadow: "0 0 12px rgba(245, 158, 11, 0.3)",
        }}
      >
        Scroll to enter office ↓
      </div>
    </div>
  );
};

export default HomeScrollPanels;
