"use client";

/**
 * SingleAgencyRoom.tsx
 *
 * The single 3D futuristic developer agency room experience.
 * Replaces the old 3-room corridor with one cohesive, detailed tech studio.
 */

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { createMonitorTexture } from "../hero/monitorTexture";
import { cloneSceneGraph } from "../hero/sceneMaterials";

const GLB_PATH = "/workstation/programmer_desk_setup__stylized_3d_room.glb";

// Room Dimensions
const W = 12;
const H = 7;
const D = 36;
const BACK_Z = -30;

// ─── Procedural Canvas Textures ───────────────────────────────────────────────

/** Create a canvas texture for the whiteboard with architecture diagrams */
function createWhiteboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Whiteboard background (slightly off-white grid)
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle grid lines
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Diagrams & Flowcharts in marker colors
    ctx.lineWidth = 3;

    // Header
    ctx.font = "bold 22px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText("SYSTEM ARCHITECTURE v2.4 — BYTEBROTHERS", 40, 50);

    // Diagram Box 1: Client WebGL
    ctx.strokeStyle = "#2563eb";
    ctx.strokeRect(40, 90, 220, 100);
    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillText("Client WebGL (3D)", 60, 125);
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("• R3F + GSAP", 60, 150);
    ctx.fillText("• 60 FPS Smooth", 60, 170);

    // Arrow 1
    ctx.strokeStyle = "#059669";
    ctx.beginPath();
    ctx.moveTo(260, 140);
    ctx.lineTo(360, 140);
    ctx.stroke();

    // Diagram Box 2: API Gateway
    ctx.strokeStyle = "#d97706";
    ctx.strokeRect(360, 90, 240, 100);
    ctx.fillStyle = "#d97706";
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillText("API Gateway & Edge", 380, 125);
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("• WebSockets Stream", 380, 150);
    ctx.fillText("• Redis Cache (sub-10ms)", 380, 170);

    // Arrow 2
    ctx.strokeStyle = "#059669";
    ctx.beginPath();
    ctx.moveTo(600, 140);
    ctx.lineTo(700, 140);
    ctx.stroke();

    // Diagram Box 3: AI Engine
    ctx.strokeStyle = "#7c3aed";
    ctx.strokeRect(700, 90, 260, 100);
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillText("AI Compute Cluster", 720, 125);
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("• LLM Agent Pipeline", 720, 150);
    ctx.fillText("• Vector DB Index", 720, 170);

    // Code snippet section below
    ctx.fillStyle = "#0f172a";
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText("const orchestrate = async (req: Request) => {", 40, 250);
    ctx.fillText("  const context = await vectorDb.query(req.prompt);", 40, 275);
    ctx.fillText("  return await streamAiResponse(context);", 40, 300);
    ctx.fillText("};", 40, 325);

    // Sticky Notes (colored squares)
    // Sticky 1 - Amber
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(720, 250, 110, 110);
    ctx.fillStyle = "#854d0e";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("TODO: Optimize", 730, 280);
    ctx.fillText("Shader Bundle!", 730, 300);

    // Sticky 2 - Pink
    ctx.fillStyle = "#fbcfe8";
    ctx.fillRect(850, 250, 110, 110);
    ctx.fillStyle = "#9d174d";
    ctx.fillText("Launch Q3", 860, 280);
    ctx.fillText("Client Demo", 860, 300);
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/** Create canvas texture for the wall-mounted 4K TV showcase screen */
function createTvShowcaseTexture(): { texture: THREE.CanvasTexture; update: (t: number) => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);

  const projects = [
    { title: "NEXUS WEBFLOW ENTERPRISE", tag: "WEBFLOW ENTERPRISE", metric: "100/100 LIGHTHOUSE", color: "#3b82f6" },
    { title: "ALI LOGISTICS PLATFORM", tag: "SUPPLY CHAIN AI", metric: "99.98% UPTIME", color: "#10b981" },
    { title: "QALBIYA EDUCATION ECOSYSTEM", tag: "LMS PLATFORM", metric: "120K ACTIVE USERS", color: "#f59e0b" },
  ];

  const update = (time: number) => {
    if (!ctx) return;
    const index = Math.floor(time / 4) % projects.length;
    const p = projects[index];

    // Dark sleek UI frame
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 1024, 576);

    // Subtle ambient glow border
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 1016, 568);

    // Header bar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 1024, 60);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 18px 'Space Grotesk', sans-serif";
    ctx.fillText("BYTEBROTHERS SHOWCASE PORTFOLIO", 40, 38);

    ctx.fillStyle = p.color;
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText(`[LIVE CASE STUDY 0${index + 1}]`, 780, 38);

    // Project title
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 42px 'Space Grotesk', sans-serif";
    ctx.fillText(p.title, 60, 180);

    // Tag
    ctx.fillStyle = p.color;
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillText(`CATEGORY: ${p.tag}`, 60, 230);

    // Metric badge
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(60, 280, 420, 80);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 280, 420, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.fillText(p.metric, 85, 330);

    // Simulated 3D wireframe graphic on the right
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    const cx = 760;
    const cy = 340;
    const rot = time * 0.8;

    for (let r = 20; r <= 120; r += 25) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.5, rot + r * 0.05, 0, Math.PI * 2);
      ctx.stroke();
    }

    tex.needsUpdate = true;
  };

  return { texture: tex, update };
}

