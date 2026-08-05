import { Vector3, Euler } from 'three';

/**
 * Represents a single content item positioned on the rotatable sphere
 */
export interface SphereContentItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  position: Vector3;
  rotation?: Euler;
  scale?: number;
  metadata?: Record<string, any>;
  type?: 'project' | 'service' | 'person' | 'contact';
}

/**
 * Configuration options for rotation controls
 */
export interface RotationControlsOptions {
  enabled: boolean;
  dampingFactor?: number; // Default: 0.05, Range: 0-1
  inertia?: boolean; // Enable momentum physics
  gyroscope?: boolean; // Enable device orientation
  sensitivity?: number; // Default: 0.005
  maxAngularVelocity?: number; // Default: 0.1
}

/**
 * Current state of rotation input
 */
export interface InputState {
  isDragging: boolean;
  previousPosition: { x: number; y: number };
  currentDelta: { x: number; y: number };
  angularVelocity: Euler;
}

/**
 * Camera state for transitions
 */
export interface CameraState {
  position: Vector3;
  lookAt: Vector3;
  fov: number;
  near: number;
  far: number;
  zoom: number;
}

/**
 * Camera transition animation config
 */
export interface CameraTransition {
  from: CameraState;
  to: CameraState;
  duration: number; // milliseconds
  easing: (t: number) => number;
  startTime?: number;
}

/**
 * Sphere type selector
 */
export type SphereType = 'portfolio' | 'services' | 'about' | 'contact' | 'team';

/**
 * LOD (Level of Detail) levels
 */
export type LODLevel = 'high' | 'medium' | 'low';

/**
 * Props for RotatablePortfolioSphere component
 */
export interface RotatablePortfolioSphereProps {
  sphereType: SphereType;
  content: SphereContentItem[];
  onContentSelect: (item: SphereContentItem) => void;
  autoRotate?: boolean;
  zoom?: number;
  theme?: 'dark' | 'light';
  reducedMotion?: boolean;
}

/**
 * Props for SphereContent component
 */
export interface SphereContentProps {
  items: SphereContentItem[];
  sphereRadius: number;
  onItemSelect: (item: SphereContentItem) => void;
  focusedItemId?: string;
}

/**
 * Raycasting intersection result
 */
export interface RaycastHit {
  object: any;
  distance: number;
  point: Vector3;
  uv?: Vector3;
  contentItem?: SphereContentItem;
}

/**
 * Rotation state
 */
export interface RotationState {
  quaternion: any; // THREE.Quaternion
  euler: Euler;
  angularVelocity: Euler;
  isAnimating: boolean;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  visibleItems: number;
  renderTime: number;
}

/**
 * Sphere configuration
 */
export interface SphereConfig {
  radius: number;
  segmentCount: number; // Geometry detail
  widthSegments: number;
  heightSegments: number;
  material: {
    color: string;
    metalness: number;
    roughness: number;
    emissive?: string;
    emissiveIntensity?: number;
  };
}

/**
 * Lighting configuration
 */
export interface LightingConfig {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: Vector3;
  };
  point: {
    color: string;
    intensity: number;
    distance: number;
    position: Vector3;
  };
}

/**
 * Content positioned on sphere
 */
export interface PositionedContent extends SphereContentItem {
  distanceFromCamera: number;
  lodLevel: LODLevel;
  isVisible: boolean;
  screenPosition?: { x: number; y: number };
}

/**
 * Content modal data
 */
export interface ContentModalData {
  isOpen: boolean;
  item: SphereContentItem | null;
  previousItem?: SphereContentItem;
  nextItem?: SphereContentItem;
}
