# Portal Windows Integration Guide

## Quick Start

### Step 1: Wrap Your Scene with PortalSystem

In your Canvas component, wrap your scene with the `PortalSystem` provider:

```tsx
import { Canvas } from '@react-three/fiber';
import { PortalSystem } from '@components/3d/PortalSystem';
import { YourScene } from './YourScene';

export function App() {
  return (
    <Canvas>
      <PortalSystem maxPortals={3}>
        <YourScene />
      </PortalSystem>
    </Canvas>
  );
}
```

### Step 2: Add Portal Windows to Your Scene

Use the `WindowMesh` component to add interactive windows:

```tsx
import { WindowMesh } from '@components/3d/WindowMesh';
import { usePortalSystem } from '@components/3d/PortalSystem';
import { PortalContentType } from '@hooks/usePortalManager';

function MyScene() {
  const { openPortal } = usePortalSystem();

  const handleWindowClick = (windowId: string, type: PortalContentType) => {
    // Open portal at window position
    const positions = {
      'w1': [-2.5, 2, -10],
      'w2': [0, 2, -10],
      'w3': [2.5, 2, -10],
    } as Record<string, [number, number, number]>;

    openPortal(type, positions[windowId]);
  };

  return (
    <group>
      <WindowMesh
        id="w1"
        type="portfolio"
        position={[-2.5, 2, -10]}
        onClickWindow={handleWindowClick}
      />
      <WindowMesh
        id="w2"
        type="services"
        position={[0, 2, -10]}
        onClickWindow={handleWindowClick}
      />
      <WindowMesh
        id="w3"
        type="about"
        position={[2.5, 2, -10]}
        onClickWindow={handleWindowClick}
      />
    </group>
  );
}
```

## HomeCorridor Integration

### Location
`src/components/home/HomeCorridor.tsx`

### Implementation

Add portal windows to the `SceneInner` component:

```tsx
import { PortalSystem } from '@components/3d/PortalSystem';
import { WindowMesh } from '@components/3d/WindowMesh';
import { PortalContentType } from '@hooks/usePortalManager';

function SceneInner({ reducedMotion, visible }: { reducedMotion: boolean; visible: boolean }) {
  const { camera } = useThree();
  const camRef = useRef(new THREE.Vector3(0, START_Y, START_Z));
  const windowPositions = useRef<Record<string, [number, number, number]>>({
    'home-w1': [-2.5, 3, bayZ(1)],
    'home-w2': [0, 3, bayZ(1)],
    'home-w3': [2.5, 3, bayZ(1)],
    'home-w4': [-2.5, 3, bayZ(3)],
    'home-w5': [0, 3, bayZ(3)],
  });

  const handleWindowClick = useCallback(
    (windowId: string, type: PortalContentType) => {
      const pos = windowPositions.current[windowId];
      if (pos) {
        // Access portal system via context
        // This will be handled by PortalSystem wrapper
      }
    },
    []
  );

  // ... existing useFrame logic ...

  return (
    <PortalSystem maxPortals={3} frameColor={0xc9a876} glassColor={0x2f7bff}>
      <CamCtx.Provider value={camRef}>
        <Corridor />
        {Array.from({ length: NUM_BAYS }, (_, i) => (
          <Bay key={i} index={i} side={i % 2 === 0 ? -1 : 1} />
        ))}

        {/* Portal windows - placed at strategic bays */}
        <WindowMesh
          id="home-w1"
          type="portfolio"
          position={windowPositions.current['home-w1']}
          onClickWindow={handleWindowClick}
          frameColor={0xc9a876}
          glassColor={0x2f7bff}
        />
        <WindowMesh
          id="home-w2"
          type="services"
          position={windowPositions.current['home-w2']}
          onClickWindow={handleWindowClick}
          frameColor={0xc9a876}
          glassColor={0x2f7bff}
        />
        <WindowMesh
          id="home-w3"
          type="about"
          position={windowPositions.current['home-w3']}
          onClickWindow={handleWindowClick}
          frameColor={0xc9a876}
          glassColor={0x2f7bff}
        />

        {/* ... existing bays and geometry ... */}
      </CamCtx.Provider>
    </PortalSystem>
  );
}
```

## GalleryScene Integration

### Location
`src/components/gallery/GalleryScene.tsx`

### Implementation

Add portal windows to the `GallerySceneInner` component:

