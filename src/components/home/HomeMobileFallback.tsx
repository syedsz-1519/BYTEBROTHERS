"use client";

// ─── HomeMobileFallback.tsx ───────────────────────────────────────────────────
// Static vertically-scrolling layout served on mobile / low-end devices.
// Same content as the corridor panels but in a normal document flow.

import React from "react";
import { FOUNDERS, TECHNICAL_TENETS, PROJECTS } from "../../data/studioData";

interface Props {
  onContact: () => void;
  onWork:    () => void;
  onPortfolio: () => void;
}

export const HomeMobileFallback: React.FC<Props> = ({ onContact, onWork, onPortfolio }) => {
  const cyan   = "#2f7bff";
  const violet = "#5ea1ff";
  const hi     = "#f5f7fa";
  const lo     = "#8b93a1";
  const glass  = { background: "rgba(18,18,22,0.9)", border: "1px solid rgba(47,123,255,0.10)" };

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", color: "#0d1117" }}>
      {/* ── Hero ── */}
      <section className="px-6 pt-28 pb-20 max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-5" style={{ color: cyan }}>
          ›_ systems, engineered.
        </p>
        <h1 className="font-display font-bold leading-[1.03] mb-5"
          style={{ fontSize: "clamp(2.2rem,9vw,3.6rem)", letterSpacing: "-0.025em" }}>
          WE BUILD THE{" "}
          <span style={{ color: cyan }}>INFRASTRUCTURE</span>{" "}
          BEHIND AI-NATIVE PRODUCTS
        </h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: lo, maxWidth: "44ch" }}>
          Custom WebGL, full-stack systems, and AI platforms engineered for scale.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onContact}
            className="px-6 py-3 rounded-xl font-display text-sm font-semibold"
            style={{ background: `linear-gradient(135deg,${cyan},${violet})`, color: "#f5f7fa" }}>
            Book Discovery Call →
          </button>
          <button onClick={onWork}
            className="px-6 py-3 rounded-xl font-display text-sm"
            style={{ border: "1px solid rgba(244,244,245,0.15)", color: hi }}>
            View Systems Built →
          </button>
        </div>
      </section>

      <hr style={{ borderColor: "rgba(47,123,255,0.08)" }} />

      {/* ── Tenets ── */}
      <section className="px-6 py-16 max-w-2xl">
        <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: cyan }}>// CORE PHILOSOPHY</p>
        <h2 className="font-display font-bold text-3xl mb-8" style={{ letterSpacing: "-0.02em" }}>
          Our Architectural Tenets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TECHNICAL_TENETS.map((t) => (
            <div key={t.number} className="p-4 rounded-xl space-y-2" style={glass}>
              <div className="font-mono text-lg font-bold" style={{ color: cyan }}>{t.number}</div>
              <div className="font-display font-semibold text-sm">{t.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: lo }}>{t.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ borderColor: "rgba(47,123,255,0.08)" }} />

      {/* ── Case studies ── */}
      <section className="px-6 py-16 max-w-2xl space-y-12">
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: cyan }}>// SELECTED WORK</p>
        {PROJECTS.slice(0, 3).map((proj, i) => (
          <div key={proj.id} className="space-y-4">
            <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: lo }}>
              {String(i + 1).padStart(2, "0")} · {proj.type} · {proj.year}
            </p>
            <h3 className="font-display font-bold text-2xl" style={{ letterSpacing: "-0.02em" }}>{proj.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: lo }}>{proj.description}</p>
            {proj.metrics && (
              <span className="inline-block px-3 py-1 rounded-lg font-mono text-xs" style={{ color: cyan, ...glass }}>
                {proj.metrics}
              </span>
            )}
            <div className="flex flex-wrap gap-2">
              {proj.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded font-mono text-[9px] uppercase"
                  style={{ background: "rgba(47,123,255,0.08)", border: "1px solid rgba(47,123,255,0.18)", color: "#a78bfa" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        <button onClick={onPortfolio} className="font-mono text-xs underline" style={{ color: lo }}>
          View all projects →
        </button>
      </section>

      <hr style={{ borderColor: "rgba(47,123,255,0.08)" }} />

      {/* ── Founders ── */}
      <section className="px-6 py-16 max-w-2xl">
        <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: cyan }}>// THE ARCHITECTS</p>
        <h2 className="font-display font-bold text-3xl mb-8" style={{ letterSpacing: "-0.02em" }}>Meet the Founders</h2>
        <div className="space-y-6">
          {FOUNDERS.map((f) => (
            <div key={f.id} className="p-5 rounded-xl space-y-3" style={glass}>
              <div className="font-display font-bold text-base">{f.name}</div>
              <div className="font-mono text-[10px] tracking-wider uppercase" style={{ color: cyan }}>{f.role}</div>
              <p className="text-xs leading-relaxed" style={{ color: lo }}>{f.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ borderColor: "rgba(47,123,255,0.08)" }} />

      {/* ── CTA ── */}
      <section className="px-6 py-20 max-w-2xl space-y-6">
        <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: cyan }}>// READY TO BUILD?</p>
        <h2 className="font-display font-bold text-3xl" style={{ letterSpacing: "-0.02em" }}>
          Let's build the next system.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: lo, maxWidth: "40ch" }}>
          Open for freelance and studio collaborations. No account managers, no junior handoffs.
        </p>
        <button onClick={onContact}
          className="px-7 py-3.5 rounded-xl font-display text-sm font-semibold"
          style={{ background: `linear-gradient(135deg,${cyan},${violet})`, color: "#f5f7fa" }}>
          Book Discovery Call →
        </button>
        <p className="font-mono text-[11px]" style={{ color: lo }}>studio@bytebrothers.dev</p>
      </section>
    </div>
  );
};

export default HomeMobileFallback;
