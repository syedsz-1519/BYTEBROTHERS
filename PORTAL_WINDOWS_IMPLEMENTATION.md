# Interactive Portal Windows Implementation

## Overview

The Interactive Portal Windows feature adds clickable 3D windows to the Byte Brothers corridor that display website content (Portfolio, Services, About, Contact) when clicked. The system uses Three.js with render-to-texture for efficient content display and raycasting for click detection.

## Architecture

### Components

#### 1. **RaycastEngine.ts** (`src/components/3d/RaycastEngine.ts`)
- Handles efficient hit testing for interactive 3D objects
- Manages click detection via raycasting
- Supports both mouse clicks and touch events
- Pools raycaster and vectors to minimize allocations

**Key Methods:**
- `registerObject(obj)` - Register object for raycasting
- `raycastFromMouse(clientX, clientY)` - Perform raycast from camera through mouse
- `dispose()` - Cleanup event listeners

#### 2. **WindowMesh.tsx** (`src/components/3d/WindowMesh.tsx`)
- Individual portal window with brass/steel frame and glass material
- Features smooth hover effects (glow, brightening)
- Supports click detection integration
- Properties:
  - Customizable frame color (default: brass 0xc9a876)
  - Customizable glass color (default: blue 0x4a8fd8)
  - Hover glow effects
  - Pulse animation when active
  - Spotlight accents

**Props:**
```typescript
interface WindowMeshProps {
  id: string;
  type: PortalContentType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  frameColor?: number;
  glassColor?: number;
  onClickWindow: (id: string, type: PortalContentType) => void;
  isActive?: boolean;
  animationProgress?: number;
}
```

#### 3. **PortalContent.tsx** (`src/components/3d/PortalContent.tsx`)
- Renders portal window content to canvas texture
- Implements lazy-load content rendering
- Uses OffscreenCanvas for performance (with fallback to HTMLCanvas)
- Renders content dynamically based on portal type

**Key Classes:**
- `ContentRenderer` - Manages canvas rendering and texture creation
- `usePortalContentTexture()` - Hook for accessing rendered textures

#### 4. **PortalSystem.tsx** (`src/components/3d/PortalSystem.tsx`)
- Main orchestration component for portal windows
- Manages portal state, animations, and lifecycle
- Enforces max 3 portals open simultaneously
- Provides context for nested components
- Auto-closes portals after timeout

**Context API:**
```typescript
interface PortalSystemContextType {
  openPortal: (type: PortalContentType, position: [number, number, number]) => void;
  closePortal: (id: string) => void;
  getPortalState: (id: string) => Portal | undefined;
}
```

#### 5. **usePortalManager.ts** (`src/hooks/usePortalManager.ts`)
- Portal state management hook
- Handles portal lifecycle (create, update, delete)
- Implements lazy content loading
- Manages portal queue (FIFO for max 3 portals)

**Key Functions:**
- `openPortal(type, position)` - Open new portal
- `closePortal(id)` - Close specific portal
- `closeOldestPortal()` - Close oldest portal (FIFO)
- `updatePortal(id, updates)` - Update portal properties

## Integration Guide

### Basic Setup

#### 1. Wrap Canvas with PortalSystem

```tsx
import { Canvas } from '@react-three/fiber';
import { PortalSystem } from '@components/3d/PortalSystem';
import HomeCorridor from '@components/home/HomeCorridor';

export function MyScene() {
  return (
    <Canvas>
      <PortalSystem>
        <HomeCorridor />
      </PortalSystem>
    </Canvas>
  );
}
```

#### 2. Add Windows to Corridor

```tsx
import { WindowMesh } from '@components/3d/WindowMesh';
import { usePortalSystem } from '@components/3d/PortalSystem';

function CorridorWithWindows() {
  const { openPortal } = usePortalSystem();

  const windows = [
    { id: 'w1', type: 'portfolio' as const, pos: [-2.5, 2, -10] },
    { id: 'w2', type: 'services' as const, pos: [0, 2, -10] },
    { id: 'w3', type: 'about' as const, pos: [2.5, 2, -10] },
  ];

  const handleWindowClick = (windowId: string, type: PortalContentType) => {
    const window = windows.find(w => w.id === windowId);
    if (window) {
      openPortal(type, window.pos);
    }
  };

  return (
    <group>
      {windows.map(w => (
        <WindowMesh
          key={w.id}
          id={w.id}
          type={w.type}
          position={w.pos}
          onClickWindow={handleWindowClick}
        />
      ))}
    </group>
  );
}
```

### Advanced Configuration

#### Custom Colors and Behavior

```tsx
<PortalSystem
  maxPortals={3}
  frameColor={0xc9a876}      // Brass
  glassColor={0x4a8fd8}      // Blue
  autoCloseDelay={10000}     // 10 seconds
>
  <YourScene />
</PortalSystem>
```

#### Portal Content Types

```typescript
type PortalContentType = 'portfolio' | 'services' | 'about' | 'contact';
```

Each type automatically renders appropriate content:
- **portfolio**: Portfolio projects and case studies
- **services**: Service offerings and capabilities
- **about**: About the company
- **contact**: Contact information and form

## Performance Optimizations

### 1. **Memoization**
- Geometries are memoized to avoid recreation
- Materials are memoized and reused
- Components use React.memo for render optimization

### 2. **Lazy Loading**
- Portal content loads only on first click
- Content rendering deferred with setTimeout
- Textures cached efficiently

### 3. **Raycasting Efficiency**
- Raycaster pooled (single instance, reused)
- Vectors pooled to minimize allocations
- Only intersects registered objects

