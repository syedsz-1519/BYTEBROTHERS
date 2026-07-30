import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Eye, EyeOff, Zap } from 'lucide-react';

export const Background3dCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    if (!isEnabled || !mountRef.current) return;

    const container = mountRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let mainMesh: THREE.Mesh;
    let outerMesh: THREE.Mesh;
    let particleSystem: THREE.Points;
    let reqId: number;

    // Smoothed state for ultra-smooth 60fps interpolation
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let frameCount = 0;
    let lastFpsTime = performance.now();

    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 7.5;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // 1. Core Glowing Wireframe TorusKnot
      const knotGeom = new THREE.TorusKnotGeometry(1.4, 0.42, 140, 18);
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7, // Bright cyan-blue
        wireframe: true,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x0369a1,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.85,
      });
      mainMesh = new THREE.Mesh(knotGeom, knotMat);
      scene.add(mainMesh);

      // 2. Outer Wireframe Geodesic/Icosahedron Cage
      const cageGeom = new THREE.IcosahedronGeometry(2.8, 1);
      const cageMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4, // Cyan wireframe
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      outerMesh = new THREE.Mesh(cageGeom, cageMat);
      scene.add(outerMesh);

      // 3. Floating Space Stars / Particles
      const particleCount = 450;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

        colors[i * 3] = 0.1 + Math.random() * 0.3; // R
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // G (Cyan accent)
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1; // B
      }

      const particleGeom = new THREE.BufferGeometry();
      particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });

      particleSystem = new THREE.Points(particleGeom, particleMat);
      scene.add(particleSystem);

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x38bdf8, 3.5, 25);
      pointLight1.position.set(6, 6, 6);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x6366f1, 2.5, 25);
      pointLight2.position.set(-6, -6, -2);
      scene.add(pointLight2);

      // Event Listeners (Passive for high performance)
      const handleMouseMove = (e: MouseEvent) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };

      const handleScroll = () => {
        targetScroll = window.scrollY;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Pause render loop when tab is hidden to save battery & GPU
      let isTabActive = true;
      const handleVisibilityChange = () => {
        isTabActive = !document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const clock = new THREE.Clock();

      // Main Render Loop
      const animate = () => {
        reqId = requestAnimationFrame(animate);

        if (!isTabActive) return;

        // FPS counter calculation
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
          frameCount = 0;
          lastFpsTime = now;
        }

        const elapsedTime = clock.getElapsedTime();

        // Smooth Lerp target values
        currentScroll += (targetScroll - currentScroll) * 0.05;
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        const scrollRatio = currentScroll / 1000;

        // Continuous & Scroll-Driven Transformations
        if (mainMesh) {
          mainMesh.rotation.x = elapsedTime * 0.25 + scrollRatio * 1.2;
          mainMesh.rotation.y = elapsedTime * 0.35 + scrollRatio * 1.8;
        }

        if (outerMesh) {
          outerMesh.rotation.x = -elapsedTime * 0.15 - scrollRatio * 0.6;
          outerMesh.rotation.y = elapsedTime * 0.2 - scrollRatio * 0.9;
        }

        if (particleSystem) {
          particleSystem.rotation.y = elapsedTime * 0.04 + scrollRatio * 0.3;
        }

        // Camera Depth & Parallax Response
        camera.position.z = 7.5 - Math.sin(scrollRatio * 0.8) * 1.8;
        camera.position.x = currentMouseX * 0.6;
        camera.position.y = -currentMouseY * 0.6 - scrollRatio * 0.5;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(reqId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (renderer && renderer.domElement) {
          renderer.domElement.remove();
        }
      };
    } catch (err) {
      console.warn('3D Background Context init error:', err);
    }
  }, [isEnabled]);

  return (
    <>
      {/* Fixed Fullscreen 3D Background Canvas Layer */}
      {isEnabled && (
        <div
          ref={mountRef}
          className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-60 transition-opacity duration-1000 overflow-hidden"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating 3D Background Control HUD (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          title={isEnabled ? 'Disable 3D Background' : 'Enable 3D Background'}
          className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-cyan-300 border border-blue-500/30 text-[11px] font-mono flex items-center gap-2 shadow-xl transition-all"
        >
          {isEnabled ? (
            <>
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">3D BG: ON</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-[9px] text-blue-300">
                {fps} FPS
              </span>
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
              <span>3D BG: OFF</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
