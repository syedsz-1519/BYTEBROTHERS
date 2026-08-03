import React, { useEffect, useRef } from 'react';

interface Point3D { x: number; y: number; z: number; }
interface Particle3D { x: number; y: number; z: number; size: number; color: string; }

export const Background3dCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let reqId: number;

    let currentScroll = window.scrollY, targetScroll = window.scrollY;
    let currentMouseX = 0, currentMouseY = 0;
    let targetMouseX  = 0, targetMouseY  = 0;

    // ── Torus-knot vertices ───────────────────────────────────────────────────
    const p = 2, q = 3, segments = 160;
    const knotPoints: Point3D[] = [];
    for (let i = 0; i < segments; i++) {
      const phi = (i / segments) * Math.PI * 2;
      const r   = 1.2 + 0.5 * Math.sin(q * phi);
      knotPoints.push({
        x: r * Math.cos(p * phi) * 160,
        y: r * Math.sin(p * phi) * 160,
        z: 0.6 * Math.sin(q * phi) * 160,
      });
    }

    // ── Icosahedron cage vertices ─────────────────────────────────────────────
    const phi0 = (1 + Math.sqrt(5)) / 2;
    const S    = 260;
    const baseIco: Point3D[] = [
      {x:-1,y:phi0,z:0},{x:1,y:phi0,z:0},{x:-1,y:-phi0,z:0},{x:1,y:-phi0,z:0},
      {x:0,y:-1,z:phi0},{x:0,y:1,z:phi0},{x:0,y:-1,z:-phi0},{x:0,y:1,z:-phi0},
      {x:phi0,y:0,z:-1},{x:phi0,y:0,z:1},{x:-phi0,y:0,z:-1},{x:-phi0,y:0,z:1},
    ].map(pt => ({ x: pt.x * S, y: pt.y * S, z: pt.z * S }));

    // ── Starfield particles ───────────────────────────────────────────────────
    const particles: Particle3D[] = Array.from({ length: 200 }, () => ({
      x: (Math.random() - 0.5) * width  * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: (Math.random() - 0.5) * 800,
      size:  Math.random() * 1.8 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(56,189,248,' : 'rgba(99,102,241,',
    }));

    // ── Event listeners ───────────────────────────────────────────────────────
    const onMove   = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => { targetScroll = window.scrollY; };
    const onResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('mousemove', onMove,   { passive: true });
    window.addEventListener('scroll',   onScroll,  { passive: true });
    window.addEventListener('resize',   onResize);

    let isTabActive = true;
    const onVisibility = () => { isTabActive = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const rotate = (pt: Point3D, rx: number, ry: number, rz: number): Point3D => {
      const x1 = pt.x * Math.cos(ry) + pt.z * Math.sin(ry);
      const z1 = -pt.x * Math.sin(ry) + pt.z * Math.cos(ry);
      const y2 = pt.y * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = pt.y * Math.sin(rx) + z1 * Math.cos(rx);
      return {
        x: x1 * Math.cos(rz) - y2 * Math.sin(rz),
        y: x1 * Math.sin(rz) + y2 * Math.cos(rz),
        z: z2,
      };
    };
    const project = (pt: Point3D, ox: number, oy: number) => {
      const scale = 700 / (700 + pt.z + 400);
      return { x: width / 2 + (pt.x + ox) * scale, y: height / 2 + (pt.y + oy) * scale, scale };
    };

    // ── Render loop ───────────────────────────────────────────────────────────
    let time = 0;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isTabActive) return;
      time += 0.012;

      currentScroll += (targetScroll - currentScroll) * 0.05;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const sr  = currentScroll / 1000;
      const ox  = currentMouseX * 60;
      const oy  = currentMouseY * 60 - sr * 30;

      ctx.clearRect(0, 0, width, height);

      // Starfield
      particles.forEach(p => {
        const pt   = rotate(p, time * 0.01, time * 0.015 + time * 0.02 + sr * 0.1, 0);
        const proj = project(pt, ox, oy);
        if (proj.x < 0 || proj.x > width || proj.y < 0 || proj.y > height) return;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(0.5, p.size * proj.scale), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(0.8, proj.scale * 0.8)})`;
        ctx.fill();
      });

      // Icosahedron cage
      const cage = baseIco.map(pt => project(rotate(pt, -time*0.15 - sr*0.5, time*0.2 - sr*0.8, 0), ox, oy));
      ctx.strokeStyle = 'rgba(6,182,212,0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < cage.length; i++) {
        for (let j = i + 1; j < cage.length; j++) {
          const dx = cage[i].x - cage[j].x, dy = cage[i].y - cage[j].y;
          if (Math.sqrt(dx*dx + dy*dy) < 280) {
            ctx.beginPath();
            ctx.moveTo(cage[i].x, cage[i].y);
            ctx.lineTo(cage[j].x, cage[j].y);
            ctx.stroke();
          }
        }
      }

      // Torus knot
      const knot = knotPoints.map(pt => project(rotate(pt, time*0.35 + sr*1.2, time*0.45 + sr*1.6, 0), ox, oy));
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56,189,248,0.6)';
      ctx.lineWidth = 1.6;
      knot.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.closePath();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#0284c7';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll',   onScroll);
      window.removeEventListener('resize',   onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60 transition-opacity duration-1000 overflow-hidden"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
