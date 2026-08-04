import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface CorridorProps {
  baydepth?: number;
  numBays?: number;
  halfWidth?: number;
  height?: number;
}

const Corridor: React.FC<CorridorProps> = ({
  baydepth = 14,
  numBays = 5,
  halfWidth = 5.2,
  height = 6.5,
}) => {
  const CORRIDOR_LEN = baydepth * numBays;

  const { floorGeo, ceilingGeo, wallGeos, trimGeos } = useMemo(() => {
    const floorGeometry = new THREE.PlaneGeometry(halfWidth * 2, CORRIDOR_LEN + 20);
    const ceilingGeometry = new THREE.PlaneGeometry(halfWidth * 2, CORRIDOR_LEN + 20);

    const wallGeometries: THREE.PlaneGeometry[] = [];
    const trimGeometries: THREE.BoxGeometry[] = [];

    for (let i = 0; i < 2; i++) {
      const wallGeo = new THREE.PlaneGeometry(CORRIDOR_LEN + 20, height);
      wallGeometries.push(wallGeo);

      const trimGeo = new THREE.BoxGeometry(0.04, 0.12, CORRIDOR_LEN + 20);
      trimGeometries.push(trimGeo);
    }

    return {
      floorGeo: floorGeometry,
      ceilingGeo: ceilingGeometry,
      wallGeos: wallGeometries,
      trimGeos: trimGeometries,
    };
  }, [CORRIDOR_LEN, halfWidth, height]);

  return (
    <group>
      {/* Floor */}
      <mesh geometry={floorGeo} position={[0, 0, -CORRIDOR_LEN / 2 + 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={0x0d1014} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Ceiling */}
      <mesh geometry={ceilingGeo} position={[0, height, -CORRIDOR_LEN / 2 + 10]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={0x12161c} roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Side Walls & Trims */}
      {[-1, 1].map((side) => (
        <group key={`side-${side}`}>
          {/* Wall */}
          <mesh
            geometry={wallGeos[side === -1 ? 0 : 1]}
            position={[side * halfWidth, height / 2, -CORRIDOR_LEN / 2 + 10]}
            rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
          >
            <meshStandardMaterial color={0x12161c} roughness={0.85} metalness={0.15} />
          </mesh>

          {/* Brass Trim */}
          <mesh
            geometry={trimGeos[side === -1 ? 0 : 1]}
            position={[side * (halfWidth - 0.05), 0.06, -CORRIDOR_LEN / 2 + 10]}
          >
            <meshStandardMaterial color={0x1c2229} roughness={0.7} metalness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Ambient Light */}
      <ambientLight intensity={0.9} color={0x2a3038} />

      {/* Fog */}
      <fog attach="fog" args={[0x05070a, 1, 100]} />
    </group>
  );
};

export default React.memo(Corridor);
