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
const CORRIDOR_LEN = BAY_DEPTH * NUM_BAYS;
const START_Z  = 8;
const START_Y  = 1.6;
const LERP     = 0.08;
const BOB_AMP  = 0.022;

const bayZ = (i: number) => START_Z - BAY_DEPTH * (i + 1) + BAY_DEPTH / 2;

// ─── Palette ──────────────────────────────────────────────────────────────────
const WALL_WHITE = 0xf8fafc;
const TRIM_COL   = 0xe2e8f0;
const DARK_GEO   = 0x0d1117;
const BLUE       = 0x2f7bff;
const BLUE_DARK  = 0x1a4fa8;

// ─── Gallery image URLs (one per bay) ─────────────────────────────────────────
const GALLERY_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
];

// ─── Camera context ───────────────────────────────────────────────────────────
type CamRef = React.MutableRefObject<THREE.Vector3>;
const CamCtx = createContext<CamRef>({ current: new THREE.Vector3(0, START_Y, START_Z) });
const useCam = () => useContext(CamCtx);

// ─── Corridor shell ───────────────────────────────────────────────────────────
const Corridor = memo(() => {
  const len = CORRIDOR_LEN + 30;
  const mid = -(CORRIDOR_LEN / 2) + 8;

  const geos = useMemo(() => ({
    floor: new THREE.PlaneGeometry(HALF_W * 2, len),
    ceil:  new THREE.PlaneGeometry(HALF_W * 2, len),
    wall:  new THREE.PlaneGeometry(len, HEIGHT),
    trim:  new THREE.BoxGeometry(0.06, 0.08, len),
  }), []);

  useEffect(() => () => Object.values(geos).forEach(g => g.dispose()), [geos]);

  return (
    <group>
      <ambientLight intensity={2.2} color={0xffffff} />
      <directionalLight position={[0, 8, 2]} intensity={1.0} color={0xffffff} />
      <pointLight position={[0, 3, START_Z - 2]} intensity={3} color={BLUE} distance={20} decay={2} />
      <fog attach="fog" args={[0xf8fafc, 12, 85]} />

      <mesh geometry={geos.floor} position={[0, 0, mid]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={WALL_WHITE} roughness={0.3} metalness={0} />
      </mesh>
      <mesh geometry={geos.ceil} position={[0, HEIGHT, mid]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={WALL_WHITE} roughness={0.4} metalness={0} />
      </mesh>

      {([-1, 1] as const).map((s) => (
        <group key={s}>
          <mesh geometry={geos.wall}
            position={[s * HALF_W, HEIGHT / 2, mid]}
            rotation={[0, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <meshStandardMaterial color={WALL_WHITE} roughness={0.4} metalness={0} />
          </mesh>
          <mesh geometry={geos.trim} position={[s * (HALF_W - 0.04), 0.04, mid]}>
            <meshStandardMaterial color={TRIM_COL} roughness={0.5} metalness={0.1} />
          </mesh>
          <mesh position={[s * (HALF_W - 0.05), HEIGHT - 0.04, mid]}>
            <boxGeometry args={[0.04, 0.04, len]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1.2} />
          </mesh>
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

// ─── Gallery Frame — framed artwork hung on corridor wall ─────────────────────
const GalleryFrame = memo(({
  index, side = -1, imageUrl,
}: { index: number; side?: -1 | 1; imageUrl: string }) => {
  const camRef   = useCam();
  const grp      = useRef<THREE.Group>(null);
  const spot     = useRef<THREE.SpotLight>(null);
  const imageMat = useRef<THREE.MeshStandardMaterial>(null);
  const z        = bayZ(index);

  const FW = 3.6, FH = 2.4;
  const BORDER = 0.10, MAT_B = 0.06, THICK = 0.06;

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load(imageUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageUrl]);

  useEffect(() => () => { texture.dispose(); }, [texture]);

  useEffect(() => {
    if (!grp.current) return;
    grp.current.position.set(side * (HALF_W - 0.12), HEIGHT / 2, z);
    grp.current.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
  }, [z, side]);

  useFrame(() => {
    if (!spot.current || !imageMat.current) return;
    const dist = Math.abs(camRef.current.z - z);
    const t = Math.max(0, 1 - dist / 8);
    spot.current.intensity = t * 5;
    imageMat.current.emissiveIntensity = t * 0.08;
  });

  const bw = BORDER;
  return (
    <group ref={grp}>
      {/* White mat backing */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[FW + MAT_B * 2, FH + MAT_B * 2]} />
        <meshStandardMaterial color={0xffffff} roughness={0.9} metalness={0} />
      </mesh>

      {/* Image plane */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[FW, FH]} />
        <meshStandardMaterial ref={imageMat} map={texture} roughness={0.5} metalness={0}
          emissive={new THREE.Color(0x5ea1ff)} emissiveIntensity={0} />
      </mesh>

      {/* Frame borders — top/bottom/left/right */}
      <mesh position={[0, FH / 2 + bw / 2 + MAT_B / 2, THICK]}>
        <boxGeometry args={[FW + MAT_B * 2 + bw * 2, bw, THICK * 2]} />
        <meshStandardMaterial color={DARK_GEO} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, -(FH / 2 + bw / 2 + MAT_B / 2), THICK]}>
        <boxGeometry args={[FW + MAT_B * 2 + bw * 2, bw, THICK * 2]} />
        <meshStandardMaterial color={DARK_GEO} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[-(FW / 2 + bw / 2 + MAT_B / 2), 0, THICK]}>
        <boxGeometry args={[bw, FH + MAT_B * 2, THICK * 2]} />
        <meshStandardMaterial color={DARK_GEO} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[FW / 2 + bw / 2 + MAT_B / 2, 0, THICK]}>
        <boxGeometry args={[bw, FH + MAT_B * 2, THICK * 2]} />
        <meshStandardMaterial color={DARK_GEO} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Blue label plate below frame */}
      <mesh position={[0, -(FH / 2 + MAT_B + bw + 0.18), THICK]}>
        <planeGeometry args={[0.8, 0.18]} />
        <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.6}
          roughness={0.3} metalness={0.1} />
      </mesh>

      <spotLight ref={spot} color={0xffffff} intensity={0} distance={12}
        angle={Math.PI / 6} penumbra={0.5} decay={1.2}
        position={[0, 2.5, 1.5]} />
    </group>
  );
});
GalleryFrame.displayName = "GalleryFrame";

// ─── Wireframe floater ────────────────────────────────────────────────────────
type Shape = "box"|"sphere"|"torus"|"octahedron"|"icosahedron"|"torusKnot";
function FloatingWire({ bayIndex, shape, offsetX=0, offsetY=0, scale=1, spin=0.3 }: {
  bayIndex:number; shape:Shape; offsetX?:number; offsetY?:number; scale?:number; spin?:number;
}) {
  const camRef = useCam();
  const ref    = useRef<THREE.LineSegments>(null);
  const z0     = bayZ(bayIndex);
  const base   = useMemo(() => {
    switch(shape) {
      case "box":        return new THREE.BoxGeometry(1,1,1);
      case "sphere":     return new THREE.SphereGeometry(0.7,10,7);
      case "torus":      return new THREE.TorusGeometry(0.6,0.14,10,28);
      case "octahedron": return new THREE.OctahedronGeometry(0.8);
      case "icosahedron":return new THREE.IcosahedronGeometry(0.8,1);
      case "torusKnot":  return new THREE.TorusKnotGeometry(0.5,0.14,60,8);
    }
  }, [shape]);
  const edges = useMemo(() => new THREE.EdgesGeometry(base), [base]);
  const mat   = useMemo(() => new THREE.LineBasicMaterial({ color:DARK_GEO, transparent:true, opacity:0 }), []);
  useEffect(() => () => { base.dispose(); edges.dispose(); mat.dispose(); }, [base,edges,mat]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const fade = Math.max(0, 1 - Math.abs(camRef.current.z - z0) / (BAY_DEPTH * 1.5));
    mat.opacity = fade * 0.7;
    ref.current.visible = fade > 0.02;
    ref.current.rotation.y = clock.elapsedTime * spin * 0.8;
    ref.current.rotation.x = clock.elapsedTime * spin * 0.45;
  });
  return <lineSegments ref={ref} geometry={edges} material={mat}
    position={[HALF_W * 0.55 + offsetX, HEIGHT * 0.6 + offsetY, z0]} scale={scale} />;
}

// ─── Code particles ───────────────────────────────────────────────────────────
function CodeParticles({ bayIndex }: { bayIndex: number }) {
  const camRef  = useCam();
  const COUNT   = 50;
  const z0      = bayZ(bayIndex);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const pts     = useMemo(() => Array.from({ length: COUNT }, () => ({
    x: (Math.random()-0.5)*HALF_W*1.4, y: 0.4+Math.random()*(HEIGHT-0.8),
    z: z0+(Math.random()-0.5)*BAY_DEPTH*0.85, ph: Math.random()*Math.PI*2, sp: 0.4+Math.random()*0.6,
  })), [z0]);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.22, 0.07), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color:BLUE, transparent:true, opacity:0, side:THREE.DoubleSide }), []);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo,mat]);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const fade = Math.max(0, 1 - Math.abs(camRef.current.z - z0) / (BAY_DEPTH * 1.5));
    mat.opacity = fade * 0.6;
    pts.forEach((p,i) => {
      dummy.position.set(p.x, p.y+Math.sin(clock.elapsedTime*p.sp+p.ph)*0.15, p.z);
      dummy.rotation.z = Math.sin(clock.elapsedTime*0.3+p.ph)*0.3;
      dummy.scale.setScalar(fade > 0.02 ? 1 : 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={meshRef} args={[geo, mat, COUNT]} />;
}

// ─── Neural net ───────────────────────────────────────────────────────────────
function NeuralNet({ bayIndex }: { bayIndex: number }) {
  const camRef = useCam();
  const z0     = bayZ(bayIndex);
  const N      = 10;
  const nPos   = useMemo(() => Array.from({ length: N }, () => ({
    x: (Math.random()-0.5)*3.5, y: 0.8+Math.random()*4.5, z: z0+(Math.random()-0.5)*5,
  })), [z0]);
  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++)
      for (let j = i+1; j < N; j++)
        if (Math.random() > 0.5) { pts.push(new THREE.Vector3(nPos[i].x,nPos[i].y,nPos[i].z)); pts.push(new THREE.Vector3(nPos[j].x,nPos[j].y,nPos[j].z)); }
    const g = new THREE.BufferGeometry(); g.setFromPoints(pts); return g;
  }, [nPos]);
  const lMat  = useMemo(() => new THREE.LineBasicMaterial({ color:BLUE_DARK, transparent:true, opacity:0 }), []);
  const nGeo  = useMemo(() => new THREE.SphereGeometry(0.08,6,4), []);
  const nMat  = useMemo(() => new THREE.MeshBasicMaterial({ color:DARK_GEO }), []);
  const grpRef= useRef<THREE.Group>(null);
  useEffect(() => () => { lineGeo.dispose(); lMat.dispose(); nGeo.dispose(); nMat.dispose(); }, [lineGeo,lMat,nGeo,nMat]);
  useFrame(() => {
    const fade = Math.max(0, 1 - Math.abs(camRef.current.z - z0) / (BAY_DEPTH * 1.5));
    lMat.opacity = fade * 0.5;
    if (grpRef.current) grpRef.current.visible = fade > 0.02;
  });
  return (
    <group ref={grpRef} visible={false}>
      <lineSegments geometry={lineGeo} material={lMat} />
      {nPos.map((p,i) => <mesh key={i} geometry={nGeo} material={nMat} position={[p.x,p.y,p.z]} />)}
    </group>
  );
}

