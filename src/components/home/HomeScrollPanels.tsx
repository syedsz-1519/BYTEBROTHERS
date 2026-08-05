"use client";

import React, { useEffect, useRef } from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { FOUNDERS, TECHNICAL_TENETS, PROJECTS } from "../../data/studioData";
import { NUM_BAYS } from "./HomeCorridor";

// ── Design tokens ─────────────────────────────────────────────────────────────
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

// ── Animated Tech Visual (right side of hero) ────────────────────────────────
const TechVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Node positions (normalized 0-1)
    const nodes = [
      { x: 0.18, y: 0.20 }, { x: 0.50, y: 0.12 }, { x: 0.82, y: 0.22 },
      { x: 0.10, y: 0.50 }, { x: 0.38, y: 0.42 }, { x: 0.65, y: 0.38 }, { x: 0.90, y: 0.50 },
      { x: 0.22, y: 0.72 }, { x: 0.52, y: 0.68 }, { x: 0.78, y: 0.75 },
      { x: 0.35, y: 0.90 }, { x: 0.68, y: 0.88 },
    ];
    const edges = [
      [0,1],[1,2],[0,3],[1,4],[2,6],[3,4],[4,5],[5,6],
      [3,7],[4,8],[5,8],[6,9],[7,8],[8,9],[7,10],[8,10],[9,11],[10,11],
    ];

    // Pulse state
    const pulses: { edge: number; t: number; speed: number }[] = [];
    let lastSpawn = 0;

    const draw = (timestamp: number) => {
      const dt = Math.min((timestamp - tRef.current) / 1000, 0.05);
      tRef.current = timestamp;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      const px = (n: typeof nodes[0]) => n.x * W;
      const py = (n: typeof nodes[0]) => n.y * H;

      // Draw edges
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        const grad = ctx.createLinearGradient(px(na), py(na), px(nb), py(nb));
        grad.addColorStop(0,   "rgba(47,123,255,0.18)");
        grad.addColorStop(0.5, "rgba(94,161,255,0.32)");
        grad.addColorStop(1,   "rgba(47,123,255,0.18)");
        ctx.beginPath();
        ctx.moveTo(px(na), py(na));
        ctx.lineTo(px(nb), py(nb));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Spawn pulses
      if (timestamp - lastSpawn > 420 && pulses.length < 8) {
        lastSpawn = timestamp;
        pulses.push({ edge: Math.floor(Math.random() * edges.length), t: 0, speed: 0.55 + Math.random() * 0.35 });
      }

      // Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].t += pulses[i].speed * dt;
        if (pulses[i].t > 1.1) { pulses.splice(i, 1); continue; }
        const [a, b] = edges[pulses[i].edge];
        const na = nodes[a], nb = nodes[b];
        const t = Math.min(pulses[i].t, 1);
        const px2 = na.x + (nb.x - na.x) * t;
        const py2 = na.y + (nb.y - na.y) * t;
        const glow = ctx.createRadialGradient(px2*W, py2*H, 0, px2*W, py2*H, 10);
        glow.addColorStop(0,   "rgba(94,161,255,0.95)");
        glow.addColorStop(0.5, "rgba(47,123,255,0.45)");
        glow.addColorStop(1,   "rgba(47,123,255,0)");
        ctx.beginPath();
        ctx.arc(px2*W, py2*H, 10, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Draw nodes
      nodes.forEach((n, i) => {
        const pulse = Math.sin(timestamp * 0.002 + i * 0.8) * 0.5 + 0.5;
        const r = 4 + pulse * 2;
        const glow = ctx.createRadialGradient(px(n), py(n), 0, px(n), py(n), r * 3);
        glow.addColorStop(0,   `rgba(47,123,255,${0.9 + pulse * 0.1})`);
        glow.addColorStop(0.4, `rgba(94,161,255,${0.4 + pulse * 0.2})`);
        glow.addColorStop(1,   "rgba(47,123,255,0)");
        ctx.beginPath();
        ctx.arc(px(n), py(n), r * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px(n), py(n), r, 0, Math.PI * 2);
        ctx.fillStyle = "#2f7bff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px(n), py(n), r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#a8ccff";
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
};

// ── Floating stat badge ───────────────────────────────────────────────────────
const StatBadge: React.FC<{ value: string; label: string; delay?: string }> = ({ value, label, delay = "0s" }) => (
  <div style={{
    ...card({ padding: "12px 18px", display: "inline-flex", flexDirection: "column",
      gap: 2, animationDelay: delay }),
    animation: "floatBadge 4s ease-in-out infinite",
  }}>
    <span style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
      fontSize: 22, color: C.blue, lineHeight: 1 }}>{value}</span>
    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9,
      letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted }}>{label}</span>
  </div>
);

