"use client";

import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three-stdlib";

// ─── Device capability detection ─────────────────────────────────────────────
function isLowEnd(): boolean {
  if (typeof window === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores <= 2) return true;
  // Rough WebGL check — low-end GPUs often have low maxTextureSize
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return true;
    const maxTex = (gl as WebGLRenderingContext).getParameter(
      (gl as WebGLRenderingContext).MAX_TEXTURE_SIZE
    );
    if (maxTex < 4096) return true;
  } catch { return true; }
  return false;
}

// ─── Colours ─────────────────────────────────────────────────────────────────
const CYAN        = new THREE.Color(0x00e5ff);
const VIOLET      = new THREE.Color(0x8b5cf6);
const TRACE_COLOR = new THREE.Color(0x003344); // dim base trace — bloom lifts it
const FOG_COLOR   = new THREE.Color(0x0a0a0d); // --void

// ─── Full-viewport circuit lattice layout ────────────────────────────────────
// Spread across a wide plane (x: -7..7, y: -4..4) with Z variation for depth.
// Text area (left-centre, x < 1) is sparser so copy stays legible.
// Right/edge areas are denser and brighter.

// [x, y, z, brightness]  brightness 0..1 scales emissiveIntensity
type Pt4 = [number, number, number, number];

const PTS: Pt4[] = [
  // ── Top rail, full width ──────────────────────────────────────────────────
  [-6.5,  3.2, -1.0, 0.5],   //  0
  [-4.0,  3.2,  0.3, 0.6],   //  1
  [-2.0,  3.2, -0.2, 0.3],   //  2  (text zone, dim)
  [ 0.5,  3.2,  0.5, 0.4],   //  3
  [ 2.8,  3.2, -0.4, 0.8],   //  4  terminal
  [ 5.0,  3.2,  0.2, 0.7],   //  5
  [ 6.8,  3.2, -0.6, 0.9],   //  6  terminal

  // ── Upper-mid rail ────────────────────────────────────────────────────────
  [-6.5,  1.5, -0.5, 0.6],   //  7
  [-4.0,  1.5,  0.4, 0.4],   //  8
  [-1.5,  1.5, -0.3, 0.25],  //  9  (text zone, dim)
  [ 0.5,  1.5,  0.6, 0.35],  // 10
  [ 2.8,  1.5,  0.0, 0.9],   // 11  terminal
  [ 5.0,  1.5, -0.5, 0.7],   // 12
  [ 6.8,  1.5,  0.3, 0.8],   // 13

  // ── Centre rail ───────────────────────────────────────────────────────────
  [-6.5,  0.0,  0.2, 0.7],   // 14  terminal
  [-4.0,  0.0, -0.4, 0.5],   // 15
  [-1.5,  0.0,  0.1, 0.2],   // 16  (text zone, very dim)
  [ 0.5,  0.0, -0.2, 0.45],  // 17  hub via
  [ 2.8,  0.0,  0.5, 0.85],  // 18  terminal
  [ 5.0,  0.0,  0.0, 0.75],  // 19
  [ 6.8,  0.0, -0.4, 0.9],   // 20  terminal

  // ── Lower-mid rail ────────────────────────────────────────────────────────
  [-6.5, -1.5,  0.3, 0.6],   // 21
  [-4.0, -1.5, -0.2, 0.5],   // 22
  [-1.5, -1.5,  0.4, 0.3],   // 23
  [ 0.5, -1.5,  0.0, 0.5],   // 24
  [ 2.8, -1.5, -0.5, 0.8],   // 25
  [ 5.0, -1.5,  0.3, 0.7],   // 26
  [ 6.8, -1.5, -0.2, 0.85],  // 27

  // ── Bottom rail ───────────────────────────────────────────────────────────
  [-6.5, -3.2, -0.3, 0.7],   // 28  terminal
  [-3.5, -3.2,  0.5, 0.6],   // 29
  [-1.0, -3.2, -0.1, 0.35],  // 30
  [ 1.5, -3.2,  0.4, 0.55],  // 31
  [ 4.0, -3.2, -0.2, 0.8],   // 32  terminal
  [ 6.8, -3.2,  0.1, 0.9],   // 33  terminal
];

// Terminal indices — larger glowing sphere pads
const TERMINALS = new Set([4, 6, 11, 14, 18, 20, 28, 32, 33]);

// ─── Orthogonal trace chains ──────────────────────────────────────────────────
// Horizontal rails + vertical connectors — PCB language
const TRACES: number[][] = [
  // Horizontal rails
  [0, 1, 2, 3, 4, 5, 6],       // top rail
  [7, 8, 9, 10, 11, 12, 13],   // upper-mid
  [14, 15, 16, 17, 18, 19, 20],// centre
  [21, 22, 23, 24, 25, 26, 27],// lower-mid
  [28, 29, 30, 31, 32, 33],    // bottom

  // Vertical connectors — left cluster
  [0, 7, 14, 21, 28],
  [1, 8, 15, 22, 29],

  // Vertical connectors — text zone (sparse, skip some)
  [2, 9],
  [16, 23, 30],

  // Vertical connectors — right cluster (dense, bright)
  [3, 10, 17, 24, 31],
  [4, 11, 18, 25, 32],
  [5, 12, 19, 26],
  [6, 13, 20, 27, 33],

  // Cross-links — accent area (right half)
  [11, 12],
  [18, 19],
  [25, 26],
  [13, 20],
];

