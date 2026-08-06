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
import SingleAgencyRoom from "./SingleAgencyRoom";
import AmbientParticles from "./AmbientParticles";
import EntranceDoor from "./EntranceDoor";

function SceneInner({ reducedMotion, visible }: SceneInnerProps) {
  const { camera, scene } = useThree();
  const camRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, START_Z));

  useEffect(() => {
    camera.position.set(0, 1.6, START_Z);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 55;
      camera.near = 0.1;
      camera.far = 120;
    }
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    scene.fog = new THREE.Fog(0xf7f3ed, 15, 75);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame(({ clock }) => {
    if (!visible) return;
    const progress = getScrollProgress();

    // Smooth Z travel from z = 10 down to z = -22
    const targetZ = START_Z - progress * 32;
    const targetY = 1.6;

    if (reducedMotion) {
      camera.position.set(0, targetY, targetZ);
    } else {
      camera.position.z += (targetZ - camera.position.z) * LERP;
      camera.position.y += (targetY - camera.position.y) * LERP;
      camera.position.y += Math.sin(clock.elapsedTime * 1.1) * BOB_AMP;
    }
    camera.position.x = 0;
    camRef.current.copy(camera.position);
  });

  return (
    <CamCtx.Provider value={camRef}>
      <Suspense fallback={<FallbackBox />}>
        <SingleAgencyRoom />
        <AmbientParticles />
      </Suspense>
    </CamCtx.Provider>
  );
}

// ─── DevRoomCorridor public component ────────────────────────────────────────

export interface DevRoomCorridorProps {
  reducedMotion?: boolean;
  visible?: boolean;
}

export const DevRoomCorridor: React.FC<DevRoomCorridorProps> = ({
  reducedMotion = false,
  visible = true,
}) => {
  const [contextLost, setContextLost] = useState(false);
  const [showDoor, setShowDoor] = useState(true);

  // Reset entrance door cinematic whenever the tab becomes visible
  useEffect(() => {
    if (visible) {
      setShowDoor(true);
    }
  }, [visible]);

  return (
    <>
      {/* Entrance Door Cinematic Overlay */}
      {visible && showDoor && (
        <EntranceDoor onDone={() => setShowDoor(false)} />
      )}

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
              position: [0, 1.6, START_Z],
              fov: 55,
              near: 0.1,
              far: 120,
            }}
            style={{ width: "100%", height: "100%" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setContextLost(true); });
              gl.domElement.addEventListener("webglcontextrestored", () => setContextLost(false));
            }}
          >
            <SceneInner reducedMotion={reducedMotion} visible={visible} />
          </Canvas>
        )}
      </div>
    </>
  );
};

export default DevRoomCorridor;
