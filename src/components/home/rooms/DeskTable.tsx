"use client";

/**
 * DeskTable.tsx — Room 1: Developer's Table
 *
 * Close-up desk view with procedural props:
 *  - Room shell built by buildRoomGeometry (darker #0d1520 walls)
 *  - Desk surface, sticky notes, coffee mug
 *  - Mechanical keyboard with animated RGB emissive keys (full hue cycle / 3 s)
 *  - Side monitor with createMonitorTexture('code') animated each frame
 *  - Desk lamp SpotLight with proximityFade-driven intensity
 *  - Visibility culling: hidden when |camZ - roomZ| > ROOM_DEPTH * 1.5
 *  - Full geometry / material / texture disposal on unmount
 */

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  buildRoomGeometry,
  proximityFade,
  ROOM_DEPTH,
  type CamRef,
} from "../../../utils/devRoomUtils";
import { createMonitorTexture } from "../../hero/monitorTexture";

// ─── Constants ────────────────────────────────────────────────────────────────

const KEYBOARD_COLS = 14;
const KEYBOARD_ROWS = 5;
const KEY_COUNT = KEYBOARD_COLS * KEYBOARD_ROWS; // 70

const KEY_SPACING_X = 0.09;
const KEY_SPACING_Z = 0.09;

// ─── Props ────────────────────────────────────────────────────────────────────

interface DeskTableProps {
  roomZ: number;
  camRef: CamRef;
}

// ─── DeskTable ────────────────────────────────────────────────────────────────