```tsx
import { PortalSystem } from '@components/3d/PortalSystem';
import { WindowMesh } from '@components/3d/WindowMesh';
import { PortalContentType } from '@hooks/usePortalManager';

function GallerySceneInner({ 
  baydepth = 14,
  numBays = 5,
  halfWidth = 5.2,
  height = 6.5,
  frameColors = [0xc9a876, 0x4a6fa5, 0xc9a876],
}) {
  const { camera } = useThree();
  const cameraRefRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.55, 4));
  // ... existing state ...

  const handleWindowClick = useCallback(
    (windowId: string, type: PortalContentType) => {
      // Portal positions coordinated with bays
      const galleryWindowPositions: Record<string, [number, number, number]> = {
        'gallery-w1': [-2.5, 2.5, -(baydepth * 0.5)],
        'gallery-w2': [0, 2.5, -(baydepth * 0.5)],
        'gallery-w3': [2.5, 2.5, -(baydepth * 0.5)],
        'gallery-w4': [-2.5, 2.5, -(baydepth * 2)],
        'gallery-w5': [0, 2.5, -(baydepth * 2)],
      };

      // Portal system will handle opening
    },
    [baydepth]
  );

  // ... existing useFrame and setup code ...

  return (
    <PortalSystem 
      maxPortals={3} 
      frameColor={0xc9a876} 
      glassColor={0x4a6fa5}
      autoCloseDelay={12000}
    >
      <CameraPositionContext.Provider value={cameraRefRef.current}>
        <Corridor baydepth={baydepth} numBays={numBays} halfWidth={halfWidth} height={height} />

        {/* Bays with frames */}
        {[0, 1, 2].map((i) => (
          <Bay
            key={`bay-${i}`}
            index={i}
            baydepth={baydepth}
            halfWidth={halfWidth}
            height={height}
            frameColor={frameColors[i % frameColors.length]}
          />
        ))}

        {/* Portal windows */}
        <WindowMesh
          id="gallery-w1"
          type="portfolio"
          position={[-2.5, 2.5, -(baydepth * 0.5)]}
          onClickWindow={handleWindowClick}
          frameColor={0xc9a876}
          glassColor={0x4a6fa5}
        />
        <WindowMesh
          id="gallery-w2"
          type="services"
          position={[0, 2.5, -(baydepth * 0.5)]}
          onClickWindow={handleWindowClick}
          frameColor={0xc9a876}
          glassColor={0x4a6fa5}
        />
        <WindowMesh
          id="gallery-w3"
          type="about"
          position={[2.5, 2.5, -(baydepth * 0.5)]}
          onClickWindow={handleWindowClick}
          frameColor={0xc9a876}
          glassColor={0x4a6fa5}
        />
      </CameraPositionContext.Provider>
    </PortalSystem>
  );
}
```

## Window Configuration

### Portal Types

```typescript
type PortalContentType = 'portfolio' | 'services' | 'about' | 'contact';
```

Each type renders specific content:

| Type | Content | Best For |
|------|---------|----------|
| `portfolio` | Project gallery and case studies | Showcase work |
| `services` | Service offerings and capabilities | Describe solutions |
| `about` | Company information and team | Build trust |
| `contact` | Contact form and information | Lead generation |

### Window Positioning

Position windows strategically along the corridor:

```typescript
// Bay-relative positioning
const bayZ = (i: number) => START_Z - BAY_DEPTH * (i + 1) + BAY_DEPTH / 2;

// Window positions (x, y, z)
const windows = [
  { id: 'w1', type: 'portfolio', position: [-2.5, 2, bayZ(1)] },   // Left wall
  { id: 'w2', type: 'services', position: [0, 2, bayZ(1)] },       // Center (if wide enough)
  { id: 'w3', type: 'about', position: [2.5, 2, bayZ(1)] },        // Right wall
  { id: 'w4', type: 'contact', position: [-2.5, 2, bayZ(4)] },     // Further down corridor
];
```

### Color Customization

```tsx
<PortalSystem
  frameColor={0xc9a876}      // Brass/gold (default)
  glassColor={0x4a8fd8}      // Blue (default)
>
  {/* Scene */}
</PortalSystem>

// Or per-window:
<WindowMesh
  id="w1"
  type="portfolio"
  position={[0, 2, -10]}
  frameColor={0xd4af37}      // Gold
  glassColor={0xff6b6b}      // Red
  onClickWindow={handleClick}
/>
```

Available colors:
- **Brass**: `0xc9a876`
- **Gold**: `0xd4af37`
- **Blue**: `0x4a8fd8`, `0x2f7bff`, `0x5ea1ff`
- **Copper**: `0xb87333`
- **Silver**: `0xc0c0c0`
- **Green**: `0x2d5016`

## Behavior Configuration

### Max Open Portals

Limit concurrent open portals:

```tsx
<PortalSystem maxPortals={3}>  {/* Default: 3 */}
  {/* Scene */}
</PortalSystem>
```

When max reached, oldest portal auto-closes to make room.

### Auto-Close Delay

Close portals automatically after timeout:

```tsx
<PortalSystem autoCloseDelay={10000}>  {/* 10 seconds, default */}
  {/* Scene */}
</PortalSystem>
```

