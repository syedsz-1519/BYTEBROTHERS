/**
 * devRoomUtils.ts
 * Pure utility functions shared across the DevRoomCorridor feature.
 * All functions are side-effect-free and fully testable without a DOM or WebGL context.
 *
 * NOTE: This module deliberately does NOT import from DevRoomCorridor.tsx to avoid
 * a circular dependency (DevRoomCorridor re-exports from this file).
 * Room-layout constants used here are inlined as local constants that mirror the
 * exported values in DevRoomCorridor.tsx.
 */

import * as THREE from "three";
import type React from "react";

// ─── Shared layout constants (circular-dependency-free anchor) ─────────────────

/** Depth of each themed room in world units. */
export const ROOM_DEPTH = 20;

/** Full room width in world units. */
export const ROOM_W = 10;

/** Room height in world units. */
export const ROOM_H = 7;

/** Total number of themed rooms. */
export const NUM_ROOMS = 3;

/** Total world-space length of the walkthrough (ROOM_DEPTH × NUM_ROOMS). */
export const TOTAL_DEPTH = ROOM_DEPTH * NUM_ROOMS; // 60

/** Camera world-space Z at scrollProgress = 0. */
export const START_Z = 10;

/**
 * Camera world-space Z at scrollProgress = 1.
 * Computed so the camera ends centred in the last room.
 */
export const END_Z = START_Z - TOTAL_DEPTH + ROOM_DEPTH / 2;

/** World-space Z centre for each room, indexed 0..NUM_ROOMS-1. */
export const ROOM_CENTRES: number[] = [0, 1, 2].map(
  (i) => START_Z - ROOM_DEPTH * i - ROOM_DEPTH / 2
);

/** Number of scroll panels per room (drives scroll-track height). */
export const PANELS_PER_ROOM = 3;

/** Mutable ref holding camera world position for room sub-components. */
export type CamRef = React.RefObject<THREE.Vector3>;

// Internal aliases matching previous private names
const _NUM_ROOMS = NUM_ROOMS;
const _ROOM_W = ROOM_W;
const _ROOM_H = ROOM_H;
const _ROOM_DEPTH = ROOM_DEPTH;

// ─── RoomDefinitionLike interface ─────────────────────────────────────────────
/**
 * Minimal subset of RoomDefinition required by buildRoomGeometry.
 * The full RoomDefinition lives in DevRoomCorridor.tsx; we use this local
 * interface to avoid a circular import.
 */
