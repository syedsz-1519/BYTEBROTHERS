"use client";

/**
 * AmbientParticles.tsx
 *
 * Ambient floating code characters and light dust particles inside the 3D room.
 * Uses a single Three.js Points geometry with custom canvas texture for performance.
 */

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 180;
const ROOM_W = 12;
const ROOM_H = 7;
const ROOM_DEPTH = 35;

export function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate initial particle positions and random velocity speeds
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * ROOM_W;
      pos[i * 3 + 1] = Math.random() * ROOM_H;
      pos[i * 3 + 2] = 5 - Math.random() * ROOM_DEPTH;

      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.005;
      spd[i * 3 + 1] = 0.002 + Math.random() * 0.006; // upward drift
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return [pos, spd];
  }, []);

  // Canvas texture generating small glowing particle soft circles
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(245, 158, 11, 0.9)");
      grad.addColorStop(0.4, "rgba(245, 158, 11, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      array[i * 3 + 0] += speeds[i * 3 + 0];
      array[i * 3 + 1] += speeds[i * 3 + 1];
      array[i * 3 + 2] += speeds[i * 3 + 2];

      // Wrap vertically at ceiling
      if (array[i * 3 + 1] > ROOM_H) {
        array[i * 3 + 1] = 0.2;
        array[i * 3 + 0] = (Math.random() - 0.5) * ROOM_W;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        map={texture}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default AmbientParticles;
