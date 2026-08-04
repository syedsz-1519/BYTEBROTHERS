/**
 * WindowMesh.tsx
 * Individual portal window with brass/steel frame and glass material
 * Supports interactive hover effects and click detection
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PortalContentType } from '../../hooks/usePortalManager';

export interface WindowMeshProps {
  id: string;
  type: PortalContentType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  frameColor?: number;
  glassColor?: number;
  onClickWindow: (id: string, type: PortalContentType) => void;
  isActive?: boolean;
  animationProgress?: number;
}

const WINDOW_WIDTH = 1.8;
const WINDOW_HEIGHT = 2.4;
const FRAME_DEPTH = 0.08;
const GLASS_THICKNESS = 0.02;

/**
 * Create glass material with reflections and transparency
 */
function createGlassMaterial(color: number): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.15,
    roughness: 0.15,
    transmission: 0.85,
    thickness: 0.5,
    ior: 1.5,
    envMapIntensity: 1.2,
    transparent: true,
    opacity: 0.9,
    side: THREE.FrontSide,
  });
}

/**
 * Create frame material with metallic appearance
 */
function createFrameMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.8,
    roughness: 0.2,
    emissive: color,
    emissiveIntensity: 0,
  });
}

/**
 * WindowMesh - Individual interactive window with frame and glass
 * Features:
 * - Brass/steel frame geometry
 * - Glass material with reflections
 * - Hover glow effect
 * - Click detection integration
 * - Animation state support
 */
export const WindowMesh = React.memo(
  ({
    id,
    type,
    position,
    rotation = [0, 0, 0],
    scale = 1,
    frameColor = 0xc9a876,
    glassColor = 0x4a8fd8,
    onClickWindow,
    isActive = false,
    animationProgress = 0,
  }: WindowMeshProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const glassRef = useRef<THREE.Mesh>(null);
    const frameMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const glassMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const spotRef = useRef<THREE.SpotLight>(null);

    const [isHovered, setIsHovered] = useState(false);

    // Memoize geometries
    const geometries = useMemo(() => {
      // Frame geometry (thick border)
      const frameGeo = new THREE.BoxGeometry(
        WINDOW_WIDTH + FRAME_DEPTH * 2,
        WINDOW_HEIGHT + FRAME_DEPTH * 2,
        FRAME_DEPTH
      );

      // Remove center for hollow frame effect
      const positions = frameGeo.getAttribute('position') as THREE.BufferAttribute;
      const posArray = positions.array as Float32Array;

      // Glass pane geometry
      const glassGeo = new THREE.PlaneGeometry(WINDOW_WIDTH, WINDOW_HEIGHT);

      return { frameGeo, glassGeo };
    }, []);

    // Memoize materials
    const materials = useMemo(() => {
      const frameMat = createFrameMaterial(frameColor);
      const glassMat = createGlassMaterial(glassColor);
      return { frameMat, glassMat };
    }, [frameColor, glassColor]);

    // Handle click detection
    const handlePointerDown = (e: THREE.Event & { stopPropagation?: () => void }) => {
      e.stopPropagation?.();
      onClickWindow(id, type);
    };

    // Handle hover effects
    const handlePointerEnter = () => {
      setIsHovered(true);
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
    };

    // Animation frame for glow and hover effects
    useFrame(({ clock }) => {
      if (!frameMatRef.current || !glassMatRef.current || !spotRef.current) return;

      // Glow intensity based on hover and active state
      const targetGlow = isHovered ? 0.8 : isActive ? 0.4 : 0.1;
      frameMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        frameMatRef.current.emissiveIntensity,
        targetGlow,
        0.1
      );

      // Subtle pulse animation when active
      if (isActive) {
        const pulse = Math.sin(clock.elapsedTime * 2) * 0.05 + 1;
        if (glassRef.current) {
          glassRef.current.scale.z = pulse;
        }
      }

      // Spotlight intensity
      const targetSpotIntensity = isHovered ? 3 : isActive ? 1.5 : 0.5;
      spotRef.current.intensity = THREE.MathUtils.lerp(
        spotRef.current.intensity,
        targetSpotIntensity,
        0.15
      );

      // Glass material opacity changes
      const targetOpacity = isHovered ? 0.95 : 0.85;
      glassMatRef.current.opacity = THREE.MathUtils.lerp(
        glassMatRef.current.opacity,
        targetOpacity,
        0.1
      );
    });

    // Cleanup
    useEffect(() => {
      return () => {
        geometries.frameGeo.dispose();
        geometries.glassGeo.dispose();
        materials.frameMat.dispose();
        materials.glassMat.dispose();
      };
    }, [geometries, materials]);

    return (
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Frame - Brass/steel outer border */}
        <mesh geometry={geometries.frameGeo} material={frameMatRef.current}>
          <meshStandardMaterial
            ref={frameMatRef}
            color={frameColor}
            metalness={0.8}
            roughness={0.2}
            emissive={frameColor}
            emissiveIntensity={0}
          />
        </mesh>

        {/* Glass pane - Interactive surface */}
        <mesh
          ref={glassRef}
          geometry={geometries.glassGeo}
          material={glassMatRef.current}
          position={[0, 0, FRAME_DEPTH / 2 + GLASS_THICKNESS]}
        >
          <meshPhysicalMaterial
            ref={glassMatRef}
            color={glassColor}
            metalness={0.15}
            roughness={0.15}
            transmission={0.85}
            thickness={0.5}
            ior={1.5}
            envMapIntensity={1.2}
            transparent={true}
            opacity={0.9}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Highlight light - Emitted from glass */}
        <spotLight
          ref={spotRef}
          color={0xffffff}
          intensity={0.5}
          distance={3}
          angle={Math.PI / 3}
          penumbra={0.5}
          decay={1.5}
          position={[0, 0, FRAME_DEPTH + 0.5]}
          target-position={[0, 0, 0]}
        />

        {/* Accent light - Frame color */}
        <pointLight
          color={frameColor}
          intensity={isHovered ? 1.5 : 0.5}
          distance={2}
          decay={2}
          position={[0, 0, -FRAME_DEPTH - 0.3]}
        />
      </group>
    );
  }
);

WindowMesh.displayName = 'WindowMesh';
