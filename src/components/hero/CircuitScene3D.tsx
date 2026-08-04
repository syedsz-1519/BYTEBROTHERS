"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";

// ─── Device capability ────────────────────────────────────────────────────────
function isLowEnd(): boolean {
  if (typeof window === "undefined") return false;
  if ((navigator.hardwareConcurrency ?? 4) <= 2) return true;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") as WebGLRenderingContext | null;
    if (!gl) return true;
    if (gl.getParameter(gl.MAX_TEXTURE_SIZE) < 4096) return true;
  } catch { return true; }
  return false;
}

// ─── Colours ──────────────────────────────────────────────────────────────────
const CYAN        = new THREE.Color(0x00e5ff);
const VIOLET      = new THREE.Color(0x8b5cf6);
const TRACE_BASE  = new THREE.Color(0x002233);
const FOG_COLOR   = new THREE.Color(0x0a0a0d);

// ─── Layout ───────────────────────────────────────────────────────────────────
// World space:  x ∈ [-8, 8],  y ∈ [-4.2, 4.2],  z ∈ [-1.2, 0.8]
// Camera sits at z=11, fov=55 → at z=0 the frustum is ~±7.5 wide, ~±4.2 tall
//
// TEXT ZONE (approximate, in world units):
//   x ∈ [-8, 1],  y ∈ [-1.6, 2.4]
// Nodes whose (x,y) fall inside this box are flagged dim (brightness ≤ 0.14)
// and pushed to z=-1.0 so they sit clearly behind the text plane.
//
// [x, y, z, brightness]
type P4 = [number, number, number, number];

// Helper: is a point inside the text zone?
function inTextZone(x: number, y: number) {
  return x < 1.0 && x > -8.0 && y < 2.4 && y > -1.6;
}

// Points: 5 horizontal rails × 8 columns + extra corner fills
const RAW_PTS: P4[] = [
  // ── ROW y=3.8  (top edge) ───────────────────────────────────────────────────
  [-7.8,  3.8, -0.8, 0.65],  //  0
  [-5.5,  3.8,  0.4, 0.70],  //  1
  [-3.2,  3.8, -0.2, 0.60],  //  2
  [-1.0,  3.8,  0.5, 0.55],  //  3
  [ 1.2,  3.8, -0.4, 0.60],  //  4
  [ 3.4,  3.8,  0.3, 0.80],  //  5  terminal
  [ 5.6,  3.8, -0.6, 0.75],  //  6
  [ 7.8,  3.8,  0.2, 0.90],  //  7  terminal

  // ── ROW y=2.0  (upper mid) ──────────────────────────────────────────────────
  [-7.8,  2.0, -0.3, 0.65],  //  8
  [-5.5,  2.0,  0.6, 0.60],  //  9
  [-3.2,  2.0, -0.5, 0.55],  // 10
  [-1.0,  2.0,  0.2, 0.14],  // 11  ← text zone, dim
  [ 1.2,  2.0, -0.3, 0.55],  // 12
  [ 3.4,  2.0,  0.5, 0.85],  // 13  terminal
  [ 5.6,  2.0,  0.0, 0.70],  // 14
  [ 7.8,  2.0, -0.4, 0.88],  // 15  terminal

  // ── ROW y=0.2  (centre, behind headline) ────────────────────────────────────
  [-7.8,  0.2,  0.4, 0.70],  // 16  terminal
  [-5.5,  0.2, -0.4, 0.55],  // 17
  [-3.2,  0.2,  0.2, 0.14],  // 18  ← text zone, dim
  [-1.0,  0.2, -0.3, 0.12],  // 19  ← text zone, very dim
  [ 1.2,  0.2,  0.5, 0.45],  // 20
  [ 3.4,  0.2, -0.5, 0.85],  // 21  terminal
  [ 5.6,  0.2,  0.3, 0.78],  // 22
  [ 7.8,  0.2, -0.2, 0.92],  // 23  terminal

  // ── ROW y=-1.6  (lower mid) ─────────────────────────────────────────────────
  [-7.8, -1.6, -0.2, 0.65],  // 24
  [-5.5, -1.6,  0.5, 0.60],  // 25
  [-3.2, -1.6, -0.3, 0.55],  // 26
  [-1.0, -1.6,  0.4, 0.14],  // 27  ← text zone, dim
  [ 1.2, -1.6, -0.4, 0.55],  // 28
  [ 3.4, -1.6,  0.6, 0.82],  // 29
  [ 5.6, -1.6, -0.1, 0.72],  // 30
  [ 7.8, -1.6,  0.3, 0.88],  // 31  terminal

  // ── ROW y=-3.6  (bottom edge) ───────────────────────────────────────────────
  [-7.8, -3.6,  0.3, 0.72],  // 32  terminal
  [-5.5, -3.6, -0.5, 0.65],  // 33
  [-3.2, -3.6,  0.4, 0.60],  // 34
  [-1.0, -3.6, -0.2, 0.55],  // 35
  [ 1.2, -3.6,  0.5, 0.58],  // 36
  [ 3.4, -3.6, -0.3, 0.80],  // 37  terminal
  [ 5.6, -3.6,  0.2, 0.75],  // 38
  [ 7.8, -3.6, -0.4, 0.90],  // 39  terminal
];

