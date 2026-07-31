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
      {/* Radial background centered behind 3D workstation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,_rgba(15,23,42,0.85)_0%,_#030712_75%)]" />
      
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 12.5], fov: 35 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true, toneMapping: 3 }}
        className="h-full w-full"
      >
        <Suspense fallback={<CanvasLoader />}>

          {/* ── Studio Lighting Rig ── */}

          {/* Bright ambient fill for native texture clarity */}
          <ambientLight intensity={1.2} color="#ffffff" />

          {/* Primary Key Light — warm overhead light for desk setup */}
          <directionalLight 
            position={[0, 10, 8]} 
            intensity={2.2} 
            color="#ffffff" 
            castShadow 
            shadow-mapSize={2048}
            shadow-camera-far={30}
          />

          {/* Targeted Cyan Accent Spotlight on the workstation */}
          <spotLight
            position={[0, 8, 6]}
            angle={0.6}
            penumbra={0.8}
            intensity={4}
            color="#00f0ff"
            castShadow
            shadow-mapSize={1024}
            target-position={[0, -1.5, 0]}
          />

          {/* Magenta Rim Backlight for edge separation */}
          <pointLight
            position={[-4, 4, -4]}
            intensity={3}
            color="#a855f7"
            distance={20}
          />

          {/* ── Centered Front-Facing 3D Workstation ── */}
          <WorkstationScene />

          {/* ── Atmospheric Particles ── */}
          <Sparkles count={60} scale={10} size={1.2} speed={0.3} opacity={0.25} color="#22d3ee" />
          <Sparkles count={30} scale={12} size={2} speed={0.15} opacity={0.15} color="#a855f7" />

          {/* ── Floor Shadow ── */}
          <ContactShadows 
            position={[0, -2.2, 0]} 
            opacity={0.5} 
            scale={25} 
            blur={2.5} 
            far={6} 
            color="#0a1628" 
          />

        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
