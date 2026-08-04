import * as THREE from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";

const CYAN = new THREE.Color("#00f0ff");
const DIM_CYAN = new THREE.Color("#0891b2");

export function cloneSceneGraph(scene: THREE.Object3D): THREE.Object3D {
  return cloneSkinned(scene) as THREE.Object3D;
}

function cloneMeshMaterial(mesh: THREE.Mesh): void {
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map((m) => m.clone());
  } else if (mesh.material) {
    mesh.material = mesh.material.clone();
  }
}

function getMaterials(mesh: THREE.Mesh): THREE.MeshStandardMaterial[] {
  const raw = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return raw.filter(
    (m): m is THREE.MeshStandardMaterial =>
      m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial
  );
}

function isMonitorMesh(name: string, parentName?: string): boolean {
  const lower = name.toLowerCase();
  const parent = (parentName ?? "").toLowerCase();
  return (
    lower.includes("my screen") ||
    lower.includes("maxresdefault") ||
    parent.includes("my screen")
  );
}

function isCableMesh(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes("beziercurve") ||
    lower.includes("beziercircle") ||
    lower.includes("usb") ||
    lower.includes("ioshield") ||
    /cylinder\.00[1-4]_/i.test(name)
  );
}

function isRgbMesh(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes("aorus case fans") ||
    lower.includes("rgb") ||
    lower.includes("tasten")
  );
}

function isDeskMesh(name: string): boolean {
  return name.includes("Cube.001_Material.055");
}

function applyMonitorTexture(
  mat: THREE.MeshStandardMaterial,
  monitorTexture: THREE.CanvasTexture
) {
  if (mat.map) mat.map.dispose();
  if (mat.emissiveMap && mat.emissiveMap !== mat.map) mat.emissiveMap.dispose();

  mat.map = monitorTexture;
  mat.emissiveMap = monitorTexture;
  mat.emissive = CYAN.clone();
  mat.emissiveIntensity = 0.4;
  mat.metalness = 0;
  mat.roughness = 0.12;
  mat.color.set("#ffffff");
  mat.toneMapped = true;
  mat.needsUpdate = true;
}

function applyStaticCyanGlow(mat: THREE.MeshStandardMaterial, intensity = 0.35) {
  if (mat.map) mat.map.dispose();
  if (mat.emissiveMap) mat.emissiveMap.dispose();

  mat.map = null;
  mat.emissiveMap = null;
  mat.color.set("#0c1220");
  mat.emissive.copy(intensity > 0.5 ? CYAN : DIM_CYAN);
  mat.emissiveIntensity = intensity;
  mat.metalness = 0.15;
  mat.roughness = 0.65;
  mat.needsUpdate = true;
}

function applyDeskMaterial(mat: THREE.MeshStandardMaterial, brushedMetalMap: THREE.CanvasTexture) {
  if (mat.map) mat.map.dispose();
  mat.map = brushedMetalMap;
  mat.metalness = 0.7;
  mat.roughness = 0.3;
  mat.color.set("#121218");
  mat.needsUpdate = true;
}

export function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#141419";
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 1) {
    const shade = 18 + Math.sin(y * 0.08) * 4 + (Math.random() - 0.5) * 3;
    ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade + 2})`;
    ctx.fillRect(0, y, 512, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function configureSceneMaterials(
  scene: THREE.Object3D,
  monitorTexture: THREE.CanvasTexture,
  brushedMetalMap: THREE.CanvasTexture
) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    cloneMeshMaterial(child);

    const name = child.name;
    const parentName = child.parent?.name;

    if (isCableMesh(name)) {
      child.visible = false;
      return;
    }

    // Portfolio image plane overlaid on monitor — remove entirely
    if (name.toLowerCase().includes("maxresdefault")) {
      child.visible = false;
      return;
    }

    const materials = getMaterials(child);
    if (materials.length === 0) return;

    materials.forEach((mat) => {
      if (isMonitorMesh(name, parentName)) {
        applyMonitorTexture(mat, monitorTexture);
        return;
      }

      if (isDeskMesh(name)) {
        applyDeskMaterial(mat, brushedMetalMap);
        return;
      }

      if (isRgbMesh(name)) {
        const isFan = name.toLowerCase().includes("aorus case fans");
        applyStaticCyanGlow(mat, isFan ? 0.45 : 0.25);
        return;
      }

      if (mat.emissiveMap || (mat.emissiveIntensity > 0 && mat.emissive.getHex() > 0)) {
        applyStaticCyanGlow(mat, 0.2);
      }
    });
  });
}
