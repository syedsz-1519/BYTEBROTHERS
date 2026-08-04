import React, { useRef, useEffect, useState, createContext, useContext } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getScrollProgress } from '../../hooks/useScrollProgress';
import Corridor from './Corridor';
import Bay from './Bay';

// Camera position context for Bay components
const CameraPositionContext = createContext<THREE.Vector3 | null>(null);
export const useCameraPosition = () => useContext(CameraPositionContext);

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
  const [, setCameraUpdate] = useState({});

  const CORRIDOR_LEN = baydepth * numBays;
  const START_Y = 1.55;
  const BOB_AMP = 0.03;
  const LERP_SPEED = 0.08;

  useEffect(() => {
    camera.position.set(0, START_Y, 4);
    
    // Type-safe camera setup
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 55;
      camera.near = 0.1;
      camera.far = 100;
    }
    
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    // Update target Z from scroll progress (read from ref, not setState)
    const scrollProg = getScrollProgress();
    targetZRef.current = 4 - scrollProg * (CORRIDOR_LEN - 6);

    // Smooth camera movement toward target Z
    camera.position.z += (targetZRef.current - camera.position.z) * LERP_SPEED;

    // Bob effect (subtle vertical movement)
    bobPhaseRef.current += 0.011;
    camera.position.y = START_Y + Math.sin(bobPhaseRef.current) * BOB_AMP;

    // Optional mouse look (disabled for now)
    // camera.rotation.y = currentLookXRef.current * 0.35;

    // Store position for Bay distance calculations
    cameraRefRef.current.copy(camera.position);
    
    // Trigger re-render for dependent Bay components
    setCameraUpdate({});
  });

  return (
    <CameraPositionContext.Provider value={cameraRefRef.current}>
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
        />
      ))}
    </CameraPositionContext.Provider>
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
    // SSR guard
    if (typeof window === 'undefined') {
      return;
    }
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
        powerPreference: 'high-performance',
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
