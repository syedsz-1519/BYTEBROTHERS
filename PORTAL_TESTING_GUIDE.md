# Portal Windows - Testing & Validation Guide

## Manual Testing Checklist

### 1. Component Rendering

- [ ] WindowMesh renders with frame and glass
- [ ] Frame color visible and correct
- [ ] Glass material has reflective appearance
- [ ] Windows appear at correct positions
- [ ] Multiple windows visible simultaneously

### 2. Hover Interactions

- [ ] Hover over window - glow effect activates
- [ ] Frame emits soft light on hover
- [ ] Glass opacity increases slightly
- [ ] Spotlight intensity increases
- [ ] Effects smooth and not jarring
- [ ] Hover effects work on multiple windows

### 3. Click Interactions

- [ ] Window responds to click
- [ ] Click opens portal with correct content type
- [ ] Portal appears near window
- [ ] Multiple portals can open (up to 3)
- [ ] Click works on different windows
- [ ] Mobile touch events work (tap on window)

### 4. Portal Opening

- [ ] Portal content loads (slight delay)
- [ ] Content text visible
- [ ] Portal has smooth entrance animation
- [ ] Portal scales up smoothly
- [ ] Opacity transitions from 0 to 1
- [ ] Portal positioned correctly
- [ ] All 4 content types display correctly:
  - [ ] Portfolio
  - [ ] Services
  - [ ] About
  - [ ] Contact

### 5. Portal State Management

- [ ] First portal opens successfully
- [ ] Second portal opens (now 2 open)
- [ ] Third portal opens (now 3 open)
- [ ] Fourth click - oldest portal closes automatically
- [ ] Max 3 portals enforced
- [ ] Portal IDs tracked correctly
- [ ] Portal creation timestamps correct

### 6. Auto-Close Behavior

- [ ] Portals remain open for ~10 seconds
- [ ] Portals auto-close after timeout
- [ ] Auto-close doesn't interfere with active portals
- [ ] Closing animation smooth
- [ ] Opacity fades to 0
- [ ] Scale shrinks back to 0

### 7. Performance

- [ ] 60 FPS with 0 portals open
- [ ] 60 FPS with 1 portal open
- [ ] 60 FPS with 2 portals open
- [ ] 60 FPS with 3 portals open
- [ ] No frame stuttering during animations
- [ ] No memory leaks on repeated open/close
- [ ] Mobile device performance acceptable (30+ FPS)

### 8. Responsive Design

- [ ] Desktop (1920px): Windows sized correctly
- [ ] Tablet (768px): Windows scaled appropriately
- [ ] Mobile (375px): Windows readable
- [ ] Touch targets large enough (>44px)
- [ ] Content readable at all scales
- [ ] No horizontal scroll
- [ ] No cut-off content

### 9. Visual Quality

- [ ] Frame material looks metallic
- [ ] Glass has realistic reflections
- [ ] Content text is crisp and readable
- [ ] Colors match design specification
- [ ] Lighting realistic and flattering
- [ ] Shadows appropriate
- [ ] Emissive effects not over-bright
- [ ] No visible artifacts or glitches

### 10. Integration

- [ ] HomeCorridor scene integrates smoothly
- [ ] GalleryScene integrates smoothly
- [ ] Existing geometry not affected
- [ ] Lighting not disrupted
- [ ] Camera movement still smooth
- [ ] No console errors
- [ ] No TypeScript compilation errors

### 11. Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### 12. Error Handling

- [ ] Content fails to load gracefully
- [ ] Canvas context errors handled
- [ ] Window creation with invalid position works
- [ ] Console shows no unhandled exceptions
- [ ] Memory cleanup on unmount
- [ ] Event listeners removed properly

## Automated Testing Strategy

### Unit Tests

#### WindowMesh.test.tsx
```typescript
describe('WindowMesh', () => {
  test('renders with correct position', () => {
    const { container } = render(
      <Canvas>
        <WindowMesh 
          id="test" 
          type="portfolio" 
          position={[0, 0, 0]} 
          onClickWindow={jest.fn()} 
        />
      </Canvas>
    );
    // Verify mesh exists and positioned correctly
  });

  test('hover effects activate on mouse enter', () => {
    const { container } = render(...);
    // Verify emissive intensity increases
  });

  test('click handler called on click', () => {
    const mockClick = jest.fn();
    // Fire click event
    // Verify mockClick called with correct args
  });

  test('material colors applied correctly', () => {
    const { container } = render(
      <WindowMesh frameColor={0xff0000} glassColor={0x00ff00} ... />
    );
    // Verify material colors match
  });

  test('animation frame updates scale and opacity', () => {
    // Verify lerp animation works
    // Scale should go from 0 to 1
    // Opacity should go from 0 to 1
  });
});
```