// Traces that carry animated pulses
const PULSE_TRACE_INDICES = [0, 2, 5, 9, 10, 12, 13];

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
  const curve = new THREE.CatmullRomCurve3(v3s, false, "catmullrom", 0.05);
  return new THREE.TubeGeometry(curve, v3s.length * 4, 0.022, 4, false);
}

// ─── Trace mesh ───────────────────────────────────────────────────────────────
function TraceMesh({ chain, lowEnd }: { chain: number[]; lowEnd: boolean }) {
  const geo = useMemo(() => buildTube(chain), [chain]);
  const avgBrightness = useMemo(
    () => chain.reduce((s, i) => s + PTS[i][3], 0) / chain.length,
    [chain]
  );
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:             TRACE_COLOR,
    emissive:          CYAN,
    emissiveIntensity: lowEnd ? avgBrightness * 1.2 : avgBrightness * 0.55,
    roughness:         0.5,
    metalness:         0.8,
    clearcoat:         lowEnd ? 0 : 0.3,
  }), [avgBrightness, lowEnd]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <mesh geometry={geo} material={mat} />;
}

// ─── Via square (junction node) ───────────────────────────────────────────────
function ViaMesh({ idx, lowEnd }: { idx: number; lowEnd: boolean }) {
  const [x, y, z, br] = PTS[idx];
  const geo = useMemo(() => new THREE.BoxGeometry(0.12, 0.12, 0.12), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:             CYAN,
    emissive:          CYAN,
    emissiveIntensity: lowEnd ? br * 3.5 : br * 2.0,
    roughness:         0.2,
    metalness:         1.0,
  }), [br, lowEnd]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <mesh geometry={geo} material={mat} position={[x, y, z]} />;
}

// ─── Terminal sphere pad ──────────────────────────────────────────────────────
function TerminalMesh({ idx, lowEnd }: { idx: number; lowEnd: boolean }) {
  const [x, y, z, br] = PTS[idx];
  const geo = useMemo(() => new THREE.SphereGeometry(0.18, 12, 8), []);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:             CYAN,
    emissive:          CYAN,
    emissiveIntensity: lowEnd ? br * 5 : br * 3.5,
    roughness:         0.05,
    metalness:         1.0,
    clearcoat:         lowEnd ? 0 : 1.0,
    clearcoatRoughness:0.1,
  }), [br, lowEnd]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  return <mesh geometry={geo} material={mat} position={[x, y, z]} />;
}

// ─── Pulse sphere (traveling light) ──────────────────────────────────────────
interface PulseState {
  t: number;
  speed: number;
  curve: THREE.CatmullRomCurve3;
}

function buildCurve(chain: number[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(
    chain.map(([x, y, z]) => new THREE.Vector3(x, y, z), chain.map(i => PTS[i]))
      .map((_, i) => { const [x,y,z] = PTS[chain[i]]; return new THREE.Vector3(x,y,z); }),
    false, "catmullrom", 0.1
  );
}

function PulseMeshes({ reducedMotion }: { reducedMotion: boolean }) {
  const MAX_PULSES = 4;
  const pulsesRef   = useRef<PulseState[]>([]);
  const lastSpawnRef = useRef(0);

  const curves = useMemo(
    () => PULSE_TRACE_INDICES.map((ti) => {
      const chain = TRACES[ti];
      return new THREE.CatmullRomCurve3(
        chain.map((i) => { const [x,y,z] = PTS[i]; return new THREE.Vector3(x,y,z); }),
        false, "catmullrom", 0.1
      );
    }),
    []
  );

  const geo = useMemo(() => new THREE.SphereGeometry(0.09, 7, 5), []);
  // One material per slot, cloned so colour can differ
  const mats = useMemo(
    () => Array.from({ length: MAX_PULSES }, () =>
      new THREE.MeshPhysicalMaterial({
        color:             CYAN,
        emissive:          CYAN,
        emissiveIntensity: 6,
        roughness:         0,
        metalness:         1,
        transparent:       true,
        opacity:           0.95,
      })
    ),
    []
  );
  const meshRefs = useMemo(
    () => Array.from({ length: MAX_PULSES }, () => React.createRef<THREE.Mesh>()),
    []
  );

  useEffect(() => () => {
    geo.dispose();
    mats.forEach(m => m.dispose());
  }, [geo, mats]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const now = performance.now();
    const dt  = Math.min(delta, 0.05);

    if (now - lastSpawnRef.current > 500 && pulsesRef.current.length < MAX_PULSES) {
      lastSpawnRef.current = now;
      const ci = Math.floor(Math.random() * curves.length);
      pulsesRef.current.push({ t: 0, speed: 0.22 + Math.random() * 0.18, curve: curves[ci] });
    }

    for (let i = pulsesRef.current.length - 1; i >= 0; i--) {
      const p = pulsesRef.current[i];
      p.t += p.speed * dt;
      if (p.t > 1.08) { pulsesRef.current.splice(i, 1); continue; }
      const mesh = meshRefs[i]?.current;
      if (!mesh) continue;
      const pos = p.curve.getPoint(Math.min(p.t, 1));
      mesh.position.copy(pos);
      mesh.visible = true;
      const col = CYAN.clone().lerp(VIOLET, p.t);
      mats[i].emissive.copy(col);
      mats[i].color.copy(col);
    }
    for (let i = pulsesRef.current.length; i < MAX_PULSES; i++) {
      const m = meshRefs[i]?.current;
      if (m) m.visible = false;
    }
  });

  return (
    <>
      {meshRefs.map((ref, i) => (
        <mesh key={i} ref={ref} geometry={geo} material={mats[i]} visible={false} />
      ))}
    </>
  );
}

