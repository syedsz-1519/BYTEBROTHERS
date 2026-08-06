"use client";

/**
 * DevRoomCorridor.tsx
 *
 * Root Three.js Canvas component — drop-in replacement for HomeCorridor.
 * This file owns all shared constants, types, and the camera context.
 *
 * Re-exports smoothstep, proximityFade, and roomProgressCalc so downstream
 * files have a single import surface.
 */

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { getScrollProgress } from "../../hooks/useScrollProgress";
import { HomeMobileFallback } from "./HomeMobileFallback";
// ─── Re-exports from utility module ──────────────────────────────────────────
export {
  smoothstep,
  proximityFade,
  roomProgressCalc,
  ROOM_DEPTH,
  ROOM_W,
  ROOM_H,
  NUM_ROOMS,
  TOTAL_DEPTH,
  START_Z,
  END_Z,
  ROOM_CENTRES,
  PANELS_PER_ROOM,
} from "../../utils/devRoomUtils";
export type { RoomProgress, CamRef } from "../../utils/devRoomUtils";

import { DevRoom } from "./rooms/DevRoom";
import { DeskTable } from "./rooms/DeskTable";
import { CafeRoom } from "./rooms/CafeRoom";
import {
  ROOM_DEPTH,
  ROOM_H,
  NUM_ROOMS,
  TOTAL_DEPTH,
  START_Z,
  ROOM_CENTRES,
  type CamRef,
} from "../../utils/devRoomUtils";

// ─── Animation constants ──────────────────────────────────────────────────────

/** Camera position lerp factor (controls smoothness of travel). */
export const LERP = 0.072;

/** Camera FOV lerp factor. */
export const LERP_FOV = 0.05;

/** Vertical bobbing amplitude applied to camera.position.y. */
export const BOB_AMP = 0.035;

// ─── RoomDefinition interface ─────────────────────────────────────────────────

/** Describes one themed room's world-space position, camera settings, and lighting. */
export interface RoomDefinition {
  id: "dev-room" | "desk-table" | "cafe-room";
  /** Display name shown in the HUD. */
  label: string;
  /** World-space Z origin (derived from ROOM_CENTRES). */
  roomZ: number;
  /** Eye height override for this room. */
  cameraY: number;
  /** FOV override in degrees. */
  cameraFov: number;
  /** THREE hex colour for scene fog. */
  fogColor: number;
  fogNear: number;
  fogFar: number;
  /** Ambient light hex colour. */
  ambientColor: number;
  ambientIntensity: number;
}

// ─── Room palette table ───────────────────────────────────────────────────────

/** Ordered palette of all three rooms. Index matches ROOM_CENTRES index. */
export const ROOMS: RoomDefinition[] = [
  {
    id: "dev-room",
    label: "Developer Room",
    roomZ: ROOM_CENTRES[0],
    cameraY: 1.6,
    cameraFov: 58,
    fogColor: 0xf1f5f9,
    fogNear: 15,
    fogFar: 70,
    ambientColor: 0xffffff,
    ambientIntensity: 2.4,
  },
  {
    id: "desk-table",
    label: "Developer's Table",
    roomZ: ROOM_CENTRES[1],
    cameraY: 1.1,
    cameraFov: 50,
    fogColor: 0xf8fafc,
    fogNear: 12,
    fogFar: 65,
    ambientColor: 0xffffff,
    ambientIntensity: 2.2,
  },
  {
    id: "cafe-room",
    label: "Café Room",
    roomZ: ROOM_CENTRES[2],
    cameraY: 1.6,
    cameraFov: 58,
    fogColor: 0xfaf5ef,
    fogNear: 15,
    fogFar: 70,
    ambientColor: 0xfff8f0,
    ambientIntensity: 2.2,
  },
];

// ─── Camera context ───────────────────────────────────────────────────────────

/** React context carrying the shared CamRef. Defaults to START_Z position. */
export const CamCtx = createContext<CamRef>({
  current: new THREE.Vector3(0, ROOMS[0].cameraY, START_Z),
});

