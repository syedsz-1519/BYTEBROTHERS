"use client";

/**
 * SingleAgencyRoom.tsx
 *
 * Light Warm Wooden 3D Developer Agency Room.
 *  - Light Scandinavian oak wood walls & floor
 *  - Soft champagne warm LED recessed ceiling & baseboard lighting
 *  - Natural light wood foreground partition frame
 *  - Whiteboard with system architecture flowcharts
 *  - Wall-mounted TV showcase on light wood slat back wall
 *  - Waving developer figure at standing oak desk
 *  - Floor-to-ceiling daylight window with city skyline view
 */

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { cloneSceneGraph } from "../hero/sceneMaterials";

const GLB_PATH = "/workstation/programmer_desk_setup__stylized_3d_room.glb";

// Room Dimensions
const W = 11.5;
const H = 6.8;
const D = 32;
const BACK_Z = -28;

// ─── Procedural Canvas Textures ───────────────────────────────────────────────

/** Whiteboard Texture with System Architecture Diagram */
function createWhiteboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1024, 640);

    // Subtle grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1.5;
    for (let x = 0; x < 1024; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 640); ctx.stroke();
    }
    for (let y = 0; y < 640; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
    }

    // Header
    ctx.font = "bold 24px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.fillText("System Architecture — ByteBrothers Engine", 40, 55);

    // Flowchart Boxes
    ctx.lineWidth = 3.5;

    // Box 1
    ctx.strokeStyle = "#2563eb";
    ctx.strokeRect(50, 110, 240, 130);
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillText("Front-End WebGL", 70, 150);
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("• Three.js + R3F", 70, 180);
    ctx.fillText("• 60 FPS Shaders", 70, 205);

    // Arrow
    ctx.strokeStyle = "#d97706";
    ctx.beginPath(); ctx.moveTo(290, 175); ctx.lineTo(390, 175); ctx.stroke();

    // Box 2
    ctx.strokeStyle = "#d97706";
    ctx.strokeRect(390, 110, 250, 130);
    ctx.fillStyle = "#d97706";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillText("Real-time API", 410, 150);
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("• WebSocket Stream", 410, 180);
    ctx.fillText("• Redis Sub-10ms", 410, 205);

    // Arrow
    ctx.strokeStyle = "#d97706";
    ctx.beginPath(); ctx.moveTo(640, 175); ctx.lineTo(740, 175); ctx.stroke();

    // Box 3
    ctx.strokeStyle = "#059669";
    ctx.strokeRect(740, 110, 230, 130);
    ctx.fillStyle = "#059669";
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillText("AI Compute", 760, 150);
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("• LLM Agents", 760, 180);
    ctx.fillText("• Vector DB", 760, 205);

    // Sticky Notes
    ctx.fillStyle = "#fef08a"; ctx.fillRect(50, 300, 130, 130);
    ctx.fillStyle = "#854d0e"; ctx.font = "bold 13px sans-serif";
    ctx.fillText("TODO: Zero", 65, 335); ctx.fillText("Layout Shift", 65, 360);

    ctx.fillStyle = "#fed7aa"; ctx.fillRect(210, 300, 130, 130);
    ctx.fillStyle = "#9a3412";
    ctx.fillText("Q3 Release", 225, 335); ctx.fillText("Client Demo", 225, 360);
  }

  return new THREE.CanvasTexture(canvas);
}

/** Daylight City Skyline Window Texture */
function createCitySkylineTexture(): { texture: THREE.CanvasTexture; update: (t: number) => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);

  const update = () => {
    if (!ctx) return;
    // Bright warm daylight gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, "#e0f2fe");
    grad.addColorStop(0.5, "#bae6fd");
    grad.addColorStop(1, "#fef3c7");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Light architectural buildings silhouette
    ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
    const buildings = [
      [50, 300, 140, 724], [210, 200, 180, 824], [410, 280, 150, 744],
      [580, 160, 190, 864], [790, 320, 160, 704],
    ];
    buildings.forEach(([x, y, w, h]) => {
      ctx.fillRect(x, y, w, h);
    });

    tex.needsUpdate = true;
  };

  return { texture: tex, update };
}

