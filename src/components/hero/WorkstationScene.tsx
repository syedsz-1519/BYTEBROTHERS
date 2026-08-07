"use client";

import React, { useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { ProceduralDeveloperDesk } from "../3d/ProceduralDeveloperDesk";

const MonitorGlowLights = () => {
  const spotRef = useRef<THREE.SpotLight>(null);

  useLayoutEffect(() => {
    if (spotRef.current) {
      spotRef.current.target.position.set(0, -0.2, 0.4);
      spotRef.current.parent?.add(spotRef.current.target);
    }
  }, []);

  return (
    <>
      <spotLight
        ref={spotRef}
        position={[0, 1.4, 1.6]}
        angle={0.65}
        penumbra={0.8}
        intensity={2}
        color="#00f0ff"
        distance={8}
      />
      <pointLight position={[0, 0.8, 1.2]} intensity={2} color="#00f0ff" distance={5} />
    </>
  );
};

export const WorkstationScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const width = viewport.width;
  const isMobile = width < 6;
  const isTablet = width >= 6 && width < 10;

  const scale = isMobile ? 0.4 : isTablet ? 0.5 : 0.65;
  const posX = isMobile ? 0 : isTablet ? 2.5 : 3.5;
  const posY = isMobile ? -1.8 : isTablet ? -1.6 : -1.5;
  const posZ = -1;

  useFrame((state) => {
    if (!groupRef.current) return;
    const targetY = state.pointer.x * 0.06;
    const targetX = -state.pointer.y * 0.03;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.1}>
        <group position={[posX, posY, posZ]} scale={scale} rotation={[0.12, 0, 0]}>
          <ProceduralDeveloperDesk />
          <MonitorGlowLights />
        </group>
      </Float>
    </group>
  );
};

export default WorkstationScene;
