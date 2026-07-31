"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

// Non-agency clutter keywords to hide from the GLB scene
const CLUTTER_KEYWORDS = [
  "soccer", "ball", "toy", "figure", "figurine", "poster",
  "social", "icon", "twitter", "youtube", "instagram", "tiktok",
  "discord", "twitch", "plant", "cactus", "cat", "pet",
  "trophy", "cup", "bottle", "food", "snack", "pizza",
  "headphone_stand", "gamepad", "controller", "joystick",
  "rubik", "cube_toy", "action_figure", "funko", "dumbell", "weights"
];

// Imported Local Workstation Component with mesh filtering
const WorkstationModel = (props: any) => {
  const { scene } = useGLTF("/workstation/programmer_desk_setup__stylized_3d_room.glb") as any;

  useEffect(() => {
    if (!scene) return;

    // Traverse the entire scene graph
    scene.traverse((child: THREE.Object3D) => {
      const name = child.name.toLowerCase();

      // Hide clutter objects
      const isClutter = CLUTTER_KEYWORDS.some((keyword) => name.includes(keyword));
      if (isClutter) {
        child.visible = false;
        return;
      }

      // Boost monitor screen emission for glow effect
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const nameCheck = name;

        if (
          nameCheck.includes("screen") ||
          nameCheck.includes("monitor") ||
          nameCheck.includes("display") ||
          nameCheck.includes("lcd") ||
          nameCheck.includes("emission") ||
          nameCheck.includes("glow")
        ) {
          if (mat.emissive) {
            mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 2.5);
          }
          mat.toneMapped = false;
        }

        // Enable shadows on all visible meshes
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} dispose={null} />;
};

export const WorkstationScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Responsive scale and position calculations based on R3F viewport width
  const isMobile = viewport.width < 6;
  const isTablet = viewport.width >= 6 && viewport.width < 10;

  const scale = isMobile ? 0.95 : isTablet ? 1.2 : 1.45;
  const posY = isMobile ? -1.6 : -2.0;
  const posX = 0; // Center horizontally as requested

  useFrame((state) => {
    if (!groupRef.current) return;

    // Subtle parallax tracking — gentle tilt on mouse movement
    const targetY = state.pointer.x * 0.1;
    const targetX = -state.pointer.y * 0.05;

    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.04} floatIntensity={0.15}>
        {/* Centered & positioned at bottom for clean viewport composition */}
        <group
          position={[posX, posY, -1]}
          scale={scale}
          rotation={[0.08, -Math.PI * 0.75, 0]}
        >
          <WorkstationModel />
        </group>
      </Float>
    </group>
  );
};

// Preload the GLTF to avoid pop-in
useGLTF.preload("/workstation/programmer_desk_setup__stylized_3d_room.glb");