// ─── Secondary Dev Workstation Component ─────────────────────────────────────

function ProceduralWorkstation({ position }: { position: [number, number, number] }) {
  // Simple clean developer desk mesh with laptop, lamp, books & coffee mug
  return (
    <group position={position}>
      {/* Desk surface (dark oak wood) */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[3.2, 0.1, 1.6]} />
        <meshStandardMaterial color="#2d1c10" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Desk legs (black steel) */}
      {[[-1.4, -0.7], [1.4, -0.7], [-1.4, 0.7], [1.4, 0.7]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Laptop */}
      <mesh position={[0, 0.82, 0]} rotation={[0, -0.1, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.55]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Laptop screen open */}
      <mesh position={[0, 1.06, -0.25]} rotation={[-0.2, -0.1, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial color="#0f172a" emissive="#0284c7" emissiveIntensity={0.4} />
      </mesh>

      {/* Books stack */}
      <mesh position={[-1.1, 0.85, -0.2]}>
        <boxGeometry args={[0.4, 0.14, 0.5]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      <mesh position={[-1.1, 0.94, -0.2]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.38, 0.08, 0.46]} />
        <meshStandardMaterial color="#1e40af" roughness={0.8} />
      </mesh>

      {/* Coffee mug */}
      <mesh position={[1.1, 0.86, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.18, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Desk lamp */}
      <mesh position={[1.2, 1.1, -0.4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
      <mesh position={[1.05, 1.4, -0.4]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.12, 0.2, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>

      {/* Lamp point light */}
      <pointLight position={[0.9, 1.3, -0.4]} color="#f59e0b" intensity={2.5} distance={5} />
    </group>
  );
}

// ─── Main SingleAgencyRoom Component ─────────────────────────────────────────

export function SingleAgencyRoom() {
  const { scene: glbScene } = useGLTF(GLB_PATH) as { scene: THREE.Group };

  // Clone GLB workstation 1
  const clonedGlb = useMemo(() => cloneSceneGraph(glbScene) as THREE.Group, [glbScene]);

  // Monitor screens for GLB workstation
  const codeHandle = useMemo(() => createMonitorTexture({ type: "code" }), []);
  const termHandle = useMemo(() => createMonitorTexture({ type: "terminal" }), []);
  const monitorGeo = useMemo(() => new THREE.PlaneGeometry(1.8, 1.1), []);

  // Whiteboard texture
  const whiteboardTex = useMemo(() => createWhiteboardTexture(), []);

  // Wall TV showcase texture handle
  const tvHandle = useMemo(() => createTvShowcaseTexture(), []);

  // Frame update for animated textures
  useFrame(({ clock }) => {
    codeHandle.draw(clock.elapsedTime);
    termHandle.draw(clock.elapsedTime);
    tvHandle.update(clock.elapsedTime);
  });

  // Clean up textures on unmount
  useEffect(() => {
    return () => {
      codeHandle.dispose();
      termHandle.dispose();
      whiteboardTex.dispose();
      tvHandle.texture.dispose();
      monitorGeo.dispose();
    };
  }, [codeHandle, termHandle, whiteboardTex, tvHandle, monitorGeo]);

  return (
    <group>
      {/* ── Room Surfaces (Walls, Floor, Ceiling) ─────────────────────────── */}

      {/* Floor: Polished dark hardwood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -D / 2 + 5]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#22150c" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Ceiling: Clean off-white */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, -D / 2 + 5]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Left Wall: Dark walnut wood panels */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, -D / 2 + 5]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#1a110a" roughness={0.7} />
      </mesh>

      {/* Right Wall: Glass window section + dark wood */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, -D / 2 + 5]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#1a110a" roughness={0.7} />
      </mesh>

      {/* Back Wall (facing camera as you walk in) */}
      <mesh position={[0, H / 2, BACK_Z]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#160d07" roughness={0.8} />
      </mesh>

      {/* ── Illuminated Warm Amber LED Strips (Top & Bottom Edges) ────────── */}

      {/* Left Ceiling LED strip */}
      <mesh position={[-W / 2 + 0.1, H - 0.1, -D / 2 + 5]}>
        <boxGeometry args={[0.08, 0.08, D]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>

      {/* Right Ceiling LED strip */}
      <mesh position={[W / 2 - 0.1, H - 0.1, -D / 2 + 5]}>
        <boxGeometry args={[0.08, 0.08, D]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>

      {/* Back Wall Ceiling LED strip */}
      <mesh position={[0, H - 0.1, BACK_Z + 0.1]}>
        <boxGeometry args={[W, 0.08, 0.08]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>

      {/* ── Back Wall: ByteBrothers Glowing Emblem & 4K TV ───────────────── */}

      {/* Glowing Neon Emblem */}
      <group position={[0, H - 1.2, BACK_Z + 0.2]}>
        {/* Backing plate */}
        <mesh>
          <boxGeometry args={[4.2, 0.9, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Glowing border */}
        <pointLight color="#f59e0b" intensity={3.5} distance={12} />
      </group>

      {/* Wall-Mounted 4K TV / Monitor Showcase */}
      <group position={[0, 3.6, BACK_Z + 0.3]}>
        {/* TV Frame */}
        <mesh>
          <boxGeometry args={[5.6, 3.2, 0.12]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* TV Display Canvas */}
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[5.4, 3.0]} />
          <meshStandardMaterial map={tvHandle.texture} emissiveMap={tvHandle.texture} emissive="#ffffff" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
        <pointLight color="#3b82f6" intensity={2.0} distance={10} position={[0, 0, 1.0]} />
      </group>

      {/* ── Left Wall: Whiteboard & Workstation 2 ────────────────────────── */}

      {/* Whiteboard on Left Wall */}
      <mesh position={[-W / 2 + 0.12, 3.6, -14]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 2.8]} />
        <meshStandardMaterial map={whiteboardTex} roughness={0.2} />
      </mesh>

      {/* Workstation 2 (Procedural Developer Desk) */}
      <ProceduralWorkstation position={[-3.8, 0, -18]} />

      {/* ── Right Wall: GLB Workstation 1 & Glass Window ─────────────────── */}

      {/* Workstation 1 GLB */}
      <primitive object={clonedGlb} scale={0.65} position={[2.2, 0, -8]} />

      {/* Animated monitor screens for Workstation 1 */}
      <mesh geometry={monitorGeo} position={[0.6, 1.85, -13.5]} rotation={[0, Math.PI * 0.1, 0]}>
        <meshStandardMaterial map={codeHandle.texture} emissiveMap={codeHandle.texture} emissive="#00f0ff" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
      <mesh geometry={monitorGeo} position={[3.6, 1.85, -13.5]} rotation={[0, -Math.PI * 0.1, 0]}>
        <meshStandardMaterial map={termHandle.texture} emissiveMap={termHandle.texture} emissive="#00ff80" emissiveIntensity={0.25} toneMapped={false} />
      </mesh>

      {/* Floor-to-Ceiling Glass Window Frame on Right Wall */}
      <group position={[W / 2 - 0.1, 3.5, -20]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[8, 5.5]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.1} metalness={0.9} transparent opacity={0.18} />
        </mesh>
      </group>

      {/* ── Ambient Room Lighting ────────────────────────────────────────── */}

      {/* Main warm ambient daylight fill */}
      <ambientLight color="#fff8f0" intensity={1.4} />

      {/* Overhead warm spot fill lights */}
      <pointLight position={[0, H - 1.5, -6]} color="#f59e0b" intensity={3.0} distance={20} />
      <pointLight position={[0, H - 1.5, -18]} color="#f59e0b" intensity={3.0} distance={20} />
      <pointLight position={[0, H - 1.5, -28]} color="#3b82f6" intensity={2.5} distance={18} />
    </group>
  );
}

useGLTF.preload(GLB_PATH);

export default SingleAgencyRoom;