// Push text-zone points deeper in Z so fog dims them naturally
const PTS: P4[] = RAW_PTS.map(([x, y, z, br]) =>
  inTextZone(x, y) ? [x, y, -1.0, Math.min(br, 0.14)] : [x, y, z, br]
);

// Terminal indices
const TERMINALS = new Set([5, 7, 13, 15, 16, 21, 23, 29, 31, 32, 37, 39]);

// ─── Orthogonal trace chains ──────────────────────────────────────────────────
const TRACES: number[][] = [
  // 5 horizontal rails — full width, corner to corner
  [0, 1, 2, 3, 4, 5, 6, 7],       // top
  [8, 9, 10, 11, 12, 13, 14, 15], // upper-mid
  [16, 17, 18, 19, 20, 21, 22, 23],// centre
  [24, 25, 26, 27, 28, 29, 30, 31],// lower-mid
  [32, 33, 34, 35, 36, 37, 38, 39],// bottom

  // 8 vertical connectors — one per column
  [0, 8, 16, 24, 32],   // col -7.8
  [1, 9, 17, 25, 33],   // col -5.5
  [2, 10, 18, 26, 34],  // col -3.2  (partial text zone)
  [3, 11, 19, 27, 35],  // col -1.0  (text zone — dim)
  [4, 12, 20, 28, 36],  // col  1.2
  [5, 13, 21, 29, 37],  // col  3.4  (bright)
  [6, 14, 22, 30, 38],  // col  5.6
  [7, 15, 23, 31, 39],  // col  7.8  (bright right edge)

  // Cross-links in the right/bright zone for density
  [13, 14],   // upper accent
  [21, 22],   // centre accent
  [29, 30],   // lower accent
  [5, 6],     // top accent
  [22, 23],   // right cluster
  [14, 15],
];

// Traces that carry animated pulses (right-half + full horizontal rails)
const PULSE_CHAINS = [0, 2, 4, 10, 11, 12, 13, 14, 15];

// ─── Geometry helpers ─────────────────────────────────────────────────────────
function buildTube(chain: number[]): THREE.TubeGeometry {
  const v3s: THREE.Vector3[] = [];
  for (let i = 0; i < chain.length; i++) {
    const [x, y, z] = PTS[chain[i]];
    v3s.push(new THREE.Vector3(x, y, z));
    if (i < chain.length - 1) {
      const [nx, ny, nz] = PTS[chain[i + 1]];
      v3s.push(new THREE.Vector3((x + nx) / 2, (y + ny) / 2, (z + nz) / 2));
    }
  }
  const curve = new THREE.CatmullRomCurve3(v3s, false, "catmullrom", 0.04);
  return new THREE.TubeGeometry(curve, v3s.length * 4, 0.020, 4, false);
}

// ─── Trace mesh ───────────────────────────────────────────────────────────────
function TraceMesh({ chain, lowEnd }: { chain: number[]; lowEnd: boolean }) {
  const geo = useMemo(() => buildTube(chain), [chain]);
  const avgBr = useMemo(
    () => chain.reduce((s, i) => s + PTS[i][3], 0) / chain.length,
    [chain]
  );
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:             TRACE_BASE,
    emissive:          CYAN,
    emissiveIntensity: lowEnd ? avgBr * 1.5 : avgBr * 0.6,
    roughness:         0.5,
    metalness:         0.8,
    clearcoat:         lowEnd ? 0 : 0.3,
    transparent:       true,
    opacity:           0.92,
  }), [avgBr, lowEnd]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <mesh geometry={geo} material={mat} />;
}

