"use client";

import React, { useRef, useEffect, useCallback } from "react";

// ─── Design language ──────────────────────────────────────────────────────────
//
//  Everything here is orthogonal — only H and V segments, connected at 90°
//  corners. The layout echoes the logo's internal circuit-B trace language:
//
//    • Traces      — thin strokes (~1.5px), dim cyan base
//    • Via-points  — small filled squares (4px) at bends / branches
//    • Terminals   — larger glowing circles (6–8px) at start/end pads
//    • Pulses      — cyan→violet traveling lights that flash via-squares
//
//  Coordinates are normalised [0..1] relative to the canvas.
//  The whole layout is intentionally asymmetric and irregular.
// ─────────────────────────────────────────────────────────────────────────────

// ── Via-point (square junction/corner/branch) ─────────────────────────────────
interface Via {
  x: number;
  y: number;
  size: number;      // half-width of the square
  delay: number;     // entry fade delay ms
  opacity: number;
  lit: number;       // 0–1 glow intensity when a pulse passes through
}

// ── Terminal pad (circle endpoint) ────────────────────────────────────────────
interface Terminal {
  x: number;
  y: number;
  radius: number;
  delay: number;
  opacity: number;
}

// ── A single orthogonal trace segment (H or V) ───────────────────────────────
// Described by start point → corner → end point (two legs).
// If cornerX === x1 (vertical first) or cornerY === y1 (horizontal first).
interface Trace {
  x1: number; y1: number;   // start
  cx: number; cy: number;   // corner (one of the two is shared with start or end)
  x2: number; y2: number;   // end
  delay: number;
  length: number;           // total path length in normalised units (computed)
}

// ── Pulse traveling along a trace ─────────────────────────────────────────────
interface Pulse {
  traceIndex: number;
  t: number;          // 0→1 progress along the full trace path
  speed: number;
  viaFlash: number;   // which via index is near (–1 if none), set during travel
}

// ─── Layout definition ────────────────────────────────────────────────────────
//
//  Think of this as a small section of PCB copper-layer art.
//  Coordinates chosen so the composition fills the right column naturally.
//
//  Naming convention for readability:
//    x increases left→right, y increases top→bottom (canvas convention)
//
// ── Terminals (glowing circles) ───────────────────────────────────────────────
const TERMINALS: Terminal[] = [
  { x: 0.14, y: 0.12, radius: 7, delay: 0   , opacity: 0 }, // T0 top-left pad
  { x: 0.84, y: 0.18, radius: 6, delay: 120 , opacity: 0 }, // T1 top-right pad
  { x: 0.92, y: 0.72, radius: 7, delay: 240 , opacity: 0 }, // T2 right power pad
  { x: 0.52, y: 0.90, radius: 6, delay: 360 , opacity: 0 }, // T3 bottom centre pad
  { x: 0.08, y: 0.58, radius: 7, delay: 160 , opacity: 0 }, // T4 left side pad
];

// ── Via-points (filled squares at bends/branches) ────────────────────────────
const VIAS: Via[] = [
  { x: 0.14, y: 0.34, size: 3, delay: 60 , opacity: 0, lit: 0 }, // V0
  { x: 0.14, y: 0.58, size: 3, delay: 90 , opacity: 0, lit: 0 }, // V1  (shares T4.x)
  { x: 0.30, y: 0.34, size: 4, delay: 110, opacity: 0, lit: 0 }, // V2
  { x: 0.30, y: 0.58, size: 3, delay: 140, opacity: 0, lit: 0 }, // V3
  { x: 0.30, y: 0.72, size: 3, delay: 170, opacity: 0, lit: 0 }, // V4
  { x: 0.52, y: 0.12, size: 3, delay: 80 , opacity: 0, lit: 0 }, // V5
  { x: 0.52, y: 0.34, size: 4, delay: 150, opacity: 0, lit: 0 }, // V6  (hub)
  { x: 0.52, y: 0.58, size: 3, delay: 200, opacity: 0, lit: 0 }, // V7
  { x: 0.52, y: 0.72, size: 3, delay: 230, opacity: 0, lit: 0 }, // V8
  { x: 0.68, y: 0.34, size: 3, delay: 180, opacity: 0, lit: 0 }, // V9
  { x: 0.68, y: 0.58, size: 3, delay: 210, opacity: 0, lit: 0 }, // V10
  { x: 0.84, y: 0.34, size: 4, delay: 260, opacity: 0, lit: 0 }, // V11
  { x: 0.84, y: 0.58, size: 3, delay: 300, opacity: 0, lit: 0 }, // V12
];

