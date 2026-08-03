"use client";

import React, { useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Node {
  x: number;      // 0–1 normalised
  y: number;
  radius: number;
  delay: number;  // entry delay in ms
  opacity: number;
  targetOpacity: number;
}

interface Edge {
  from: number;
  to: number;
}

interface Packet {
  edgeIndex: number;
  t: number;       // 0→1 progress along the edge
  speed: number;   // progress per ms
  opacity: number;
}

// ─── Graph definition (circuit-B geometry: right-angles + short diagonals) ───

const NODES: Node[] = [
  { x: 0.12, y: 0.18, radius: 5, delay: 0,    opacity: 0, targetOpacity: 1 },
  { x: 0.38, y: 0.10, radius: 4, delay: 100,  opacity: 0, targetOpacity: 1 },
  { x: 0.68, y: 0.20, radius: 6, delay: 200,  opacity: 0, targetOpacity: 1 },
  { x: 0.88, y: 0.38, radius: 4, delay: 280,  opacity: 0, targetOpacity: 1 },
  { x: 0.75, y: 0.62, radius: 5, delay: 360,  opacity: 0, targetOpacity: 1 },
  { x: 0.50, y: 0.75, radius: 4, delay: 440,  opacity: 0, targetOpacity: 1 },
  { x: 0.22, y: 0.65, radius: 5, delay: 520,  opacity: 0, targetOpacity: 1 },
  { x: 0.08, y: 0.46, radius: 4, delay: 600,  opacity: 0, targetOpacity: 1 },
  { x: 0.50, y: 0.44, radius: 7, delay: 700,  opacity: 0, targetOpacity: 1 }, // hub
];

const EDGES: Edge[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
  { from: 7, to: 0 },
  { from: 0, to: 8 },
  { from: 2, to: 8 },
  { from: 4, to: 8 },
  { from: 6, to: 8 },
  { from: 1, to: 8 },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface NodeGraphProps {
  className?: string;
}

export const NodeGraph: React.FC<NodeGraphProps> = ({ className = "" }) => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const nodesRef     = useRef<Node[]>(NODES.map((n) => ({ ...n })));
  const packetsRef   = useRef<Packet[]>([]);
  const mouseRef     = useRef({ x: 0.5, y: 0.5 });
  const offsetRef    = useRef({ x: 0, y: 0 });
  const startTimeRef = useRef<number>(0);
  const lastPacketRef = useRef<number>(0);
  const reducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // Resolve canvas pixel coords from normalised node position + parallax offset
  const resolve = useCallback(
    (nx: number, ny: number, w: number, h: number, ox: number, oy: number) => ({
      x: nx * w + ox,
      y: ny * h + oy,
    }),
    []
  );

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const elapsed = now - startTimeRef.current;
    const nodes   = nodesRef.current;
    const packets = packetsRef.current;

    // Smooth parallax offset (eased toward target)
    const targetOX = (mouseRef.current.x - 0.5) * -30;
    const targetOY = (mouseRef.current.y - 0.5) * -20;
    offsetRef.current.x += (targetOX - offsetRef.current.x) * 0.06;
    offsetRef.current.y += (targetOY - offsetRef.current.y) * 0.06;
    const ox = offsetRef.current.x;
    const oy = offsetRef.current.y;

    ctx.clearRect(0, 0, W, H);

    // ── Node entry animation ──────────────────────────────────────────────────
    nodes.forEach((node) => {
      if (reducedMotion) {
        node.opacity = node.targetOpacity;
      } else {
        const entryStart = node.delay;
        const entryDur   = 400;
        const t = Math.min(1, Math.max(0, (elapsed - entryStart) / entryDur));
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        node.opacity = eased * node.targetOpacity;
      }
    });

    // ── Draw edges ────────────────────────────────────────────────────────────
    EDGES.forEach((edge) => {
      const a  = nodes[edge.from];
      const b  = nodes[edge.to];
      const pa = resolve(a.x, a.y, W, H, ox, oy);
      const pb = resolve(b.x, b.y, W, H, ox, oy);
      const alpha = Math.min(a.opacity, b.opacity) * 0.35;
      if (alpha <= 0) return;

      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    // ── Spawn packets ─────────────────────────────────────────────────────────
    if (!reducedMotion && now - lastPacketRef.current > 280) {
      lastPacketRef.current = now;
      const edgeIndex = Math.floor(Math.random() * EDGES.length);
      packets.push({
        edgeIndex,
        t: 0,
        speed: 0.0004 + Math.random() * 0.0003,
        opacity: 0.9,
      });
    }

    // ── Animate & draw packets ────────────────────────────────────────────────
    const PACKET_LEN = 0.18; // fraction of edge length for the glow trail
    for (let i = packets.length - 1; i >= 0; i--) {
      const p  = packets[i];
      const dt = 16; // approximate frame delta
      p.t += p.speed * dt;

      if (p.t > 1 + PACKET_LEN) {
        packets.splice(i, 1);
        continue;
      }

      const edge = EDGES[p.edgeIndex];
      const a    = nodes[edge.from];
      const b    = nodes[edge.to];
      const lineAlpha = Math.min(a.opacity, b.opacity);
      if (lineAlpha <= 0) continue;

      const pa = resolve(a.x, a.y, W, H, ox, oy);
      const pb = resolve(b.x, b.y, W, H, ox, oy);

      // Clamp head and tail to [0,1]
      const head = Math.min(p.t, 1);
      const tail = Math.max(p.t - PACKET_LEN, 0);

      const hx = pa.x + (pb.x - pa.x) * head;
      const hy = pa.y + (pb.y - pa.y) * head;
      const tx = pa.x + (pb.x - pa.x) * tail;
      const ty = pa.y + (pb.y - pa.y) * tail;

      // Gradient: cyan → violet
      const grad = ctx.createLinearGradient(tx, ty, hx, hy);
      grad.addColorStop(0, `rgba(139, 92, 246, 0)`);
      grad.addColorStop(0.4, `rgba(139, 92, 246, ${0.5 * lineAlpha * p.opacity})`);
      grad.addColorStop(1, `rgba(0, 229, 255, ${lineAlpha * p.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 2;
      ctx.stroke();
    }

    // ── Draw nodes ────────────────────────────────────────────────────────────
    nodes.forEach((node) => {
      if (node.opacity <= 0) return;
      const p = resolve(node.x, node.y, W, H, ox, oy);

      // Outer glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, node.radius * 5);
      glow.addColorStop(0, `rgba(0, 229, 255, ${0.25 * node.opacity})`);
      glow.addColorStop(1, `rgba(0, 229, 255, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, node.radius * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${node.opacity})`;
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(p.x - node.radius * 0.25, p.y - node.radius * 0.25, node.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255, ${0.6 * node.opacity})`;
      ctx.fill();
    });

    rafRef.current = requestAnimationFrame(draw);
  }, [resolve, reducedMotion]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr  = window.devicePixelRatio || 1;
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // RAF loop
  useEffect(() => {
    startTimeRef.current = performance.now();
    lastPacketRef.current = performance.now();

    const loop = (now: number) => draw(now);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Mouse parallax
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Use viewport normalised coords
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
