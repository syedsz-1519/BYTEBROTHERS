"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface HeroTextProps {
  onBookCall: () => void;
  onViewWork: () => void;
}

// ── New blue-theme text-shadow extrusions ─────────────────────────────────────
const H1_SHADOW = [
  "1px 1px 0 rgba(47,123,255,0.22)",
  "2px 2px 0 rgba(47,123,255,0.15)",
  "3px 3px 0 rgba(47,123,255,0.09)",
  "4px 4px 0 rgba(47,123,255,0.05)",
  "0 0 32px rgba(47,123,255,0.14)",
  "0 0 64px rgba(94,161,255,0.08)",
].join(", ");

const ACCENT_SHADOW = [
  "1px 1px 0 rgba(94,161,255,0.4)",
  "2px 2px 0 rgba(94,161,255,0.25)",
  "3px 3px 0 rgba(94,161,255,0.12)",
  "0 0 24px rgba(94,161,255,0.5)",
  "0 0 48px rgba(47,123,255,0.22)",
].join(", ");

const baseDelay = 0.2;

export const HeroText: React.FC<HeroTextProps> = ({ onBookCall, onViewWork }) => {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const tiltRef   = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = ((e.clientY / window.innerHeight) - 0.5) * -6;
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
    <div ref={wrapRef} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>

      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: baseDelay, ease: "easeOut" }}
        className="font-mono text-[11px] tracking-[0.22em] uppercase mb-5"
        style={{ color: "var(--blue)", textShadow: "0 0 16px rgba(47,123,255,0.55)" }}
      >
        ›_ systems, engineered.
      </motion.p>

      {/* H1 */}
      <motion.h1
        className="font-display font-bold leading-[1.03] mb-6"
        style={{
          fontSize:      "clamp(2.6rem, 5.2vw, 4.5rem)",
          color:         "var(--white)",
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
          <span style={{ color: "var(--blue-bright)", textShadow: ACCENT_SHADOW }}>
            AI-NATIVE
          </span>
          {" PRODUCTS"}
        </motion.span>
      </motion.h1>

      {/* Subhead */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.4, ease: "easeOut" }}
        style={{
          fontSize: "18px", lineHeight: 1.65,
          color: "var(--gray)", fontWeight: 400,
          maxWidth: "500px", marginBottom: "2.5rem",
          textShadow: "0 2px 12px rgba(0,0,0,0.85)",
        }}
      >
        Custom WebGL, full-stack systems, and AI platforms engineered for scale.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.54, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Primary — blue gradient */}
        <button
          onClick={onBookCall}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-semibold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
          style={{
            background:    "linear-gradient(135deg, var(--blue) 0%, var(--blue-bright) 100%)",
            color:         "var(--white)",
            letterSpacing: "-0.01em",
            boxShadow:     "0 0 24px rgba(47,123,255,0.3), 0 0 48px rgba(94,161,255,0.12)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 36px rgba(47,123,255,0.45), 0 0 64px rgba(94,161,255,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(47,123,255,0.3), 0 0 48px rgba(94,161,255,0.12)";
          }}
        >
          Book Discovery Call <span aria-hidden="true" className="opacity-70">→</span>
        </button>

        {/* Secondary — ghost */}
        <button
          onClick={onViewWork}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-medium transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]"
          style={{
            color:          "var(--white)",
            border:         "1px solid rgba(255,255,255,0.1)",
            background:     "rgba(5,6,8,0.5)",
            letterSpacing:  "-0.01em",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(47,123,255,0.45)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--blue-bright)";
            (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 12px rgba(94,161,255,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--white)";
            (e.currentTarget as HTMLButtonElement).style.textShadow = "";
          }}
        >
          Enter the Corridor <span aria-hidden="true">↓</span>
        </button>
      </motion.div>
    </div>
  );
};

export default HeroText;