// ── Traces (each is two orthogonal legs: start→corner, corner→end) ───────────
//  cx,cy is the corner — either cx===x1 (go horizontal then vertical)
//  or cy===y1 (go vertical then horizontal).
const TRACE_DEFS: Omit<Trace, "length">[] = [
  // Vertical spine from T0 down through V0 → V1 → T4
  { x1:0.14, y1:0.12, cx:0.14, cy:0.34, x2:0.14, y2:0.34, delay:0   }, // T0→V0  (straight V)
  { x1:0.14, y1:0.34, cx:0.14, cy:0.58, x2:0.14, y2:0.58, delay:60  }, // V0→V1  (straight V)
  { x1:0.14, y1:0.58, cx:0.08, cy:0.58, x2:0.08, y2:0.58, delay:90  }, // V1→T4  (straight H)

  // H-branch from V0 right to V2, then V2 down to V3
  { x1:0.14, y1:0.34, cx:0.30, cy:0.34, x2:0.30, y2:0.34, delay:110 }, // V0→V2  (straight H)
  { x1:0.30, y1:0.34, cx:0.30, cy:0.58, x2:0.30, y2:0.58, delay:140 }, // V2→V3  (straight V)
  { x1:0.30, y1:0.58, cx:0.30, cy:0.72, x2:0.30, y2:0.72, delay:170 }, // V3→V4  (straight V)
  { x1:0.30, y1:0.72, cx:0.52, cy:0.72, x2:0.52, y2:0.72, delay:200 }, // V4→V8  (straight H)

  // Central column: V5 (top) → V6 → V7 → V8 → T3
  { x1:0.52, y1:0.12, cx:0.52, cy:0.12, x2:0.84, y2:0.12, delay:80  }, // V5→T1  (straight H)
  { x1:0.14, y1:0.12, cx:0.52, cy:0.12, x2:0.52, y2:0.12, delay:40  }, // T0→V5  (H then stays)
  { x1:0.52, y1:0.12, cx:0.52, cy:0.34, x2:0.52, y2:0.34, delay:110 }, // V5→V6  (straight V)
  { x1:0.52, y1:0.34, cx:0.52, cy:0.58, x2:0.52, y2:0.58, delay:160 }, // V6→V7  (straight V)
  { x1:0.52, y1:0.58, cx:0.52, cy:0.72, x2:0.52, y2:0.72, delay:210 }, // V7→V8 already covered, skip dup
  { x1:0.52, y1:0.72, cx:0.52, cy:0.90, x2:0.52, y2:0.90, delay:260 }, // V8→T3  (straight V)

  // H-branches right from V6 → V9, V9 → V11
  { x1:0.52, y1:0.34, cx:0.68, cy:0.34, x2:0.68, y2:0.34, delay:180 }, // V6→V9  (straight H)
  { x1:0.68, y1:0.34, cx:0.84, cy:0.34, x2:0.84, y2:0.34, delay:220 }, // V9→V11 (straight H)
  { x1:0.84, y1:0.18, cx:0.84, cy:0.34, x2:0.84, y2:0.34, delay:200 }, // T1→V11 (straight V)
  { x1:0.84, y1:0.34, cx:0.84, cy:0.58, x2:0.84, y2:0.58, delay:270 }, // V11→V12(straight V)
  { x1:0.84, y1:0.58, cx:0.84, cy:0.72, x2:0.92, y2:0.72, delay:310 }, // V12→T2 (V then H)

  // H-branches at mid row V7→V10, V10→V12
  { x1:0.52, y1:0.58, cx:0.68, cy:0.58, x2:0.68, y2:0.58, delay:220 }, // V7→V10 (straight H)
  { x1:0.68, y1:0.58, cx:0.84, cy:0.58, x2:0.84, y2:0.58, delay:260 }, // V10→V12(straight H)

  // Short stubs — V2 up to an isolated pad-style terminal stub
  { x1:0.30, y1:0.34, cx:0.30, cy:0.12, x2:0.52, y2:0.12, delay:130 }, // V2 to top rail (V then H)
];

