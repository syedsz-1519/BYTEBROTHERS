import React, { useRef, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { PositionedContent, LODLevel } from '../../../types/rotatable';

interface ContentBillboardProps {
  item: PositionedContent;
  lodLevel: LODLevel;
  onSelect: () => void;
  theme?: 'dark' | 'light';
}

/**
 * Individual content item billboard (always faces camera)
 */
export function ContentBillboard({
  item,
  lodLevel,
  onSelect,
  theme = 'dark',
}: ContentBillboardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { camera } = useThree();

  // Make billboard face camera
  useFrame(() => {
    if (!groupRef.current) return;

    // Always face camera
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  const handleClick = useCallback(() => {
    onSelect();
  }, [onSelect]);

  const getScale = (lod: LODLevel): number => {
    switch (lod) {
      case 'high':
        return 1.2;
      case 'medium':
        return 0.8;
      case 'low':
        return 0.4;
      default:
        return 1;
    }
  };

  const scale = getScale(lodLevel);
  const textColor = theme === 'dark' ? '#e5e1e4' : '#0f172a';
  const hoverColor = isHovered ? '#3b82f6' : '#a1a1aa';

  return (
    <group
      ref={groupRef}
      position={[item.position.x, item.position.y, item.position.z]}
      scale={scale}
    >
      {/* Background card */}
      <mesh
        onClick={handleClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        castShadow
      >
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial
          color={hoverColor}
          metalness={0.3}
          roughness={0.4}
          emissive={isHovered ? '#3b82f6' : '#000000'}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </mesh>

      {/* Title text */}
      {(lodLevel === 'high' || lodLevel === 'medium') && (
        <Text
          position={[0, 0.5, 0.1]}
          fontSize={0.4}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          font="/fonts/TimesNewRoman-Regular.ttf"
        >
          {item.title}
        </Text>
      )}

      {/* Description text (high LOD only) */}
      {lodLevel === 'high' && item.description && (
        <Text
          position={[0, -0.3, 0.1]}
          fontSize={0.2}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          font="/fonts/TimesNewRoman-Regular.ttf"
        >
          {item.description.substring(0, 50)}...
        </Text>
      )}

      {/* Image texture (if available) */}
      {item.imageUrl && lodLevel !== 'low' && (
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.8, 1.5]} />
          <meshStandardMaterial
            map={new THREE.TextureLoader().load(item.imageUrl)}
            metalness={0.1}
            roughness={0.3}
          />
        </mesh>
      )}

      {/* Glow effect when hovered */}
      {isHovered && (
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[2.2, 2.7, 0.05]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}

export default ContentBillboard;
