# Portal Windows - Quick Reference

## File Structure

```
src/components/3d/
├── RaycastEngine.ts          # Click detection & raycasting
├── WindowMesh.tsx             # Individual window component
├── PortalSystem.tsx           # Portal orchestration & state
├── PortalContent.tsx          # Content rendering to texture
├── InteractivePortals.tsx     # Wrapper for multiple windows
└── PortalWindowsExample.tsx   # Complete example

src/hooks/
└── usePortalManager.ts        # Portal state management hook
```

## Component Hierarchy

```
<PortalSystem>                 # Provides context & manages state
  <WindowMesh id="w1" />       # Portal window 1
  <WindowMesh id="w2" />       # Portal window 2
  <WindowMesh id="w3" />       # Portal window 3
  {children}                   # Your scene
</PortalSystem>
```

## Quick Integration (Copy-Paste Ready)

### 1. Wrap Canvas
```tsx
import { PortalSystem } from '@components/3d/PortalSystem';

<Canvas>
  <PortalSystem>
    <YourScene />
  </PortalSystem>
</Canvas>
```

### 2. Add Windows
```tsx
import { WindowMesh } from '@components/3d/WindowMesh';
import { usePortalSystem } from '@components/3d/PortalSystem';
import { PortalContentType } from '@hooks/usePortalManager';

function YourScene() {
  const { openPortal } = usePortalSystem();

  const handleClick = (id: string, type: PortalContentType) => {
    const pos = { 'w1': [-2.5, 2, -10], 'w2': [0, 2, -10] }[id];
    if (pos) openPortal(type, pos);
  };

  return (
    <>
      <WindowMesh id="w1" type="portfolio" position={[-2.5, 2, -10]} onClickWindow={handleClick} />
      <WindowMesh id="w2" type="services" position={[0, 2, -10]} onClickWindow={handleClick} />
    </>
  );
}
```

## API Quick Reference

### PortalSystem Props
```typescript
<PortalSystem
  maxPortals={3}              // Max concurrent portals (default: 3)
  frameColor={0xc9a876}       // Window frame color (default: brass)
  glassColor={0x4a8fd8}       // Window glass color (default: blue)
  autoCloseDelay={10000}      // Auto-close after ms (default: 10s)
>
```

### WindowMesh Props
```typescript
<WindowMesh
  id="w1"                        // Unique identifier
  type="portfolio"               // Content type
  position={[x, y, z]}          // 3D position
  rotation={[x, y, z]}          // 3D rotation (optional)
  scale={1}                      // Scale factor (optional)
  frameColor={0xc9a876}         // Frame color (optional)
  glassColor={0x4a8fd8}         // Glass color (optional)
  onClickWindow={callback}      // Click handler
  isActive={false}              // Animation state (optional)
  animationProgress={0}         // Animation value (optional)
/>
```

### usePortalSystem Hook
```typescript
const {
  openPortal,          // (type, position) => void
  closePortal,         // (id) => void
  getPortalState,      // (id) => Portal | undefined
} = usePortalSystem();
```

### usePortalManager Hook
```typescript
const {
  portals,             // Portal[]
  activeCount,         // number
  maxPortals,          // number
  openPortal,          // (type, position) => void
  closePortal,         // (id) => void
  closeOldestPortal,   // () => void
  getPortal,           // (id) => Portal | undefined
  updatePortal,        // (id, updates) => void
} = usePortalManager();
```

## Portal Content Types

```typescript
type PortalContentType = 
  | 'portfolio'  // Projects & case studies
  | 'services'   // Service offerings
  | 'about'      // Company info
  | 'contact'    // Contact form
```

## Color Palette

```typescript
// Frame Colors
0xc9a876 // Brass (default)
0xd4af37 // Gold
0xb87333 // Copper
0xc0c0c0 // Silver

// Glass Colors
0x4a8fd8 // Blue (default)
0x2f7bff // Bright blue
0xff6b6b // Red
0x2d5016 // Green
```

## Position Examples

```typescript
// Corridor-relative (bay-based)
const bayZ = (i: number) => START_Z - BAY_DEPTH * (i + 1) + BAY_DEPTH / 2;

// Wall positions
[-2.5, 2, bayZ(1)]  // Left wall, bay 1
[0, 2, bayZ(1)]     // Center, bay 1
[2.5, 2, bayZ(1)]   // Right wall, bay 1

// Multiple rows
[-2.5, 1.5, -10]    // Bottom left
[-2.5, 3, -10]      // Top left
```

## Common Tasks

### Open Portal from Button
```tsx
function PortfolioButton() {
  const { openPortal } = usePortalSystem();
  return (
    <button onClick={() => openPortal('portfolio', [0, 2, -10])}>
      View Portfolio
    </button>
  );
}
```

### List All Open Portals
```tsx
function PortalDebug() {
  const { portals } = usePortalManager();
  return (
    <div>
      {portals.map(p => (
        <div key={p.id}>{p.type}: {p.isLoading ? 'Loading...' : 'Ready'}</div>
      ))}
    </div>
  );
}
```

### Close All Portals
```tsx
function CloseAllButton() {
  const { portals } = usePortalManager();
  const { closePortal } = usePortalSystem();
  
  return (
    <button onClick={() => portals.forEach(p => closePortal(p.id))}>
      Close All
    </button>
  );
}
```

### Responsive Windows
```tsx
// Desktop: 3 windows
// Mobile: 1 window (larger)
const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
const windowScale = isDesktop ? 1 : 1.5;

<WindowMesh scale={windowScale} ... />
```

## Performance Checklist

- ✓ Memoized geometries & materials
- ✓ Lazy content loading (first click)
- ✓ Pooled raycaster & vectors
- ✓ Efficient state updates
- ✓ Auto-close limits memory
- ✓ Render-to-texture (not DOM)
- ✓ OffscreenCanvas for rendering
- ✓ Touch event support

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✓ | OffscreenCanvas available |
| Firefox | ✓ | OffscreenCanvas available |
| Safari | ✓ | Fallback to HTMLCanvas |
| Edge | ✓ | OffscreenCanvas available |
| Mobile | ✓ | Touch events supported |

## Troubleshooting

```tsx
// Debug: Log portal state
useEffect(() => {
  console.log('Portals:', portals);
}, [portals]);

// Debug: Log clicks
const handleClick = (id, type) => {
  console.log('Window clicked:', id, type);
  openPortal(type, pos);
};

// Debug: Performance
useFrame(({ clock }) => {
  const fps = 1 / clock.getDelta();
  if (fps < 55) console.warn('Low FPS:', fps);
});
```

## Next Steps

1. **Basic Setup**: Add 3 windows to corridor
2. **Test Clicks**: Verify portals open/close
3. **Customize**: Adjust colors & positions
4. **Scale Up**: Add more windows/corridors
5. **Optimize**: Monitor performance
6. **Polish**: Add animations & interactions

## Resources

- Full API Docs: `PORTAL_WINDOWS_IMPLEMENTATION.md`
- Integration Guide: `PORTAL_INTEGRATION_GUIDE.md`
- Example Implementation: `src/components/3d/PortalWindowsExample.tsx`