export interface RoomDefinitionLike {
  id: "dev-room" | "desk-table" | "cafe-room";
  roomZ: number;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Clamp a value to the range [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── smoothstep ──────────────────────────────────────────────────────────────

/**
 * Ken Perlin's smoothstep: 3t² − 2t³
 *
 * Preconditions : t ∈ [0, 1]
 * Postconditions:
 *   smoothstep(0) = 0
 *   smoothstep(1) = 1
 *   smoothstep(0.5) = 0.5
 *   monotonically non-decreasing over [0, 1]
 *   first derivative = 0 at both endpoints
 */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// ─── proximityFade ────────────────────────────────────────────────────────────

/**
 * Returns an opacity in [0, 1] based on the distance between the camera and a prop.
 *
 * Algorithm (from design pseudocode):
 *   dist    = |camZ - propZ|
 *   t       = clamp(1 - dist / fadeRadius, 0, 1)
 *   return  smoothstep(t)
 *
 * Guard: if fadeRadius <= 0, returns 0 immediately.
 *
 * Preconditions : fadeRadius > 0 for meaningful output
 * Postconditions: result ∈ [0, 1]
 */
export function proximityFade(
  camZ: number,
  propZ: number,
  fadeRadius: number,
): number {
  if (fadeRadius <= 0) return 0;
  const dist = Math.abs(camZ - propZ);
  const t = clamp(1 - dist / fadeRadius, 0, 1);
  return smoothstep(t);
}

// ─── roomProgressCalc ─────────────────────────────────────────────────────────

/** Output type for roomProgressCalc — matches the useRoomProgress interface. */
export interface RoomProgress {
  /** Active room index: always ∈ {0, 1, 2} */
  roomIndex: number;
  /** Blend factor toward the next room: always ∈ [0, 1] */
  blend: number;
  /** Normalised position within the current room: always ∈ [0, 1] */
  localT: number;
}

/**
 * Pure function deriving room progress from a normalised scroll progress.
 *
 * Preconditions : scrollProgress ∈ [0, 1]
 * Postconditions:
 *   roomIndex ∈ {0, 1, 2}
 *   blend     ∈ [0, 1]
 *   localT    ∈ [0, 1]
 *   scrollProgress = 0 → roomIndex = 0, blend = 0
 *   scrollProgress = 1 → roomIndex = 2, blend ≈ 1
 */
export function roomProgressCalc(scrollProgress: number): RoomProgress {
  const s = clamp(scrollProgress, 0, 1);
  const roomFloat = s * _NUM_ROOMS; // 0.._NUM_ROOMS

  // roomIndex is floor(roomFloat), clamped to [0, _NUM_ROOMS - 1]
  const roomIndex = clamp(Math.floor(roomFloat), 0, _NUM_ROOMS - 1);

  // blend is the fractional part of roomFloat, clamped to [0, 1]
  const blend = clamp(roomFloat - Math.floor(roomFloat), 0, 1);

  // localT: how far we are through the current room's scroll band
  // Each room occupies a 1/_NUM_ROOMS slice of scrollProgress.
  // localT = (s - roomIndex / _NUM_ROOMS) * _NUM_ROOMS, clamped to [0, 1].
  const localT = clamp((s - roomIndex / _NUM_ROOMS) * _NUM_ROOMS, 0, 1);

  return { roomIndex, blend, localT };
}

// ─── buildRoomGeometry ────────────────────────────────────────────────────────

/**
 * Per-room material colours, keyed by room id.
 * Bright, realistic white and light tones for realistic room experience.
 */
const ROOM_WALL_COLOURS: Record<RoomDefinitionLike["id"], number> = {
  "dev-room": 0xf1f5f9,
  "desk-table": 0xf8fafc,
  "cafe-room": 0xfaf5ef,
};

const ROOM_FLOOR_COLOURS: Record<RoomDefinitionLike["id"], number> = {
  "dev-room": 0xe2e8f0,
  "desk-table": 0xe2e8f0,
  "cafe-room": 0xe6d7c3, // warm light wood floor
};

/**
 * Builds a `THREE.Group` containing the five bounding surfaces of a room:
 * floor, ceiling, left wall, right wall, and back wall.
 */
export function buildRoomGeometry(room: RoomDefinitionLike): THREE.Group {
  const wallColour = ROOM_WALL_COLOURS[room.id] ?? 0xf8fafc;
  const floorColour = ROOM_FLOOR_COLOURS[room.id] ?? 0xe2e8f0;

  const W = _ROOM_W;
  const H = _ROOM_H;
  const D = _ROOM_DEPTH;

  // Shared material factory for walls and ceiling
  const makeMat = (colour: number, roughness = 0.6, metalness = 0.05) =>
    new THREE.MeshStandardMaterial({ color: colour, roughness, metalness, side: THREE.FrontSide });

  // ── Floor ─────────────────────────────────────────────────────────────────
  // PlaneGeometry lies in the XZ plane by default.  Rotate -90° around X so
  // it lies flat (Y = 0 in group-local space, which is ROOM_H/2 below the
  // group origin).
  const floorGeo = new THREE.PlaneGeometry(W, D);
  const floorMesh = new THREE.Mesh(floorGeo, makeMat(floorColour, 0.7, 0.1));
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, -H / 2, 0); // y=0 in world (group at ROOM_H/2)
  floorMesh.name = "floor";

  // ── Ceiling ───────────────────────────────────────────────────────────────
  // Rotate +90° around X so the face points downward toward the camera.
  const ceilGeo = new THREE.PlaneGeometry(W, D);
  const ceilMesh = new THREE.Mesh(ceilGeo, makeMat(0xffffff, 0.8, 0.0));
  ceilMesh.rotation.x = Math.PI / 2;
  ceilMesh.position.set(0, H / 2, 0); // y=ROOM_H in world
  ceilMesh.name = "ceiling";

  // ── Left wall (x = -ROOM_W/2) ────────────────────────────────────────────
  // PlaneGeometry faces +Z; rotate +90° around Y so it faces +X (inward).
  const leftGeo = new THREE.PlaneGeometry(D, H);
  const leftMesh = new THREE.Mesh(leftGeo, makeMat(wallColour, 0.6, 0.02));
  leftMesh.rotation.y = Math.PI / 2;
  leftMesh.position.set(-W / 2, 0, 0);
  leftMesh.name = "left-wall";

  // ── Right wall (x = +ROOM_W/2) ───────────────────────────────────────────
  // Rotate -90° around Y so it faces -X (inward).
  const rightGeo = new THREE.PlaneGeometry(D, H);
  const rightMesh = new THREE.Mesh(rightGeo, makeMat());
  rightMesh.rotation.y = -Math.PI / 2;
  rightMesh.position.set(W / 2, 0, 0);
  rightMesh.name = "right-wall";

  // ── Back wall (z = room.roomZ - ROOM_DEPTH/2, local z = -D/2) ────────────
  // PlaneGeometry faces +Z; no Y-rotation needed — it already faces the camera.
  const backGeo = new THREE.PlaneGeometry(W, H);
  const backMesh = new THREE.Mesh(backGeo, makeMat());
  backMesh.position.set(0, 0, -D / 2);
  backMesh.name = "back-wall";

  // ── Assemble group ────────────────────────────────────────────────────────
  const group = new THREE.Group();
  group.add(floorMesh, ceilMesh, leftMesh, rightMesh, backMesh);

  // Centre the group at [0, ROOM_H/2, room.roomZ] as per spec.
  group.position.set(0, H / 2, room.roomZ);

  return group;
}