// ─── Scene inner ──────────────────────────────────────────────────────────────
function SceneInner({ reducedMotion, visible }: { reducedMotion: boolean; visible: boolean }) {
  const { camera } = useThree();
  const camRef  = useRef(new THREE.Vector3(0, START_Y, START_Z));
  const bob     = useRef(0);
  const targetZ = useRef(START_Z);

  useEffect(() => {
    camera.position.set(0, START_Y, START_Z);
    if (camera instanceof THREE.PerspectiveCamera) { camera.fov = 58; camera.near = 0.1; camera.far = 100; }
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    if (!visible) return;
    const prog = getScrollProgress();
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

      {/* Gallery frames — project artwork on alternating walls */}
      {Array.from({ length: NUM_BAYS }, (_, i) => (
        <GalleryFrame key={i} index={i} side={i % 2 === 0 ? -1 : 1} imageUrl={GALLERY_IMAGES[i]} />
      ))}

      <CodeParticles bayIndex={0} />
      <FloatingWire bayIndex={1} shape="box"         scale={1.1} spin={0.25} />
      <CodeParticles bayIndex={1} />
      <FloatingWire bayIndex={2} shape="octahedron"  scale={1.2} offsetY={0.3} spin={0.3} />
      <FloatingWire bayIndex={2} shape="sphere"      scale={0.8} offsetX={-2.5} spin={0.2} />
      <FloatingWire bayIndex={3} shape="icosahedron" scale={1.3} spin={0.2} />
      <NeuralNet   bayIndex={4} />
      <FloatingWire bayIndex={4} shape="torusKnot"   scale={1.0} offsetX={1.5} spin={0.4} />
      <FloatingWire bayIndex={5} shape="torus"       scale={1.3} spin={0.18} />
      <FloatingWire bayIndex={5} shape="icosahedron" scale={0.9} offsetX={-2.0} spin={0.25} />
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
