/**
 * Unit tests for devRoomUtils.ts
 *
 * Covers:
 *  - smoothstep: boundary values, midpoint, and monotonicity
 *  - proximityFade: boundary values and zero-radius guard
 *  - roomProgressCalc: boundary inputs and clamped output invariants
 */

import { describe, expect, it } from "vitest";
import {
  proximityFade,
  roomProgressCalc,
  smoothstep,
} from "../devRoomUtils";

// ─── smoothstep ───────────────────────────────────────────────────────────────

describe("smoothstep", () => {
  it("returns 0 at t = 0", () => {
    expect(smoothstep(0)).toBe(0);
  });

  it("returns 1 at t = 1", () => {
    expect(smoothstep(1)).toBe(1);
  });

  it("returns 0.5 at t = 0.5", () => {
    // 3(0.5)² − 2(0.5)³ = 3(0.25) − 2(0.125) = 0.75 − 0.25 = 0.5
    expect(smoothstep(0.5)).toBeCloseTo(0.5, 10);
  });

  it("output is always in [0, 1] for t in [0, 1]", () => {
    const samples = 100;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const result = smoothstep(t);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    }
  });

  it("is monotonically non-decreasing over [0, 1]", () => {
    let prev = smoothstep(0);
    const samples = 200;
    for (let i = 1; i <= samples; i++) {
      const t = i / samples;
      const curr = smoothstep(t);
      expect(curr).toBeGreaterThanOrEqual(prev - Number.EPSILON);
      prev = curr;
    }
  });

  it("has a near-zero first derivative at t = 0 (smooth entry)", () => {
    const dt = 1e-6;
    const derivative = (smoothstep(dt) - smoothstep(0)) / dt;
    expect(Math.abs(derivative)).toBeLessThan(0.01);
  });

  it("has a near-zero first derivative at t = 1 (smooth exit)", () => {
    const dt = 1e-6;
    const derivative = (smoothstep(1) - smoothstep(1 - dt)) / dt;
    expect(Math.abs(derivative)).toBeLessThan(0.01);
  });
});

// ─── proximityFade ────────────────────────────────────────────────────────────

