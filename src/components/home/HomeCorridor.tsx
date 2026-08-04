"use client";

// ─── HomeCorridor.tsx ─────────────────────────────────────────────────────────
// Scroll-driven first-person corridor — "The Developer's Journey"
// Canvas is hoisted to App level, always mounted, never torn down on tab switch.
// Camera travels Z-axis only, driven by scroll progress from a shared ref.

import React, { useRef, useMemo, useEffect, createContext, useContext, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "../../hooks/useScrollProgress";

// ─── Layout constants ─────────────────────────────────────────────────────────
export const BAY_DEPTH  = 16;
export const NUM_BAYS   = 7;
export const HALF_W     = 5.5;
export const HEIGHT     = 7.0;
const CORRIDOR_LEN = BAY_DEPTH * NUM_BAYS;   // 112
const START_Y  = 1.6;
const LERP     = 0.07;
const BOB_AMP  = 0.025;

// ─── Colours ──────────────────────────────────────────────────────────────────
const BLUE       = 0x2f7bff;
const BLUE_B     = 0x5ea1ff;
const WALL_COL   = 0x0b0d12;
const FLOOR_COL  = 0x070810;
const TRIM_COL   = 0x111620;

// ─── Camera context for proximity checks ─────────────────────────────────────
const CamCtx = createContext(new THREE.Vector3(0, START_Y, 4));
const useCam = () => useContext(CamCtx);

// ─── Utility: bay world Z (centre of bay i) ───────────────────────────────────
const bayZ = (i: number) => -(BAY_DEPTH * i + BAY_DEPTH / 2 + BAY_DEPTH);

// ─── Corridor shell ───────────────────────────────────────────────────────────
const Corridor = memo(() => {
  const len = CORRIDOR_LEN + 30;
  const mid = -(CORRIDOR_LEN / 2) + 6;

  const geos = useMemo(() => ({
    floor: new THREE.PlaneGeometry(HALF_W * 2, len),
    ceil:  new THREE.PlaneGeometry(HALF_W * 2, len),
    wall:  new THREE.PlaneGeometry(len, HEIGHT),
    trim:  new THREE.BoxGeometry(0.05, 0.10, len),
  }), []);

  useEffect(() => () => Object.values(geos).forEach(g => g.dispose()), [geos]);

  return (
    <group>
      <ambientLight intensity={0.7} color={0x1a2035} />
      <fog attach="fog" args={[0x050608, 6, 95]} />

      <mesh geometry={geos.floor} position={[0, 0, mid]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={FLOOR_COL} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh geometry={geos.ceil} position={[0, HEIGHT, mid]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={WALL_COL} roughness={0.9} metalness={0.05} />
      </mesh>
      {([-1, 1] as const).map((s, si) => (
        <group key={s}>
          <mesh geometry={geos.wall}
            position={[s * HALF_W, HEIGHT / 2, mid]}
            rotation={[0, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <meshStandardMaterial color={WALL_COL} roughness={0.9} metalness={0.05} />
          </mesh>
          <mesh geometry={geos.trim} position={[s * (HALF_W - 0.04), 0.05, mid]}>
            <meshStandardMaterial color={TRIM_COL} roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Thin glowing strip along the ceiling edge */}
          <mesh position={[s * (HALF_W - 0.06), HEIGHT - 0.06, mid]}>
            <boxGeometry args={[0.03, 0.03, len]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
});
Corridor.displayName = "Corridor";

// ─── Bay panel with circuit-border and spotlight ──────────────────────────────
const Bay = memo(({ index, side = -1 as -1 | 1, color = BLUE }: {
  index: number; side?: -1 | 1; color?: number;
}) => {
  const cam    = useCam();
  const grp    = useRef<THREE.Group>(null);
  const spot   = useRef<THREE.SpotLight>(null);
  const mat    = useRef<THREE.MeshStandardMaterial>(null);
  const z      = bayZ(index);
  const PW = 3.6, PH = 2.2;

  // Corner via-squares for circuit language
  const viaGeo = useMemo(() => new THREE.BoxGeometry(0.09, 0.09, 0.09), []);
  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(PW + 0.15, PH + 0.15)), []);
  useEffect(() => () => { viaGeo.dispose(); edgeGeo.dispose(); }, [viaGeo, edgeGeo]);

  useEffect(() => {
    if (!grp.current) return;
    grp.current.position.set(side * (HALF_W - 0.14), HEIGHT / 2, z);
    grp.current.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
  }, [z, side]);

  useFrame(() => {
    if (!spot.current || !mat.current) return;
    const dist = Math.abs(cam.z - z);
    const t = Math.max(0, 1 - dist / 7);
    spot.current.intensity    = t * 5;
    mat.current.emissiveIntensity = t * 0.4;
  });

  const corners: [number, number][] = [
    [-PW/2-0.075, -PH/2-0.075], [PW/2+0.075, -PH/2-0.075],
    [PW/2+0.075,  PH/2+0.075], [-PW/2-0.075, PH/2+0.075],
    [0, -PH/2-0.075], [0, PH/2+0.075],
    [-PW/2-0.075, 0], [PW/2+0.075, 0],
  ];

  return (
    <group ref={grp}>
      <mesh>
        <planeGeometry args={[PW, PH]} />
        <meshStandardMaterial ref={mat} color={0x0d1018} roughness={0.5}
          metalness={0.3} emissive={color} emissiveIntensity={0} />
      </mesh>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color={color} />
      </lineSegments>
      {corners.map(([x, y], i) => (
        <mesh key={i} geometry={viaGeo} position={[x, y, 0.01]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8}
            roughness={0.1} metalness={1} />
        </mesh>
      ))}
      <spotLight ref={spot} color={color} intensity={0} distance={9}
        angle={Math.PI / 5} penumbra={0.6} decay={1.2} position={[0, 1.8, 0.9]} />
    </group>
  );
});
Bay.displayName = "Bay";

// ─── Floating code-particle system (bays 0-1) ─────────────────────────────────
function CodeParticles({ bayIndex }: { bayIndex: number }) {
  const cam   = useCam();
  const count = 60;
  const z0    = bayZ(bayIndex);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  // Fixed random positions within this bay volume
  const positions = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * HALF_W * 1.6,
    y: Math.random() * HEIGHT,
    z: z0 + (Math.random() - 0.5) * BAY_DEPTH * 0.9,
    speed: 0.002 + Math.random() * 0.003,
    phase: Math.random() * Math.PI * 2,
  })), [z0]);

  const geo = useMemo(() => new THREE.PlaneGeometry(0.18, 0.06), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: BLUE_B, transparent: true, opacity: 0.55, side: THREE.DoubleSide,
  }), []);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const dist = Math.abs(cam.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.4));
    mat.opacity = fade * 0.55;

    positions.forEach((p, i) => {
      const t = clock.elapsedTime;
      dummy.position.set(p.x, p.y + Math.sin(t * p.speed * 30 + p.phase) * 0.2, p.z);
      dummy.rotation.y = Math.sin(t * 0.4 + p.phase) * 0.5;
      dummy.scale.setScalar(fade > 0.05 ? 1 : 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geo, mat, count]} />;
}

// ─── Floating wireframe geometry per bay ──────────────────────────────────────
type WireShape = "box" | "sphere" | "torus" | "octahedron" | "icosahedron";

function FloatingWire({ bayIndex, shape, color = BLUE, scale = 1 }: {
  bayIndex: number; shape: WireShape; color?: number; scale?: number;
}) {
  const cam = useCam();
  const meshRef = useRef<THREE.Mesh>(null);
  const z0  = bayZ(bayIndex);

  const geo = useMemo(() => {
    switch (shape) {
      case "box":         return new THREE.BoxGeometry(1.2, 1.2, 1.2);
      case "sphere":      return new THREE.SphereGeometry(0.8, 8, 6);
      case "torus":       return new THREE.TorusGeometry(0.7, 0.15, 8, 24);
      case "octahedron":  return new THREE.OctahedronGeometry(0.9);
      case "icosahedron": return new THREE.IcosahedronGeometry(0.9);
    }
  }, [shape]);

  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const mat   = useMemo(() => new THREE.LineBasicMaterial({ color }), [color]);
  useEffect(() => () => { geo.dispose(); edges.dispose(); mat.dispose(); }, [geo, edges, mat]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const dist = Math.abs(cam.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.6));
    meshRef.current.visible = fade > 0.05;
    meshRef.current.rotation.y = clock.elapsedTime * 0.25;
    meshRef.current.rotation.x = clock.elapsedTime * 0.12;
  });

  return (
    <lineSegments
      ref={meshRef}
      geometry={edges}
      material={mat}
      position={[HALF_W * 0.6, HEIGHT * 0.65, z0]}
      scale={scale}
    />
  );
}