// ── Panel definitions ─────────────────────────────────────────────────────────
type PanelDef = {
  id: string;
  label: string;
  render: (p: { onContact: () => void; onWork: () => void }) => React.ReactNode;
};

const PANELS: PanelDef[] = [

  // ── Bay 0: Hero (two-column) ───────────────────────────────────────────────
  {
    id: "hero", label: "›_ systems, engineered.",
    render: ({ onContact, onWork }) => (
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4vw",
        alignItems: "center", width: "100%", maxWidth: 1200,
      }}>
        {/* LEFT: text */}
        <div>
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.blue, marginBottom: 18,
            display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 6, height: 6,
              borderRadius: "50%", background: C.blue,
              boxShadow: `0 0 8px ${C.blue}` }} />
            ›_ systems, engineered.
          </p>
          <h1 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
            fontSize: "clamp(2.2rem,4.5vw,4rem)", lineHeight: 1.04,
            letterSpacing: "-0.03em", color: C.black, marginBottom: 20 }}>
            WE BUILD THE{" "}
            <span style={{ color: C.blue }}>INFRASTRUCTURE</span>
            {" "}BEHIND{" "}
            <span style={{ color: C.blueD }}>AI-NATIVE</span>
            {" "}PRODUCTS
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: C.mid,
            maxWidth: 440, marginBottom: 32 }}>
            Custom WebGL, full-stack systems, and AI platforms engineered for scale —
            by two founders, zero account managers.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
            <button onClick={onContact} style={{
              padding: "14px 28px", borderRadius: 12,
              fontFamily: "Space Grotesk,sans-serif", fontSize: 14, fontWeight: 700,
              cursor: "pointer", border: "none",
              background: `linear-gradient(135deg,${C.blue},${C.blueBr})`, color: "#fff",
              boxShadow: `0 4px 20px rgba(47,123,255,0.40)`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(47,123,255,0.55)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px rgba(47,123,255,0.40)`; }}
            >Book Discovery Call →</button>
            <button onClick={onWork} style={{
              padding: "14px 24px", borderRadius: 12,
              fontFamily: "Space Grotesk,sans-serif", fontSize: 14, fontWeight: 600,
              cursor: "pointer", background: "rgba(255,255,255,0.88)", color: C.dark,
              border: `1px solid rgba(47,123,255,0.28)`, transition: "border-color 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.blue; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(47,123,255,0.28)"; }}
            >View Systems Built ↓</button>
          </div>
          {/* Stat row */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <StatBadge value="50+" label="Systems Shipped" delay="0s" />
            <StatBadge value="2" label="Founders, No Fluff" delay="0.6s" />
            <StatBadge value="∞" label="Uptime Ambition" delay="1.2s" />
          </div>
        </div>

        {/* RIGHT: animated tech graph */}
        <div style={{ position: "relative", height: "clamp(320px,45vh,520px)" }}>
          {/* Glow backdrop */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 24,
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(47,123,255,0.10) 0%, transparent 70%)",
            border: "1px solid rgba(47,123,255,0.12)",
          }} />
          {/* Canvas */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden" }}>
            <TechVisual />
          </div>
          {/* Corner label */}
          <div style={{
            position: "absolute", top: 16, left: 20,
            fontFamily: "JetBrains Mono,monospace", fontSize: 9,
            letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted,
          }}>// LIVE NODE GRAPH</div>
          {/* Corner dots */}
          {["top:12px;left:12px","top:12px;right:12px","bottom:12px;left:12px","bottom:12px;right:12px"].map((pos, i) => {
            const [t,l] = pos.split(";").map(s=>s.split(":")[1]);
            const style: React.CSSProperties = { position:"absolute", width:4, height:4,
              borderRadius:"50%", background: C.blue, opacity:0.6 };
            if (pos.includes("top:")) style.top = t;
            else style.bottom = t;
            if (pos.includes("left:")) style.left = l;
            else style.right = l;
            return <div key={i} style={style} />;
          })}
        </div>
      </div>
    ),
  },

  // ── Bay 1: Tenets (two-column) ─────────────────────────────────────────────
  {
    id: "tenets", label: "Core philosophy",
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4vw",
        alignItems: "start", width: "100%", maxWidth: 1200 }}>
        <div>
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 10 }}>
            // CORE PHILOSOPHY
          </p>
          <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
            fontSize: "clamp(2rem,3.8vw,3.2rem)", letterSpacing: "-0.025em",
            color: C.black, marginBottom: 20 }}>
            Our Engineering<br />Tenets
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: C.mid, maxWidth: 380 }}>
            Every system we ship is guided by these core principles — no exceptions, no shortcuts.
          </p>
        </div>
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

  // ── Bays 2-4: Case studies (two-column) ────────────────────────────────────
  ...PROJECTS.slice(0, 3).map((proj, i) => ({
    id: proj.id,
    label: `Selected work — 0${i + 1}`,
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4vw",
        alignItems: "center", width: "100%", maxWidth: 1200 }}>
        {/* Left: meta + text */}
        <div>
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 10 }}>
            SELECTED WORK — {String(i + 1).padStart(2, "0")} · {proj.type} · {proj.year}
          </p>
          <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
            fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.025em",
            color: C.black, marginBottom: 14 }}>{proj.title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: C.mid, maxWidth: "44ch", marginBottom: 16 }}>
            {proj.description}
          </p>
          {proj.metrics && (
            <div style={{ ...card({ display: "inline-flex", alignItems: "center",
              padding: "8px 16px", marginBottom: 16, gap: 8,
              fontSize: 13, fontFamily: "JetBrains Mono,monospace", color: C.blueD }) }}>
              <span style={{ fontSize: 16 }}>📈</span> {proj.metrics}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {proj.tags.slice(0, 5).map(tag => <TagPill key={tag} label={tag} />)}
          </div>
        </div>
        {/* Right: project image */}
        <div style={{
          borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`,
          boxShadow: "0 8px 40px rgba(47,123,255,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          height: "clamp(200px,30vh,360px)",
        }}>
          <img src={proj.image} alt={proj.title}
            style={{ width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.4s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
          />
        </div>
      </div>
    ),
  })) as PanelDef[],

  // ── Bay 5: Founders (two-column) ───────────────────────────────────────────
  {
    id: "founders", label: "The architects",
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4vw",
        alignItems: "start", width: "100%", maxWidth: 1200 }}>
        <div>
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 10 }}>
            // THE ARCHITECTS
          </p>
          <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
            fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.025em",
            color: C.black, marginBottom: 16 }}>
            Meet the Founders
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: C.mid, maxWidth: 360 }}>
            Two engineers. No VC backing, no overhead. Just clean systems and direct collaboration.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {FOUNDERS.map((f) => (
            <div key={f.id} style={card({ padding: "20px" })}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <img src={f.avatar} alt={f.name}
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover",
                    border: `2px solid ${C.border}` }} />
                <div>
                  <div style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 700,
                    fontSize: 15, color: C.black }}>{f.name}</div>
                  <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9,
                    letterSpacing: "0.15em", textTransform: "uppercase", color: C.blue }}>{f.role}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: C.mid, marginBottom: 12 }}>{f.bio}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {f.specialties.slice(0, 3).map(s => <TagPill key={s} label={s} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── Bay 6: CTA (two-column) ────────────────────────────────────────────────
  {
    id: "cta", label: "Start a project",
    render: ({ onContact }) => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4vw",
        alignItems: "center", width: "100%", maxWidth: 1200 }}>
        <div>
          <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase", color: C.blue, marginBottom: 10 }}>
            // READY TO BUILD?
          </p>
          <h2 style={{ fontFamily: "Space Grotesk,sans-serif", fontWeight: 800,
            fontSize: "clamp(2rem,4vw,3.4rem)", letterSpacing: "-0.025em",
            color: C.black, marginBottom: 18 }}>
            Let's build the<br />next system.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: C.mid, maxWidth: "38ch", marginBottom: 28 }}>
            Open for freelance and studio collaborations. Direct access to the founders.
            No account managers, no junior handoffs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <button onClick={onContact} style={{
              padding: "15px 32px", borderRadius: 12,
              fontFamily: "Space Grotesk,sans-serif", fontSize: 15, fontWeight: 700,
              cursor: "pointer", border: "none",
              background: `linear-gradient(135deg,${C.blue},${C.blueBr})`, color: "#fff",
              boxShadow: `0 6px 28px rgba(47,123,255,0.38)`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            >Book Discovery Call →</button>
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11,
              color: C.muted, margin: 0 }}>studio@bytebrothers.dev</p>
          </div>
        </div>
        {/* Right: availability card */}
        <div style={{ ...card({ padding: "32px 36px" }) }}>
          <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10,
            letterSpacing: "0.18em", textTransform: "uppercase", color: C.blue, marginBottom: 16 }}>
            // CURRENT STATUS
          </div>
          {[
            { label: "Availability", value: "Q3/Q4 2025", ok: true },
            { label: "Response Time", value: "< 24 hours", ok: true },
            { label: "Min. Engagement", value: "$5K", ok: true },
            { label: "Onboarding", value: "1-week sprint", ok: true },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", paddingBlock: "10px",
              borderBottom: `1px solid rgba(47,123,255,0.08)` }}>
              <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11,
                color: C.muted, letterSpacing: "0.05em" }}>{row.label}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6,
                fontFamily: "Space Grotesk,sans-serif", fontWeight: 600,
                fontSize: 13, color: C.black }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%",
                  background: row.ok ? "#22c55e" : "#ef4444",
                  boxShadow: row.ok ? "0 0 6px #22c55e" : "0 0 6px #ef4444",
                  display: "inline-block" }} />
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ── Keyframe injection ────────────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes floatBadge {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-6px); }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface HomeScrollPanelsProps { onContact: () => void; onWork: () => void; }

