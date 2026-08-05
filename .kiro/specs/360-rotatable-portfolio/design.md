# Design: 360-Degree Rotatable Portfolio Website

## Architecture Overview

### High-Level Component Hierarchy

```
App
├── RotatablePortfolioPage
│   ├── RotablePortfolioSphere (Canvas)
│   │   ├── Three.js Scene Setup
│   │   ├── SphereMesh (Renderer)
│   │   ├── SphereContent (Dynamic Content)
│   │   ├── Lighting System
│   │   ├── Camera Controller
│   │   └── Particle System (optional)
│   ├── RotationControls (Input Handler)
│   │   ├── MouseController
│   │   ├── TouchController
│   │   └── GyroscopeController
│   ├── SphereHUD (Overlay UI)
│   │   ├── Instructions
│   │   ├── Current Rotation Indicator
│   │   └── Zoom Controls
│   └── ContentModal (Detail View)
│       └── Selected Item Details
```

## Core Components

### 1. RotatablePortfolioSphere Component

**Purpose**: Main Canvas component for rendering the 360-degree sphere

**Type**: React Three Fiber Canvas component

**Interface**:
```typescript
interface RotatablePortfolioSphereProps {
  sphereType: 'portfolio' | 'services' | 'about' | 'contact' | 'team';
  content: SphereContentItem[];
  onContentSelect: (item: SphereContentItem) => void;
  autoRotate?: boolean;
  zoom?: number;
  theme?: 'dark' | 'light';
  reducedMotion?: boolean;
}

interface SphereContentItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  position: Vector3; // Position on sphere
  rotation?: Euler;
  scale?: number;
  metadata?: Record<string, any>;
}
```

**Algorithm**:
1. Initialize Three.js scene with PerspectiveCamera positioned at origin
2. Create sphere mesh (IcosahedronGeometry for detail)
3. Position content items on sphere surface using spherical coordinates
4. Set up lighting: Directional light + ambient light + point lights
5. Render loop: Update rotation quaternion, apply inertia, render frame
6. Event handlers: Attach input listeners to canvas element

**Key Methods**:
- `getSphericalCoords(index, total)`: Calculate position for Nth item on sphere
- `updateRotation(deltaQuaternion)`: Apply rotation delta to sphere
- `applyInertia()`: Dampen rotation over time with exponential decay
- `raycastContent()`: Detect which content item is under cursor/touch

### 2. RotationControls Component

**Purpose**: Unified input handler for mouse, touch, and gyroscope

**Type**: Custom React Hook + event manager

**Interface**:
```typescript
interface RotationControlsOptions {
  enabled: boolean;
  dampingFactor?: number; // 0.05
  inertia?: boolean;
  gyroscope?: boolean;
  sensitivity?: number; // 0.005
  maxAngularVelocity?: number; // 0.1
}

interface InputState {
  isDragging: boolean;
  previousPosition: { x: number; y: number };
  currentDelta: { x: number; y: number };
  angularVelocity: Euler;
}
```

**Algorithm**:
1. Mouse Input:
   - On pointerdown: Record initial position, set isDragging=true
   - On pointermove: Calculate delta, convert to rotation
   - On pointerup: Calculate velocity from final delta, apply inertia
   
2. Touch Input:
   - On touchstart: Record initial touch position
   - On touchmove: Calculate multi-touch delta (average)
   - On touchend: Calculate velocity, apply inertia
   
3. Gyroscope Input (optional):
   - Request DeviceOrientationEvent permission
   - On deviceorientation: Apply incremental rotation from alpha, beta, gamma

4. Inertia Application:
   - Each frame: velocity *= (1 - dampingFactor)
   - Apply velocity to rotation
   - Stop when velocity < threshold

**Key Methods**:
- `onPointerDown/Move/Up()`: Mouse input handlers
- `onTouchStart/Move/End()`: Touch input handlers
- `onDeviceOrientation()`: Gyroscope handler
- `calculateRotation(deltaX, deltaY)`: Convert 2D mouse delta to 3D rotation

### 3. SphereContent Component

**Purpose**: Render dynamic content positioned on sphere surface

**Type**: React Three Fiber component with Suspense

**Interface**:
```typescript
interface SphereContentProps {
  items: SphereContentItem[];
  sphereRadius: number;
  onItemSelect: (item: SphereContentItem) => void;
  focusedItemId?: string;
}

interface ContentRenderer {
  renderCard(item: SphereContentItem, position: Vector3): JSX.Element;
  renderBillboard(item: SphereContentItem, position: Vector3): JSX.Element;
  renderImage(url: string, position: Vector3): JSX.Element;
}
```

**Algorithm**:
1. For each content item:
   - Calculate 3D position on sphere surface using spherical coordinates
   - Create billboard group (always faces camera)
   - Add image/text mesh with proper scale based on distance
   - Attach click handler with raycasting
   
