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
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,_rgba(6,24,44,0.6)_0%,_#030712_70%)]" />
      
      <Canvas
        shadows
        camera={{ position: [0.5, 0.8, 8], fov: 32 }}
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true, toneMapping: 3 }}
        className="h-full w-full"
      >
        <Suspense fallback={<CanvasLoader />}>

          {/* ── Studio Lighting Rig ── */}

          {/* Global fill — brighter than before for studio-grade illumination */}
          <ambientLight intensity={0.8} color="#d4e5ff" />

          {/* Primary Key Light — warm white overhead to naturally light the desk */}
          <directionalLight 
            position={[5, 10, 8]} 
            intensity={2} 
            color="#ffffff" 
            castShadow 
            shadow-mapSize={2048}
            shadow-camera-far={30}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Targeted Cyan Spotlight — focused on the main desk setup */}
          <spotLight
            position={[5, 8, 5]}
            angle={0.5}
            penumbra={0.8}
            intensity={5}
            color="#00f0ff"
            castShadow
            shadow-mapSize={1024}
            target-position={[2, -1, 0]}
          />

          {/* Magenta/Purple Backlight — rim lighting along edges */}
          <pointLight
            position={[-5, 5, -5]}
            intensity={3}
            color="#a855f7"
            distance={20}
          />

          {/* Subtle cyan fill from below for dramatic underbelly glow */}
          <pointLight
            position={[3, -2, 2]}
            intensity={1.5}
            color="#22d3ee"
            distance={8}
          />

          {/* ── 3D Workstation ── */}
          <WorkstationScene />

          {/* ── Atmospheric Particles ── */}
          <Sparkles count={80} scale={10} size={1.2} speed={0.3} opacity={0.25} color="#22d3ee" />
          <Sparkles count={40} scale={12} size={2} speed={0.15} opacity={0.15} color="#a855f7" />

          {/* ── Shadow Floor ── */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
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
