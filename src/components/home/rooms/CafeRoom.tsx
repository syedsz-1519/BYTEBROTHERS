"use client";

/**
 * CafeRoom.tsx — Room 2: Warm Café Environment
 *
 * Procedural café props: wooden tables, pendant lights, coffee machine silhouette,
 * and a steam particle system over coffee cups.
 *
 * Requirements: 4.6–4.7, 8, 12, 14.2, 15
 */

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildRoomGeometry,
  proximityFade,
  ROOM_DEPTH,
  ROOM_H,
  type CamRef,
} from "../../../utils/devRoomUtils";

// ─── Constants ─────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 20; // 10 per cup × 2 cups

// World-space cup positions (used for steam spawn and cup mesh placement)
// Spec: [-1.5, 0.82, roomZ - 3] and [1.5, 0.82, roomZ - 3]
// These are templates; actual Z is roomZ - 3, filled in at runtime.
const CUP_X = [-1.5, 1.5] as const;
const CUP_Y = 0.82;
const CUP_Z_OFFSET = -3; // relative to roomZ

// ─── Types ─────────────────────────────────────────────────────────────────

interface SteamParticle {
  x: number;
  y: number;
  z: number;
  life: number;  // [0, 1]
  speed: number; // [0.3, 0.5]
}

interface CafeRoomProps {
  roomZ: number;
  camRef: CamRef;
  reducedMotion?: boolean;
}

// ─── CafeRoom ──────────────────────────────────────────────────────────────

