"use client";

import React from "react";
import { motion } from "motion/react";

interface HeroTextProps {
  onBookCall: () => void;
  onViewWork: () => void;
}

export const HeroText: React.FC<HeroTextProps> = ({ onBookCall, onViewWork }) => {
  // Headline split into words with the "AI-NATIVE" highlight
  const headline1 = "WE BUILD THE INFRASTRUCTURE BEHIND";
  const headline2 = "AI-NATIVE PRODUCTS";

  const baseDelay = 0.25;

  return (
    <div className="flex flex-col justify-center h-full">

      {/* ── Eyebrow label ──────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: baseDelay, ease: "easeOut" }}
        className="font-mono text-[11px] tracking-[0.2em] uppercase mb-6"
        style={{ color: "var(--signal-cyan)" }}
      >
        ›_ systems, engineered.
      </motion.p>

      {/* ── H1 ─────────────────────────────────────────────────────────── */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1, delay: baseDelay + 0.05 }}
        className="font-display font-bold leading-[1.04] tracking-tight mb-6"
        style={{
          fontSize: "clamp(2.4rem, 5vw, 4.25rem)",
          color: "var(--text-hi)",
          letterSpacing: "-0.02em",
        }}
      >
        {/* Line 1 */}
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: baseDelay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {headline1}
        </motion.span>

        {/* Line 2 — AI-NATIVE highlighted */}
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: baseDelay + 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{ color: "var(--signal-cyan)" }}>AI-NATIVE</span>
          {" PRODUCTS"}
        </motion.span>
      </motion.h1>

      {/* ── Subhead ─────────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.38, ease: "easeOut" }}
        className="text-[18px] leading-relaxed mb-10 max-w-[520px]"
        style={{ color: "var(--text-lo)", fontWeight: 400 }}
      >
        Custom WebGL, full-stack systems, and AI platforms engineered for scale.
      </motion.p>

      {/* ── CTAs ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: baseDelay + 0.52, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-3"
      >
        {/* Primary — cyan→violet gradient */}
        <button
          onClick={onBookCall}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-semibold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)]"
          style={{
            background: "linear-gradient(135deg, var(--signal-cyan) 0%, var(--signal-violet) 100%)",
            color: "#060608",
            letterSpacing: "-0.01em",
            boxShadow: "0 0 24px rgba(0,229,255,0.2), 0 0 48px rgba(139,92,246,0.1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 32px rgba(0,229,255,0.35), 0 0 60px rgba(139,92,246,0.2)";
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.06)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(0,229,255,0.2), 0 0 48px rgba(139,92,246,0.1)";
            (e.currentTarget as HTMLButtonElement).style.filter = "";
          }}
        >
          Book Discovery Call
          <span aria-hidden="true" className="opacity-70">→</span>
        </button>

        {/* Secondary — ghost/outline */}
        <button
          onClick={onViewWork}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[14px] font-medium transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-cyan)]"
          style={{
            color: "var(--text-hi)",
            border: "1px solid rgba(244,244,245,0.15)",
            background: "rgba(255,255,255,0.03)",
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,229,255,0.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--signal-cyan)";
            (e.currentTarget as HTMLButtonElement).style.textShadow = "0 0 12px rgba(0,229,255,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,244,245,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-hi)";
            (e.currentTarget as HTMLButtonElement).style.textShadow = "";
          }}
        >
          View Systems Built
          <span aria-hidden="true">→</span>
        </button>
      </motion.div>
    </div>
  );
};

export default HeroText;