/** Hook for consuming the CamRef from any child component. */
export function useCam(): CamRef {
  return useContext(CamCtx);
}

// ─── FallbackBox ──────────────────────────────────────────────────────────────

/**
 * Minimal mesh shown inside the Suspense fallback while GLBs load.
 * Positioned at [0, 1, START_Z - 5] so it is visible immediately on page load.
 */
function FallbackBox() {
  return (
    <mesh position={[0, 1, START_Z - 5]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
}

// ─── SceneInner ───────────────────────────────────────────────────────────────

interface SceneInnerProps {
  reducedMotion: boolean;
  visible: boolean;
}

/**
 * Inner R3F component that owns the per-frame camera animation loop and
 * fog / ambient-light cross-fade controller.
 */
function SceneInner({ reducedMotion, visible }: SceneInnerProps) {
  const { camera, scene } = useThree();

  // Shared mutable ref for camera position (consumed by room sub-components)
  const camRef = useRef<THREE.Vector3>(new THREE.Vector3(0, ROOMS[0].cameraY, START_Z));

  // Ref to the ambient light so we can lerp it each frame without a state update
  const ambientRef = useRef<THREE.AmbientLight>(null);

  // Initialise camera once on mount
  useEffect(() => {
    camera.position.set(0, ROOMS[0].cameraY, START_Z);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = ROOMS[0].cameraFov;
      camera.near = 0.1;
      camera.far = 200;
    }
    camera.updateProjectionMatrix();
  }, [camera]);

  // Initialise scene fog once on mount
  useEffect(() => {
    scene.fog = new THREE.Fog(
      ROOMS[0].fogColor,
      ROOMS[0].fogNear,
      ROOMS[0].fogFar
    );
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame(({ clock }) => {
    // Pause entirely when the corridor is hidden
    if (!visible) return;

    const progress = getScrollProgress();

    // ── Room index & blend ───────────────────────────────────────────────────
    const roomFloat = progress * NUM_ROOMS;
    const roomIndex = Math.min(Math.floor(roomFloat), NUM_ROOMS - 1);
    const nextIndex = Math.min(roomIndex + 1, NUM_ROOMS - 1);
    const rawBlend = roomFloat - Math.floor(roomFloat);

    // smoothstep the blend for smooth easing at room boundaries
    const blend = rawBlend * rawBlend * (3 - 2 * rawBlend); // smoothstep

    const currentRoom = ROOMS[roomIndex];
    const nextRoom = ROOMS[nextIndex];

    // ── Camera targets ───────────────────────────────────────────────────────
    const targetZ = START_Z - progress * TOTAL_DEPTH;
    const targetY = currentRoom.cameraY + (nextRoom.cameraY - currentRoom.cameraY) * blend;
    const targetFov = currentRoom.cameraFov + (nextRoom.cameraFov - currentRoom.cameraFov) * blend;

    const perspCam = camera instanceof THREE.PerspectiveCamera ? camera : null;

    if (reducedMotion) {
      // Snap directly — no lerp, no bob
      camera.position.set(0, targetY, targetZ);
      if (perspCam) {
        perspCam.fov = Math.min(65, Math.max(45, targetFov));
        perspCam.updateProjectionMatrix();
      }
    } else {
      // Lerp position Z
      camera.position.z += (targetZ - camera.position.z) * LERP;

      // Lerp position Y, then add sinusoidal bob
      camera.position.y += (targetY - camera.position.y) * LERP;
      camera.position.y += Math.sin(clock.elapsedTime * 1.1) * BOB_AMP;

      // Lerp FOV, clamp, and mark projection dirty
      if (perspCam) {
        const newFov = perspCam.fov + (targetFov - perspCam.fov) * LERP_FOV;
        perspCam.fov = Math.min(65, Math.max(45, newFov));
        perspCam.updateProjectionMatrix();
      }
    }

    // Always keep X at 0 (camera only moves Z/Y)
    camera.position.x = 0;

    // Update the shared ref for room sub-components
    camRef.current.copy(camera.position);

    // ── Fog cross-fade ───────────────────────────────────────────────────────
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      const fromFog = new THREE.Color(currentRoom.fogColor);
      const toFog = new THREE.Color(nextRoom.fogColor);
      fog.color.lerpColors(fromFog, toFog, blend);
      fog.near = currentRoom.fogNear + (nextRoom.fogNear - currentRoom.fogNear) * blend;
      fog.far = currentRoom.fogFar + (nextRoom.fogFar - currentRoom.fogFar) * blend;
    }

    // ── Ambient light cross-fade ─────────────────────────────────────────────
    const amb = ambientRef.current;
    if (amb) {
      const fromAmb = new THREE.Color(currentRoom.ambientColor);
      const toAmb = new THREE.Color(nextRoom.ambientColor);
      amb.color.lerpColors(fromAmb, toAmb, blend);
      amb.intensity =
        currentRoom.ambientIntensity +
        (nextRoom.ambientIntensity - currentRoom.ambientIntensity) * blend;
    }
  });

  return (
    <CamCtx.Provider value={camRef}>
      {/* Ambient light — lerped in useFrame via ref */}
      <ambientLight ref={ambientRef} color={ROOMS[0].ambientColor} intensity={ROOMS[0].ambientIntensity} />

      {/* Three themed rooms — each receives its world-space Z centre, the shared
          camera position ref, and (CafeRoom only) the reducedMotion flag.
          All three live inside the same Suspense boundary so the FallbackBox
          is shown while any GLB is still loading (req 1.4, 4.1). */}
      <Suspense fallback={<FallbackBox />}>
        <DevRoom roomZ={ROOM_CENTRES[0]} camRef={camRef} />
        <DeskTable roomZ={ROOM_CENTRES[1]} camRef={camRef} />
        <CafeRoom roomZ={ROOM_CENTRES[2]} camRef={camRef} reducedMotion={reducedMotion} />
      </Suspense>
    </CamCtx.Provider>
  );
}

// ─── DevRoomCorridor public component ────────────────────────────────────────

export interface DevRoomCorridorProps {
  /** Honour prefers-reduced-motion: snaps camera, disables particles. */
  reducedMotion?: boolean;
  /** Opacity-driven show/hide (home tab only). */
  visible?: boolean;
}

/**
 * Root Three.js Canvas component.
 * Fixed-position, full-viewport, `zIndex: 1`, `pointerEvents: none`.
 * Opacity transitions on `visible` prop change.
 * Handles WebGL context loss by showing HomeMobileFallback.
 */
export const DevRoomCorridor: React.FC<DevRoomCorridorProps> = ({
  reducedMotion = false,
  visible = true,
}) => {
  const [contextLost, setContextLost] = useState(false);

  const handleContextLost = (e: Event) => {
    e.preventDefault(); // required so the browser allows restoration
    setContextLost(true);
  };

  const handleContextRestored = () => {
    setContextLost(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {contextLost ? (
        /* WebGL context lost — show static fallback with pointer events re-enabled */
        <div style={{ pointerEvents: "auto", width: "100%", height: "100%", overflowY: "auto" }}>
          <HomeMobileFallback
            onContact={() => {}}
            onWork={() => {}}
            onPortfolio={() => {}}
          />
        </div>
      ) : (
        <Canvas
          dpr={[1, 1.5]}
          camera={{
            position: [0, ROOMS[0].cameraY, START_Z],
            fov: ROOMS[0].cameraFov,
            near: 0.1,
            far: 200,
          }}
          style={{ width: "100%", height: "100%" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", handleContextLost);
            gl.domElement.addEventListener("webglcontextrestored", handleContextRestored);
          }}
        >
          <SceneInner reducedMotion={reducedMotion} visible={visible} />
        </Canvas>
      )}
    </div>
  );
};

export default DevRoomCorridor;