/** Wall-mounted TV Showcase Texture */
function createTvShowcaseTexture(): { texture: THREE.CanvasTexture; update: (t: number) => void } {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);

  const update = () => {
    if (!ctx) return;
    // Clean bright UI container
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1024, 576);

    // Warm amber header bar
    ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
    ctx.fillRect(0, 0, 1024, 64);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px 'Space Grotesk', sans-serif";
    ctx.fillText("ByteBrothers Portfolio: Quantum UI", 40, 42);

    // Main showcase card mockup
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, 96, 560, 440);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 96, 560, 440);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 32px 'Space Grotesk', sans-serif";
    ctx.fillText("NEXUS WEBFLOW ENTERPRISE", 70, 160);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillText("100/100 LIGHTHOUSE SPEED", 70, 205);

    // Grid mockup on right
    ctx.fillStyle = "#334155";
    ctx.fillRect(630, 96, 354, 205);
    ctx.fillRect(630, 330, 354, 205);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText("[ALI LOGISTICS PLATFORM]", 650, 130);
    ctx.fillText("[QALBIYA LMS ECOSYSTEM]", 650, 365);

    tex.needsUpdate = true;
  };

  return { texture: tex, update };
}

// ─── Waving Developer Figure Component ──────────────────────────────────────

function WavingDeveloper({ position }: { position: [number, number, number] }) {
  const armRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(clock.elapsedTime * 3) * 0.25 - 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Office Chair */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.9, -0.3]}>
        <boxGeometry args={[0.6, 0.8, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Seated Developer */}
      <mesh position={[-0.15, 0.4, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.15, 0.4, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Torso (Warm hoodie) */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#d97706" roughness={0.6} />
      </mesh>

      {/* Waving Arm */}
      <group ref={armRef} position={[0.3, 1.1, 0]}>
        <mesh position={[0.15, 0.2, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0.3, 0.4, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
      </group>
    </group>
  );
}

// ─── SingleAgencyRoom Main Component ─────────────────────────────────────────

export function SingleAgencyRoom() {
  const { scene: glbScene } = useGLTF(GLB_PATH) as { scene: THREE.Group };
  const clonedGlb = useMemo(() => cloneSceneGraph(glbScene) as THREE.Group, [glbScene]);

  const whiteboardTex = useMemo(() => createWhiteboardTexture(), []);
  const skylineHandle = useMemo(() => createCitySkylineTexture(), []);
  const tvHandle = useMemo(() => createTvShowcaseTexture(), []);

  useFrame(({ clock }) => {
    skylineHandle.update(clock.elapsedTime);
    tvHandle.update(clock.elapsedTime);
  });

  useEffect(() => {
    return () => {
      whiteboardTex.dispose();
      skylineHandle.texture.dispose();
      tvHandle.texture.dispose();
    };
  }, [whiteboardTex, skylineHandle, tvHandle]);

  return (
    <group>
      {/* ── Foreground Partition Frame (Light Natural Oak Wood) ─────────── */}
      <group position={[0, H / 2, 7]}>
        <mesh position={[-W / 2, 0, 0]}><boxGeometry args={[0.2, H, 0.2]} /><meshStandardMaterial color="#78350f" roughness={0.4} /></mesh>
        <mesh position={[W / 2, 0, 0]}><boxGeometry args={[0.2, H, 0.2]} /><meshStandardMaterial color="#78350f" roughness={0.4} /></mesh>
        <mesh position={[0, H / 2, 0]}><boxGeometry args={[W, 0.2, 0.2]} /><meshStandardMaterial color="#78350f" roughness={0.4} /></mesh>
        <mesh position={[0, -H / 2, 0]}><boxGeometry args={[W, 0.2, 0.2]} /><meshStandardMaterial color="#78350f" roughness={0.4} /></mesh>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.12, H, 0.12]} /><meshStandardMaterial color="#78350f" roughness={0.4} /></mesh>
      </group>

      {/* ── Room Surfaces (Light Warm Wood Palette) ──────────────────────── */}

      {/* Floor: Light Natural Oak Wood Planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -D / 2 + 5]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#d4be9c" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Cream Woven Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]}>
        <planeGeometry args={[5.5, 12]} />
        <meshStandardMaterial color="#f3ece0" roughness={0.9} />
      </mesh>

      {/* Ceiling: Clean Warm Off-White Cream */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, -D / 2 + 5]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#faf7f2" roughness={0.8} />
      </mesh>

      {/* Back Wall: Light Scandinavian Oak Wood Slats */}
      <mesh position={[0, H / 2, BACK_Z]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#e6d5c3" roughness={0.7} />
      </mesh>

      {/* Left Wall: Light Birch Wood Panels */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, -D / 2 + 5]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#ebdccb" roughness={0.7} />
      </mesh>

      {/* Right Wall Window Surface */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2 - 0.05, H / 2, -14]}>
        <planeGeometry args={[18, H - 0.4]} />
        <meshStandardMaterial map={skylineHandle.texture} roughness={0.2} />
      </mesh>

      {/* ── Soft Warm Champagne LED Channel Lighting ────────────────────── */}

      {/* Ceiling Perimeter LED Rectangular Ring */}
      <mesh position={[-W / 2 + 0.15, H - 0.1, -D / 2 + 5]}><boxGeometry args={[0.08, 0.08, D]} /><meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.8} toneMapped={false} /></mesh>
      <mesh position={[W / 2 - 0.15, H - 0.1, -D / 2 + 5]}><boxGeometry args={[0.08, 0.08, D]} /><meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.8} toneMapped={false} /></mesh>
      <mesh position={[0, H - 0.1, BACK_Z + 0.1]}><boxGeometry args={[W, 0.08, 0.08]} /><meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.9} toneMapped={false} /></mesh>

      {/* Floor Baseboard Warm Amber LED Strips */}
      <mesh position={[-W / 2 + 0.15, 0.08, -D / 2 + 5]}><boxGeometry args={[0.06, 0.06, D]} /><meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.7} toneMapped={false} /></mesh>
      <mesh position={[W / 2 - 0.15, 0.08, -D / 2 + 5]}><boxGeometry args={[0.06, 0.06, D]} /><meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.7} toneMapped={false} /></mesh>
      <mesh position={[0, 0.08, BACK_Z + 0.1]}><boxGeometry args={[W, 0.06, 0.06]} /><meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.8} toneMapped={false} /></mesh>

      {/* ── Back Wall: Glowing Orange Neon "BB The ByteBrothers" + 4K TV ──── */}

      {/* Glowing Neon Emblem */}
      <group position={[0, H - 1.2, BACK_Z + 0.3]}>
        <pointLight color="#f59e0b" intensity={3.5} distance={15} />
      </group>

      {/* Wall-Mounted 4K TV */}
      <group position={[0, 3.2, BACK_Z + 0.3]}>
        <mesh><boxGeometry args={[5.8, 3.4, 0.12]} /><meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} /></mesh>
        <mesh position={[0, 0, 0.07]}><planeGeometry args={[5.6, 3.2]} /><meshStandardMaterial map={tvHandle.texture} emissiveMap={tvHandle.texture} emissive="#ffffff" emissiveIntensity={0.6} toneMapped={false} /></mesh>
        <pointLight color="#f59e0b" intensity={2.2} distance={10} position={[0, 0, 1.2]} />
      </group>

      {/* ── Left Wall: Whiteboard & Left Oak Workstation with Waving Developer ─ */}

      {/* Whiteboard */}
      <mesh position={[-W / 2 + 0.12, 3.8, -14]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6.0, 3.2]} />
        <meshStandardMaterial map={whiteboardTex} roughness={0.2} />
      </mesh>

      {/* Standing Oak Desk */}
      <group position={[-3.8, 0, -14]}>
        <mesh position={[0, 0.75, 0]}><boxGeometry args={[3.2, 0.1, 1.5]} /><meshStandardMaterial color="#c29b68" roughness={0.4} /></mesh>
        <mesh position={[-0.7, 1.3, -0.2]} rotation={[0, 0.15, 0]}><boxGeometry args={[1.2, 0.7, 0.04]} /><meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} /></mesh>
        <mesh position={[0.7, 1.3, -0.2]} rotation={[0, -0.15, 0]}><boxGeometry args={[1.2, 0.7, 0.04]} /><meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} /></mesh>
      </group>

      {/* Seated Waving Developer Figure */}
      <WavingDeveloper position={[-3.8, 0, -13.2]} />

      {/* ── Right Wall: 2nd Workstation ──────────────────────────────────── */}

      <primitive object={clonedGlb} scale={0.65} position={[2.5, 0, -10]} />

      {/* ── Bright Warm Daylight Lighting ───────────────────────────────── */}

      <ambientLight color="#ffffff" intensity={2.2} />
      <pointLight position={[0, H - 1.2, -6]} color="#fff8ed" intensity={3.0} distance={20} />
      <pointLight position={[0, H - 1.2, -18]} color="#fff8ed" intensity={3.0} distance={20} />
    </group>
  );
}

useGLTF.preload(GLB_PATH);

export default SingleAgencyRoom;
