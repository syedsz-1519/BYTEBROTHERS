"use client";

/**
 * RoomFurniture.tsx
 *
 * Premium procedural furniture sub-components for the 3D agency room.
 * All geometry uses low-poly primitives (box, cylinder, sphere, torus).
 * Materials follow the warm-matte + metallic-accent design language:
 *   - Dark slate:  #0f172a / #1e293b
 *   - Warm amber:  #d97706 / #f59e0b
 *   - Cyan accent:  #00f0ff / #38bdf8
 *   - Charcoal:    #334155
 *   - Concrete:    #94a3b8
 */

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── 1. Floating Slate Desk ──────────────────────────────────────────────────

export function FloatingSlateDesk({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Desktop Slab — Dark Slate */}
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[5.5, 0.1, 1.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Warm wood accent strip along front edge */}
      <mesh position={[0, 0.78, 0.82]}>
        <boxGeometry args={[5.5, 0.1, 0.06]} />
        <meshStandardMaterial color="#c29b68" roughness={0.35} />
      </mesh>

      {/* Wall mounting bracket — left */}
      <mesh position={[-2.2, 0.5, -0.78]}>
        <boxGeometry args={[0.08, 0.56, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[-2.2, 0.52, -0.5]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Wall mounting bracket — right */}
      <mesh position={[2.2, 0.5, -0.78]}>
        <boxGeometry args={[0.08, 0.56, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[2.2, 0.52, -0.5]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Under-desk ambient LED strip */}
      <mesh position={[0, 0.72, 0.4]}>
        <boxGeometry args={[5.2, 0.02, 0.02]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── 2. Ergonomic Mesh Office Chair ──────────────────────────────────────────

export function ErgonomicMeshChair({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* 5-Star Chrome Base */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <group key={i}>
            <mesh
              position={[Math.cos(angle) * 0.25, 0.04, Math.sin(angle) * 0.25]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[0.5, 0.03, 0.04]} />
              <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.9} />
            </mesh>
            <mesh position={[Math.cos(angle) * 0.48, 0.03, Math.sin(angle) * 0.48]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* Gas lift cylinder */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.48, 12]} />
        <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Seat pan */}
      <mesh position={[0, 0.54, 0.02]}>
        <boxGeometry args={[0.48, 0.06, 0.46]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Seat cushion */}
      <mesh position={[0, 0.58, 0.02]}>
        <boxGeometry args={[0.44, 0.04, 0.42]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} />
      </mesh>

      {/* Backrest frame */}
      <mesh position={[0, 0.88, -0.2]}>
        <boxGeometry args={[0.46, 0.62, 0.04]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Mesh panel */}
      <mesh position={[0, 0.88, -0.17]}>
        <boxGeometry args={[0.4, 0.54, 0.01]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} transparent opacity={0.7} />
      </mesh>

      {/* Lumbar support pad */}
      <mesh position={[0, 0.7, -0.15]}>
        <boxGeometry args={[0.36, 0.12, 0.06]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Headrest */}
      <mesh position={[0, 1.24, -0.22]}>
        <boxGeometry args={[0.28, 0.14, 0.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Armrests */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.26, 0.62, -0.04]}>
            <boxGeometry args={[0.03, 0.16, 0.03]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[side * 0.26, 0.72, 0.04]}>
            <boxGeometry args={[0.08, 0.03, 0.22]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── 3. Low-Profile Lounge Sofa ─────────────────────────────────────────────

export function LoungeCouch({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat base */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.8, 0.28, 0.95]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>

      {/* Seat cushions */}
      <mesh position={[-0.55, 0.46, 0.02]}>
        <boxGeometry args={[1.2, 0.1, 0.86]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>
      <mesh position={[0.55, 0.46, 0.02]}>
        <boxGeometry args={[1.2, 0.1, 0.86]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.7, -0.38]}>
        <boxGeometry args={[2.8, 0.52, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>

      {/* Back cushions */}
      <mesh position={[-0.55, 0.72, -0.26]}>
        <boxGeometry args={[1.15, 0.42, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 0.72, -0.26]}>
        <boxGeometry args={[1.15, 0.42, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Left armrest */}
      <mesh position={[-1.46, 0.48, 0]}>
        <boxGeometry args={[0.12, 0.36, 0.85]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>

      {/* Right armrest */}
      <mesh position={[1.46, 0.48, 0]}>
        <boxGeometry args={[0.12, 0.36, 0.85]} />
        <meshStandardMaterial color="#1e293b" roughness={0.75} />
      </mesh>

      {/* Slim brushed-metal amber legs */}
      {[
        [-1.2, 0.07, 0.35],
        [1.2, 0.07, 0.35],
        [-1.2, 0.07, -0.35],
        [1.2, 0.07, -0.35],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.14, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// ─── 4. Geometric Coffee Table ──────────────────────────────────────────────

export function GeometricCoffeeTable({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Glass top */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[1.4, 0.03, 0.8]} />
        <meshPhysicalMaterial
          color="#e2e8f0"
          transparent
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
          transmission={0.5}
          ior={1.52}
        />
      </mesh>

      {/* Metal frame edges (triangular pattern) */}
      <mesh position={[0, 0.37, 0]}>
        <boxGeometry args={[1.44, 0.04, 0.02]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.37, 0]} rotation={[0, Math.PI / 3, 0]}>
        <boxGeometry args={[1.44, 0.04, 0.02]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.37, 0]} rotation={[0, -Math.PI / 3, 0]}>
        <boxGeometry args={[1.44, 0.04, 0.02]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Three geometric legs */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.5, 0.19, Math.sin(angle) * 0.3]}>
          <cylinderGeometry args={[0.025, 0.03, 0.36, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* Lower cross brace */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.02]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

// ─── 5. Server Rack ─────────────────────────────────────────────────────────

export function ServerRack({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  const led1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const led2Ref = useRef<THREE.MeshStandardMaterial>(null);
  const led3Ref = useRef<THREE.MeshStandardMaterial>(null);
  const led4Ref = useRef<THREE.MeshStandardMaterial>(null);
  const led5Ref = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const blink = (offset: number) => (Math.sin(t * 4 + offset) > 0.3 ? 1.8 : 0.15);
    if (led1Ref.current) led1Ref.current.emissiveIntensity = blink(0);
    if (led2Ref.current) led2Ref.current.emissiveIntensity = blink(1.2);
    if (led3Ref.current) led3Ref.current.emissiveIntensity = blink(2.5);
    if (led4Ref.current) led4Ref.current.emissiveIntensity = blink(3.8);
    if (led5Ref.current) led5Ref.current.emissiveIntensity = blink(5.1);
  });

  const ledRefs = [led1Ref, led2Ref, led3Ref, led4Ref, led5Ref];

  return (
    <group position={position} rotation={rotation}>
      {/* Main Cabinet Body */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.75, 2.0, 0.65]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Front Panel */}
      <mesh position={[0, 1.0, 0.33]}>
        <boxGeometry args={[0.72, 1.96, 0.02]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Rack Mount Rails + LED indicators */}
      {[-0.55, -0.2, 0.15, 0.5, 0.85].map((yOff, i) => (
        <group key={i}>
          <mesh position={[0, yOff + 0.55, 0.34]}>
            <boxGeometry args={[0.68, 0.015, 0.005]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>

          <mesh position={[0.28, yOff + 0.62, 0.345]}>
            <boxGeometry args={[0.03, 0.03, 0.01]} />
            <meshStandardMaterial
              ref={ledRefs[i]}
              color={i % 2 === 0 ? "#00f0ff" : "#ffffff"}
              emissive={i % 2 === 0 ? "#00f0ff" : "#ffffff"}
              emissiveIntensity={1.0}
              toneMapped={false}
            />
          </mesh>

          <mesh position={[0.22, yOff + 0.62, 0.345]}>
            <boxGeometry args={[0.02, 0.02, 0.01]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Ventilation mesh top */}
      <mesh position={[0, 2.02, 0]}>
        <boxGeometry args={[0.72, 0.03, 0.62]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} wireframe />
      </mesh>

      {/* Cabinet footer */}
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.78, 0.04, 0.68]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Subtle inner glow */}
      <pointLight color="#00f0ff" intensity={0.8} distance={3} position={[0, 1.0, 0.5]} />
    </group>
  );
}

// ─── 6. Floating Wall Shelves ───────────────────────────────────────────────

export function FloatingWallShelves({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position} rotation={rotation}>
      {[0, 1.0, 2.0].map((yOff, i) => (
        <group key={i} position={[0, yOff, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.05, 0.28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.75} />
          </mesh>
          <mesh position={[-0.65, -0.08, -0.12]}>
            <boxGeometry args={[0.04, 0.15, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0.65, -0.08, -0.12]}>
            <boxGeometry args={[0.04, 0.15, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Bottom shelf: glowing cube artifact */}
      <mesh position={[-0.4, 0.09, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          toneMapped={false}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Bottom shelf: book stack */}
      <mesh position={[0.2, 0.08, 0]}>
        <boxGeometry args={[0.22, 0.14, 0.16]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.16, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.15]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Middle shelf: glowing orb */}
      <mesh position={[0.3, 1.08, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Middle shelf: trophy */}
      <mesh position={[-0.3, 1.06, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.1, 8]} />
        <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[-0.3, 1.14, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Top shelf: mini NAS box */}
      <mesh position={[0, 2.07, 0]}>
        <boxGeometry args={[0.3, 0.12, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0.12, 2.07, 0.11]}>
        <boxGeometry args={[0.02, 0.02, 0.01]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── 7. Cyber Plant (Monstera) ──────────────────────────────────────────────

export function CyberPlant({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Hexagonal Concrete Pot */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.24, 6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.85} />
      </mesh>

      {/* Soil surface */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 6]} />
        <meshStandardMaterial color="#422006" roughness={0.95} />
      </mesh>

      {/* Main stem */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.45, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>

      {/* Monstera leaves */}
      {[
        { pos: [0.12, 0.62, 0.06] as [number, number, number], rot: [0.3, 0.5, 0.2] as [number, number, number], s: 1 },
        { pos: [-0.1, 0.68, -0.08] as [number, number, number], rot: [-0.2, -0.8, 0.1] as [number, number, number], s: 0.85 },
        { pos: [0.05, 0.55, 0.1] as [number, number, number], rot: [0.5, 0.2, -0.3] as [number, number, number], s: 0.7 },
        { pos: [-0.08, 0.73, 0.04] as [number, number, number], rot: [-0.1, 1.2, 0.15] as [number, number, number], s: 0.9 },
        { pos: [0.1, 0.78, -0.05] as [number, number, number], rot: [0.2, -0.4, -0.1] as [number, number, number], s: 0.75 },
      ].map((leaf, i) => (
        <mesh key={i} position={leaf.pos} rotation={leaf.rot} scale={leaf.s}>
          <boxGeometry args={[0.18, 0.005, 0.14]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#15803d" : "#166534"}
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── 8. Arc Floor Lamp ──────────────────────────────────────────────────────

export function FloorLamp({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Heavy circular base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.25, 0.28, 0.06, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Vertical pole */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.95, 12]} />
        <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Arc curve section */}
      <mesh position={[0.25, 1.9, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
        <meshStandardMaterial color="#d97706" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Lamp shade dome */}
      <mesh position={[0.5, 1.78, 0]}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner light surface */}
      <mesh position={[0.5, 1.72, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.14, 16]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive="#f59e0b"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Warm ambient light */}
      <pointLight
        color="#f59e0b"
        intensity={2.5}
        distance={6}
        position={[0.5, 1.6, 0]}
      />
    </group>
  );
}
