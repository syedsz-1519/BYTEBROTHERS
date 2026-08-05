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

// ─── Mirrored layout constants (keeps this module circular-dependency-free) ───
// These MUST match the exported constants in DevRoomCorridor.tsx.

/** Must match NUM_ROOMS in DevRoomCorridor.tsx. */
const _NUM_ROOMS = 3;

/** Must match ROOM_W in DevRoomCorridor.tsx. */
const _ROOM_W = 10;

/** Must match ROOM_H in DevRoomCorridor.tsx. */
const _ROOM_H = 7;

/** Must match ROOM_DEPTH in DevRoomCorridor.tsx. */
const _ROOM_DEPTH = 20;

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
 * These are intentionally dark/muted to serve as background surfaces that
 * receive lighting rather than emit it.
 */
const ROOM_WALL_COLOURS: Record<RoomDefinitionLike["id"], number> = {
  "dev-room": 0x0a0f1e,
  "desk-table": 0x0d1520,
  "cafe-room": 0x3d2010,
};

/**
 * Builds a `THREE.Group` containing the five bounding surfaces of a room:
 * floor, ceiling, left wall, right wall, and back wall.
 *
 * The group is positioned so its local origin is at
 * `[0, ROOM_H / 2, room.roomZ]`, meaning all mesh positions inside the
 * group are expressed relative to that centre point.
 *
 * Preconditions:
 *   - `room.id` is one of the three valid room identifiers
 *   - `ROOM_W`, `ROOM_H`, `ROOM_DEPTH` are all positive
 *
 * Postconditions:
 *   - Returns a `THREE.Group` with exactly 5 `THREE.Mesh` children
 *   - All meshes use `MeshStandardMaterial`
 *   - No NaN values in any mesh position
 *   - Does not throw for any valid `RoomDefinitionLike`
 *
 * @param room - A room descriptor (id + roomZ).  Accepts any object satisfying
 *               `RoomDefinitionLike`; the full `RoomDefinition` from
 *               `DevRoomCorridor.tsx` is a structural subtype and works directly.
 * @returns A `THREE.Group` ready to be added to a scene.
 */
export function buildRoomGeometry(room: RoomDefinitionLike): THREE.Group {
  const colour = ROOM_WALL_COLOURS[room.id] ?? 0x111111;

  const W = _ROOM_W;
  const H = _ROOM_H;
  const D = _ROOM_DEPTH;

  // ── Shared material factory ───────────────────────────────────────────────
  // Each surface gets its own material instance so they can be individually
  // disposed and potentially given different roughness/emissive values later.
  const makeMat = (roughness = 0.9, metalness = 0.05) =>
    new THREE.MeshStandardMaterial({ color: colour, roughness, metalness, side: THREE.FrontSide });

  // ── Floor ─────────────────────────────────────────────────────────────────
  // PlaneGeometry lies in the XZ plane by default.  Rotate -90° around X so
  // it lies flat (Y = 0 in group-local space, which is ROOM_H/2 below the
  // group origin).
  const floorGeo = new THREE.PlaneGeometry(W, D);
  const floorMesh = new THREE.Mesh(floorGeo, makeMat(0.95));
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, -H / 2, 0); // y=0 in world (group at ROOM_H/2)
  floorMesh.name = "floor";

  // ── Ceiling ───────────────────────────────────────────────────────────────
  // Rotate +90° around X so the face points downward toward the camera.
  const ceilGeo = new THREE.PlaneGeometry(W, D);
  const ceilMesh = new THREE.Mesh(ceilGeo, makeMat(0.8));
  ceilMesh.rotation.x = Math.PI / 2;
  ceilMesh.position.set(0, H / 2, 0); // y=ROOM_H in world
  ceilMesh.name = "ceiling";

  // ── Left wall (x = -ROOM_W/2) ────────────────────────────────────────────
  // PlaneGeometry faces +Z; rotate +90° around Y so it faces +X (inward).
  const leftGeo = new THREE.PlaneGeometry(D, H);
  const leftMesh = new THREE.Mesh(leftGeo, makeMat());
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
