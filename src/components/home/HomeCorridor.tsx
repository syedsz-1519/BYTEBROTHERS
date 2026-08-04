"use client";

import React, { useRef, useMemo, useEffect, createContext, useContext, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "../../hooks/useScrollProgress";

// ─── Layout ───────────────────────────────────────────────────────────────────
export const BAY_DEPTH = 14;
export const NUM_BAYS  = 7;
export const HALF_W    = 5.0;
export const HEIGHT    = 6.5;
const CORRIDOR_LEN = BAY_DEPTH * NUM_BAYS; // 98
const START_Z  = 5;
const START_Y  = 1.6;
const LERP     = 0.08;
const BOB_AMP  = 0.022;

// Camera starts at z=5, ends at z = 5 - (98-8) = -85
// Bay i centre: START_Z - BAY_DEPTH*(i+1) + BAY_DEPTH/2
//   Bay 0: 5 - 14 + 7 = -2   ← just 7 units ahead of camera start ✓
//   Bay 1: 5 - 28 + 7 = -16
//   Bay 6: 5 - 98 + 7 = -86
const bayZ = (i: number) => START_Z - BAY_DEPTH * (i + 1) + BAY_DEPTH / 2;

// ─── White corridor palette ───────────────────────────────────────────────────
const WALL_WHITE  = 0xf8fafc;  // white walls / floor / ceiling
const TRIM_COL    = 0xe2e8f0;  // light grey trim
const DARK_GEO    = 0x0d1117;  // near-black for 3D objects (visible on white)
const BLUE        = 0x2f7bff;
const BLUE_B      = 0x5ea1ff;
const BLUE_DARK   = 0x1a4fa8;  // darker blue for contrast on white

// ─── Camera position context ─────────────────────────────────────────────────
// We store the mutable vec3 in a ref and pass the ref so identity is stable
type CamRef = React.MutableRefObject<THREE.Vector3>;
const CamCtx = createContext<CamRef>({ current: new THREE.Vector3(0, START_Y, START_Z) });
const useCam = () => useContext(CamCtx);

// ─── Corridor shell ───────────────────────────────────────────────────────────
const Corridor = memo(() => {
  const len = CORRIDOR_LEN + 30;
  // Centre geometry so it spans from z=+8 to z=-(CORRIDOR_LEN+22)
  const mid = -(CORRIDOR_LEN / 2) + 8;

  const geos = useMemo(() => ({
    floor:  new THREE.PlaneGeometry(HALF_W * 2, len),
    ceil:   new THREE.PlaneGeometry(HALF_W * 2, len),
    wall:   new THREE.PlaneGeometry(len, HEIGHT),
    trim:   new THREE.BoxGeometry(0.06, 0.08, len),
  }), []);

  useEffect(() => () => Object.values(geos).forEach(g => g.dispose()), [geos]);

  return (
    <group>
      {/* Strong white ambient — corridor reads as a bright space */}
      <ambientLight intensity={2.2} color={0xffffff} />
      {/* Soft directional from above to add depth to geometry */}
      <directionalLight position={[0, 8, 2]} intensity={1.0} color={0xffffff} />
      {/* Blue accent fill from front */}
      <pointLight position={[0, 3, START_Z - 2]} intensity={3} color={BLUE} distance={20} decay={2} />

      {/* Linear fog in white — distant bays fade to white, not black */}
      <fog attach="fog" args={[0xf8fafc, 10, 85]} />

      {/* Floor */}
      <mesh geometry={geos.floor} position={[0, 0, mid]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={WALL_WHITE} roughness={0.3} metalness={0} />
      </mesh>
      {/* Ceiling */}
      <mesh geometry={geos.ceil} position={[0, HEIGHT, mid]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={WALL_WHITE} roughness={0.4} metalness={0} />
      </mesh>
      {/* Side walls + trims + blue accent strips */}
      {([-1, 1] as const).map((s) => (
        <group key={s}>
          <mesh geometry={geos.wall}
            position={[s * HALF_W, HEIGHT / 2, mid]}
            rotation={[0, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <meshStandardMaterial color={WALL_WHITE} roughness={0.4} metalness={0} />
          </mesh>
          {/* Skirting trim */}
          <mesh geometry={geos.trim} position={[s * (HALF_W - 0.04), 0.04, mid]}>
            <meshStandardMaterial color={TRIM_COL} roughness={0.5} metalness={0.1} />
          </mesh>
          {/* Blue glowing strip at ceiling edge */}
          <mesh position={[s * (HALF_W - 0.05), HEIGHT - 0.04, mid]}>
            <boxGeometry args={[0.04, 0.04, len]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1.2} />
          </mesh>
          {/* Thin floor line */}
          <mesh position={[s * (HALF_W - 0.05), 0.01, mid]}>
            <boxGeometry args={[0.02, 0.02, len]} />
            <meshStandardMaterial color={BLUE_DARK} emissive={BLUE_DARK} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
});
Corridor.displayName = "Corridor";

// ─── Bay panel on wall ────────────────────────────────────────────────────────
const Bay = memo(({ index, side = -1 as -1 | 1 }: { index: number; side?: -1 | 1 }) => {
  const camRef = useCam();
  const grp    = useRef<THREE.Group>(null);
  const spot   = useRef<THREE.SpotLight>(null);
  const mat    = useRef<THREE.MeshStandardMaterial>(null);
  const z      = bayZ(index);
  const PW = 3.8, PH = 2.4;

  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(PW + 0.2, PH + 0.2)), []);
  const viaGeo  = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.1), []);
  useEffect(() => () => { edgeGeo.dispose(); viaGeo.dispose(); }, [edgeGeo, viaGeo]);

  useEffect(() => {
    if (!grp.current) return;
    grp.current.position.set(side * (HALF_W - 0.12), HEIGHT / 2, z);
    grp.current.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
  }, [z, side]);

  useFrame(() => {
    if (!spot.current || !mat.current) return;
    const dist = Math.abs(camRef.current.z - z);
    const t    = Math.max(0, 1 - dist / 8);
    spot.current.intensity      = t * 4;
    mat.current.emissiveIntensity = t * 0.15;
  });

  const vias: [number, number][] = [
    [-PW/2-0.1, -PH/2-0.1], [PW/2+0.1, -PH/2-0.1],
    [PW/2+0.1,   PH/2+0.1], [-PW/2-0.1, PH/2+0.1],
    [0, -PH/2-0.1], [0, PH/2+0.1],
  ];

  return (
    <group ref={grp}>
      {/* Panel — light surface on white wall */}
      <mesh>
        <planeGeometry args={[PW, PH]} />
        <meshStandardMaterial ref={mat} color={0xf0f4f8} roughness={0.3}
          metalness={0} emissive={BLUE} emissiveIntensity={0} />
      </mesh>
      {/* Dark circuit border */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={DARK_GEO} />
      </lineSegments>
      {/* Blue via squares */}
      {vias.map(([x, y], i) => (
        <mesh key={i} geometry={viaGeo} position={[x, y, 0.02]}>
          <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={2}
            roughness={0.1} metalness={1} />
        </mesh>
      ))}
      <spotLight ref={spot} color={BLUE} intensity={0} distance={10}
        angle={Math.PI / 5} penumbra={0.7} decay={1.5} position={[0, 2, 1]} />
    </group>
  );
});
Bay.displayName = "Bay";

// ─── Dark wireframe geometry (visible on white walls) ─────────────────────────
type Shape = "box"|"sphere"|"torus"|"octahedron"|"icosahedron"|"torusKnot";
function FloatingWire({ bayIndex, shape, offsetX = 0, offsetY = 0, scale = 1, spin = 0.3 }: {
  bayIndex: number; shape: Shape; offsetX?: number; offsetY?: number;
  scale?: number; spin?: number;
}) {
  const camRef = useCam();
  const ref    = useRef<THREE.LineSegments>(null);
  const z0     = bayZ(bayIndex);

  const base = useMemo(() => {
    switch (shape) {
      case "box":        return new THREE.BoxGeometry(1, 1, 1);
      case "sphere":     return new THREE.SphereGeometry(0.7, 10, 7);
      case "torus":      return new THREE.TorusGeometry(0.6, 0.14, 10, 28);
      case "octahedron": return new THREE.OctahedronGeometry(0.8);
      case "icosahedron":return new THREE.IcosahedronGeometry(0.8, 1);
      case "torusKnot":  return new THREE.TorusKnotGeometry(0.5, 0.14, 60, 8);
    }
  }, [shape]);

  const edges = useMemo(() => new THREE.EdgesGeometry(base), [base]);
  const mat   = useMemo(() => new THREE.LineBasicMaterial({
    color: DARK_GEO, transparent: true, opacity: 0,
  }), []);
  useEffect(() => () => { base.dispose(); edges.dispose(); mat.dispose(); }, [base, edges, mat]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const dist = Math.abs(camRef.current.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.5));
    mat.opacity = fade * 0.7;
    ref.current.visible = fade > 0.02;
    ref.current.rotation.y = clock.elapsedTime * spin * 0.8;
    ref.current.rotation.x = clock.elapsedTime * spin * 0.45;
  });

  return (
    <lineSegments ref={ref} geometry={edges} material={mat}
      position={[HALF_W * 0.55 + offsetX, HEIGHT * 0.6 + offsetY, z0]}
      scale={scale} />
  );
}

// ─── Code particle field ──────────────────────────────────────────────────────
function CodeParticles({ bayIndex }: { bayIndex: number }) {
  const camRef = useCam();
  const COUNT  = 50;
  const z0     = bayZ(bayIndex);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  const pts = useMemo(() => Array.from({ length: COUNT }, () => ({
    x: (Math.random() - 0.5) * HALF_W * 1.4,
    y: 0.4 + Math.random() * (HEIGHT - 0.8),
    z: z0 + (Math.random() - 0.5) * BAY_DEPTH * 0.85,
    ph: Math.random() * Math.PI * 2,
    sp: 0.4 + Math.random() * 0.6,
  })), [z0]);

  const geo = useMemo(() => new THREE.PlaneGeometry(0.22, 0.07), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: BLUE, transparent: true, opacity: 0, side: THREE.DoubleSide,
  }), []);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const dist = Math.abs(camRef.current.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.5));
    mat.opacity = fade * 0.6;
    pts.forEach((p, i) => {
      const t = clock.elapsedTime;
      dummy.position.set(p.x, p.y + Math.sin(t * p.sp + p.ph) * 0.15, p.z);
      dummy.rotation.z = Math.sin(t * 0.3 + p.ph) * 0.3;
      dummy.scale.setScalar(fade > 0.02 ? 1 : 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, COUNT]} />;
}

// ─── Neural net (bay 4 — AI layer) ───────────────────────────────────────────
function NeuralNet({ bayIndex }: { bayIndex: number }) {
  const camRef = useCam();
  const z0     = bayZ(bayIndex);
  const N      = 10;

  const nPos = useMemo(() => Array.from({ length: N }, () => ({
    x: (Math.random() - 0.5) * 3.5,
    y: 0.8 + Math.random() * 4.5,
    z: z0 + (Math.random() - 0.5) * 5,
  })), [z0]);

  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (Math.random() > 0.5) continue;
        pts.push(new THREE.Vector3(nPos[i].x, nPos[i].y, nPos[i].z));
        pts.push(new THREE.Vector3(nPos[j].x, nPos[j].y, nPos[j].z));
      }
    }
    const g = new THREE.BufferGeometry(); g.setFromPoints(pts); return g;
  }, [nPos]);

  const lMat   = useMemo(() => new THREE.LineBasicMaterial({ color: BLUE_DARK, transparent: true, opacity: 0 }), []);
  const nGeo   = useMemo(() => new THREE.SphereGeometry(0.08, 6, 4), []);
  const nMat   = useMemo(() => new THREE.MeshBasicMaterial({ color: DARK_GEO }), []);
  const grpRef = useRef<THREE.Group>(null);
  const lRef   = useRef<THREE.LineSegments>(null);
  useEffect(() => () => { lineGeo.dispose(); lMat.dispose(); nGeo.dispose(); nMat.dispose(); }, [lineGeo, lMat, nGeo, nMat]);

  useFrame(() => {
    const dist = Math.abs(camRef.current.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.5));
    lMat.opacity = fade * 0.5;
    if (grpRef.current) grpRef.current.visible = fade > 0.02;
  });

  return (
    <group ref={grpRef} visible={false}>
      <lineSegments ref={lRef} geometry={lineGeo} material={lMat} />
      {nPos.map((p, i) => (
        <mesh key={i} geometry={nGeo} material={nMat} position={[p.x, p.y, p.z]} />
      ))}
    </group>
  );
}