#### PortalSystem.test.tsx
```typescript
describe('PortalSystem', () => {
  test('context provides open/close functions', () => {
    const { openPortal, closePortal } = usePortalSystem();
    expect(typeof openPortal).toBe('function');
    expect(typeof closePortal).toBe('function');
  });

  test('enforces max 3 portals', () => {
    const { portals } = usePortalManager();
    // Open 4 portals
    // Verify only 3 remain
  });

  test('auto-closes oldest portal when max reached', () => {
    // Open portal 1, 2, 3
    // Verify all 3 open
    // Open portal 4
    // Verify portal 1 closed
    // Verify portals 2, 3, 4 open
  });

  test('animates portal scale and opacity', () => {
    // Open portal
    // Check frame 1: scale near 0
    // Check frame 30: scale approaching 1
    // Verify lerp animation
  });

  test('auto-closes after timeout', (done) => {
    const { openPortal, portals } = usePortalManager();
    openPortal('portfolio', [0, 0, 0]);
    setTimeout(() => {
      expect(portals).toHaveLength(0);
      done();
    }, 11000); // Just after 10s auto-close
  });
});
```

#### usePortalManager.test.ts
```typescript
describe('usePortalManager', () => {
  test('opens portal with correct properties', () => {
    const { openPortal, getPortal } = usePortalManager();
    openPortal('portfolio', [1, 2, 3]);
    const portal = getPortal('portal-0');
    expect(portal?.type).toBe('portfolio');
    expect(portal?.position).toEqual([1, 2, 3]);
    expect(portal?.isLoading).toBe(true);
  });

  test('lazy loads content asynchronously', (done) => {
    const { openPortal, getPortal } = usePortalManager();
    openPortal('services', [0, 0, 0]);
    const portal = getPortal('portal-0');
    expect(portal?.isLoading).toBe(true);
    
    setTimeout(() => {
      const updated = getPortal('portal-0');
      expect(updated?.isLoading).toBe(false);
      expect(updated?.content).toBeDefined();
      done();
    }, 600);
  });

  test('closes portal by ID', () => {
    const { openPortal, closePortal, portals } = usePortalManager();
    openPortal('portfolio', [0, 0, 0]);
    expect(portals).toHaveLength(1);
    closePortal(portals[0].id);
    expect(portals).toHaveLength(0);
  });

  test('updates portal properties', () => {
    const { openPortal, getPortal, updatePortal } = usePortalManager();
    openPortal('portfolio', [0, 0, 0]);
    const id = 'portal-0';
    updatePortal(id, { scale: 1.5, opacity: 0.8 });
    const portal = getPortal(id);
    expect(portal?.scale).toBe(1.5);
    expect(portal?.opacity).toBe(0.8);
  });
});
```

#### RaycastEngine.test.ts
```typescript
describe('RaycastEngine', () => {
  test('registers and unregisters objects', () => {
    const engine = new RaycastEngine({ camera: mockCamera, canvas: mockCanvas });
    const obj = new THREE.Mesh();
    engine.registerObject(obj);
    engine.unregisterObject(obj);
    // Verify object removed from intersectables
  });

  test('raycasts from mouse position', () => {
    const engine = new RaycastEngine({ camera: mockCamera, canvas: mockCanvas });
    const result = engine.raycastFromMouse(100, 100);
    expect(result).toHaveProperty('hit');
    expect(result).toHaveProperty('distance');
    expect(result).toHaveProperty('object');
    expect(result).toHaveProperty('point');
  });

  test('detects hit on registered object', () => {
    // Setup scene with object
    const result = engine.raycastFromMouse(centerX, centerY);
    expect(result.hit).toBe(true);
    expect(result.object).toBeDefined();
  });

  test('misses unregistered objects', () => {
    const unregistered = new THREE.Mesh();
    const result = engine.raycastFromMouse(centerX, centerY);
    expect(result.hit).toBe(false);
  });

  test('handles touch events', () => {
    const engine = new RaycastEngine({ ... });
    const mockCallback = jest.fn();
    engine.onHit = mockCallback;
    
    const touchEvent = new TouchEvent('touchstart', { 
      touches: [{ clientX: 100, clientY: 100 }]
    });
    canvas.dispatchEvent(touchEvent);
    
    expect(mockCallback).toHaveBeenCalled();
  });
});
```

### Integration Tests

#### Portal Opening Flow
```typescript
test('complete portal opening flow', async () => {
  // 1. Render scene with windows
  // 2. Click window
  // 3. Verify portal opens
  // 4. Verify content loads
  // 5. Verify animations complete
  // 6. Take screenshot
  // 7. Compare to baseline
});
```

#### Multi-Portal Behavior
```typescript
test('opening 4 portals closes oldest', async () => {
  // 1. Open portal 1, wait for animation
  // 2. Open portal 2, verify 2 open
  // 3. Open portal 3, verify 3 open
  // 4. Open portal 4, verify only 2-4 open (1 closed)
});
```

