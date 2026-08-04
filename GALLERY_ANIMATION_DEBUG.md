# Gallery Animation Debug Guide

## Changes Made:

### 1. **Rebranding Complete** ✅
- Replaced all instances of "White Brothers" with "Byte Brothers"
- Updated email from `studio@whitebrothers.dev` to `studio@bytebrothers.dev`
- Updated in:
  - `src/components/gallery/ScrollPanels.tsx`
  - `.kiro/docs/WEBSITE_SPECIFICATION.md`
  - `BYTEBROTHERS/WORKFLOW_GUIDE.md`

### 2. **Fixed Scroll Reset Issue** ✅
- Changed `GalleryPage.tsx` to only reset scroll on first load
- Uses `useRef` flag to prevent scroll reset on tab switches
- This was preventing scroll progress from updating properly

### 3. **Improved Scroll Progress Calculation** ✅
- Updated `useScrollProgress.ts` to use `document.documentElement.scrollHeight`
- Added resize event listener
- Better scroll position calculation: `currentScroll / maxScroll`

### 4. **Fixed Bay Component Context** ✅
- Bay now uses `useCameraPosition()` hook from context
- Properly receives camera position updates
- Spotlight intensity updates based on camera distance

## Commits Pushed:
```
0fea7e9 - fix(gallery): fix scroll reset issue and update email to bytebrothers
fac768e - rebrand: replace all 'White Brothers' with 'Byte Brothers' throughout website
76a6603 - fix(gallery): correct scroll progress calculation, camera animation, and add gallery nav item
```

## Testing Checklist:

### Basic Functionality:
- [ ] Gallery tab appears in navbar
- [ ] Clicking Gallery tab navigates to gallery page
- [ ] Page loads without errors
- [ ] 3D corridor renders (black void background should show)

### Scroll Animation:
- [ ] Scrolling down moves camera forward (positive Z direction)
- [ ] Text panels fade in/out as you scroll
- [ ] HUD progress bar updates with scroll
- [ ] "Scroll to walk in" cue disappears after initial scroll

### 3D Rendering:
- [ ] Corridor walls/floor/ceiling are visible
- [ ] Spotlights turn on/off as camera approaches/leaves bays
- [ ] Panel materials have glowing effect (brass/steel colors)
- [ ] Fog effect is visible in distance

### Performance:
- [ ] No console errors
- [ ] Smooth 60 FPS on desktop
- [ ] 30 FPS on mobile (target)
- [ ] No jank on scroll fling

## If Animation Still Not Working:

### Debug Steps:
1. **Open Browser DevTools Console (F12)**
   - Check for any JavaScript errors
   - Look for Three.js warnings

2. **Check Scroll Progress:**
   ```javascript
   // In console, add this to monitor scroll progress
   setInterval(() => {
     const track = document.getElementById('scroll-track');
     console.log('Scroll progress:', window.scrollY, '/', track?.scrollHeight);
   }, 100);
   ```

3. **Verify Canvas is Rendering:**
   - Look for `<canvas>` element in DevTools Elements tab
   - Should be fixed positioned with z-index: 1
   - Should cover full viewport

4. **Check Scroll Track:**
   - Should be `height: 600vh` (very tall)
   - Allows page to scroll
   - Prevents premature scroll reset

### Common Issues:

**Issue: Black screen, no 3D scene**
- Check browser console for WebGL errors
- Verify `<Canvas>` component is rendering
- Check if Three.js is loaded

**Issue: Camera not moving**
- Verify scroll progress is updating (use debug console command)
- Check if `useFrame` loop is running
- Inspect `GallerySceneInner` component in React DevTools

**Issue: Text panels not showing**
- Verify `ScrollPanels` component renders
- Check if scroll-track element exists
- Verify scroll progress calculation in hook

**Issue: Spotlights not lighting up**
- Check if bays are positioned correctly
- Verify camera position is being passed to Bay components
- Check spotlight intensity calculation: `1 - dist/6.5`

## Next Steps for Full Fix:

1. **Test Locally:**
   - Run `npm run dev` and test gallery tab
   - Check console for errors
   - Verify scroll behavior

2. **If Scroll Animation Issues Persist:**
   - May need to review React Three Fiber hook dependencies
   - Consider using `useEffect` to sync scroll with camera
   - Check if `setCameraUpdate` state changes are causing re-renders

3. **Performance Optimization:**
   - Implement RAF-based scroll tracking instead of event listener
   - Memoize corridor geometry properly
   - Consider using Zustand for global scroll state

4. **Spline Integration (Phase 2):**
   - Add Spline models to Bay components
   - Implement loading states
   - Test with async model loading

## File References:
- `src/pages/GalleryPage.tsx` - Main gallery page
- `src/components/gallery/GalleryScene.tsx` - 3D canvas and camera
- `src/components/gallery/Corridor.tsx` - Corridor geometry
- `src/components/gallery/Bay.tsx` - Individual bays
- `src/components/gallery/ScrollPanels.tsx` - Text overlays
- `src/hooks/useScrollProgress.ts` - Scroll progress tracking
- `src/components/Navbar.tsx` - Navigation menu

## Support:
If animation still doesn't work after these fixes, additional debugging may be needed:
- Check React Three Fiber version compatibility
- Verify Tailwind CSS is not interfering with canvas positioning
- Test with minimal example to isolate issue
