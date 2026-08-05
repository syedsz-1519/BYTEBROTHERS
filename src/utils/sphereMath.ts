import { Vector3, Quaternion, Euler } from 'three';

/**
 * Calculate spherical coordinates for N items distributed on a sphere
 * Using golden spiral algorithm for even distribution
 */
export function getSphericalCoordinates(
  index: number,
  total: number,
  radius: number = 10
): Vector3 {
  // Golden spiral distribution
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

/**
 * Convert 2D mouse/touch delta to 3D rotation
 */
export function deltaToRotation(
  deltaX: number,
  deltaY: number,
  width: number,
  height: number,
  sensitivity: number = 0.005
): Quaternion {
  // Normalize deltas to screen size
  const angleX = (deltaX / width) * Math.PI * 2 * sensitivity;
  const angleY = (deltaY / height) * Math.PI * 2 * sensitivity;

  // Create quaternions for each axis
  const qX = new Quaternion();
  qX.setFromAxisAngle(new Vector3(0, 1, 0), angleX);

  const qY = new Quaternion();
  qY.setFromAxisAngle(new Vector3(1, 0, 0), angleY);

  // Combine rotations
  const result = new Quaternion();
  result.multiplyQuaternions(qX, qY);

  return result;
}

/**
 * Apply inertia/damping to angular velocity
 */
export function applyInertia(
  angularVelocity: Euler,
  dampingFactor: number = 0.95,
  deltaTime: number = 1 / 60
): Euler {
  const decay = Math.pow(dampingFactor, deltaTime * 60);
  angularVelocity.x *= decay;
  angularVelocity.y *= decay;
  angularVelocity.z *= decay;

  return angularVelocity;
}

/**
 * Calculate angular velocity from mouse movement
 */
export function calculateAngularVelocity(
  deltaX: number,
  deltaY: number,
  width: number,
  height: number,
  sensitivity: number = 0.005
): Euler {
  const velocityX = (deltaY / height) * Math.PI * sensitivity;
  const velocityY = (deltaX / width) * Math.PI * sensitivity;

  return new Euler(velocityX, velocityY, 0);
}

/**
 * Create rotation quaternion from euler angles
 */
export function eulerToQuaternion(euler: Euler): Quaternion {
  const q = new Quaternion();
  q.setFromEuler(euler);
  return q;
}

/**
 * Convert quaternion to euler angles
 */
export function quaternionToEuler(quaternion: Quaternion): Euler {
  const euler = new Euler();
  euler.setFromQuaternion(quaternion);
  return euler;
}

/**
 * Calculate distance from camera to point
 */
export function distanceFromCamera(
  point: Vector3,
  cameraPosition: Vector3
): number {
  return point.distanceTo(cameraPosition);
}

/**
 * Determine LOD level based on distance
 */
export function getLODLevel(
  distance: number,
  highThreshold: number = 5,
  mediumThreshold: number = 15
): 'high' | 'medium' | 'low' {
  if (distance < highThreshold) return 'high';
  if (distance < mediumThreshold) return 'medium';
  return 'low';
}

/**
 * Check if point is within sphere radius
 */
export function isPointOnSphere(
  point: Vector3,
  sphereCenter: Vector3,
  sphereRadius: number,
  tolerance: number = 0.5
): boolean {
  const distance = point.distanceTo(sphereCenter);
  return Math.abs(distance - sphereRadius) < tolerance;
}

/**
 * Project 3D point to 2D screen coordinates
 */
export function projectToScreen(
  point: Vector3,
  camera: any, // THREE.PerspectiveCamera
  width: number,
  height: number
): { x: number; y: number } | null {
  const vector = point.clone();
  vector.project(camera);

  const x = ((vector.x + 1) / 2) * width;
  const y = ((1 - vector.y) / 2) * height;

  // Check if point is behind camera
  if (vector.z > 1) {
    return null;
  }

  return { x, y };
}

/**
 * Calculate direction vector from point to another
 */
export function getDirection(from: Vector3, to: Vector3): Vector3 {
  const direction = to.clone();
  direction.sub(from);
  direction.normalize();
  return direction;
}

/**
 * Linear interpolation for vectors
 */
export function lerpVector(
  from: Vector3,
  to: Vector3,
  t: number
): Vector3 {
  const result = from.clone();
  result.lerp(to, t);
  return result;
}

/**
 * Linear interpolation for quaternions
 */
export function lerpQuaternion(
  from: Quaternion,
  to: Quaternion,
  t: number
): Quaternion {
  const result = from.clone();
  result.slerp(to, t);
  return result;
}

/**
 * Check if velocity is negligible
 */
export function isVelocityNegligible(
  velocity: Euler,
  threshold: number = 0.001
): boolean {
  return Math.abs(velocity.x) < threshold &&
    Math.abs(velocity.y) < threshold &&
    Math.abs(velocity.z) < threshold;
}

/**
 * Clamp angle to 0-360 degrees
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += Math.PI * 2;
  while (angle > Math.PI * 2) angle -= Math.PI * 2;
  return angle;
}

/**
 * Calculate angle between two vectors
 */
export function angleBetweenVectors(a: Vector3, b: Vector3): number {
  const cos = Math.min(Math.max(a.dot(b) / (a.length() * b.length()), -1), 1);
  return Math.acos(cos);
}

/**
 * Get normal vector of sphere at point
 */
export function getSphereNormal(
  point: Vector3,
  sphereCenter: Vector3 = new Vector3(0, 0, 0)
): Vector3 {
  const normal = point.clone();
  normal.sub(sphereCenter);
  normal.normalize();
  return normal;
}

/**
 * Rotate point around axis
 */
export function rotateAroundAxis(
  point: Vector3,
  axis: Vector3,
  angle: number
): Vector3 {
  const q = new Quaternion();
  q.setFromAxisAngle(axis, angle);
  const rotated = point.clone();
  rotated.applyQuaternion(q);
  return rotated;
}

/**
 * Check if angle difference is small enough to consider equal
 */
export function isAngleAlmostEqual(
  angle1: number,
  angle2: number,
  tolerance: number = 0.01
): boolean {
  const diff = Math.abs(angle1 - angle2);
  return diff < tolerance || diff > Math.PI * 2 - tolerance;
}

/**
 * Smoothstep interpolation (0 to 1)
 */
export function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

/**
 * Smootherstep interpolation (smoother curve)
 */
export function smootherstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}
