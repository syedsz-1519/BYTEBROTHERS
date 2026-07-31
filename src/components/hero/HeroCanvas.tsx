"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles, Html, ContactShadows } from "@react-three/drei";
import { WorkstationScene } from "./WorkstationScene";

// High-tech fallback loader
const CanvasLoader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 font-mono">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-r-2 border-blue-500 animate-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <span className="text-[10px] text-cyan-400 tracking-[0.2em] font-bold uppercase">
          Loading 3D Assets...
        </span>
      </div>
    </Html>
  );
};

export const HeroCanvas = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#030712]">
      {/* Radial background centered behind lower 3D workstation */}
      {/* Dark radial glow on the right side where the workstation sits */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_55%,_rgba(15,23,42,0.9)_0%,_#030712_65%)]" />

      <Canvas
        shadows
        camera={{ position: [1, 1, 10], fov: 36 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true, toneMapping: 3 }}
        className="h-full w-full"
      >
        <Suspense fallback={<CanvasLoader />}>

          {/* Dark atmospheric ambient — keeps left side pitch black */}
          <ambientLight intensity={0.35} color="#94a3b8" />

          {/* Key Light aimed at the right-side workstation */}
          <directionalLight
            position={[8, 10, 6]}
            intensity={1.8}
            color="#ffffff"
            castShadow
            shadow-mapSize={2048}
            shadow-camera-far={30}
          />

          {/* Sharp Cyan Spotlight focused on the desk */}
          <spotLight
            position={[5, 8, 5]}
            angle={0.45}
            penumbra={0.6}
            intensity={6}
            color="#00f0ff"
            castShadow
            shadow-mapSize={1024}
            target-position={[3.5, -1.5, -1]}
          />

          {/* Purple rim backlight for edge separation */}
          <pointLight
            position={[-3, 5, -5]}
            intensity={2.5}
            color="#a855f7"
            distance={18}
          />

          {/* Cyan underglow on the desk */}
          <pointLight
            position={[3.5, -2, 1]}
            intensity={1.5}
            color="#22d3ee"
            distance={6}
          />

          {/* ── Right-Shifted 3D Workstation ── */}
          <WorkstationScene />

          {/* ── Subtle Background Glow Particles ── */}
          <Sparkles count={50} scale={12} size={1} speed={0.2} opacity={0.2} color="#00f0ff" />
          <Sparkles count={25} scale={14} size={1.8} speed={0.1} opacity={0.12} color="#a855f7" />

          {/* ── Deep Shadow Floor ── */}
          <ContactShadows
            position={[3.5, -2.5, -1]}
            opacity={0.6}
            scale={20}
            blur={2}
            far={5}
            color="#030712"
          />

        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