describe("proximityFade", () => {
  it("returns 1 when camZ equals propZ (distance = 0)", () => {
    expect(proximityFade(5, 5, 10)).toBe(1);
    expect(proximityFade(-3, -3, 20)).toBe(1);
  });

  it("returns 0 when distance equals fadeRadius", () => {
    expect(proximityFade(0, 10, 10)).toBe(0);
    expect(proximityFade(10, 0, 10)).toBe(0);
  });

  it("returns 0 when distance exceeds fadeRadius", () => {
    expect(proximityFade(0, 20, 10)).toBe(0);
    expect(proximityFade(100, 0, 5)).toBe(0);
  });

  it("returns 0 when fadeRadius <= 0 (guard clause)", () => {
    expect(proximityFade(0, 0, 0)).toBe(0);
    expect(proximityFade(0, 0, -5)).toBe(0);
    expect(proximityFade(5, 5, -1)).toBe(0);
  });

  it("output is always in [0, 1] for any inputs with positive fadeRadius", () => {
    const cams = [-100, -10, -1, 0, 1, 10, 100];
    const props = [-50, 0, 50];
    const radii = [0.1, 1, 10, 100];
    for (const camZ of cams) {
      for (const propZ of props) {
        for (const r of radii) {
          const result = proximityFade(camZ, propZ, r);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("is symmetric (|camZ - propZ| = |propZ - camZ|)", () => {
    const fadeRadius = 15;
    expect(proximityFade(3, 10, fadeRadius)).toBeCloseTo(
      proximityFade(10, 3, fadeRadius),
      10
    );
  });

  it("applies smoothstep so value at half-radius is 0.5", () => {
    // At dist = fadeRadius / 2: t = clamp(1 - 0.5, 0, 1) = 0.5, smoothstep(0.5) = 0.5
    expect(proximityFade(0, 5, 10)).toBeCloseTo(0.5, 10);
  });
});

// ─── roomProgressCalc ─────────────────────────────────────────────────────────

describe("roomProgressCalc", () => {
  describe("roomIndex", () => {
    it("is 0 at scrollProgress = 0", () => {
      expect(roomProgressCalc(0).roomIndex).toBe(0);
    });

    it("is 2 at scrollProgress = 1", () => {
      expect(roomProgressCalc(1).roomIndex).toBe(2);
    });

    it("is 0 in the first third (scrollProgress = 0.2)", () => {
      expect(roomProgressCalc(0.2).roomIndex).toBe(0);
    });

    it("is 1 in the middle third (scrollProgress = 0.5)", () => {
      expect(roomProgressCalc(0.5).roomIndex).toBe(1);
    });

    it("is 2 in the last third (scrollProgress = 0.8)", () => {
      expect(roomProgressCalc(0.8).roomIndex).toBe(2);
    });

    it("is always in {0, 1, 2} for all valid inputs", () => {
      const samples = 100;
      for (let i = 0; i <= samples; i++) {
        const s = i / samples;
        const { roomIndex } = roomProgressCalc(s);
        expect([0, 1, 2]).toContain(roomIndex);
      }
    });
  });

  describe("blend", () => {
    it("is 0 at scrollProgress = 0", () => {
      expect(roomProgressCalc(0).blend).toBe(0);
    });

    it("is always in [0, 1]", () => {
      const samples = 100;
      for (let i = 0; i <= samples; i++) {
        const s = i / samples;
        const { blend } = roomProgressCalc(s);
        expect(blend).toBeGreaterThanOrEqual(0);
        expect(blend).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("localT", () => {
    it("is 0 at scrollProgress = 0 (start of room 0)", () => {
      expect(roomProgressCalc(0).localT).toBeCloseTo(0, 10);
    });

    it("is always in [0, 1]", () => {
      const samples = 100;
      for (let i = 0; i <= samples; i++) {
        const s = i / samples;
        const { localT } = roomProgressCalc(s);
        expect(localT).toBeGreaterThanOrEqual(0);
        expect(localT).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("boundary transitions", () => {
    it("transitions from room 0 to room 1 at scrollProgress ≈ 0.333", () => {
      const just_before = roomProgressCalc(0.332).roomIndex;
      const just_after = roomProgressCalc(0.334).roomIndex;
      expect(just_before).toBe(0);
      expect(just_after).toBe(1);
    });

    it("transitions from room 1 to room 2 at scrollProgress ≈ 0.666", () => {
      const just_before = roomProgressCalc(0.665).roomIndex;
      const just_after = roomProgressCalc(0.667).roomIndex;
      expect(just_before).toBe(1);
      expect(just_after).toBe(2);
    });

    it("clamps inputs below 0 to behave as 0", () => {
      const result = roomProgressCalc(-0.5);
      expect(result.roomIndex).toBe(0);
      expect(result.blend).toBe(0);
      expect(result.localT).toBe(0);
    });

    it("clamps inputs above 1 to behave as 1", () => {
      const result = roomProgressCalc(1.5);
      expect(result.roomIndex).toBe(2);
    });
  });
});

// ─── buildRoomGeometry ────────────────────────────────────────────────────────

import * as THREE from "three";
import { buildRoomGeometry, type RoomDefinitionLike } from "../devRoomUtils";

/** Minimal valid RoomDefinition objects for each of the three rooms. */
const VALID_ROOMS: RoomDefinitionLike[] = [
  { id: "dev-room", roomZ: 0 },
  { id: "desk-table", roomZ: -20 },
  { id: "cafe-room", roomZ: -40 },
];

describe("buildRoomGeometry", () => {
  it("returns a THREE.Group", () => {
    const group = buildRoomGeometry(VALID_ROOMS[0]);
    expect(group).toBeInstanceOf(THREE.Group);
  });

  it("returns a group with at least 5 children", () => {
    for (const room of VALID_ROOMS) {
      const group = buildRoomGeometry(room);
      expect(group.children.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("all children are THREE.Mesh instances", () => {
    for (const room of VALID_ROOMS) {
      const group = buildRoomGeometry(room);
      for (const child of group.children) {
        expect(child).toBeInstanceOf(THREE.Mesh);
      }
    }
  });

  it("all meshes use MeshStandardMaterial", () => {
    for (const room of VALID_ROOMS) {
      const group = buildRoomGeometry(room);
      for (const child of group.children) {
        const mesh = child as THREE.Mesh;
        expect(mesh.material).toBeInstanceOf(THREE.MeshStandardMaterial);
      }
    }
  });

  it("no NaN values in any mesh world position", () => {
    for (const room of VALID_ROOMS) {
      const group = buildRoomGeometry(room);
      group.updateMatrixWorld(true);
      for (const child of group.children) {
        const mesh = child as THREE.Mesh;
        const pos = new THREE.Vector3();
        mesh.getWorldPosition(pos);
        expect(isNaN(pos.x)).toBe(false);
        expect(isNaN(pos.y)).toBe(false);
        expect(isNaN(pos.z)).toBe(false);
      }
    }
  });

  it("no NaN values in mesh local positions", () => {
    for (const room of VALID_ROOMS) {
      const group = buildRoomGeometry(room);
      for (const child of group.children) {
        expect(isNaN(child.position.x)).toBe(false);
        expect(isNaN(child.position.y)).toBe(false);
        expect(isNaN(child.position.z)).toBe(false);
      }
    }
  });

  it("group position is not NaN and reflects roomZ", () => {
    for (const room of VALID_ROOMS) {
      const group = buildRoomGeometry(room);
      expect(isNaN(group.position.x)).toBe(false);
      expect(isNaN(group.position.y)).toBe(false);
      expect(isNaN(group.position.z)).toBe(false);
      // Group z should equal room.roomZ
      expect(group.position.z).toBe(room.roomZ);
    }
  });

  it("group is centred at [0, ROOM_H/2, room.roomZ] (ROOM_H = 7)", () => {
    const ROOM_H = 7;
    for (const room of VALID_ROOMS) {
      const group = buildRoomGeometry(room);
      expect(group.position.x).toBe(0);
      expect(group.position.y).toBeCloseTo(ROOM_H / 2, 10);
      expect(group.position.z).toBe(room.roomZ);
    }
  });

  it("does not throw for any of the three valid room ids", () => {
    for (const room of VALID_ROOMS) {
      expect(() => buildRoomGeometry(room)).not.toThrow();
    }
  });

  it("produces 5 named surfaces: floor, ceiling, left-wall, right-wall, back-wall", () => {
    const group = buildRoomGeometry(VALID_ROOMS[0]);
    const names = group.children.map((c) => c.name);
    expect(names).toContain("floor");
    expect(names).toContain("ceiling");
    expect(names).toContain("left-wall");
    expect(names).toContain("right-wall");
    expect(names).toContain("back-wall");
  });
});