Set to `Infinity` to disable auto-close.

## Hook Usage

### usePortalSystem

Access portal system from any component within the tree:

```tsx
import { usePortalSystem } from '@components/3d/PortalSystem';

function MyComponent() {
  const { openPortal, closePortal, getPortalState } = usePortalSystem();

  const handleOpenPortfolio = () => {
    openPortal('portfolio', [-2.5, 2, -10]);
  };

  const handleCloseAll = () => {
    // Get all portals and close them
    // (requires tracking via state)
  };

  return (
    <button onClick={handleOpenPortfolio}>
      View Portfolio
    </button>
  );
}
```

### usePortalManager

Direct portal state management:

```tsx
import { usePortalManager } from '@hooks/usePortalManager';

function PortalDebugPanel() {
  const {
    portals,
    activeCount,
    maxPortals,
    openPortal,
    closePortal,
    closeOldestPortal,
    getPortal,
    updatePortal,
  } = usePortalManager();

  return (
    <div>
      <p>Active: {activeCount}/{maxPortals}</p>
      <ul>
        {portals.map(p => (
          <li key={p.id}>
            {p.type} - {p.isLoading ? 'Loading...' : 'Ready'}
            <button onClick={() => closePortal(p.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Performance Tips

1. **Limit Windows**: Don't render more than 8-10 windows in a scene
2. **Memoize Positions**: Store window positions in `useRef` to avoid recalculation
3. **Defer Callbacks**: Use `useCallback` for click handlers
4. **Lazy Content**: Content loads only on first portal open (not on mount)
5. **Texture Resolution**: Content renders at 512x680 - suitable for distant viewing

## Styling Portal Content

Customize content appearance in `PortalContent.tsx`:

```typescript
// Modify ContentRenderer.renderContent() to change:
// - Font sizes
// - Colors
// - Layout
// - Typography
```

Example customizations:
```typescript
// Change title color
this.ctx.fillStyle = '#ff6b6b';  // Red instead of brass
this.ctx.font = 'bold 40px Arial';  // Larger title

// Add background pattern
const pattern = this.ctx.createPattern(...);
this.ctx.fillStyle = pattern;
```

## Debugging

### Check Portal State

Add debug output:

```tsx
function DebugPortals() {
  const { portals } = usePortalManager();

  useEffect(() => {
    portals.forEach(p => {
      console.log(`Portal ${p.id}:`, {
        type: p.type,
        isLoading: p.isLoading,
        position: p.position,
        scale: p.scale,
        opacity: p.opacity,
      });
    });
  }, [portals]);

  return null;
}
```

### Verify Click Detection

Check raycaster:

```tsx
// In RaycastEngine, add logging:
const result = this.raycastFromMouse(clientX, clientY);
console.log('Raycast hit:', result.hit, result.object?.name);
```

### Performance Monitoring

Monitor frame rate:

```tsx
useFrame(({ clock }) => {
  const deltaTime = clock.getDelta();
  const fps = 1 / deltaTime;
  if (fps < 55) {
    console.warn(`Low FPS: ${fps.toFixed(1)}`);
  }
});
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Portals don't appear | PortalSystem not wrapping scene | Wrap Canvas content with `<PortalSystem>` |
| Clicks don't work | Raycaster not registered | Ensure WindowMesh is child of PortalSystem group |
| Content blank | Loader failed silently | Check browser console for errors |
| Performance drops | Too many portals | Reduce `maxPortals` or window count |
| Texture corrupted | Canvas context failed | Fallback uses HTMLCanvas (less efficient) |

## Migration Checklist

- [ ] Import PortalSystem and WindowMesh
- [ ] Wrap scene with `<PortalSystem>`
- [ ] Add WindowMesh components to corridors
- [ ] Create handleWindowClick callbacks
- [ ] Test portal opening on window click
- [ ] Verify portal positioning in corridor
- [ ] Test mobile touch interaction
- [ ] Verify performance (60 FPS)
- [ ] Customize colors if needed
- [ ] Configure auto-close behavior
- [ ] Add custom content (optional)

## Next Steps

1. **Start Simple**: Add 3 windows to one corridor
2. **Test Interaction**: Click windows and verify portals open
3. **Adjust Positioning**: Move windows to desired locations
4. **Customize Content**: Update portal content in `usePortalManager.ts`
5. **Scale Up**: Add windows to additional corridors or scenes
6. **Optimize**: Monitor performance and adjust as needed

## Support

For issues or questions:
1. Check the PORTAL_WINDOWS_IMPLEMENTATION.md for detailed API reference
2. Review PortalWindowsExample.tsx for reference implementation
3. Check browser console for TypeScript/runtime errors
4. Verify all imports are correct
