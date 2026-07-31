"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

// Imported Local Workstation Component — rendering native textures & materials
const WorkstationModel = (props: any) => {
  const { scene } = useGLTF("/workstation/programmer_desk_setup__stylized_3d_room.glb") as any;

  return <primitive object={scene} {...props} dispose={null} />;
};

export const WorkstationScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Responsive scale and vertical positioning (anchored to lower floor to prevent text collision)
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
        {/* RIGHT side of screen: position [3.5, -1.5, -1] on desktop */}
        <group
          position={[posX, posY, posZ]}
          scale={scale}
          rotation={[0.12, 0, 0]}
        >
          <WorkstationModel />
        </group>
      </Float>
    </group>
  );
};

// Preload the GLTF to avoid pop-in
useGLTF.preload("/workstation/programmer_desk_setup__stylized_3d_room.glb");
