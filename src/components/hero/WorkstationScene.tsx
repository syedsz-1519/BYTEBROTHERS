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

  // Responsive scale and vertical positioning (zoomed out for full desk perspective)
  const width = viewport.width;
  const isMobile = width < 6;
  const isTablet = width >= 6 && width < 10;

  const scale = isMobile ? 0.45 : isTablet ? 0.6 : 0.75;
  const posY = isMobile ? -1.1 : isTablet ? -1.3 : -1.5;
  const posX = 0; // Centered horizontally

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle mouse parallax tracking
    const targetY = state.pointer.x * 0.08;
    const targetX = -state.pointer.y * 0.04;

    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.03} floatIntensity={0.12}>
        {/* Front facing [0.15, 0, 0] zoomed out to reveal the full workstation setup */}
        <group
          position={[posX, posY, 0]}
          scale={scale}
          rotation={[0.15, 0, 0]}
        >
          <WorkstationModel />
        </group>
      </Float>
    </group>
  );
};

// Preload the GLTF to avoid pop-in
useGLTF.preload("/workstation/programmer_desk_setup__stylized_3d_room.glb");