// ─── Via square ───────────────────────────────────────────────────────────────
function ViaMesh({ idx, lowEnd }: { idx: number; lowEnd: boolean }) {
  const [x, y, z, br] = PTS[idx];
  const geo = useMemo(() => new THREE.BoxGeometry(0.11, 0.11, 0.11), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: CYAN, emissive: CYAN,
    emissiveIntensity: lowEnd ? br * 4 : br * 2.2,
    roughness: 0.15, metalness: 1,
    transparent: true, opacity: Math.max(0.25, br),
  }), [br, lowEnd]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <mesh geometry={geo} material={mat} position={[x, y, z]} />;
}

// ─── Terminal sphere ──────────────────────────────────────────────────────────
function TerminalMesh({ idx, lowEnd }: { idx: number; lowEnd: boolean }) {
  const [x, y, z, br] = PTS[idx];
  const geo = useMemo(() => new THREE.SphereGeometry(0.17, 12, 8), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: CYAN, emissive: CYAN,
    emissiveIntensity: lowEnd ? br * 5.5 : br * 4.0,
    roughness: 0.04, metalness: 1,
    clearcoat: lowEnd ? 0 : 1, clearcoatRoughness: 0.08,
  }), [br, lowEnd]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <mesh geometry={geo} material={mat} position={[x, y, z]} />;
}

// ─── Radial veil plane — dims text area in-scene ──────────────────────────────
// A flat plane at z=0.5 (just in front of nodes) with a radial gradient texture
// that is opaque at centre (behind text) and transparent at edges.
function TextVeilPlane() {
  const tex = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    // Radial gradient: --void at 40% opacity centre → transparent at edge
    const grad = ctx.createRadialGradient(
      size * 0.3, size * 0.5, 0,   // centre biased left (text column)
      size * 0.3, size * 0.5, size * 0.55
    );
    grad.addColorStop(0,   "rgba(10,10,13,0.42)");
    grad.addColorStop(0.5, "rgba(10,10,13,0.22)");
    grad.addColorStop(1,   "rgba(10,10,13,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(canvas);
    return t;
  }, []);

  const geo = useMemo(() => new THREE.PlaneGeometry(16, 8.4), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, side: THREE.FrontSide,
  }), [tex]);

  useEffect(() => () => { geo.dispose(); mat.dispose(); tex.dispose(); }, [geo, mat, tex]);
  return <mesh geometry={geo} material={mat} position={[0, 0, 0.5]} />;
}

// ─── Pulse spheres ────────────────────────────────────────────────────────────
interface PulseState { t: number; speed: number; curve: THREE.CatmullRomCurve3; }

function PulseMeshes({ reducedMotion }: { reducedMotion: boolean }) {
  const MAX = 5;
  const pulsesRef    = useRef<PulseState[]>([]);
  const lastSpawnRef = useRef(0);

  const curves = useMemo(() =>
    PULSE_CHAINS.map((ti) => new THREE.CatmullRomCurve3(
      TRACES[ti].map((i) => { const [x,y,z] = PTS[i]; return new THREE.Vector3(x,y,z); }),
      false, "catmullrom", 0.1
    )), []
  );

  const geo  = useMemo(() => new THREE.SphereGeometry(0.08, 7, 5), []);
  const mats = useMemo(() => Array.from({ length: MAX }, () =>
    new THREE.MeshPhysicalMaterial({
      color: CYAN, emissive: CYAN, emissiveIntensity: 7,
      roughness: 0, metalness: 1, transparent: true, opacity: 0.95,
    })
  ), []);
  const refs = useMemo(() =>
    Array.from({ length: MAX }, () => React.createRef<THREE.Mesh>()), []
  );

  useEffect(() => () => { geo.dispose(); mats.forEach(m => m.dispose()); }, [geo, mats]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const now = performance.now();
    const dt  = Math.min(delta, 0.05);
    if (now - lastSpawnRef.current > 480 && pulsesRef.current.length < MAX) {
      lastSpawnRef.current = now;
      const ci = Math.floor(Math.random() * curves.length);
      pulsesRef.current.push({ t: 0, speed: 0.20 + Math.random() * 0.18, curve: curves[ci] });
    }
    for (let i = pulsesRef.current.length - 1; i >= 0; i--) {
      const p = pulsesRef.current[i];
      p.t += p.speed * dt;
      if (p.t > 1.08) { pulsesRef.current.splice(i, 1); continue; }
      const mesh = refs[i]?.current;
      if (!mesh) continue;
      mesh.position.copy(p.curve.getPoint(Math.min(p.t, 1)));
      mesh.visible = true;
      const col = CYAN.clone().lerp(VIOLET, p.t);
      mats[i].emissive.copy(col);
      mats[i].color.copy(col);
    }
    for (let i = pulsesRef.current.length; i < MAX; i++) {
      const m = refs[i]?.current;
      if (m) m.visible = false;
    }
  });

  return <>{refs.map((ref, i) => <mesh key={i} ref={ref} geometry={geo} material={mats[i]} visible={false} />)}</>;
}