// ─── Data-packet stream (bays 3-4: infrastructure) ────────────────────────────
function DataStream({ bayIndex }: { bayIndex: number }) {
  const cam     = useCam();
  const COUNT   = 8;
  const z0      = bayZ(bayIndex);
  const refs    = useRef<(THREE.Mesh | null)[]>([]);
  const phases  = useMemo(() => Array.from({ length: COUNT }, (_, i) => i / COUNT), []);

  const geo = useMemo(() => new THREE.SphereGeometry(0.06, 5, 4), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: BLUE_B }), []);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame(({ clock }) => {
    const dist = Math.abs(cam.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.4));
    phases.forEach((phase, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.visible = fade > 0.05;
      // Travel along ceiling edge strip
      const t  = ((clock.elapsedTime * 0.4 + phase) % 1);
      const zz = z0 - BAY_DEPTH * 0.5 + t * BAY_DEPTH;
      m.position.set(HALF_W - 0.06, HEIGHT - 0.06, zz);
      (m.material as THREE.MeshBasicMaterial).opacity = fade * (0.4 + Math.sin(t * Math.PI) * 0.6);
    });
  });

  return (
    <>
      {phases.map((_, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el; }}
          geometry={geo} material={mat.clone()} visible={false}>
          {/* material already set above */}
        </mesh>
      ))}
    </>
  );
}