// Pre-compute trace path lengths (sum of both legs)
const TRACES: Trace[] = TRACE_DEFS.map((t) => {
  const leg1 = Math.abs(t.cx - t.x1) + Math.abs(t.cy - t.y1);
  const leg2 = Math.abs(t.x2 - t.cx) + Math.abs(t.y2 - t.cy);
  return { ...t, length: leg1 + leg2 };
}).filter((t) => t.length > 0.001); // drop zero-length dupes

// ─── Pulse queue: which traces pulses can travel ──────────────────────────────
// Only the "interesting" traces — main spine and key branches
const PULSE_TRACES = [0, 1, 3, 4, 9, 10, 13, 14, 16, 18, 19, 11];

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function px(nx: number, W: number, ox: number) { return nx * W + ox; }
function py(ny: number, H: number, oy: number) { return ny * H + oy; }

// Draw a two-leg orthogonal path (no fill)
function drawTrace(
  ctx: CanvasRenderingContext2D,
  t: Trace,
  W: number, H: number,
  ox: number, oy: number,
  alpha: number,
) {
  ctx.beginPath();
  ctx.moveTo(px(t.x1, W, ox), py(t.y1, H, oy));
  ctx.lineTo(px(t.cx, W, ox), py(t.cy, H, oy));
  ctx.lineTo(px(t.x2, W, ox), py(t.y2, H, oy));
  ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
  ctx.lineWidth   = 1.5;
  ctx.stroke();
}

// ─── Component ────────────────────────────────────────────────────────────────
interface NodeGraphProps { className?: string; }

