"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface HeroTextProps {
  onBookCall: () => void;
  onViewWork: () => void;
}

// CSS layered text-shadow — pseudo-3D extrusion matching the scene's cyan/violet lighting
const H1_SHADOW = [
  // Extrusion depth — offset steps in cyan
  "1px 1px 0 rgba(0,229,255,0.25)",
  "2px 2px 0 rgba(0,229,255,0.18)",
  "3px 3px 0 rgba(0,229,255,0.12)",
  "4px 4px 0 rgba(0,229,255,0.07)",
  // Ambient glow halo
  "0 0 32px rgba(0,229,255,0.18)",
  "0 0 64px rgba(139,92,246,0.10)",
].join(", ");

const CYAN_SHADOW = [
  "1px 1px 0 rgba(0,229,255,0.45)",
  "2px 2px 0 rgba(0,229,255,0.30)",
  "3px 3px 0 rgba(0,229,255,0.15)",
  "0 0 24px rgba(0,229,255,0.55)",
  "0 0 48px rgba(0,229,255,0.25)",
].join(", ");

const baseDelay = 0.2;

export const HeroText: React.FC<HeroTextProps> = ({ onBookCall, onViewWork }) => {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const tiltRef  = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef   = useRef<number>(0);

  // CSS 3D parallax tilt — mouse + scroll drive a subtle rotateX/Y
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = ((e.clientY / window.innerHeight) - 0.5) * -6; // deg
      targetRef.current.y = ((e.clientX / window.innerWidth)  - 0.5) *  6;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      tiltRef.current.x += (targetRef.current.x - tiltRef.current.x) * 0.07;
      tiltRef.current.y += (targetRef.current.y - tiltRef.current.y) * 0.07;
      if (wrapRef.current) {
        wrapRef.current.style.transform =
          `perspective(900px) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* ── Eyebrow ──────────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: baseDelay, ease: "easeOut" }}
        className="font-mono text-[11px] tracking-[0.22em] uppercase mb-5"
        style={{
          color:      "var(--signal-cyan, #00e5ff)",
          textShadow: "0 0 16px rgba(0,229,255,0.6)",
        }}
      >
        ›_ systems, engineered.
      </motion.p>

      {/* ── H1 — real DOM text for SEO/a11y ─────────────────────────────── */}
      <motion.h1
        className="font-display font-bold leading-[1.03] mb-6"
        style={{
          fontSize:      "clamp(2.6rem, 5.2vw, 4.5rem)",
          color:         "var(--text-hi, #f4f4f5)",
          letterSpacing: "-0.025em",
          textShadow:    H1_SHADOW,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1, delay: baseDelay + 0.05 }}
      >
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: baseDelay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          WE BUILD THE INFRASTRUCTURE BEHIND
        </motion.span>
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: baseDelay + 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{ color: "var(--signal-cyan, #00e5ff)", textShadow: CYAN_SHADOW }}>
            AI-NATIVE
          </span>
          {" PRODUCTS"}
        </motion.span>
      </motion.h1>

      {/* ── Subhead ──────────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.4, ease: "easeOut" }}
        style={{
          fontSize:   "18px",
          lineHeight: 1.65,
          color:      "var(--text-lo, #8b8b93)",
          fontWeight: 400,
          maxWidth:   "500px",
          marginBottom: "2.5rem",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        Custom WebGL, full-stack systems, and AI platforms engineered for scale.
      </motion.p>

      {/* ── CTAs ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.54, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Primary */}
        <button
          onClick={onBookCall}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-semibold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)]"
          style={{
            background:    "linear-gradient(135deg, #00e5ff 0%, #8b5cf6 100%)",
            color:         "#060608",
            letterSpacing: "-0.01em",
            boxShadow:     "0 0 24px rgba(0,229,255,0.25), 0 0 48px rgba(139,92,246,0.12)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 36px rgba(0,229,255,0.4), 0 0 64px rgba(139,92,246,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(0,229,255,0.25), 0 0 48px rgba(139,92,246,0.12)";
          }}
        >
          Book Discovery Call <span aria-hidden="true" className="opacity-70">→</span>
        </button>

        {/* Secondary */}
        <button
          onClick={onViewWork}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-medium transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)]"
          style={{
            color:         "var(--text-hi, #f4f4f5)",
            border:        "1px solid rgba(244,244,245,0.15)",
            background:    "rgba(10,10,13,0.45)",
            letterSpacing: "-0.01em",
            backdropFilter:"blur(8px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,229,255,0.45)";
            (e.currentTarget as HTMLButtonElement).style.color = "#00e5ff";
            (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 12px rgba(0,229,255,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,244,245,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-hi, #f4f4f5)";
            (e.currentTarget as HTMLButtonElement).style.textShadow = "";
          }}
        >
          View Systems Built <span aria-hidden="true">→</span>
        </button>
      </motion.div>
    </div>
  );
};

export default HeroText;