#### Performance Metrics
```typescript
test('maintains 60 FPS with 3 portals', async () => {
  // 1. Open 3 portals
  // 2. Monitor frame rate for 5 seconds
  // 3. Verify average FPS > 58
  // 4. Verify no frame drops below 50 FPS
});
```

## Visual Regression Testing

### Screenshots to Compare

- [ ] Desktop view with 0 portals
- [ ] Desktop view with 1 portal
- [ ] Desktop view with 3 portals
- [ ] Mobile view with 1 portal
- [ ] Hover state on window
- [ ] Portal opening animation frame 1
- [ ] Portal opening animation frame 10
- [ ] Portal opening animation final
- [ ] Portal closing animation frame 1
- [ ] Portal closing animation final

### Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- WindowMesh.test.tsx

# Run with coverage
npm test -- --coverage

# Visual regression baseline
npm run test:visual:baseline

# Visual regression compare
npm run test:visual

# E2E tests
npm run test:e2e
```

## Performance Profiling

### Metrics to Monitor

```typescript
// Frame time
const frameTime = 1000 / fps;
console.assert(frameTime < 16.67, 'Frame time exceeds 60 FPS budget');

// Memory usage
const memBefore = performance.memory.usedJSHeapSize;
openPortal('portfolio', [0, 0, 0]);
const memAfter = performance.memory.usedJSHeapSize;
const memDelta = memAfter - memBefore;
console.log(`Portal memory delta: ${(memDelta / 1024).toFixed(2)} KB`);

// Raycast time
const start = performance.now();
engine.raycastFromMouse(x, y);
const duration = performance.now() - start;
console.assert(duration < 1, 'Raycast took too long');

// Content load time
const contentStart = performance.now();
await contentLoader();
const contentDuration = performance.now() - contentStart;
console.log(`Content load: ${contentDuration.toFixed(0)}ms`);
```

### Profiling in Chrome DevTools

1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Perform actions (open portals, click windows)
5. Click Stop
6. Analyze:
   - Frame rate graph
   - JavaScript execution time
   - Rendering time
   - Paint timing

### Memory Profiling

1. Go to Memory tab
2. Take heap snapshot
3. Open 3 portals
4. Take another snapshot
5. Compare snapshots
6. Check for memory leaks

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab through windows
- [ ] Enter/Space to activate
- [ ] Escape to close portals
- [ ] Arrow keys to navigate (if applicable)

### Screen Reader

- [ ] Windows announced with type and label
- [ ] Portal content readable
- [ ] Close button labeled
- [ ] Status updates announced

### Color Contrast

- [ ] Frame color contrast meets WCAG AA
- [ ] Glass effect doesn't obscure text
- [ ] Text color contrast >= 4.5:1
- [ ] Focus indicators visible

### Mobile Accessibility

- [ ] Touch targets >= 44px
- [ ] Readable without zooming
- [ ] Orientation change works
- [ ] Haptic feedback on tap (if available)

## Deployment Checklist

Before deploying to production:

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Performance benchmarks met
- [ ] Visual regression tests pass
- [ ] Accessibility audit passed
- [ ] Mobile devices tested
- [ ] Browser compatibility verified
- [ ] Memory profiling clean
- [ ] Bundle size acceptable
- [ ] Documentation up to date
- [ ] TypeScript strict mode passes

## Monitoring in Production

### Error Tracking

```typescript
// Log uncaught errors
window.addEventListener('error', (e) => {
  console.error('Portal error:', e);
  // Send to error tracking service
});
```

### Performance Monitoring

```typescript
// Track metrics
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Performance:', entry.name, entry.duration);
    // Send to analytics
  }
});
observer.observe({ entryTypes: ['measure'] });
```

### Usage Analytics

```typescript
// Track portal usage
analytics.track('portal_opened', { type, position });
analytics.track('portal_closed', { duration });
```

## Known Issues & Workarounds

### OffscreenCanvas Not Available

**Issue**: Older browsers don't support OffscreenCanvas

**Workaround**: Fallback to HTMLCanvas
- System detects automatically
- Performance slightly lower
- Functionality identical

### Mobile Touch Event Latency

**Issue**: Touch events may lag on low-end devices

**Workaround**: 
- Reduce portal count
- Lower content texture resolution
- Disable animations on mobile

### Safari Glass Material

**Issue**: Glass material doesn't reflect in Safari

**Workaround**: 
- Use solid color fallback
- Adjust roughness/metalness
- Test on actual Safari device

## Continuous Integration

### GitHub Actions Example

```yaml
name: Portal Windows Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run test:e2e
```

## Success Criteria

✓ 60 FPS sustained with 3 portals
✓ <500ms portal open animation
✓ <500ms content load time
✓ All 4 content types display
✓ Max 3 portals enforced
✓ Auto-close after 10s
✓ Mobile touch supported
✓ No memory leaks
✓ All tests passing
✓ Accessibility compliant