export const NodeGraph: React.FC<NodeGraphProps> = ({ className = "" }) => {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const rafRef         = useRef<number>(0);
  const terminalsRef   = useRef<Terminal[]>(TERMINALS.map((n) => ({ ...n })));
  const viasRef        = useRef<Via[]>(VIAS.map((v) => ({ ...v })));
  const pulsesRef      = useRef<Pulse[]>([]);
  const mouseRef       = useRef({ x: 0.5, y: 0.5 });
  const offsetRef      = useRef({ x: 0, y: 0 });
  const startTimeRef   = useRef<number>(0);
  const lastPulseRef   = useRef<number>(0);
  const prevTimeRef    = useRef<number>(0);

  const reducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  // ─── Draw loop ──────────────────────────────────────────────────────────────
  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W       = canvas.width  / (window.devicePixelRatio || 1);
    const H       = canvas.height / (window.devicePixelRatio || 1);
    const elapsed = now - startTimeRef.current;
    const dt      = Math.min(now - prevTimeRef.current, 50); // cap at 50ms
    prevTimeRef.current = now;

    // ── Parallax ────────────────────────────────────────────────────────────
    if (!reducedMotion) {
      const targetOX = (mouseRef.current.x - 0.5) * -30;
      const targetOY = (mouseRef.current.y - 0.5) * -20;
      offsetRef.current.x += (targetOX - offsetRef.current.x) * 0.06;
      offsetRef.current.y += (targetOY - offsetRef.current.y) * 0.06;
    }
    const ox = offsetRef.current.x;
    const oy = offsetRef.current.y;

    ctx.clearRect(0, 0, W * (window.devicePixelRatio || 1), H * (window.devicePixelRatio || 1));

    // ── Entry fade (terminals + vias) ───────────────────────────────────────
    const ENTRY_DUR = 380;
    terminalsRef.current.forEach((t) => {
      if (reducedMotion) { t.opacity = 1; return; }
      const p = Math.min(1, Math.max(0, (elapsed - t.delay) / ENTRY_DUR));
      t.opacity = 1 - Math.pow(1 - p, 3);
    });
    viasRef.current.forEach((v) => {
      if (reducedMotion) { v.opacity = 1; return; }
      const p = Math.min(1, Math.max(0, (elapsed - v.delay) / ENTRY_DUR));
      v.opacity = 1 - Math.pow(1 - p, 3);
      // decay lit
      if (v.lit > 0) v.lit = Math.max(0, v.lit - dt * 0.004);
    });

    // ── Compute trace alpha (driven by endpoints it touches) ────────────────
    // We approximate: a trace is visible once the later of its endpoints has faded in
    const traceAlphaBase = TRACES.map((tr) => {
      // Find minimum opacity of any via/terminal close to start or end
      const checkPoint = (nx: number, ny: number) => {
        let best = 1;
        terminalsRef.current.forEach((t) => {
          const d = Math.abs(t.x - nx) + Math.abs(t.y - ny);
          if (d < 0.05) best = Math.min(best, t.opacity);
        });
        viasRef.current.forEach((v) => {
          const d = Math.abs(v.x - nx) + Math.abs(v.y - ny);
          if (d < 0.05) best = Math.min(best, v.opacity);
        });
        return best;
      };
      const a1 = checkPoint(tr.x1, tr.y1);
      const a2 = checkPoint(tr.x2, tr.y2);
      const p  = Math.min(1, Math.max(0, (elapsed - tr.delay) / ENTRY_DUR));
      const eased = 1 - Math.pow(1 - p, 3);
      return Math.min(a1, a2, eased) * 0.38;
    });

    // ── Draw traces ─────────────────────────────────────────────────────────
    ctx.save();
    ctx.lineCap  = "square"; // PCB-style — square line endings
    ctx.lineJoin = "miter";
    TRACES.forEach((tr, i) => {
      const alpha = traceAlphaBase[i];
      if (alpha <= 0.01) return;
      drawTrace(ctx, tr, W, H, ox, oy, alpha);
    });
    ctx.restore();

    // ── Spawn pulses ─────────────────────────────────────────────────────────
    if (!reducedMotion && now - lastPulseRef.current > 320) {
      lastPulseRef.current = now;
      const candidates = PULSE_TRACES.filter((ti) => traceAlphaBase[ti] > 0.2);
      if (candidates.length > 0) {
        const ti = candidates[Math.floor(Math.random() * candidates.length)];
        pulsesRef.current.push({
          traceIndex: ti,
          t: 0,
          speed: 0.00035 + Math.random() * 0.0003,
          viaFlash: -1,
        });
      }
    }

    // ── Animate pulses ───────────────────────────────────────────────────────
    const TAIL = 0.22; // fraction of trace length for the glow tail
    ctx.save();
    ctx.lineCap  = "square";
    ctx.lineJoin = "miter";

    const pulses = pulsesRef.current;
    for (let pi = pulses.length - 1; pi >= 0; pi--) {
      const pulse = pulses[pi];
      pulse.t += pulse.speed * dt;

      if (pulse.t > 1 + TAIL) {
        pulses.splice(pi, 1);
        continue;
      }

      const tr    = TRACES[pulse.traceIndex];
      const alpha = traceAlphaBase[pulse.traceIndex];
      if (alpha <= 0.01) { pulses.splice(pi, 1); continue; }

      // ── Interpolate position along the two-leg path ──────────────────────
      // Leg lengths (normalised units)
      const leg1 = Math.abs(tr.cx - tr.x1) + Math.abs(tr.cy - tr.y1);
      const leg2 = Math.abs(tr.x2 - tr.cx) + Math.abs(tr.y2 - tr.cy);
      const total = leg1 + leg2;

      const interp = (frac: number): [number, number] => {
        const clamped = Math.max(0, Math.min(1, frac));
        const dist    = clamped * total;
        if (dist <= leg1) {
          const f = leg1 > 0 ? dist / leg1 : 0;
          return [tr.x1 + (tr.cx - tr.x1) * f, tr.y1 + (tr.cy - tr.y1) * f];
        } else {
          const f = leg2 > 0 ? (dist - leg1) / leg2 : 0;
          return [tr.cx + (tr.x2 - tr.cx) * f, tr.cy + (tr.y2 - tr.cy) * f];
        }
      };

      const headT = Math.min(pulse.t, 1);
      const tailT = Math.max(pulse.t - TAIL, 0);

      const [hNx, hNy] = interp(headT);
      const [tNx, tNy] = interp(tailT);

      const hx = px(hNx, W, ox), hy = py(hNy, H, oy);
      const tx2 = px(tNx, W, ox), ty2 = py(tNy, H, oy);

      // ── Flash any via-point near the pulse head ──────────────────────────
      viasRef.current.forEach((v) => {
        const d = Math.abs(v.x - hNx) + Math.abs(v.y - hNy);
        if (d < 0.04) v.lit = Math.min(1, v.lit + 0.6);
      });

      // ── The pulse travels along two orthogonal legs. We draw each leg
      //    segment that the pulse tail→head spans. ───────────────────────────
      //    For simplicity: draw a gradient from tail to head position.
      //    Since legs are axis-aligned the gradient will look correct.
      const grad = ctx.createLinearGradient(tx2, ty2, hx, hy);
      grad.addColorStop(0,   `rgba(139,92,246,0)`);
      grad.addColorStop(0.35,`rgba(139,92,246,${0.55 * alpha * 2})`);
      grad.addColorStop(1,   `rgba(0,229,255,${alpha * 2.2})`);

      // We need to draw the path segments covered. Build a sub-path:
      ctx.beginPath();
      ctx.moveTo(tx2, ty2);

      // If the corner point is between tailT and headT, include it
      const cornerFrac = leg1 / total;
      if (tailT < cornerFrac && headT > cornerFrac) {
        ctx.lineTo(px(tr.cx, W, ox), py(tr.cy, H, oy));
      }
      ctx.lineTo(hx, hy);

      ctx.strokeStyle = grad;
      ctx.lineWidth   = 2;
      ctx.stroke();
    }
    ctx.restore();

    // ── Draw vias (squares) ──────────────────────────────────────────────────
    viasRef.current.forEach((v) => {
      if (v.opacity <= 0.01) return;
      const cx = px(v.x, W, ox);
      const cy = py(v.y, H, oy);
      const s  = v.size;

      // Glow when lit
      if (v.lit > 0) {
        ctx.save();
        ctx.shadowColor = `rgba(0,229,255,${v.lit})`;
        ctx.shadowBlur  = 12;
        ctx.fillStyle   = `rgba(0,229,255,${v.opacity * v.lit})`;
        ctx.fillRect(cx - s, cy - s, s * 2, s * 2);
        ctx.restore();
      }

      // Base square
      ctx.fillStyle = `rgba(0,229,255,${0.7 * v.opacity})`;
      ctx.fillRect(cx - s, cy - s, s * 2, s * 2);
    });

    // ── Draw terminals (circles) ─────────────────────────────────────────────
    terminalsRef.current.forEach((t) => {
      if (t.opacity <= 0.01) return;
      const cx = px(t.x, W, ox);
      const cy = py(t.y, H, oy);
      const r  = t.radius;

      // Outer radial glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 4.5);
      glow.addColorStop(0,   `rgba(0,229,255,${0.22 * t.opacity})`);
      glow.addColorStop(0.5, `rgba(0,229,255,${0.08 * t.opacity})`);
      glow.addColorStop(1,   `rgba(0,229,255,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, r * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,229,255,${0.85 * t.opacity})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Filled inner dot
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${t.opacity})`;
      ctx.fill();
    });

    rafRef.current = requestAnimationFrame(draw);
  }, [reducedMotion]);

  // ─── Resize handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr  = window.devicePixelRatio || 1;
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ─── RAF bootstrap ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t0 = performance.now();
    startTimeRef.current  = t0;
    lastPulseRef.current  = t0;
    prevTimeRef.current   = t0;

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // ─── Mouse parallax ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      style={{ display: "block" }}
    />
  );
};

export default NodeGraph;