export const CafeRoom: React.FC<CafeRoomProps> = ({
  roomZ,
  camRef,
  reducedMotion = false,
}) => {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const groupRef    = useRef<THREE.Group>(null!);
  const steamRef    = useRef<THREE.InstancedMesh>(null!);
  const light1Ref   = useRef<THREE.PointLight>(null!);
  const light2Ref   = useRef<THREE.PointLight>(null!);

  // Pendant shade refs for per-frame emissive update
  const shade1MatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const shade2MatRef = useRef<THREE.MeshStandardMaterial>(null!);

  // ── Particle state (mutable ref — no re-renders) ──────────────────────────
  const particlesRef = useRef<SteamParticle[]>([]);

  // Reusable dummy for building instance matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // ── Initialise particles once (staggered life stages) ────────────────────
  useMemo(() => {
    const ps: SteamParticle[] = [];
    // 10 particles per cup, 2 cups = 20 total
    for (let cup = 0; cup < 2; cup++) {
      const cupX = CUP_X[cup];
      const cupZ = roomZ + CUP_Z_OFFSET;
      for (let k = 0; k < 10; k++) {
        const idx = cup * 10 + k;
        ps.push({
          x:     cupX + (Math.random() - 0.5) * 0.15,
          y:     CUP_Y + 0.1 + (idx / PARTICLE_COUNT) * 0.5, // staggered Y
          z:     cupZ  + (Math.random() - 0.5) * 0.1,
          life:  0.6 + Math.random() * 0.4,
          speed: 0.3 + Math.random() * 0.2,
        });
      }
    }
    particlesRef.current = ps;
  }, [roomZ]);

  // ── Room shell (memoised, added imperatively) ─────────────────────────────
  const roomGroup = useMemo(
    () => buildRoomGeometry({ id: "cafe-room", roomZ }),
    [roomZ]
  );

  // Add room shell imperatively; dispose on unmount
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.add(roomGroup);
    return () => {
      g.remove(roomGroup);
      // Traverse-dispose room shell geometries and materials
      roomGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: THREE.Material) => m.dispose());
          } else {
            (obj.material as THREE.Material).dispose();
          }
        }
      });
    };
  }, [roomGroup]);

  // ── Table geometry and material ───────────────────────────────────────────
  const tableTopGeo = useMemo(() => new THREE.BoxGeometry(1.5, 0.08, 1.0), []);
  const tableLegGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), []);
  const tableMat    = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c48b59", roughness: 0.65, metalness: 0.05 }),
    []
  );

  // ── Coffee cup geometry and material ──────────────────────────────────────
  const cupGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.06, 0.15, 8), []);
  const cupMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 }),
    []
  );

  // ── Pendant geometries ────────────────────────────────────────────────────
  const pendantShadeGeo = useMemo(() => new THREE.SphereGeometry(0.25, 8, 8), []);
  const pendantCordGeo  = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 1.5, 4), []);
  const pendantCordMat  = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.9 }),
    []
  );

  // Two separate shade material instances so each ref can be updated independently
  const pendantShadeMat1 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cc7722",
        roughness: 0.5,
        metalness: 0.1,
        emissive: new THREE.Color("#ff9a3c"),
        emissiveIntensity: 0.0, // driven each frame
      }),
    []
  );
  const pendantShadeMat2 = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cc7722",
        roughness: 0.5,
        metalness: 0.1,
        emissive: new THREE.Color("#ff9a3c"),
        emissiveIntensity: 0.0,
      }),
    []
  );

  // Store shade mats in refs for per-frame access without closures
  useEffect(() => { shade1MatRef.current = pendantShadeMat1; }, [pendantShadeMat1]);
  useEffect(() => { shade2MatRef.current = pendantShadeMat2; }, [pendantShadeMat2]);

  // ── Coffee machine geometries and materials ───────────────────────────────
  const machineBodyGeo = useMemo(() => new THREE.BoxGeometry(0.6, 0.8, 0.4), []);
  const machineTopGeo  = useMemo(() => new THREE.BoxGeometry(0.4, 0.2, 0.3), []);
  const machineMat     = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2c2c2c", roughness: 0.6, metalness: 0.4 }),
    []
  );
  const machineTopMat  = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3a3a3a", roughness: 0.55, metalness: 0.35 }),
    []
  );

  // ── Steam geometry and material ───────────────────────────────────────────
  const steamGeo = useMemo(() => new THREE.PlaneGeometry(0.08, 0.12), []);
  const steamMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // ── Dispose all inline resources on unmount ───────────────────────────────
  useEffect(() => {
    return () => {
      tableTopGeo.dispose();
      tableLegGeo.dispose();
      tableMat.dispose();
      cupGeo.dispose();
      cupMat.dispose();
      pendantShadeGeo.dispose();
      pendantCordGeo.dispose();
      pendantCordMat.dispose();
      pendantShadeMat1.dispose();
      pendantShadeMat2.dispose();
      machineBodyGeo.dispose();
      machineTopGeo.dispose();
      machineMat.dispose();
      machineTopMat.dispose();
      steamGeo.dispose();
      steamMat.dispose();
      dummy.clear();
    };
  }, [
    tableTopGeo, tableLegGeo, tableMat,
    cupGeo, cupMat,
    pendantShadeGeo, pendantCordGeo, pendantCordMat,
    pendantShadeMat1, pendantShadeMat2,
    machineBodyGeo, machineTopGeo, machineMat, machineTopMat,
    steamGeo, steamMat,
    dummy,
  ]);

  // ── Per-frame logic ───────────────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const camZ   = camRef.current?.z ?? 0;
    const culled = Math.abs(camZ - roomZ) > ROOM_DEPTH * 1.5;

    // Visibility culling (Req 12.2)
    groupRef.current.visible = !culled;
    if (culled) return;

    // Proximity fade factor for lights / glow
    const fade = proximityFade(camZ, roomZ, ROOM_DEPTH * 1.2);

    // Drive point light intensities
    if (light1Ref.current) light1Ref.current.intensity = fade * 2.5;
    if (light2Ref.current) light2Ref.current.intensity = fade * 2.5;

    // Drive pendant emissive glow
    if (shade1MatRef.current) shade1MatRef.current.emissiveIntensity = fade * 1.2;
    if (shade2MatRef.current) shade2MatRef.current.emissiveIntensity = fade * 1.2;

    // Steam particle system — skip entirely when reducedMotion (Req 14.2)
    if (reducedMotion) {
      if (steamRef.current) steamRef.current.visible = false;
      return;
    }

    const steamMesh = steamRef.current;
    if (!steamMesh) return;

    steamMesh.visible = true;

    const ps = particlesRef.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = ps[i];

      // Advance particle
      p.y    += p.speed * delta;
      p.life -= delta * 0.4;

      // Respawn when life exhausted
      if (p.life <= 0) {
        // Which cup does this particle belong to? (first 10 → cup 0, next 10 → cup 1)
        const cupIdx = i < 10 ? 0 : 1;
        p.x    = CUP_X[cupIdx] + (Math.random() - 0.5) * 0.15;
        p.y    = CUP_Y + 0.1;
        p.z    = (roomZ + CUP_Z_OFFSET) + (Math.random() - 0.5) * 0.1;
        p.life  = 0.6 + Math.random() * 0.4;  // [0.6, 1]
        p.speed = 0.3 + Math.random() * 0.2;  // [0.3, 0.5]
      }

      // Update instance matrix
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.life > 0 ? 1 : 0);
      dummy.updateMatrix();
      steamMesh.setMatrixAt(i, dummy.matrix);
    }

    steamMesh.instanceMatrix.needsUpdate = true;

    // Shared opacity for all steam instances
    steamMat.opacity = 0.35;
  });

  // ── Derived world positions ───────────────────────────────────────────────

  // Table positions: 2 tables as per spec
  const tablePositions: [number, number, number][] = [
    [-1.5, 0.7, roomZ - 3],
    [ 1.5, 0.7, roomZ - 3],
  ];

  // Leg corner offsets from table top centre (XZ plane)
  const legOffsets: [number, number][] = [
    [-0.65, -0.4],
    [ 0.65, -0.4],
    [-0.65,  0.4],
    [ 0.65,  0.4],
  ];

  // Pendant positions: one above each table
  // Spec: [-1.5, ROOM_H - 0.8, roomZ - 3] and [1.5, ROOM_H - 0.8, roomZ - 3]
  const pendantPositions: [number, number, number][] = [
    [-1.5, ROOM_H - 0.8, roomZ - 3],
    [ 1.5, ROOM_H - 0.8, roomZ - 3],
  ];

  return (
    <group ref={groupRef}>
      {/* Room shell added imperatively via useEffect above */}

      {/* ── Wooden tables (2) ── */}
      {tablePositions.map(([tx, ty, tz], ti) => (
        <group key={`table-${ti}`} position={[tx, ty, tz]}>
          {/* Table top */}
          <mesh geometry={tableTopGeo} material={tableMat} />
          {/* 4 legs */}
          {legOffsets.map(([lx, lz], li) => (
            <mesh
              key={`leg-${li}`}
              geometry={tableLegGeo}
              material={tableMat}
              position={[lx, -0.39, lz]}
            />
          ))}
        </group>
      ))}

      {/* ── Coffee cups on each table ── */}
      {/* Spec: CylinderGeometry(0.08, 0.06, 0.15, 8) at [-1.5, 0.82, roomZ-3] and [1.5, 0.82, roomZ-3] */}
      <mesh geometry={cupGeo} material={cupMat} position={[-1.5, CUP_Y, roomZ + CUP_Z_OFFSET]} />
      <mesh geometry={cupGeo} material={cupMat} position={[ 1.5, CUP_Y, roomZ + CUP_Z_OFFSET]} />

      {/* ── Pendant lights ── */}
      {pendantPositions.map(([px, py, pz], pi) => (
        <group key={`pendant-${pi}`} position={[px, py, pz]}>
          {/* Cord hanging down from near-ceiling position */}
          <mesh
            geometry={pendantCordGeo}
            material={pendantCordMat}
            position={[0, 0.75, 0]}
          />
          {/* Shade sphere with emissive glow */}
          <mesh
            geometry={pendantShadeGeo}
            material={pi === 0 ? pendantShadeMat1 : pendantShadeMat2}
          />
        </group>
      ))}

      {/* ── Point lights below each pendant shade ── */}
      <pointLight
        ref={light1Ref}
        color="#ff9a3c"
        intensity={0}
        decay={2}
        distance={8}
        position={[pendantPositions[0][0], pendantPositions[0][1] - 0.4, pendantPositions[0][2]]}
      />
      <pointLight
        ref={light2Ref}
        color="#ff9a3c"
        intensity={0}
        decay={2}
        distance={8}
        position={[pendantPositions[1][0], pendantPositions[1][1] - 0.4, pendantPositions[1][2]]}
      />

      {/* ── Coffee machine at back wall ── */}
      {/* Spec: body at [1.5, 0.6, roomZ - 9], top at [1.5, 1.05, roomZ - 9] */}
      <group position={[1.5, 0, roomZ - 9]}>
        <mesh geometry={machineBodyGeo} material={machineMat} position={[0, 0.6, 0]} />
        <mesh geometry={machineTopGeo}  material={machineTopMat} position={[0, 1.05, 0]} />
      </group>

      {/* ── Steam InstancedMesh (20 billboard planes) ── */}
      {/* Created unconditionally; visibility controlled in useFrame */}
      <instancedMesh
        ref={steamRef}
        args={[steamGeo, steamMat, PARTICLE_COUNT]}
        frustumCulled={false}
        visible={false}
      />
    </group>
  );
};

export default CafeRoom;