2. LOD Management:
   - Distance to camera < 5 units: Show high-detail card
   - Distance 5-15 units: Show medium-detail thumbnail
   - Distance > 15 units: Show low-detail dot with label

3. Visibility Culling:
   - Only render items within camera frustum
   - Use frustum.containsPoint() check

**Key Methods**:
- `positionItemOnSphere(index, total)`: Calculate spherical coordinates
- `createBillboard(item)`: Create billboard that faces camera
- `handleContentClick(item)`: Trigger selection with animation

### 4. SphereCameraController

**Purpose**: Manage camera position and transitions

**Type**: React Hook + Three.js Camera behavior

**Interface**:
```typescript
interface CameraState {
  position: Vector3;
  lookAt: Vector3;
  fov: number;
  near: number;
  far: number;
  zoom: number;
}

interface CameraTransition {
  from: CameraState;
  to: CameraState;
  duration: number;
  easing: (t: number) => number;
}
```

**Algorithm**:
1. Initialize camera:
   - Position: (0, 0, 15) - Outside sphere looking at origin
   - FOV: 75 degrees
   - Aspect: window.innerWidth / window.innerHeight
   - Near: 0.1, Far: 1000

2. On zoom:
   - Calculate new FOV: 75 - (zoomLevel * 10)
   - Or move camera along lookAt vector

3. On sphere selection:
   - Transition camera to focus on selected item
   - Duration: 0.8 seconds with easeInOutQuad
   - Rotate to face item's normal direction

**Key Methods**:
- `updateAspectRatio()`: On window resize
- `transitionTo(targetState)`: Smooth camera movement
- `resetView()`: Return to default position

### 5. RotatablePortfolioPage Container

**Purpose**: Page component integrating all sphere functionality

**Type**: React functional component

**Structure**:
```typescript
function RotatablePortfolioPage() {
  const [sphereType, setSphereType] = useState<SphereType>('portfolio');
  const [selectedItem, setSelectedItem] = useState<SphereContentItem | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  // Get content based on sphereType
  const content = getSphereContent(sphereType);
  
  return (
    <>
      <Canvas>
        <RotatablePortfolioSphere
          sphereType={sphereType}
          content={content}
          onContentSelect={setSelectedItem}
          autoRotate={autoRotate}
          zoom={zoom}
        />
      </Canvas>
      <RotationControlsUI
        onAutoRotateToggle={setAutoRotate}
        onZoomChange={setZoom}
      />
      {selectedItem && (
        <ContentModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
```

## Data Flow

### Content Population Pipeline

```
studioData.ts (Static Data)
    ↓
getSphereContent(type) (Transform)
    ↓
RotatablePortfolioSphere (Props)
    ↓
SphereContent (Render Items)
    ↓
SphericalCoordinateCalculator (Position)
    ↓
Three.js Meshes (Render)
```

### Rotation State Flow

```
User Input (Mouse/Touch/Gyro)
    ↓
RotationControls (Normalize)
    ↓
RotatablePortfolioSphere (Apply)
    ↓
Three.js Quaternion (Update Rotation)
    ↓
Render Loop (Re-render Scene)
    ↓
Canvas Output (Display to User)
```

## Technical Implementation Details

### Spherical Coordinate System

**Conversion Formula**:
```
x = radius * sin(phi) * cos(theta)
y = radius * sin(phi) * sin(theta)
z = radius * cos(phi)

Where:
- phi: Polar angle [0, π]
- theta: Azimuthal angle [0, 2π]
- radius: Distance from origin
```

**For N items on sphere**:
```typescript
function getSphericalCoordinates(index: number, total: number): Vector3 {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  
  const x = Math.sin(phi) * Math.cos(theta) * SPHERE_RADIUS;
  const y = Math.sin(phi) * Math.sin(theta) * SPHERE_RADIUS;
  const z = Math.cos(phi) * SPHERE_RADIUS;
  
  return new Vector3(x, y, z);
}
```

### Rotation Math with Quaternions

**Mouse to Rotation Mapping**:
```typescript
const deltaX = currentPos.x - prevPos.x; // pixels
const deltaY = currentPos.y - prevPos.y; // pixels

const angleX = (deltaX / window.innerWidth) * Math.PI * 2 * sensitivity;
const angleY = (deltaY / window.innerHeight) * Math.PI * 2 * sensitivity;

// Create quaternions for each axis
const qX = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), angleX);
const qY = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), angleY);

// Combine rotations
currentRotation.multiplyQuaternions(qX, qY);
sphereMesh.quaternion.copy(currentRotation);
```

### Inertia/Damping Algorithm

