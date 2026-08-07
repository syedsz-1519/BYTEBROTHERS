"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createMonitorTexture } from "../hero/monitorTexture";

export interface ProceduralDeveloperDeskProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function ProceduralDeveloperDesk({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: ProceduralDeveloperDeskProps) {
  // Fan rotation refs for PC case
  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);
  const fan3Ref = useRef<THREE.Group>(null);
  const rearFanRef = useRef<THREE.Group>(null);

  // Monitor canvas texture handles
  const codeHandle = useMemo(() => createMonitorTexture({ type: "code" }), []);
  const termHandle = useMemo(() => createMonitorTexture({ type: "terminal" }), []);

  useEffect(() => {
    return () => {
      codeHandle.dispose();
      termHandle.dispose();
    };
  }, [codeHandle, termHandle]);

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    codeHandle.draw(elapsed);
    termHandle.draw(elapsed);

    // Rotate PC fans
    const rotSpeed = 0.08;
    if (fan1Ref.current) fan1Ref.current.rotation.z += rotSpeed;
    if (fan2Ref.current) fan2Ref.current.rotation.z += rotSpeed;
    if (fan3Ref.current) fan3Ref.current.rotation.z += rotSpeed;
    if (rearFanRef.current) rearFanRef.current.rotation.z += rotSpeed;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ── 1. Ergonomic Oak Standing Desk & Steel Frame ──────────────── */}
      
      {/* Oak Desktop Slab */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[4.2, 0.12, 1.9]} />
        <meshStandardMaterial color="#c29b68" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Dual Motor Steel Desk Legs */}
      <mesh position={[-1.7, 0.36, 0]}>
        <boxGeometry args={[0.12, 0.72, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[1.7, 0.36, 0]}>
        <boxGeometry args={[0.12, 0.72, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[-1.7, 0.03, 0]}>
        <boxGeometry args={[0.3, 0.06, 1.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.7} />
      </mesh>
      <mesh position={[1.7, 0.03, 0]}>
        <boxGeometry args={[0.3, 0.06, 1.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Desk Mat (Midnight Felt with Amber Stitch Edge) */}
      <mesh position={[0, 0.815, 0.1]}>
        <boxGeometry args={[3.0, 0.015, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.816, 0.1]}>
        <boxGeometry args={[3.04, 0.005, 1.24]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>

      {/* ── 2. Ultra-Wide & Dual Curved Monitor Setup ─────────────────── */}

      {/* Dual Monitor Stand Base & Arm */}
      <group position={[0, 0.81, -0.5]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.25, 0.28, 0.04, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Left Arm */}
        <mesh position={[-0.45, 0.75, -0.05]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.9, 0.05, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        {/* Right Arm */}
        <mesh position={[0.45, 0.75, -0.05]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.9, 0.05, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
      </group>

      {/* Main Center Ultra-Wide Monitor (Code View) */}
      <group position={[-0.3, 1.7, -0.45]} rotation={[0, 0.08, 0]}>
        {/* Bezel */}
        <mesh>
          <boxGeometry args={[2.5, 1.35, 0.08]} />
          <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Screen Mesh */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.42, 1.28]} />
          <meshStandardMaterial
            map={codeHandle.texture}
            emissiveMap={codeHandle.texture}
            emissive="#ffffff"
            emissiveIntensity={0.6}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>
        {/* Ambient Backlight Glow */}
        <pointLight color="#00f0ff" intensity={2.0} distance={5} position={[0, 0, -0.3]} />
      </group>

      {/* Secondary Vertical Curved Monitor (Terminal View) */}
      <group position={[1.35, 1.75, -0.4]} rotation={[0, -0.22, 0]}>
        {/* Bezel */}
        <mesh>
          <boxGeometry args={[1.25, 1.45, 0.08]} />
          <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Screen Mesh */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.18, 1.38]} />
          <meshStandardMaterial
            map={termHandle.texture}
            emissiveMap={termHandle.texture}
            emissive="#ffffff"
            emissiveIntensity={0.55}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>
        {/* Ambient Backlight Glow */}
        <pointLight color="#f59e0b" intensity={1.8} distance={4} position={[0, 0, -0.3]} />
      </group>

      {/* ── 3. Custom High-Performance RGB Dev PC Rig ────────────────── */}

      <group position={[1.85, 1.4, 0.15]}>
        {/* Main Obsidian Chassis */}
        <mesh>
          <boxGeometry args={[0.8, 1.15, 1.15]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Front Mesh Grill */}
        <mesh position={[-0.41, 0, 0]}>
          <boxGeometry args={[0.02, 1.1, 1.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} wireframe />
        </mesh>

        {/* Front RGB Fans */}
        {[-0.32, 0, 0.32].map((yPos, idx) => (
          <group key={idx} position={[-0.39, yPos, 0]}>
            {/* Fan LED Ring */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.13, 0.015, 16, 32]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? "#00f0ff" : "#f59e0b"}
                emissive={idx % 2 === 0 ? "#00f0ff" : "#f59e0b"}
                emissiveIntensity={1.2}
                toneMapped={false}
              />
            </mesh>
            {/* Fan Blades */}
            <group ref={idx === 0 ? fan1Ref : idx === 1 ? fan2Ref : fan3Ref}>
              {[0, 1, 2, 3].map((b) => (
                <mesh key={b} rotation={[0, Math.PI / 2, (b * Math.PI) / 2]}>
                  <boxGeometry args={[0.01, 0.22, 0.04]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
              ))}
            </group>
          </group>
        ))}

        {/* Smoked Tempered Glass Side Window */}
        <mesh position={[0, 0, 0.58]}>
          <boxGeometry args={[0.76, 1.08, 0.02]} />
          <meshPhysicalMaterial
            color="#1e293b"
            transparent
            opacity={0.4}
            roughness={0.1}
            transmission={0.6}
            ior={1.5}
          />
        </mesh>

        {/* Internal Hardware (GPU & RAM RGB) */}
        <group position={[0, -0.1, 0]}>
          {/* RTX GPU */}
          <mesh position={[0, -0.15, 0.1]}>
            <boxGeometry args={[0.6, 0.12, 0.35]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.15, 0.28]}>
            <boxGeometry args={[0.5, 0.02, 0.02]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>

          {/* Dual RAM RGB Strips */}
          <mesh position={[0.1, 0.2, -0.1]}>
            <boxGeometry args={[0.04, 0.18, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          <mesh position={[0.16, 0.2, -0.1]}>
            <boxGeometry args={[0.04, 0.18, 0.02]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>

          {/* Case Inner Ambient Light */}
          <pointLight color="#38bdf8" intensity={1.5} distance={2} position={[0, 0, 0.2]} />
        </group>
      </group>

      {/* ── 4. Studio Audio Speakers & Peripherals ──────────────────── */}

      {/* Left Studio Speaker */}
      <group position={[-1.75, 1.15, -0.3]}>
        <mesh>
          <boxGeometry args={[0.32, 0.58, 0.32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Tweeter */}
        <mesh position={[0, 0.15, 0.16]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Woofer (Amber Cone Ring) */}
        <mesh position={[0, -0.08, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 24]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} />
        </mesh>
      </group>

      {/* Right Studio Speaker */}
      <group position={[0.85, 1.15, -0.3]}>
        <mesh>
          <boxGeometry args={[0.32, 0.58, 0.32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Tweeter */}
        <mesh position={[0, 0.15, 0.16]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Woofer (Amber Cone Ring) */}
        <mesh position={[0, -0.08, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 24]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} />
        </mesh>
      </group>

      {/* Mechanical RGB Keyboard */}
      <group position={[-0.3, 0.84, 0.25]}>
        {/* Keyboard Base */}
        <mesh>
          <boxGeometry args={[1.15, 0.04, 0.38]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* RGB Underglow */}
        <mesh position={[0, -0.015, 0]}>
          <boxGeometry args={[1.17, 0.01, 0.4]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
        {/* Keycaps Grid */}
        <mesh position={[0, 0.025, 0]}>
          <boxGeometry args={[1.08, 0.02, 0.32]} />
          <meshStandardMaterial color="#090d16" roughness={0.6} />
        </mesh>
      </group>

      {/* Ergonomic Wireless Gaming Mouse */}
      <group position={[0.65, 0.85, 0.28]}>
        <mesh>
          <boxGeometry args={[0.18, 0.08, 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* RGB Scroll Wheel */}
        <mesh position={[0, 0.045, -0.06]}>
          <boxGeometry args={[0.02, 0.02, 0.06]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>

      {/* Audiophile Headphone Stand & Headphone */}
      <group position={[-1.75, 1.1, 0.3]}>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.02, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        {/* Headphones Arc */}
        <mesh position={[0, 0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.12, 0.02, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#090d16" roughness={0.5} />
        </mesh>
      </group>

      {/* ── 5. Desk Succulent Plant & Coffee Thermos ─────────────────── */}

      {/* Ceramic Pot with Succulent */}
      <group position={[1.15, 0.88, -0.2]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.08, 0.14, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </group>

      {/* Ceramic Coffee Mug */}
      <group position={[-1.15, 0.88, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.06, 0.14, 16]} />
          <meshStandardMaterial color="#d97706" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

export default ProceduralDeveloperDesk;
