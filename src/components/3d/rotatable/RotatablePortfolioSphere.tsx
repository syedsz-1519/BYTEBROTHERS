import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  OrbitControls,
  Sphere,
  Lights,
} from '@react-three/drei';
import * as THREE from 'three';
import {
  RotatablePortfolioSphereProps,
  SphereContentItem,
} from '../../../types/rotatable';
import {
  CAMERA_CONFIG,
  getSphereConfig,
  getLightingConfig,
  ROTATION_CONTROLS_DEFAULTS,
  ANIMATION_CONFIG,
} from '../../../utils/threejsConfig';
import {
  deltaToRotation,
  applyInertia,
  calculateAngularVelocity,
  isVelocityNegligible,
  getSphericalCoordinates,
} from '../../../utils/sphereMath';
import { SphereContentRenderer } from './SphereContentRenderer';
import { SphereLighting } from './SphereLighting';

/**
 * Main rotating sphere component using React Three Fiber
 */
function RotatableSphereScene(props: RotatablePortfolioSphereProps) {
  const { camera, scene, gl } = useThree();
  const sphereRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);

  // State
  const [isDragging, setIsDragging] = useState(false);
  const [previousPos, setPreviousPos] = useState({ x: 0, y: 0 });
  const [angularVelocity, setAngularVelocity] = useState(
    new THREE.Euler(0, 0, 0)
  );
  const [rotation, setRotation] = useState(new THREE.Quaternion());
  const [frameCount, setFrameCount] = useState(0);
  const [fps, setFps] = useState(60);

  const dragStart = useRef({ x: 0, y: 0 });
  const lastFrameTime = useRef(Date.now());

  const sphereConfig = getSphereConfig(props.theme || 'dark');
  const lightingConfig = getLightingConfig(props.theme || 'dark');

  // Handle pointer down
  const handlePointerDown = useCallback((e: PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    setPreviousPos({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle pointer move
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging || !sphereRef.current) return;

    const deltaX = e.clientX - previousPos.x;
    const deltaY = e.clientY - previousPos.y;

    // Convert mouse delta to rotation
    const rotationDelta = deltaToRotation(
      deltaX,
      deltaY,
      window.innerWidth,
      window.innerHeight,
      ROTATION_CONTROLS_DEFAULTS.sensitivity
    );

    // Apply rotation
    if (sphereRef.current) {
      const currentQuat = new THREE.Quaternion().copy(rotation);
      currentQuat.multiplyQuaternions(rotationDelta, currentQuat);
      setRotation(currentQuat);
    }

    setPreviousPos({ x: e.clientX, y: e.clientY });

    // Calculate velocity for inertia
    const velocity = calculateAngularVelocity(
      deltaX,
      deltaY,
      window.innerWidth,
      window.innerHeight,
      ROTATION_CONTROLS_DEFAULTS.sensitivity
    );
    setAngularVelocity(velocity);
  }, [isDragging, previousPos, rotation]);

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [gl, handlePointerDown, handlePointerMove, handlePointerUp]);

  // Animation loop
  useFrame(() => {
    if (!sphereRef.current) return;

    // Apply auto-rotation if enabled and not dragging
    if (props.autoRotate && !isDragging) {
      const autoRotQuat = new THREE.Quaternion();
      autoRotQuat.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        ANIMATION_CONFIG.autoRotateSpeed
      );
      const newRotation = new THREE.Quaternion().copy(rotation);
      newRotation.multiplyQuaternions(autoRotQuat, newRotation);
      setRotation(newRotation);
    }

    // Apply inertia when not dragging
    if (!isDragging && !isVelocityNegligible(angularVelocity)) {
      const newVelocity = applyInertia(
        angularVelocity.clone(),
        ANIMATION_CONFIG.inertiaDecay
      );
      setAngularVelocity(newVelocity);

      // Apply velocity to rotation
      if (!isVelocityNegligible(newVelocity)) {
        const velocityQuat = new THREE.Quaternion();
        velocityQuat.setFromEuler(newVelocity);
        const newRotation = new THREE.Quaternion().copy(rotation);
        newRotation.multiplyQuaternions(velocityQuat, newRotation);
        setRotation(newRotation);
      }
    }

    // Update sphere rotation
    if (sphereRef.current) {
      sphereRef.current.quaternion.copy(rotation);
    }

    // Calculate FPS
    const now = Date.now();
    const delta = now - lastFrameTime.current;
    lastFrameTime.current = now;

    if (delta > 0) {
      const currentFps = Math.round(1000 / delta);
      setFrameCount(prev => {
        const count = prev + 1;
        if (count % 30 === 0) {
          setFps(currentFps);
        }
        return count;
      });
    }

    // Update camera zoom
    if (camera instanceof THREE.PerspectiveCamera) {
      const zoomFactor = props.zoom || 1;
      camera.fov = CAMERA_CONFIG.fov / zoomFactor;
      camera.updateProjectionMatrix();
    }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      gl.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gl]);

  return (
    <>
      {/* Lighting */}
      <SphereLighting config={lightingConfig} />

      {/* Main sphere group */}
      <group ref={sphereRef}>
        {/* Sphere mesh */}
        <Sphere
          args={[
            sphereConfig.radius,
            sphereConfig.widthSegments,
            sphereConfig.heightSegments,
          ]}
          position={[0, 0, 0]}
        >
          <meshPhysicalMaterial
            color={sphereConfig.material.color}
            metalness={sphereConfig.material.metalness}
            roughness={sphereConfig.material.roughness}
            emissive={sphereConfig.material.emissive}
            emissiveIntensity={sphereConfig.material.emissiveIntensity || 0}
          />
        </Sphere>

        {/* Content items on sphere */}
        <group ref={contentRef}>
          <SphereContentRenderer
            items={props.content}
            sphereRadius={sphereConfig.radius}
            onItemSelect={props.onContentSelect}
            theme={props.theme || 'dark'}
          />
        </group>
      </group>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <group position={[-window.innerWidth / 2 + 50, window.innerHeight / 2 - 50, 0]}>
          {/* FPS display would go here */}
        </group>
      )}
    </>
  );
}

/**
 * Main component wrapper
 */
export function RotatablePortfolioSphere(props: RotatablePortfolioSphereProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const reducedMotion = props.reducedMotion ?? false;

  return (
    <div
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100vh',
        background: props.theme === 'light' ? '#f8f9fa' : '#131315',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{
          position: CAMERA_CONFIG.initialPosition.toArray(),
          fov: CAMERA_CONFIG.fov,
          near: CAMERA_CONFIG.near,
          far: CAMERA_CONFIG.far,
        }}
        gl={{ antialias: true, alpha: false }}
        style={{ display: 'block' }}
      >
        <RotatableSphereScene {...props} />
      </Canvas>

      {/* On-screen help text */}
      {!reducedMotion && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            color: props.theme === 'light' ? '#0f172a' : '#e5e1e4',
            fontSize: '12px',
            fontFamily: "'Times New Roman', serif",
            pointerEvents: 'none',
          }}
        >
          <p>Drag to rotate • Scroll to zoom • Click to select</p>
        </div>
      )}
    </div>
  );
}

export default RotatablePortfolioSphere;
