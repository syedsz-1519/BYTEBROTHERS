/**
 * devRoomProperties.test.ts
 *
 * Property-based tests for DevRoomCorridor utility functions and invariants using fast-check.
 *
 * Covers:
 *  - Property 1: Monotonic Z travel
 *  - Property 2: roomProgressCalc output invariants
 *  - Property 3: smoothstep monotonicity and bounds
 *  - Property 4: proximityFade bounds
 *  - Property 5: buildRoomGeometry structural correctness
 *  - Property 6: Fog cross-fade continuity
 */

import { describe, expect, it } from "vitest";
import * as fc from "fast-check";
import * as THREE from "three";

import {
  buildRoomGeometry,
  proximityFade,
  roomProgressCalc,
  smoothstep,
  type RoomDefinitionLike,
} from "../devRoomUtils";
import {
  START_Z,
  TOTAL_DEPTH,
  ROOMS,
  NUM_ROOMS,
} from "../../components/home/DevRoomCorridor";

describe("Property-based Tests for DevRoom Experience", () => {
  // ── Property 1: Monotonic Z Travel ───────────────────────────────────────
  it("Property 1: Monotonic Z Travel — camera Z decreases strictly as scroll progress increases", () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (s1, s2) => {
          fc.pre(s1 < s2);
          const z1 = START_Z - s1 * TOTAL_DEPTH;
          const z2 = START_Z - s2 * TOTAL_DEPTH;
          return z1 > z2;
        }
      )
    );
  });

  // ── Property 2: roomProgressCalc Output Invariants ───────────────────────
  it("Property 2: roomProgressCalc output invariants — roomIndex in {0,1,2}, blend in [0,1], localT in [0,1]", () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        (s) => {
          const { roomIndex, blend, localT } = roomProgressCalc(s);
          const validRoomIndex = roomIndex === 0 || roomIndex === 1 || roomIndex === 2;
          const validBlend = blend >= 0 && blend <= 1;
          const validLocalT = localT >= 0 && localT <= 1;
          return validRoomIndex && validBlend && validLocalT;
        }
      )
    );
  });

  // ── Property 3: smoothstep Monotonicity and Bounds ────────────────────────
  it("Property 3: smoothstep monotonicity and bounds — output in [0,1] and smoothstep(t1) <= smoothstep(t2) for t1 <= t2", () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (t1, t2) => {
          const s1 = smoothstep(t1);
          const s2 = smoothstep(t2);

          const inBounds1 = s1 >= 0 && s1 <= 1;
          const inBounds2 = s2 >= 0 && s2 <= 1;

          if (t1 <= t2) {
            return inBounds1 && inBounds2 && s1 <= s2 + 1e-7;
          } else {
            return inBounds1 && inBounds2 && s2 <= s1 + 1e-7;
          }
        }
      )
    );
  });

  // ── Property 4: proximityFade Bounds ─────────────────────────────────────
  it("Property 4: proximityFade bounds — output always in [0,1] for any camZ, propZ, and positive fadeRadius", () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: 0.001, max: 1000, noNaN: true }),
        (camZ, propZ, fadeRadius) => {
          const fade = proximityFade(camZ, propZ, fadeRadius);
          return fade >= 0 && fade <= 1;
        }
      )
    );
  });

  // ── Property 5: buildRoomGeometry Structural Correctness ──────────────────
  it("Property 5: buildRoomGeometry structural correctness — >= 5 children, no NaN positions, no thrown errors", () => {
    const roomArbitrary = fc.constantFrom<RoomDefinitionLike>(
      { id: "dev-room", roomZ: 0 },
      { id: "desk-table", roomZ: -20 },
      { id: "cafe-room", roomZ: -40 }
    );

    fc.assert(
      fc.property(roomArbitrary, (roomDef) => {
        const group = buildRoomGeometry(roomDef);
        if (!(group instanceof THREE.Group)) return false;
        if (group.children.length < 5) return false;

        let noNaN = true;
        group.children.forEach((child) => {
          if (
            Number.isNaN(child.position.x) ||
            Number.isNaN(child.position.y) ||
            Number.isNaN(child.position.z)
          ) {
            noNaN = false;
          }
        });

        // Cleanup
        group.traverse((c) => {
          if (c instanceof THREE.Mesh) {
            c.geometry?.dispose();
            if (Array.isArray(c.material)) {
              c.material.forEach((m) => m.dispose());
            } else {
              c.material?.dispose();
            }
          }
        });

        return noNaN;
      })
    );
  });

  // ── Property 6: Fog Cross-Fade Continuity ────────────────────────────────
  it("Property 6: Fog cross-fade continuity — max channel delta between s and s+0.001 <= 0.01", () => {
    function computeFogColor(progress: number): { r: number; g: number; b: number } {
      const p = Math.max(0, Math.min(1, progress));
      const roomFloat = p * NUM_ROOMS;
      const roomIndex = Math.min(Math.floor(roomFloat), NUM_ROOMS - 1);
      const nextIndex = Math.min(roomIndex + 1, NUM_ROOMS - 1);
      const rawBlend = roomFloat - Math.floor(roomFloat);
      const blend = smoothstep(rawBlend);

      const fromFog = new THREE.Color(ROOMS[roomIndex].fogColor);
      const toFog = new THREE.Color(ROOMS[nextIndex].fogColor);
      const res = fromFog.clone().lerp(toFog, blend);
      return { r: res.r, g: res.g, b: res.b };
    }

    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 0.999, noNaN: true }),
        (s) => {
          const c1 = computeFogColor(s);
          const c2 = computeFogColor(s + 0.001);

          const deltaR = Math.abs(c1.r - c2.r);
          const deltaG = Math.abs(c1.g - c2.g);
          const deltaB = Math.abs(c1.b - c2.b);

          return deltaR <= 0.01 && deltaG <= 0.01 && deltaB <= 0.01;
        }
      )
    );
  });
});