// ─── Bloom ────────────────────────────────────────────────────────────────────
function BloomComposer({ lowEnd }: { lowEnd: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    if (lowEnd) return null;
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 1.3, 0.45, 0.08));
    return c;
  }, [gl, scene, camera, size, lowEnd]);
  useEffect(() => { composer?.setSize(size.width, size.height); }, [composer, size]);
  useFrame(() => { composer?.render(); }, 1);
  useEffect(() => () => { composer?.dispose(); }, [composer]);
  return null;
}

// ─── Circuit group ────────────────────────────────────────────────────────────
function CircuitGroup({ reducedMotion, lowEnd }: { reducedMotion: boolean; lowEnd: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse  = useRef({ x: 0, y: 0 });
  const tilt   = useRef({ x: 0, y: 0 });
  const autoY  = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    if (!reducedMotion) autoY.current += 0.035 * dt;
    const MAX = reducedMotion ? 0 : 0.16;
    tilt.current.x += (mouse.current.y * -MAX - tilt.current.x) * 0.04;
    tilt.current.y += (mouse.current.x *  MAX - tilt.current.y) * 0.04;
    groupRef.current.rotation.y = autoY.current + tilt.current.y;
    groupRef.current.rotation.x = tilt.current.x;
  });

  const allIdx = useMemo(() => {
    const s = new Set<number>();
    TRACES.forEach(c => c.forEach(i => s.add(i)));
    return Array.from(s);
  }, []);

  return (
    <group ref={groupRef}>
      {TRACES.map((chain, i) => <TraceMesh key={i} chain={chain} lowEnd={lowEnd} />)}
      {allIdx.filter(i => !TERMINALS.has(i)).map(i => <ViaMesh key={`v${i}`} idx={i} lowEnd={lowEnd} />)}
      {Array.from(TERMINALS).map(i => <TerminalMesh key={`t${i}`} idx={i} lowEnd={lowEnd} />)}
      <PulseMeshes reducedMotion={reducedMotion} />
      <TextVeilPlane />
    </group>
  );
}

// ─── Scene setup ──────────────────────────────────────────────────────────────
function SceneSetup({ lowEnd }: { lowEnd: boolean }) {
  const { scene, camera, gl } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(FOG_COLOR, lowEnd ? 0.038 : 0.026);
    scene.background = null;
    (camera as THREE.PerspectiveCamera).position.set(0, 0, 11);
    camera.lookAt(0, 0, 0);
    if (!lowEnd) gl.autoClear = false;
    return () => { scene.fog = null; gl.autoClear = true; };
  }, [scene, camera, gl, lowEnd]);
  return null;
}

// ─── Export ───────────────────────────────────────────────────────────────────
export interface CircuitScene3DProps { className?: string; }

export const CircuitScene3D: React.FC<CircuitScene3DProps> = ({ className = "" }) => {
  const reducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const lowEnd = useMemo(() => isLowEnd(), []);

  return (
    <div className={`w-full h-full ${className}`} aria-hidden="true">
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 80 }}
        gl={{ antialias: !lowEnd, alpha: true, powerPreference: "high-performance", stencil: false }}
        style={{ background: "transparent" }}
        dpr={lowEnd ? 1 : [1, 1.5]}
        frameloop="always"
      >
        <SceneSetup lowEnd={lowEnd} />
        <ambientLight intensity={0.10} color="#080818" />
        {/* Cyan key — upper right front */}
        <pointLight position={[7, 4, 8]}  intensity={lowEnd ? 35 : 22} color="#00e5ff" distance={28} decay={2} />
        {/* Violet fill — left rear */}
        <pointLight position={[-7, 2, -6]} intensity={lowEnd ? 18 : 12} color="#8b5cf6" distance={22} decay={2} />
        {/* Top bounce for terminal highlights */}
        <pointLight position={[0, 8, 3]}  intensity={7}               color="#00ffcc" distance={20} decay={2} />
        <CircuitGroup reducedMotion={reducedMotion} lowEnd={lowEnd} />
        <BloomComposer lowEnd={lowEnd} />
      </Canvas>
    </div>
  );
};

export default CircuitScene3D;