// ─── Bloom post-processing (three-stdlib EffectComposer) ─────────────────────
function BloomComposer({ lowEnd }: { lowEnd: boolean }) {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    if (lowEnd) return null;
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      1.4,   // strength
      0.5,   // radius
      0.1    // threshold — low so emissives bloom readily
    );
    c.addPass(bloom);
    return c;
  }, [gl, scene, camera, size, lowEnd]);

  useEffect(() => {
    if (!composer) return;
    composer.setSize(size.width, size.height);
  }, [composer, size]);

  useFrame(() => {
    if (!composer) return;
    composer.render();
  }, 1); // priority 1 — runs after scene render

  useEffect(() => () => { composer?.dispose(); }, [composer]);
  return null;
}

// ─── Main circuit group: rotation + tilt ─────────────────────────────────────
function CircuitGroup({
  reducedMotion,
  lowEnd,
}: {
  reducedMotion: boolean;
  lowEnd: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const tilt     = useRef({ x: 0, y: 0 });
  const autoRot  = useRef(0);

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
    if (!reducedMotion) autoRot.current += 0.04 * dt;

    const MAX = reducedMotion ? 0 : 0.18; // ~10°
    tilt.current.x += (mouse.current.y * -MAX - tilt.current.x) * 0.04;
    tilt.current.y += (mouse.current.x *  MAX - tilt.current.y) * 0.04;

    groupRef.current.rotation.y = autoRot.current + tilt.current.y;
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
      {allIdx.filter(i => !TERMINALS.has(i)).map(i =>
        <ViaMesh key={`v${i}`} idx={i} lowEnd={lowEnd} />
      )}
      {Array.from(TERMINALS).map(i =>
        <TerminalMesh key={`t${i}`} idx={i} lowEnd={lowEnd} />
      )}
      <PulseMeshes reducedMotion={reducedMotion} />
    </group>
  );
}

// ─── Fog + scene setup ────────────────────────────────────────────────────────
function SceneSetup({ lowEnd }: { lowEnd: boolean }) {
  const { scene, camera, gl } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2(FOG_COLOR, lowEnd ? 0.045 : 0.032);
    scene.background = null; // transparent
    camera.position.set(0, 0, 11);
    camera.lookAt(0, 0, 0);
    // Disable auto-clear so BloomComposer controls rendering
    if (!lowEnd) gl.autoClear = false;
    return () => { scene.fog = null; gl.autoClear = true; };
  }, [scene, camera, gl, lowEnd]);
  return null;
}

// ─── Public export ────────────────────────────────────────────────────────────
export interface CircuitScene3DProps { className?: string; }

export const CircuitScene3D: React.FC<CircuitScene3DProps> = ({ className = "" }) => {
  const reducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const lowEnd = useMemo(() => isLowEnd(), []);

  return (
    <div className={`w-full h-full ${className}`} aria-hidden="true">
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 80 }}
        gl={{
          antialias:        !lowEnd,
          alpha:            true,
          powerPreference:  "high-performance",
          stencil:          false,
          depth:            true,
        }}
        style={{ background: "transparent" }}
        dpr={lowEnd ? 1 : [1, 1.5]}
        frameloop="always"
      >
        <SceneSetup lowEnd={lowEnd} />

        {/* Ambient — minimal, emissives provide most light */}
        <ambientLight intensity={0.12} color="#0a0a1a" />

        {/* Cyan key light — upper right front */}
        <pointLight position={[6, 4, 7]} intensity={lowEnd ? 30 : 20}
          color="#00e5ff" distance={25} decay={2} />

        {/* Violet fill — left rear */}
        <pointLight position={[-6, 2, -5]} intensity={lowEnd ? 15 : 10}
          color="#8b5cf6" distance={20} decay={2} />

        {/* Warm top bounce — subtle surface catch on terminals */}
        <pointLight position={[0, 7, 2]} intensity={6}
          color="#00ffcc" distance={18} decay={2} />

        <CircuitGroup reducedMotion={reducedMotion} lowEnd={lowEnd} />

        {/* Bloom — skipped on low-end, emissiveIntensity compensates */}
        <BloomComposer lowEnd={lowEnd} />
      </Canvas>
    </div>
  );
};

export default CircuitScene3D;