### 4. **Render-to-Texture**
- Content rendered to canvas texture, not DOM
- OffscreenCanvas for off-main-thread rendering
- Single texture update per portal

### 5. **Animation**
- Uses requestAnimationFrame via useFrame
- Lerp animations instead of direct value changes
- Efficient state updates through React hook

## Performance Targets

- **60 FPS** with 3 open portals
- **<5ms** per-frame overhead for portal system
- **Lazy load** on first click (~500ms)
- **Memory**: ~2-3MB per portal (content + texture)

## Mobile Support

- Touch events supported via raycasting engine
- Responsive window sizing
- Optimized for mobile devices with reduced geometry complexity

## API Reference

### usePortalSystem Hook

```typescript
import { usePortalSystem } from '@components/3d/PortalSystem';

function MyComponent() {
  const { openPortal, closePortal, getPortalState } = usePortalSystem();

  const handleClick = () => {
    openPortal('portfolio', [0, 2, -10]);
  };

  return <button onClick={handleClick}>Open Portal</button>;
}
```

### usePortalManager Hook

```typescript
import { usePortalManager } from '@hooks/usePortalManager';

function PortalDebug() {
  const {
    portals,
    activeCount,
    maxPortals,
    openPortal,
    closePortal,
    closeOldestPortal,
  } = usePortalManager();

  console.log(`${activeCount}/${maxPortals} portals active`);
  portals.forEach(p => console.log(`Portal ${p.id}: ${p.type}`));
}
```

## Integration with Existing Scenes

### HomeCorridor Integration

Add to `src/components/home/HomeCorridor.tsx`:

```tsx
import { PortalSystem } from '@components/3d/PortalSystem';
import { WindowMesh } from '@components/3d/WindowMesh';

// Inside SceneInner component, wrap content:
<PortalSystem>
  <CamCtx.Provider value={camRef}>
    <Corridor />
    {/* ... existing bays ... */}
    
    {/* Add windows to corridors */}
    {[0, 2, 4].map((bayIdx) => (
      <WindowMesh
        key={`w-${bayIdx}`}
        id={`window-${bayIdx}`}
        type={['portfolio', 'services', 'about'][bayIdx % 3] as PortalContentType}
        position={[bayIdx === 0 ? -2.5 : bayIdx === 2 ? 0 : 2.5, 2, bayZ(bayIdx)]}
        onClickWindow={handleWindowClick}
      />
    ))}
  </CamCtx.Provider>
</PortalSystem>
```

### GalleryScene Integration

Add to `src/components/gallery/GalleryScene.tsx`:

```tsx
import { PortalSystem } from '@components/3d/PortalSystem';
import { WindowMesh } from '@components/3d/WindowMesh';

// Inside GallerySceneInner component:
<PortalSystem frameColor={0xc9a876} glassColor={0x4a8fd8}>
  <CameraPositionContext.Provider value={cameraRefRef.current}>
    <Corridor ... />
    <Bay ... />
    
    {/* Portal windows */}
    <WindowMesh
      id="gallery-w1"
      type="portfolio"
      position={[-2.5, 2.5, -10]}
      onClickWindow={handleWindowClick}
    />
    {/* ... more windows ... */}
  </CameraPositionContext.Provider>
</PortalSystem>
```

## Testing

### Unit Tests

Test individual components:
- `WindowMesh.test.tsx` - Window rendering and interactions
- `PortalSystem.test.tsx` - Portal state management
- `RaycastEngine.test.ts` - Raycasting hit detection

### Integration Tests

Test full portal workflow:
- Click window → Portal opens
- 3+ portals → Max enforcement
- Auto-close → Timeout behavior
- Lazy load → Content appears

### Performance Tests

Monitor:
- Frame rate with 3 portals open
- Memory usage per portal
- Click detection latency (<16ms)
- Content load time (<1s)

## Customization

### Custom Content Types

Extend `PortalContentType` and add to `portalLoaders` in `usePortalManager.ts`:

```typescript
const portalLoaders = {
  custom: async () => {
    const response = await fetch('/api/custom-content');
    return response.json();
  },
  // ... existing loaders ...
};
```

### Custom Materials and Colors

```tsx
<PortalSystem
  frameColor={0x2d5016}      // Custom green
  glassColor={0xff6b6b}      // Custom red
>
  <YourScene />
</PortalSystem>
```

### Custom Animations

Override animation speeds in `PortalSystem.tsx`:

```typescript
const newScale = THREE.MathUtils.lerp(portal.scale, targetScale, 0.25); // Faster
```

## Troubleshooting

### Portals Not Appearing
- Check PortalSystem wraps Canvas
- Verify WindowMesh position is visible
- Check console for render errors

### Click Detection Not Working
- Ensure raycasting engine registered objects
- Check canvas pointer-events CSS
- Verify window mesh has collision geometry

### Performance Issues
- Reduce number of windows
- Lower content texture resolution (512x680)
- Disable animations on mobile
- Check for memory leaks in cleanup

### Content Not Loading
- Verify portalLoaders have correct content
- Check async loader timeouts
- Inspect canvas context availability

## Future Enhancements

- [ ] WebGL render-to-texture (skip canvas intermediate)
- [ ] Portal animations (warp, dissolve effects)
- [ ] Multi-window interactions (linked portals)
- [ ] Dynamic content loading from API
- [ ] Portal touch gestures (swipe to close)
- [ ] Portal grouping/categories
- [ ] Save/restore portal state
- [ ] Portal search/filtering
