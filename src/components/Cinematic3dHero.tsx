import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Layers, ArrowUpRight, Zap } from 'lucide-react';

export const Cinematic3dHero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [renderMode, setRenderMode] = useState<'3d' | 'fallback'>('3d');

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. THREE.JS Scene Setup
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let mainMesh: THREE.Mesh;
    let outerMesh: THREE.Mesh;
    let particleSystem: THREE.Points;
    let reqId: number;

    try {
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.z = 7;

      // Renderer
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // 2. Geometry & Materials
      // Inner Complex Geometry: TorusKnot
      const innerGeom = new THREE.TorusKnotGeometry(1.2, 0.35, 120, 16);
      const innerMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.3,
      });
      mainMesh = new THREE.Mesh(innerGeom, innerMat);
      scene.add(mainMesh);

      // Outer Icosahedron Ring
      const outerGeom = new THREE.IcosahedronGeometry(2.4, 1);
      const outerMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      outerMesh = new THREE.Mesh(outerGeom, outerMat);
      scene.add(outerMesh);

      // 3. Particles Constellation
      const particleCount = 400;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

        colors[i * 3] = 0.2 + Math.random() * 0.4;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }

      const particleGeom = new THREE.BufferGeometry();
      particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      });

      particleSystem = new THREE.Points(particleGeom, particleMat);
      scene.add(particleSystem);

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x38bdf8, 3, 20);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x818cf8, 2, 20);
      pointLight2.position.set(-5, -5, -2);
      scene.add(pointLight2);

      // Mouse interactive position
      let targetMouseX = 0;
      let targetMouseY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / container.clientWidth - 0.5;
        const y = (e.clientY - rect.top) / container.clientHeight - 0.5;
        targetMouseX = x * 2;
        targetMouseY = y * 2;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Scroll listener to update camera and rotation
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
        const progress = Math.min(1, Math.max(0, scrollY / 1200));
        setScrollProgress(progress);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        reqId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        const currentScroll = window.scrollY / 1000;

        // Rotation & Motion
        if (mainMesh) {
          mainMesh.rotation.x = elapsedTime * 0.35 + currentScroll * 1.5;
          mainMesh.rotation.y = elapsedTime * 0.45 + currentScroll * 2.0;
        }

        if (outerMesh) {
          outerMesh.rotation.x = -elapsedTime * 0.2 - currentScroll * 0.8;
          outerMesh.rotation.y = elapsedTime * 0.25 - currentScroll * 1.2;
        }

        if (particleSystem) {
          particleSystem.rotation.y = elapsedTime * 0.05 + currentScroll * 0.5;
        }

        // Camera Depth Reactivity
        camera.position.z = 7 - currentScroll * 2.5;
        camera.position.y = -currentScroll * 1.2 + targetMouseY * 0.3;
        camera.position.x = targetMouseX * 0.5;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      // Resize handler
      const handleResize = () => {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(reqId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement) {
          renderer.domElement.remove();
        }
      };
    } catch (err) {
      console.warn('WebGL Context init fallback:', err);
      setRenderMode('fallback');
    }
  }, []);

  return (
    <div className="relative w-full rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#090d16] via-[#0d1322] to-[#080a10] overflow-hidden shadow-2xl my-6">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="h-[380px] sm:h-[480px] w-full relative cursor-grab active:cursor-grabbing"
      >
        {renderMode === 'fallback' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-blue-950/20">
            <Layers className="h-12 w-12 text-blue-400 animate-bounce mb-3" />
            <div className="font-display font-bold text-xl text-white">Interactive 3D Stage</div>
            <p className="text-xs text-zinc-400 max-w-sm mt-1">
              WebGL fallback rendering active. Move your cursor and scroll to explore 3D spatial transformation layers.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Info Banner */}
      <div className="p-6 bg-black/50 backdrop-blur-md border-t border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-display font-bold text-lg text-white flex items-center gap-2">
            <span>White Brothers 3D Web Engine</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-400/30">
              Interactive WebGL
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Scroll down the page to control the camera trajectory, lighting shifts, and spatial wireframe transformations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-cyan-400">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span>60 FPS Hardware Accelerated</span>
        </div>
      </div>
    </div>
  );
};
