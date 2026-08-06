"use client";

/**
 * DevRoom.tsx — Room 0 of the DevRoomCorridor walkthrough.
 *
 * Responsibilities:
 *  - Builds the cool-blue room shell via `buildRoomGeometry`
 *  - Loads and clones the workstation GLB (never mutates the original)
 *  - Applies simplified materials on low-end devices (hardwareConcurrency ≤ 4)
 *  - Renders `DevRoomLighting`: ambient + 2–3 proximity-faded cyan point lights
 *  - Renders `MonitorScreens`: 2 animated monitor planes (code + terminal)
 *  - Culls the whole group when the camera is far away
 *  - Disposes all Three.js resources on unmount
 */

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import {
  buildRoomGeometry,
  proximityFade,
  ROOM_DEPTH,
  START_Z,
  type CamRef,
} from "../../../utils/devRoomUtils";
import { createMonitorTexture } from "../../hero/monitorTexture";
import { cloneSceneGraph } from "../../hero/sceneMaterials";

// ─── Constants ────────────────────────────────────────────────────────────────

const GLB_PATH = "/workstation/programmer_desk_setup__stylized_3d_room.glb";

/** Scale for normal devices. */
const SCALE_NORMAL = 0.65;

/** Scale for low-end devices (hardwareConcurrency ≤ 4). */
const SCALE_LOWEND = 0.33;

/** Visibility culling threshold: hide the room group beyond this distance. */
const CULL_DIST = ROOM_DEPTH * 1.5;

/** Max intensity for the proximity-faded cyan point lights. */
const MAX_POINT_INTENSITY = 4;

// ─── DevRoomProps ─────────────────────────────────────────────────────────────

export interface DevRoomProps {
  /** World-space Z centre for this room (from ROOM_CENTRES[0]). */
  roomZ: number;
  /** Shared mutable ref for camera position — read camRef.current?.z. */
  camRef: CamRef;
}

// ─── DevRoomLighting ─────────────────────────────────────────────────────────

interface DevRoomLightingProps {
  roomZ: number;
  camRef: CamRef;
}

/**
 * Cool-blue lighting for Room 0.
 *
 * • AmbientLight  — intensity 1.8, colour #1a3a6e  (always on while visible)
 * • PointLight 1  — overhead left,   cyan, proximity-faded
 * • PointLight 2  — overhead right,  cyan, proximity-faded
 * • PointLight 3  — behind monitors, cyan, proximity-faded (dim accent)
 */
function DevRoomLighting({ roomZ, camRef }: DevRoomLightingProps) {
  const pt1Ref = useRef<THREE.PointLight>(null);
  const pt2Ref = useRef<THREE.PointLight>(null);
  const pt3Ref = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const camZ = camRef.current?.z ?? START_Z;
    const fade = proximityFade(camZ, roomZ, ROOM_DEPTH * 2);

    if (pt1Ref.current) pt1Ref.current.intensity = fade * MAX_POINT_INTENSITY;
    if (pt2Ref.current) pt2Ref.current.intensity = fade * MAX_POINT_INTENSITY * 0.85;
    if (pt3Ref.current) pt3Ref.current.intensity = fade * MAX_POINT_INTENSITY * 0.5;
  });

  return (
    <>
      {/* Ambient fill — bright daylight white */}
      <ambientLight color="#ffffff" intensity={2.2} />

      {/* Daylight point lights — positioned relative to roomZ */}
      <pointLight
        ref={pt1Ref}
        position={[-2, 4, roomZ]}
        color="#ffffff"
        intensity={MAX_POINT_INTENSITY}
        distance={22}
        decay={2}
      />
      <pointLight
        ref={pt2Ref}
        position={[2, 3, roomZ - 5]}
        color="#f0f9ff"
        intensity={MAX_POINT_INTENSITY * 0.85}
        distance={20}
        decay={2}
      />
      <pointLight
        ref={pt3Ref}
        position={[0, 3, roomZ - 8]}
        color="#0284c7"
        intensity={MAX_POINT_INTENSITY * 0.4}
        distance={18}
        decay={2}
      />
    </>
  );
}

// ─── MonitorScreens ───────────────────────────────────────────────────────────

interface MonitorScreensProps {
  roomZ: number;
}

/**
 * Two animated monitor planes.
 *  - Left  monitor: 'code'     texture
 *  - Right monitor: 'terminal' texture
 *
 * Both textures are animated each frame via handle.draw(elapsedTime).
 * Both are disposed on unmount.
 */
