/**
 * RaycastEngine.ts
 * Efficient raycasting for portal window click detection in 3D corridor
 * Handles hit testing and click event propagation
 */

import * as THREE from 'three';

export interface RaycastResult {
  hit: boolean;
  distance: number;
  object: THREE.Object3D | null;
  point: THREE.Vector3 | null;
}

export interface RaycastEngineConfig {
  camera: THREE.Camera;
  canvas: HTMLCanvasElement;
}

/**
 * RaycastEngine manages efficient hit testing for interactive 3D objects
 * Uses pooled raycaster and vectors to minimize allocations
 */
export class RaycastEngine {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private intersectables: THREE.Object3D[] = [];
  private canvas: HTMLCanvasElement;
  private camera: THREE.Camera;
  public onHit?: (object: THREE.Object3D, point: THREE.Vector3) => void;

  constructor(config: RaycastEngineConfig) {
    this.canvas = config.canvas;
    this.camera = config.camera;
    this.setupEventListeners();
  }

  /**
   * Register an object for raycasting hit detection
   */
  public registerObject(obj: THREE.Object3D) {
    if (!this.intersectables.includes(obj)) {
      this.intersectables.push(obj);
    }
  }

  /**
   * Unregister an object from raycasting
   */
  public unregisterObject(obj: THREE.Object3D) {
    const idx = this.intersectables.indexOf(obj);
    if (idx !== -1) {
      this.intersectables.splice(idx, 1);
    }
  }

  /**
   * Perform a raycast from camera through mouse position
   */
  public raycastFromMouse(clientX: number, clientY: number): RaycastResult {
    // Normalize mouse coordinates to clip space
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Test intersections
    const intersects = this.raycaster.intersectObjects(this.intersectables, true);

    if (intersects.length > 0) {
      const first = intersects[0];
      return {
        hit: true,
        distance: first.distance,
        object: first.object,
        point: first.point.clone(),
      };
    }

    return {
      hit: false,
      distance: Infinity,
      object: null,
      point: null,
    };
  }

  /**
   * Setup mouse/touch event listeners for click detection
   */
  private setupEventListeners() {
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('touchstart', this.handleTouch);
  }

  private handleClick = (e: MouseEvent) => {
    const result = this.raycastFromMouse(e.clientX, e.clientY);
    if (result.hit && result.object) {
      // Emit custom callback instead of dispatchEvent
      this.onHit?.(result.object, result.point!);
    }
  };

  private handleTouch = (e: TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const result = this.raycastFromMouse(touch.clientX, touch.clientY);
    if (result.hit && result.object) {
      // Emit custom callback instead of dispatchEvent
      this.onHit?.(result.object, result.point!);
    }
  };



  /**
   * Cleanup event listeners
   */
  public dispose() {
    this.canvas.removeEventListener('click', this.handleClick);
    this.canvas.removeEventListener('touchstart', this.handleTouch);
  }
}
