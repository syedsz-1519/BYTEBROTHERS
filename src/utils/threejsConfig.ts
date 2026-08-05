import { Vector3, Color } from 'three';
import { SphereConfig, LightingConfig } from '../types/rotatable';

/**
 * Default sphere configuration
 */
export const DEFAULT_SPHERE_CONFIG: SphereConfig = {
  radius: 10,
  segmentCount: 32,
  widthSegments: 64,
  heightSegments: 32,
  material: {
    color: '#1a1a1d',
    metalness: 0.3,
    roughness: 0.4,
    emissive: '#000000',
    emissiveIntensity: 0,
  },
};

/**
 * Dark theme sphere configuration
 */
export const SPHERE_CONFIG_DARK: SphereConfig = {
  ...DEFAULT_SPHERE_CONFIG,
  material: {
    color: '#1a1a1d',
    metalness: 0.3,
    roughness: 0.4,
    emissive: '#1a1a1d',
    emissiveIntensity: 0.1,
  },
};

/**
 * Light theme sphere configuration
 */
export const SPHERE_CONFIG_LIGHT: SphereConfig = {
  ...DEFAULT_SPHERE_CONFIG,
  material: {
    color: '#f8f9fa',
    metalness: 0.2,
    roughness: 0.5,
    emissive: '#ffffff',
    emissiveIntensity: 0.05,
  },
};

/**
 * Dark theme lighting configuration
 */
export const LIGHTING_CONFIG_DARK: LightingConfig = {
  ambient: {
    color: '#ffffff',
    intensity: 0.5,
  },
  directional: {
    color: '#ffffff',
    intensity: 1.2,
    position: new Vector3(5, 10, 7),
  },
  point: {
    color: '#3b82f6',
    intensity: 1,
    distance: 50,
    position: new Vector3(0, 0, 20),
  },
};

/**
 * Light theme lighting configuration
 */
export const LIGHTING_CONFIG_LIGHT: LightingConfig = {
  ambient: {
    color: '#ffffff',
    intensity: 0.8,
  },
  directional: {
    color: '#ffffff',
    intensity: 1.0,
    position: new Vector3(5, 10, 7),
  },
  point: {
    color: '#2563eb',
    intensity: 0.8,
    distance: 40,
    position: new Vector3(0, 0, 20),
  },
};

/**
 * Camera configuration defaults
 */
export const CAMERA_CONFIG = {
  fov: 75,
  near: 0.1,
  far: 1000,
  initialPosition: new Vector3(0, 0, 15),
  initialLookAt: new Vector3(0, 0, 0),
};

/**
 * Rotation controls defaults
 */
export const ROTATION_CONTROLS_DEFAULTS = {
  enabled: true,
  dampingFactor: 0.05,
  inertia: true,
  gyroscope: false,
  sensitivity: 0.005,
  maxAngularVelocity: 0.1,
};

/**
 * Animation defaults
 */
export const ANIMATION_CONFIG = {
  autoRotateSpeed: 0.001, // radians per frame
  inertiaDecay: 0.95, // 0-1, lower = faster decay
  transitionDuration: 800, // milliseconds
  focusZoom: 1.5,
};

/**
 * Performance settings
 */
export const PERFORMANCE_CONFIG = {
  enableFrustumCulling: true,
  enableLOD: true,
  lodDistances: {
    high: 5,
    medium: 15,
    low: 50,
  },
  maxVisibleItems: 30,
  targetFPS: 60,
};

/**
 * Content item defaults
 */
export const CONTENT_ITEM_DEFAULTS = {
  scale: 1,
  distanceFromCenter: 10,
};

/**
 * Get sphere config based on theme
 */
export function getSphereConfig(theme: 'dark' | 'light'): SphereConfig {
  return theme === 'dark' ? SPHERE_CONFIG_DARK : SPHERE_CONFIG_LIGHT;
}

/**
 * Get lighting config based on theme
 */
export function getLightingConfig(theme: 'dark' | 'light'): LightingConfig {
  return theme === 'dark' ? LIGHTING_CONFIG_DARK : LIGHTING_CONFIG_LIGHT;
}

/**
 * Easing functions for animations
 */
export const EASING = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
};

/**
 * Convert hex color to THREE.Color
 */
export function hexToColor(hex: string): Color {
  return new Color(hex);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Check if WebGL is supported
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('webgl2'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Get WebGL version
 */
export function getWebGLVersion(): 1 | 2 | 0 {
  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext('webgl2')) return 2;
    if (canvas.getContext('webgl')) return 1;
    return 0;
  } catch (e) {
    return 0;
  }
}