**Exponential Decay**:
```typescript
function applyInertia(deltaTime: number) {
  const dampingFactor = 0.95; // per frame
  
  angularVelocity.multiplyScalar(Math.pow(dampingFactor, deltaTime * 60));
  
  const rotationDelta = new Quaternion()
    .setFromEuler(new Euler(
      angularVelocity.x * deltaTime,
      angularVelocity.y * deltaTime,
      angularVelocity.z * deltaTime
    ));
  
  currentRotation.multiplyQuaternions(rotationDelta, currentRotation);
  
  // Stop if velocity is negligible
  if (angularVelocity.length() < 0.001) {
    angularVelocity.set(0, 0, 0);
  }
}
```

### Performance Optimizations

**1. Frustum Culling**:
```typescript
const frustum = new Frustum();
frustum.setFromProjectionMatrix(camera.projectionMatrix);

items.forEach(item => {
  if (frustum.containsPoint(item.position)) {
    renderItem(item);
  }
});
```

**2. LOD System**:
```typescript
function getLODLevel(distance: number): LODLevel {
  if (distance < 5) return 'high';
  if (distance < 15) return 'medium';
  return 'low';
}
```

**3. Object Pooling for Particles** (if used):
```typescript
class ParticlePool {
  private particles: Particle[] = [];
  private activeParticles: Particle[] = [];
  
  getParticle(): Particle {
    return this.particles.pop() || new Particle();
  }
  
  returnParticle(p: Particle): void {
    this.activeParticles = this.activeParticles.filter(x => x !== p);
    this.particles.push(p);
  }
}
```

## Styling & Theming

### 3D Material Properties

```typescript
const sphereMaterial = new MeshPhysicalMaterial({
  color: theme === 'dark' ? 0x1a1a1d : 0xf8f9fa,
  metalness: 0.3,
  roughness: 0.4,
  envMapIntensity: 1.0,
});

const contentMaterial = new MeshStandardMaterial({
  color: theme === 'dark' ? 0x3b82f6 : 0x2563eb,
  metalness: 0.1,
  roughness: 0.3,
  emissive: 0x1e40af,
  emissiveIntensity: 0.2,
});
```

### Lighting Setup

```typescript
// Directional light (sun)
const dirLight = new DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Ambient light
const ambLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambLight);

// Point light for focus
const pointLight = new PointLight(0x3b82f6, 1, 50);
pointLight.position.set(0, 0, 20);
scene.add(pointLight);
```

## Error Handling & Edge Cases

### WebGL Fallback
- Detect WebGL support with canvas.getContext('webgl')
- Fallback to 2D canvas grid view if WebGL unavailable
- Still provide interactive content selection with 2D layout

### Performance Degradation
- Monitor frame rate using requestAnimationFrame delta time
- If FPS < 30 on desktop, disable particles and reduce LOD detail
- If FPS < 20 on mobile, reduce sphere mesh complexity
- Warn user if unable to maintain 30 FPS

### Content Overflow
- If > 100 items: Group into categories, show only visible category
- If image fails to load: Show placeholder with fallback color
- If text too long: Truncate with ellipsis, show full in tooltip

### Reduced Motion Support
```typescript
if (prefersReducedMotion) {
  // Disable auto-rotation
  autoRotate = false;
  
  // Disable inertia momentum
  dampingFactor = 1.0; // Stop immediately
  
  // Use instant transitions instead of animations
  transitionDuration = 0;
}
```

## Browser Compatibility Matrix

| Browser | Desktop | Mobile | WebGL 2.0 | Status |
|---------|---------|--------|-----------|--------|
| Chrome  | ✓       | ✓      | ✓         | Full   |
| Firefox | ✓       | ✓      | ✓         | Full   |
| Safari  | ✓       | ✓      | ~         | Partial|
| Edge    | ✓       | N/A    | ✓         | Full   |
| Samsung Internet | N/A | ✓ | ✓         | Full   |

## Testing Strategy

### Unit Tests
- Spherical coordinate calculations
- Quaternion rotation math
- Inertia decay algorithm
- Content positioning algorithm

### Integration Tests
- Content loading and population
- Input handling (mouse, touch, gyro)
- Camera transitions
- Modal interactions

### E2E Tests
- Landing on page and seeing sphere rotate
- Selecting content and opening modal
- Switching between portfolio types
- Responsive behavior on different screen sizes

### Performance Tests
- Frame rate monitoring (target 60 FPS desktop, 30 FPS mobile)
- Memory profiling for asset loading
- Input latency measurement
- Texture atlas efficiency

## Accessibility Considerations

1. **Keyboard Navigation**
   - Tab: Cycle through content items
   - Arrow keys: Rotate sphere
   - Enter/Space: Select focused item
   - Escape: Close modal

2. **Screen Reader**
   - Announce sphere type on load
   - Announce selected item title and description
   - Provide context for current rotation position

3. **Color Contrast**
   - Text on 3D surfaces minimum 4.5:1 ratio
   - Glow effects sufficient to indicate focus

4. **Animation**
   - Respect prefers-reduced-motion media query
   - Disable auto-rotation and momentum
   - Use instant transitions
