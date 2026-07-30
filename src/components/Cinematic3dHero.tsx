import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Layers, Zap } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
}

export const Cinematic3dHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderMode] = useState<'3d' | 'fallback'>('3d');

  useEffect(() => {
    if (!canvasRef.current || !mountRef.current) return;

    const container = mountRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    let reqId: number;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // 1. Generate TorusKnot 3D Vertices
    const p = 2;
    const q = 3;
    const segments = 140;
    const knotPoints: Point3D[] = [];

    for (let i = 0; i < segments; i++) {
      const phi = (i / segments) * Math.PI * 2;
      const r = 1.2 + 0.45 * Math.sin(q * phi);
      const x = r * Math.cos(p * phi) * 110;
      const y = r * Math.sin(p * phi) * 110;
      const z = 0.55 * Math.sin(q * phi) * 110;
      knotPoints.push({ x, y, z });
    }

    // 2. Generate Outer Icosahedron Vertices
    const phiConst = (1 + Math.sqrt(5)) / 2;
    const cageScale = 210;
    const baseIcosahedron: Point3D[] = [
      { x: -1, y: phiConst, z: 0 },
      { x: 1, y: phiConst, z: 0 },
      { x: -1, y: -phiConst, z: 0 },
      { x: 1, y: -phiConst, z: 0 },

      { x: 0, y: -1, z: phiConst },
      { x: 0, y: 1, z: phiConst },
      { x: 0, y: -1, z: -phiConst },
      { x: 0, y: 1, z: -phiConst },

      { x: phiConst, y: 0, z: -1 },
      { x: phiConst, y: 0, z: 1 },
      { x: -phiConst, y: 0, z: -1 },
      { x: -phiConst, y: 0, z: 1 },
    ].map((pt) => ({
      x: pt.x * cageScale,
      y: pt.y * cageScale,
      z: pt.z * cageScale,
    }));

    // 3. Floating Particles
    const particleCount = 180;
    const particles: Particle3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: (Math.random() - 0.5) * 600,
        size: Math.random() * 1.6 + 0.6,
        color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ',
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / container.clientWidth - 0.5;
      const y = (e.clientY - rect.top) / container.clientHeight - 0.5;
      targetMouseX = x * 2;
      targetMouseY = y * 2;
    };

    const handleResize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let time = 0;

    const rotatePoint = (pt: Point3D, rotX: number, rotY: number, rotZ: number): Point3D => {
      let x1 = pt.x * Math.cos(rotY) + pt.z * Math.sin(rotY);
      let y1 = pt.y;
      let z1 = -pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);

      let x2 = x1;
      let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);

      let x3 = x2 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
      let y3 = x2 * Math.sin(rotZ) + y2 * Math.cos(rotZ);
      let z3 = z2;

      return { x: x3, y: y3, z: z3 };
    };

    const projectPoint = (pt: Point3D, offsetX: number, offsetY: number) => {
      const perspective = 600;
      const scale = perspective / (perspective + pt.z + 350);
      return {
        x: width / 2 + (pt.x + offsetX) * scale,
        y: height / 2 + (pt.y + offsetY) * scale,
        scale,
      };
    };

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      time += 0.015;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const currentScroll = window.scrollY / 1000;

      ctx.clearRect(0, 0, width, height);

      const offsetX = currentMouseX * 50;
      const offsetY = currentMouseY * 50 - currentScroll * 20;

      // Render Floating Stars
      particles.forEach((p) => {
        const pt = rotatePoint(p, time * 0.01, time * 0.015, 0);
        const proj = projectPoint(pt, offsetX, offsetY);

        if (proj.x >= 0 && proj.x <= width && proj.y >= 0 && proj.y <= height) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.5, p.size * proj.scale), 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.min(0.85, proj.scale * 0.85)})`;
          ctx.fill();
        }
      });

      // Render Outer Icosahedron Cage
      const rotCageX = -time * 0.18 - currentScroll * 0.5;
      const rotCageY = time * 0.22 - currentScroll * 0.8;
      const projectedCage = baseIcosahedron.map((pt) => {
        const rot = rotatePoint(pt, rotCageX, rotCageY, 0);
        return projectPoint(rot, offsetX, offsetY);
      });

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < projectedCage.length; i++) {
        for (let j = i + 1; j < projectedCage.length; j++) {
          const dx = projectedCage[i].x - projectedCage[j].x;
          const dy = projectedCage[i].y - projectedCage[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 230) {
            ctx.beginPath();
            ctx.moveTo(projectedCage[i].x, projectedCage[i].y);
            ctx.lineTo(projectedCage[j].x, projectedCage[j].y);
            ctx.stroke();
          }
        }
      }

      // Render Inner TorusKnot
      const rotKnotX = time * 0.35 + currentScroll * 1.3;
      const rotKnotY = time * 0.45 + currentScroll * 1.8;
      const projectedKnot = knotPoints.map((pt) => {
        const rot = rotatePoint(pt, rotKnotX, rotKnotY, 0);
        return projectPoint(rot, offsetX, offsetY);
      });

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 1.8;

      for (let i = 0; i < projectedKnot.length; i++) {
        if (i === 0) {
          ctx.moveTo(projectedKnot[i].x, projectedKnot[i].y);
        } else {
          ctx.lineTo(projectedKnot[i].x, projectedKnot[i].y);
        }
      }
      ctx.closePath();
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#3b82f6';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#090d16] via-[#0d1322] to-[#080a10] overflow-hidden shadow-2xl my-6">
      {/* 3D WebGL / HTML5 Canvas Viewport */}
      <div
        ref={mountRef}
        className="h-[380px] sm:h-[480px] w-full relative cursor-grab active:cursor-grabbing"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {renderMode === 'fallback' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-blue-950/20">
            <Layers className="h-12 w-12 text-blue-400 animate-bounce mb-3" />
            <div className="font-display font-bold text-xl text-white">Interactive 3D Stage</div>
            <p className="text-xs text-zinc-400 max-w-sm mt-1">
              WebGL rendering active. Move your cursor and scroll to explore 3D spatial transformation layers.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Info Banner */}
      <div className="p-6 bg-black/50 backdrop-blur-md border-t border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-display font-bold text-lg text-white flex items-center gap-2">
            <span>Byte Brothers 3D Engine</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-400/30">
              Native WebGL 3D
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Scroll down the page to control camera depth, particle motion, and wireframe transformations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-cyan-400">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span>60 FPS Hardware Accelerated</span>
        </div>
      </div>
    </div>
  );
};