// ─── Scene inner ─────────────────────────────────────────────────────────────
function SceneInner({ reducedMotion, visible }: { reducedMotion: boolean; visible: boolean }) {
  const { camera } = useThree();
  const camRef  = useRef(new THREE.Vector3(0, START_Y, START_Z));
  const bob     = useRef(0);
  const targetZ = useRef(START_Z);

  useEffect(() => {
    camera.position.set(0, START_Y, START_Z);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 58; camera.near = 0.1; camera.far = 100;
    }
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    if (!visible) return;
    const prog   = getScrollProgress();
    targetZ.current = START_Z - prog * (CORRIDOR_LEN - 8);

    if (reducedMotion) {
      camera.position.z = targetZ.current;
      camera.position.y = START_Y;
    } else {
      camera.position.z += (targetZ.current - camera.position.z) * LERP;
      bob.current += 0.009;
      camera.position.y = START_Y + Math.sin(bob.current) * BOB_AMP;
    }
    camRef.current.copy(camera.position);
  });

  return (
    <CamCtx.Provider value={camRef}>
      <Corridor />
      {Array.from({ length: NUM_BAYS }, (_, i) => (
        <Bay key={i} index={i} side={i % 2 === 0 ? -1 : 1} />
      ))}

      {/* Bay 0 — Origin: code particles float ahead of camera */}
      <CodeParticles bayIndex={0} />

      {/* Bay 1 — First project: terminal box */}
      <FloatingWire bayIndex={1} shape="box"         scale={1.1} spin={0.25} />
      <CodeParticles bayIndex={1} />

      {/* Bay 2 — Tech stack: octahedron = DB, sphere = API */}
      <FloatingWire bayIndex={2} shape="octahedron"  scale={1.2} offsetY={0.3} spin={0.3} />
      <FloatingWire bayIndex={2} shape="sphere"      scale={0.8} offsetX={-2.5} spin={0.2} />

      {/* Bay 3 — Client work: icosahedron rotating */}
      <FloatingWire bayIndex={3} shape="icosahedron" scale={1.3} spin={0.2} />

      {/* Bay 4 — AI layer: neural net + torus knot */}
      <NeuralNet   bayIndex={4} />
      <FloatingWire bayIndex={4} shape="torusKnot"   scale={1.0} offsetX={1.5} spin={0.4} />

      {/* Bay 5 — Founders: dual geometry */}
      <FloatingWire bayIndex={5} shape="torus"       scale={1.3} spin={0.18} />
      <FloatingWire bayIndex={5} shape="icosahedron" scale={0.9} offsetX={-2.0} spin={0.25} />

      {/* Bay 6 — CTA: pulsing icosahedron */}
      <FloatingWire bayIndex={6} shape="icosahedron" scale={1.8} spin={0.12} />
      <CodeParticles bayIndex={6} />
    </CamCtx.Provider>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export interface HomeCorridorProps { reducedMotion?: boolean; visible?: boolean; }

export const HomeCorridor: React.FC<HomeCorridorProps> = ({
  reducedMotion = false, visible = true,
}) => (
  <div style={{
    position: "fixed", top: 0, left: 0,
    width: "100vw", height: "100vh",
    zIndex: 1, pointerEvents: "none",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.5s ease",
  }}>
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, START_Y, START_Z], fov: 58, near: 0.1, far: 100 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneInner reducedMotion={reducedMotion} visible={visible} />
    </Canvas>
  </div>
);

export default HomeCorridor;