export const HomeScrollPanels: React.FC<HomeScrollPanelsProps> = ({ onContact, onWork }) => {
  const scrollProgress = useScrollProgress();
  const band = 1 / NUM_BAYS;

  const opacities = PANELS.map((_, i) => {
    const centre = band * i + band / 2;
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
    <>
      {/* Inject keyframes once */}
      <style>{KEYFRAMES}</style>

      <div style={{ position: "relative", zIndex: 2, pointerEvents: "none" }}>
        {/* Scroll track */}
        <div id="scroll-track" style={{ height: `${NUM_BAYS * 120}vh` }} />

        {/* Fixed panels — full width, horizontal centred */}
        {PANELS.map((panel, i) => (
          <div key={panel.id} style={{
            position: "fixed", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            paddingLeft: "6vw", paddingRight: "6vw",
            paddingTop: "5rem",
            opacity: opacities[i], zIndex: 2, pointerEvents: "none",
          }}>
            <div style={{ pointerEvents: "auto", width: "100%" }}>
              {panel.render({ onContact, onWork })}
            </div>
          </div>
        ))}

        {/* HUD — bottom left */}
        <div style={{
          position: "fixed", bottom: "2rem", left: "6vw", zIndex: 3,
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: "JetBrains Mono,monospace", fontSize: 11,
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: C.muted, pointerEvents: "none",
        }}>
          <span style={{ color: C.blue, fontWeight: 700 }}>
            {String(activeBay + 1).padStart(2, "0")}
          </span>
          <span style={{ color: C.muted }}>/ {String(NUM_BAYS).padStart(2, "0")}</span>
          <div style={{ width: 100, height: 1, background: "rgba(47,123,255,0.15)",
            position: "relative", overflow: "hidden" }}>
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
          position: "fixed", top: "5.5rem", right: "6vw", zIndex: 3,
          fontFamily: "JetBrains Mono,monospace", fontSize: 11,
          letterSpacing: "0.15em", textTransform: "uppercase",
          color: C.muted, pointerEvents: "none",
          opacity: scrollProgress < 0.03 ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}>
          Scroll to walk in ↓
        </div>
      </div>
    </>
  );
};

export default HomeScrollPanels;
