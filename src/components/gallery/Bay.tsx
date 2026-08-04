import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraPosition } from './GalleryScene';

export interface BayProps {
  index: number;
  baydepth?: number;
  halfWidth?: number;
  height?: number;
  frameColor?: number;
}

const Bay: React.FC<BayProps> = ({
  index,
  baydepth = 14,
  halfWidth = 5.2,
  height = 6.5,
  frameColor = 0xc9a876,
}) => {
  const cameraPosition = useCameraPosition();
  const groupRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const panelMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const z = -(baydepth * (index + 1) + baydepth / 2);
  const side = index % 2 === 0 ? -1 : 1;

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(side * (halfWidth - 0.12), height / 2, z);
    groupRef.current.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
  }, [z, side, halfWidth, height]);

  useFrame(() => {
    if (!spotRef.current || !panelMatRef.current || !cameraPosition) return;

    const dist = Math.abs(cameraPosition.z - z);
    const intensity = Math.max(0, 1 - dist / 6.5);

    spotRef.current.intensity = intensity * 4.5;
    panelMatRef.current.emissiveIntensity = intensity * 0.6;
  });

  return (
    <group ref={groupRef}>
      {/* Panel */}
      <mesh>
        <planeGeometry args={[3.4, 2.1]} />
        <meshStandardMaterial
          ref={panelMatRef}
          color={0x1a1f26}
          roughness={0.4}
          metalness={0.3}
          emissive={frameColor}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Frame Border (line segments) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.5, 2.2)]} />
        <lineBasicMaterial color={frameColor} />
      </lineSegments>

      {/* Spotlight */}
      <spotLight
        ref={spotRef}
        color={frameColor}
        intensity={0}
        distance={8}
        angle={Math.PI / 6}
        penumbra={0.5}
        decay={1.2}
        position={[0, 1.6, 0.8]}
        target-position={[0, 0, 0]}
      />
    </group>
  );
};

export default React.memo(Bay);