export const DeskTable: React.FC<DeskTableProps> = ({ roomZ, camRef }) => {
  // ── Refs ───────────────────────────────────────────────────────────────────
  const groupRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const keysRef = useRef<THREE.InstancedMesh>(null);

  // ── Room shell ─────────────────────────────────────────────────────────────
  const roomGroup = useMemo(() => buildRoomGeometry({ id: "desk-table", roomZ }), [roomZ]);

  // ── Desk surface ───────────────────────────────────────────────────────────
  const deskGeo = useMemo(() => new THREE.BoxGeometry(4, 0.08, 2), []);
  const deskMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d4a373", roughness: 0.6 }),
    []
  );

  // ── Sticky notes ──────────────────────────────────────────────────────────
  const stickyGeo = useMemo(() => new THREE.PlaneGeometry(0.4, 0.4), []);
  const stickyMats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#fef08a", side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: "#bbf7d0", side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: "#bfdbfe", side: THREE.DoubleSide }),
    ],
    []
  );

  // Positions for the three sticky notes scattered on the desk surface
  const stickyPositions: [number, number, number][] = useMemo(
    () => [
      [-1.4, 0.80, roomZ + 0.6],
      [-0.8, 0.80, roomZ - 0.5],
      [0.6, 0.80, roomZ + 0.7],
    ],
    [roomZ]
  );

  // ── Coffee mug ─────────────────────────────────────────────────────────────
  const mugGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.10, 0.3, 12), []);
  const mugMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 }),
    []
  );

  // ── Keyboard base ──────────────────────────────────────────────────────────
  const kbBaseGeo = useMemo(() => new THREE.BoxGeometry(1.4, 0.05, 0.5), []);
  const kbBaseMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.5 }),
    []
  );

  // ── Keyboard keys (InstancedMesh) ──────────────────────────────────────────
  const keyGeo = useMemo(() => new THREE.BoxGeometry(0.07, 0.06, 0.07), []);
  const keyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111122",
        roughness: 0.4,
        emissive: new THREE.Color(1, 0, 0),
        emissiveIntensity: 0.8,
      }),
    []
  );

  // Pre-build the instance matrices (static layout; only emissive animates)
  const keyInstanceData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];

    // Keyboard base world position
    const kbX = 0.2;
    const kbY = 0.82 + 0.025 + 0.03; // on top of the base (base half-height 0.025 + key half-height 0.03)
    const kbZ = roomZ + 0.2;

    // Grid origin: top-left corner of the key grid
    const startX = kbX - ((KEYBOARD_COLS - 1) * KEY_SPACING_X) / 2;
    const startZ = kbZ - ((KEYBOARD_ROWS - 1) * KEY_SPACING_Z) / 2;

    for (let row = 0; row < KEYBOARD_ROWS; row++) {
      for (let col = 0; col < KEYBOARD_COLS; col++) {
        dummy.position.set(
          startX + col * KEY_SPACING_X,
          kbY,
          startZ + row * KEY_SPACING_Z
        );
        dummy.updateMatrix();
        matrices.push(dummy.matrix.clone());
      }
    }

    return matrices;
  }, [roomZ]);

  // ── Side monitor ───────────────────────────────────────────────────────────
  const monitorGeo = useMemo(() => new THREE.PlaneGeometry(1.6, 1.0), []);
  const monitorHandle = useMemo(() => createMonitorTexture({ type: "code" }), []);
  const monitorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: monitorHandle.texture,
        emissive: new THREE.Color(0x003344),
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide,
      }),
    [monitorHandle.texture]
  );

  // ── Apply instance matrices once keys mesh is ready ───────────────────────
  useEffect(() => {
    const mesh = keysRef.current;
    if (!mesh) return;
    keyInstanceData.forEach((mat, i) => {
      mesh.setMatrixAt(i, mat);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [keyInstanceData]);

  // ── Add / remove room shell from parent group ─────────────────────────────
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.add(roomGroup);
    return () => {
      g.remove(roomGroup);
    };
  }, [roomGroup]);

  // ── Disposal on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      // Room shell geometries & materials
      roomGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      // Desk props
      deskGeo.dispose();
      deskMat.dispose();
      stickyGeo.dispose();
      stickyMats.forEach((m) => m.dispose());
      mugGeo.dispose();
      mugMat.dispose();
      kbBaseGeo.dispose();
      kbBaseMat.dispose();
      keyGeo.dispose();
      keyMat.dispose();

      // Monitor
      monitorGeo.dispose();
      monitorMat.dispose();
      monitorHandle.dispose();
    };
  }, [
    roomGroup,
    deskGeo,
    deskMat,
    stickyGeo,
    stickyMats,
    mugGeo,
    mugMat,
    kbBaseGeo,
    kbBaseMat,
    keyGeo,
    keyMat,
    monitorGeo,
    monitorMat,
    monitorHandle,
  ]);

  // ── Per-frame animation ────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;

    const camZ = camRef.current?.z ?? 0;
    const dist = Math.abs(camZ - roomZ);
    const cullRadius = ROOM_DEPTH * 1.5;

    // Visibility culling
    g.visible = dist <= cullRadius;
    if (!g.visible) return;

    const elapsed = clock.elapsedTime;

    // Animated emissive hue on keyboard keys (full RGB cycle every 3 s)
    const hue = (elapsed / 3) % 1.0;
    keyMat.emissive.setHSL(hue, 1, 0.5);

    // Desk lamp intensity via proximity fade
    if (spotRef.current) {
      const fade = proximityFade(camZ, roomZ, cullRadius);
      spotRef.current.intensity = fade * 3.0;
    }

    // Animate side monitor canvas
    monitorHandle.draw(elapsed);
  });

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <group ref={groupRef}>
      {/* Desk surface */}
      <mesh
        geometry={deskGeo}
        material={deskMat}
        position={[0, 0.75, roomZ]}
      />

      {/* Sticky notes */}
      {stickyPositions.map((pos, i) => (
        <mesh
          key={i}
          geometry={stickyGeo}
          material={stickyMats[i]}
          position={pos}
          rotation={[-Math.PI / 2, 0, (i - 1) * 0.15]}
        />
      ))}

      {/* Coffee mug */}
      <mesh
        geometry={mugGeo}
        material={mugMat}
        position={[-1.2, 0.95, roomZ - 0.3]}
      />

      {/* Keyboard base */}
      <mesh
        geometry={kbBaseGeo}
        material={kbBaseMat}
        position={[0.2, 0.82, roomZ + 0.2]}
      />

      {/* Keyboard keys — InstancedMesh */}
      <instancedMesh
        ref={keysRef}
        args={[keyGeo, keyMat, KEY_COUNT]}
        frustumCulled={false}
      />

      {/* Side monitor */}
      <mesh
        geometry={monitorGeo}
        material={monitorMat}
        position={[1.8, 1.2, roomZ - 0.2]}
        rotation={[0, -0.3, 0]}
      />

      {/* Desk lamp SpotLight */}
      <spotLight
        ref={spotRef}
        color="#ffe8b0"
        intensity={0}
        angle={Math.PI / 6}
        penumbra={0.4}
        distance={5}
        decay={2}
        position={[-1.5, 2.5, roomZ + 0.5]}
        castShadow={false}
      />
      {/* SpotLight target anchored at desk surface below the lamp */}
      <object3D position={[-1.5, 0.75, roomZ + 0.5]} />
    </group>
  );
};

export default DeskTable;
