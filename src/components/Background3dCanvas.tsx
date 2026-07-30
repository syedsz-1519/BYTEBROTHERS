import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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

export const Background3dCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    if (!isEnabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let reqId: number;

    // Smoothed state for interpolation
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let frameCount = 0;
    let lastFpsTime = performance.now();

    // 1. Generate Parametric Torus Knot 3D Vertices
    const p = 2;
    const q = 3;
    const segments = 160;
    const knotPoints: Point3D[] = [];

    for (let i = 0; i < segments; i++) {
      const phi = (i / segments) * Math.PI * 2;
      const r = 1.2 + 0.5 * Math.sin(q * phi);
      const x = r * Math.cos(p * phi) * 160;
      const y = r * Math.sin(p * phi) * 160;
      const z = 0.6 * Math.sin(q * phi) * 160;
      knotPoints.push({ x, y, z });
    }

    // 2. Generate Outer Icosahedron / Cage 3D Vertices
    const phiConst = (1 + Math.sqrt(5)) / 2;
    const cageScale = 260;
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

    // 3. Generate Floating Space Starfield Particles
    const particleCount = 200;
    const particles: Particle3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: (Math.random() - 0.5) * 800,
        size: Math.random() * 1.8 + 0.5,
        color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(99, 102, 241, ',
      });
    }

    // Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    let isTabActive = true;
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let time = 0;

    // 3D Point Rotation & Perspective Projection Helpers
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
      const perspective = 700;
      const scale = perspective / (perspective + pt.z + 400);
      return {
        x: width / 2 + (pt.x + offsetX) * scale,
        y: height / 2 + (pt.y + offsetY) * scale,
        scale,
      };
    };

    // Main Render Loop
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (!isTabActive) return;

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = now;
      }

      time += 0.012;

      // Smooth Lerp target values
      currentScroll += (targetScroll - currentScroll) * 0.05;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const scrollRatio = currentScroll / 1000;

      ctx.clearRect(0, 0, width, height);

      const offsetX = currentMouseX * 60;
      const offsetY = currentMouseY * 60 - scrollRatio * 30;

      // Render Floating Starfield Particles
      particles.forEach((p) => {
        const rotZ = time * 0.02 + scrollRatio * 0.1;
        const pt = rotatePoint(p, time * 0.01, time * 0.015 + rotZ, 0);
        const proj = projectPoint(pt, offsetX, offsetY);

        if (proj.x >= 0 && proj.x <= width && proj.y >= 0 && proj.y <= height) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(0.5, p.size * proj.scale), 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.min(0.8, proj.scale * 0.8)})`;
          ctx.fill();
        }
      });

      // Render Outer Icosahedron Cage Wireframe
      const rotCageX = -time * 0.15 - scrollRatio * 0.5;
      const rotCageY = time * 0.2 - scrollRatio * 0.8;
      const projectedCage = baseIcosahedron.map((pt) => {
        const rot = rotatePoint(pt, rotCageX, rotCageY, 0);
        return projectPoint(rot, offsetX, offsetY);
      });

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < projectedCage.length; i++) {
        for (let j = i + 1; j < projectedCage.length; j++) {
          const dx = projectedCage[i].x - projectedCage[j].x;
          const dy = projectedCage[i].y - projectedCage[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 280) {
            ctx.beginPath();
            ctx.moveTo(projectedCage[i].x, projectedCage[i].y);
            ctx.lineTo(projectedCage[j].x, projectedCage[j].y);
            ctx.stroke();
          }
        }
      }

      // Render Parametric TorusKnot Glow Wireframe
      const rotKnotX = time * 0.35 + scrollRatio * 1.2;
      const rotKnotY = time * 0.45 + scrollRatio * 1.6;
      const projectedKnot = knotPoints.map((pt) => {
        const rot = rotatePoint(pt, rotKnotX, rotKnotY, 0);
        return projectPoint(rot, offsetX, offsetY);
      });

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.6;

      for (let i = 0; i < projectedKnot.length; i++) {
        if (i === 0) {
          ctx.moveTo(projectedKnot[i].x, projectedKnot[i].y);
        } else {
          ctx.lineTo(projectedKnot[i].x, projectedKnot[i].y);
        }
      }
      ctx.closePath();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#0284c7';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isEnabled]);

  return (
    <>
      {/* Fixed Fullscreen 3D Background Canvas Layer */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60 transition-opacity duration-1000 overflow-hidden"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating 3D Background Control HUD (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          title={isEnabled ? 'Disable 3D Background' : 'Enable 3D Background'}
          className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-cyan-300 border border-blue-500/30 text-[11px] font-mono flex items-center gap-2 shadow-xl transition-all"
        >
          {isEnabled ? (
            <>
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">3D BG: ON</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-[9px] text-blue-300">
                {fps} FPS
              </span>
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
              <span>3D BG: OFF</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