function MonitorScreens({ roomZ }: MonitorScreensProps) {
  // Build canvas texture handles once — never recreate them
  const codeHandle = useMemo(() => createMonitorTexture({ type: "code" }), []);
  const termHandle = useMemo(() => createMonitorTexture({ type: "terminal" }), []);

  // Dispose textures when this component unmounts
  useEffect(() => {
    return () => {
      codeHandle.dispose();
      termHandle.dispose();
    };
  }, [codeHandle, termHandle]);

  // Animate both canvases every frame
  useFrame(({ clock }) => {
    codeHandle.draw(clock.elapsedTime);
    termHandle.draw(clock.elapsedTime);
  });

  // Monitor geometry — 2.2 × 1.4 as per task spec
  const monitorGeo = useMemo(() => new THREE.PlaneGeometry(2.2, 1.4), []);

  useEffect(() => {
    return () => {
      monitorGeo.dispose();
    };
  }, [monitorGeo]);

  return (
    <>
      {/* Left monitor — code view */}
      <mesh
        geometry={monitorGeo}
        position={[-1.8, 2.0, roomZ - 6]}
        rotation={[0, Math.PI * 0.12, 0]}
      >
        <meshStandardMaterial
          map={codeHandle.texture}
          emissiveMap={codeHandle.texture}
          emissive={new THREE.Color("#00f0ff")}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      {/* Right monitor — terminal view */}
      <mesh
        geometry={monitorGeo}
        position={[1.8, 2.0, roomZ - 6]}
        rotation={[0, -Math.PI * 0.12, 0]}
      >
        <meshStandardMaterial
          map={termHandle.texture}
          emissiveMap={termHandle.texture}
          emissive={new THREE.Color("#00ff80")}
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

// ─── WorkstationMesh ──────────────────────────────────────────────────────────

interface WorkstationMeshProps {
  roomZ: number;
}

/**
 * Loads the workstation GLB, clones its scene graph (never mutates the original),
 * and applies simplified materials on low-end devices.
 *
 * Clone is stored in useMemo and disposed on unmount.
 */
function WorkstationMesh({ roomZ }: WorkstationMeshProps) {
  const { scene } = useGLTF(GLB_PATH) as { scene: THREE.Group };

  const isLowEnd = useMemo(
    () => typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4,
    [],
  );

  const scale = isLowEnd ? SCALE_LOWEND : SCALE_NORMAL;

  // Clone the scene graph — never touch the original (req 9.1, 9.2)
  const clonedScene = useMemo(() => {
    const clone = cloneSceneGraph(scene) as THREE.Group;

    if (isLowEnd) {
      // Apply simplified materials on low-end devices (req 12.4)
      clone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = 1;
              mat.metalness = 0;
            }
          });
        }
      });
    }

    return clone;
  }, [scene, isLowEnd]);

  // Dispose cloned scene on unmount (req 9.3, 15.2)
  useEffect(() => {
    return () => {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((mat) => mat?.dispose());
        }
      });
    };
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={[1.5, 0, roomZ]}
      dispose={null}
    />
  );
}

// ─── DevRoom (public component) ───────────────────────────────────────────────

/**
 * Room 0 — the full developer environment.
 *
 * Contains:
 *   - Room shell (floor, ceiling, walls) via buildRoomGeometry
 *   - Workstation GLB (cloned, never mutated)
 *   - DevRoomLighting (ambient + point lights)
 *   - MonitorScreens (2 animated planes)
 *   - Visibility culling based on camera proximity
 */
export function DevRoom({ roomZ, camRef }: DevRoomProps) {
  const groupRef = useRef<THREE.Group>(null);

  // ── Room geometry (req 5, 15.1) ───────────────────────────────────────────
  const roomGroup = useMemo(
    () => buildRoomGeometry({ id: "dev-room", roomZ }),
    [roomZ],
  );

  useEffect(() => {
    return () => {
      // Dispose all geometries and materials created by buildRoomGeometry
      roomGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((mat) => mat?.dispose());
        }
      });
    };
  }, [roomGroup]);

  // ── Visibility culling (req 12.2) ─────────────────────────────────────────
  useFrame(() => {
    if (!groupRef.current) return;
    const camZ = camRef.current?.z ?? START_Z;
    groupRef.current.visible = Math.abs(camZ - roomZ) <= CULL_DIST;
  });

  return (
    <group ref={groupRef}>
      {/* Room shell geometry — positioned by buildRoomGeometry at roomZ */}
      <primitive object={roomGroup} dispose={null} />

      {/* Workstation GLB (inside Suspense in parent SceneInner) */}
      <WorkstationMesh roomZ={roomZ} />

      {/* Lighting */}
      <DevRoomLighting roomZ={roomZ} camRef={camRef} />

      {/* Animated monitor screens */}
      <MonitorScreens roomZ={roomZ} />
    </group>
  );
}

// Preload the GLB so it is ready before the camera reaches Room 0 (req 9)
useGLTF.preload(GLB_PATH);

export default DevRoom;