// ─── Neural-net node cluster (bay 4: AI layer) ───────────────────────────────
function NeuralCluster({ bayIndex }: { bayIndex: number }) {
  const cam = useCam();
  const z0  = bayZ(bayIndex);
  const NODES = 12;

  const nodePositions = useMemo(() => Array.from({ length: NODES }, () => ({
    x: (Math.random() - 0.5) * 4,
    y: 1.5 + Math.random() * 3,
    z: z0 + (Math.random() - 0.5) * 6,
  })), [z0]);

  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NODES; i++) {
      for (let j = i + 1; j < NODES; j++) {
        if (Math.random() > 0.55) continue;
        const a = nodePositions[i], b = nodePositions[j];
        pts.push(new THREE.Vector3(a.x, a.y, a.z));
        pts.push(new THREE.Vector3(b.x, b.y, b.z));
      }
    }
    const g = new THREE.BufferGeometry();
    g.setFromPoints(pts);
    return g;
  }, [nodePositions]);

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.3 }), []);
  const nodGeo  = useMemo(() => new THREE.SphereGeometry(0.07, 6, 4), []);
  const nodMat  = useMemo(() => new THREE.MeshBasicMaterial({ color: BLUE_B }), []);
  useEffect(() => () => { lineGeo.dispose(); lineMat.dispose(); nodGeo.dispose(); nodMat.dispose(); }, [lineGeo, lineMat, nodGeo, nodMat]);

  const lineRef = useRef<THREE.LineSegments>(null);
  const grpRef  = useRef<THREE.Group>(null);

  useFrame(() => {
    const dist = Math.abs(cam.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.5));
    if (lineRef.current) { lineMat.opacity = fade * 0.3; }
    if (grpRef.current)  { grpRef.current.visible = fade > 0.05; }
  });

  return (
    <group ref={grpRef} visible={false}>
      <lineSegments ref={lineRef} geometry={lineGeo} material={lineMat} />
      {nodePositions.map((p, i) => (
        <mesh key={i} geometry={nodGeo} material={nodMat} position={[p.x, p.y, p.z]} />
      ))}
    </group>
  );
}

