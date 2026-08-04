import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getScrollProgress } from '../../hooks/useScrollProgress';
import Corridor from './Corridor';
import Bay from './Bay';

interface GallerySceneInnerProps {
  baydepth?: number;
  numBays?: number;
  halfWidth?: number;
  height?: number;
  frameColors?: number[];
}

const GallerySceneInner: React.FC<GallerySceneInnerProps> = ({
  baydepth = 14,
  numBays = 5,
  halfWidth = 5.2,
  height = 6.5,
  frameColors = [0xc9a876, 0x4a6fa5, 0xc9a876],
}) => {
  const { camera } = useThree();
  const cameraRefRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.55, 4));
  const targetZRef = useRef(4);
  const currentLookXRef = useRef(0);
  const bobPhaseRef = useRef(0);

  const CORRIDOR_LEN = baydepth * numBays;
  const START_Y = 1.55;
  const BOB_AMP = 0.03;

  useEffect(() => {
    camera.position.set(0, START_Y, 4);
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    // Update target Z from scroll progress
    const scrollProg = getScrollProgress();
    targetZRef.current = 4 - scrollProg * (CORRIDOR_LEN - 6);

    // Smooth camera movement toward target Z
    camera.position.z += (targetZRef.current - camera.position.z) * 0.08;

    // Bob effect
    bobPhaseRef.current += 0.011;
    camera.position.y = START_Y + Math.sin(bobPhaseRef.current * 1.1) * BOB_AMP;

    // Mouse look (optional: you can add mouse tracking here)
    // For now, keep it simple
    camera.rotation.y = currentLookXRef.current * 0.35;

    // Store position for Bay distance calculations
    cameraRefRef.current.copy(camera.position);
  });

  return (
    <>
      <Corridor baydepth={baydepth} numBays={numBays} halfWidth={halfWidth} height={height} />

      {/* Bays with frames */}
      {[0, 1, 2].map((i) => (
        <Bay
          key={`bay-${i}`}
          index={i}
          baydepth={baydepth}
          halfWidth={halfWidth}
          height={height}
          frameColor={frameColors[i % frameColors.length]}
          cameraPosition={cameraRefRef.current}
        />
      ))}
    </>
  );
};

interface GallerySceneProps {
  baydepth?: number;
  numBays?: number;
  halfWidth?: number;
  height?: number;
  frameColors?: number[];
}

export const GalleryScene: React.FC<GallerySceneProps> = ({
  baydepth = 14,
  numBays = 5,
  halfWidth = 5.2,
  height = 6.5,
  frameColors = [0xc9a876, 0x4a6fa5, 0xc9a876],
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#05070a] flex items-center justify-center">
        <div className="text-[#8b8f96] font-space-grotesk text-sm">Loading gallery...</div>
      </div>
    );
  }

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
      }}
      dpr={[1, 2]}
      camera={{
        position: [0, 1.55, 4],
        fov: 55,
        near: 0.1,
        far: 100,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <GallerySceneInner
        baydepth={baydepth}
        numBays={numBays}
        halfWidth={halfWidth}
        height={height}
        frameColors={frameColors}
      />
    </Canvas>
  );
};

export default GalleryScene;