// ─── Expanding wireframe sphere (bay 6: infinite horizon / CTA) ──────────────
function ExpandingSphere({ bayIndex }: { bayIndex: number }) {
  const cam = useCam();
  const z0  = bayZ(bayIndex);
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(2.5, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: BLUE_B, transparent: true, opacity: 0 }), []);
  useEffect(() => () => { geo.dispose(); edges.dispose(); mat.dispose(); }, [geo, edges, mat]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const dist = Math.abs(cam.z - z0);
    const fade = Math.max(0, 1 - dist / (BAY_DEPTH * 1.4));
    mat.opacity = fade * 0.45;
    ref.current.rotation.y = clock.elapsedTime * 0.08;
    ref.current.rotation.x = clock.elapsedTime * 0.05;
    const pulse = 1 + Math.sin(clock.elapsedTime * 0.6) * 0.04;
    ref.current.scale.setScalar(pulse);
  });

  return <lineSegments ref={ref} geometry={edges} material={mat} position={[1.5, HEIGHT * 0.6, z0]} />;
}

// ─── Scene inner: camera + all objects ───────────────────────────────────────
function SceneInner({ reducedMotion, visible }: { reducedMotion: boolean; visible: boolean }) {
  const { camera } = useThree();
  const camVec  = useRef(new THREE.Vector3(0, START_Y, 4));
  const bobRef  = useRef(0);
  const targetZ = useRef(4);

  useEffect(() => {
    camera.position.set(0, START_Y, 4);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 60; camera.near = 0.1; camera.far = 110;
    }
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    if (!visible) return;
    const prog = getScrollProgress();
    targetZ.current = 4 - prog * (CORRIDOR_LEN - 8);

    if (reducedMotion) {
      camera.position.z = targetZ.current;
      camera.position.y = START_Y;
    } else {
      camera.position.z += (targetZ.current - camera.position.z) * LERP;
      bobRef.current += 0.01;
      camera.position.y = START_Y + Math.sin(bobRef.current) * BOB_AMP;
    }
    camVec.current.copy(camera.position);
  });

  const bayColors = [BLUE, BLUE_B, BLUE, BLUE_B, BLUE, BLUE_B, BLUE];

  return (
    <CamCtx.Provider value={camVec.current}>
      <Corridor />

      {/* 7 wall panels with circuit borders */}
      {Array.from({ length: NUM_BAYS }, (_, i) => (
        <Bay key={i} index={i} side={i % 2 === 0 ? -1 : 1} color={bayColors[i]} />
      ))}

      {/* Bay 0-1: code particles — the origin */}
      <CodeParticles bayIndex={0} />
      <CodeParticles bayIndex={1} />

      {/* Bay 1: keyboard-shaped geometry */}
      <FloatingWire bayIndex={1} shape="box" color={BLUE} scale={0.9} />

      {/* Bay 2: tech stack — floating wireframe objects */}
      <FloatingWire bayIndex={2} shape="octahedron" color={BLUE_B} scale={1.1} />
      <FloatingWire bayIndex={2} shape="sphere"     color={BLUE}   scale={0.8} />

      {/* Bay 3-4: infrastructure — data packets along ceiling edge */}
      <DataStream bayIndex={3} />
      <DataStream bayIndex={4} />
      <FloatingWire bayIndex={3} shape="icosahedron" color={BLUE} scale={1.0} />

      {/* Bay 4: AI layer — neural net cluster */}
      <NeuralCluster bayIndex={4} />
      <FloatingWire bayIndex={4} shape="torus" color={BLUE_B} scale={1.2} />

      {/* Bay 5: founders / studio */}
      <FloatingWire bayIndex={5} shape="icosahedron" color={BLUE} scale={1.3} />
      <DataStream bayIndex={5} />

      {/* Bay 6: CTA — expanding sphere */}
      <ExpandingSphere bayIndex={6} />
      <CodeParticles bayIndex={6} />
    </CamCtx.Provider>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export interface HomeCorridorProps {
  reducedMotion?: boolean;
  visible?: boolean;      // controlled by App — false on non-home tabs
}

export const HomeCorridor: React.FC<HomeCorridorProps> = ({
  reducedMotion = false,
  visible = true,
}) => (
  <div
    style={{
      position:      "fixed",
      top: 0, left: 0,
      width:         "100vw",
      height:        "100vh",
      zIndex:        1,
      pointerEvents: "none",
      // Hide entirely on non-home tabs to save GPU but keep the Canvas mounted
      opacity:       visible ? 1 : 0,
      transition:    "opacity 0.4s ease",
    }}
  >
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, START_Y, 4], fov: 60, near: 0.1, far: 110 }}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneInner reducedMotion={reducedMotion} visible={visible} />
    </Canvas>
  </div>
);

export default HomeCorridor;
