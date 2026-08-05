# Implementation Plan: Immersive Dev Room Experience


## Tasks

- [x] 1. Shared constants, types, and utility functions
  - Create `src/components/home/DevRoomCorridor.tsx` skeleton exporting: `ROOM_DEPTH`, `ROOM_W`, `ROOM_H`, `NUM_ROOMS`, `TOTAL_DEPTH`, `START_Z`, `END_Z`, `ROOM_CENTRES`, `LERP`, `LERP_FOV`, `BOB_AMP`, `PANELS_PER_ROOM`, `RoomDefinition` interface, `ROOMS` palette table, `CamRef` type, `CamCtx` context, and `useCam()` hook
  - Implement `smoothstep(t: number): number` using Ken Perlin's formula `3t² − 2t³` in `src/utils/devRoomUtils.ts` and re-export from `DevRoomCorridor.tsx`
  - Implement `proximityFade(camZ, propZ, fadeRadius)` in `src/utils/devRoomUtils.ts`: guard `fadeRadius <= 0` returns `0`, compute `t = clamp(1 - |camZ - propZ| / fadeRadius, 0, 1)`, return `smoothstep(t)`
  - Implement pure `roomProgressCalc(scrollProgress)` function in `src/utils/devRoomUtils.ts` returning `{ roomIndex, blend, localT }` with all outputs clamped to their valid ranges
  - Write unit tests in `src/utils/__tests__/devRoomUtils.test.ts` verifying `smoothstep` boundary values and monotonicity, `proximityFade` boundary values and zero-radius guard, and `roomProgressCalc` boundary outputs
  - _Requirements: 3, 5, 16_

- [x] 2. `buildRoomGeometry` factory and `createMonitorTexture` handle
  - Implement `buildRoomGeometry(room: RoomDefinition): THREE.Group` in `src/utils/devRoomUtils.ts` creating floor, ceiling, left wall, right wall, and back wall meshes using `MeshStandardMaterial`, centred at `[0, ROOM_H / 2, room.roomZ]`
  - Extend `src/components/hero/monitorTexture.ts` to export `createMonitorTexture(content: MonitorContent): CanvasTextureHandle` supporting types `'code'`, `'terminal'`, and `'matrix'`; ensure `draw(time)` sets `texture.needsUpdate = true` and `dispose()` calls `texture.dispose()`
  - Write unit tests asserting `buildRoomGeometry` returns a group with at least 5 children, no NaN positions, all `MeshStandardMaterial` meshes, and does not throw for any valid `RoomDefinition`
  - _Requirements: 5, 10_

- [x] 3. `DevRoomCorridor` shell — Canvas, Suspense, SceneInner frame loop, and fog controller
  - Complete `DevRoomCorridor.tsx` public component: fixed-position `div` (`100vw × 100vh`, `zIndex:1`, `pointerEvents:none`), opacity driven by `visible` prop with `transition: opacity 0.5s ease`, and `<Canvas dpr={[1, 1.5]}>` inside
  - Implement `FallbackBox` component: a `<mesh>` at `[0, 1, START_Z - 5]` with `boxGeometry(2,2,2)` and `meshStandardMaterial color="#333"` shown while GLBs load inside `<Suspense fallback={<FallbackBox />}>`
  - Implement `SceneInner` with `useFrame` loop: read `getScrollProgress()`, compute target Z/Y/FOV via lerp between adjacent room definitions, apply lerp factor `LERP`/`LERP_FOV` or snap (when `reducedMotion`), add sinusoidal bob (`sin(elapsedTime * 1.1) * BOB_AMP`) when not `reducedMotion`, clamp FOV to `[45, 65]`, call `camera.updateProjectionMatrix()`, and update `camRef`
  - Implement fog/ambient cross-fade in `SceneInner useFrame`: lerp `scene.fog.color`, `fog.near`, `fog.far`, `ambientLight.color`, and `ambientLight.intensity` between adjacent room palette entries using `smoothstep`-weighted blend; pause early when `!visible`
  - Implement WebGL context loss/restore: register `webglcontextlost` and `webglcontextrestored` listeners in `onCreated`; when context is lost, display `HomeMobileFallback` and restore automatically on `webglcontextrestored`
  - _Requirements: 1, 2, 6, 13, 14_

- [x] 4. `DevRoom` component — Room 0
  - Create `src/components/home/rooms/DevRoom.tsx` accepting `{ roomZ, camRef }`, using memoised `buildRoomGeometry` for the cool-blue room shell (`#0a0f1e` walls) with `useEffect` disposal
  - Load workstation GLB via `useGLTF`, clone scene graph inside `useMemo` without mutating the original, apply simplified materials when `navigator.hardwareConcurrency <= 4` (scale `0.33`, `roughness:1, metalness:0`), dispose clone on unmount
  - Add `DevRoomLighting`: `AmbientLight` intensity `1.8` color `#1a3a6e`, plus 2–3 cyan `PointLight`s with intensity driven by `proximityFade` in `useFrame`
  - Add `MonitorScreens`: 2 monitor planes using `createMonitorTexture` (one `'code'`, one `'terminal'`), call `draw(elapsedTime)` each frame, dispose on unmount
  - Apply visibility culling in `useFrame`: set group `visible` based on `|camZ - roomZ| <= ROOM_DEPTH * 1.5`
  - _Requirements: 4.1–4.3, 9, 10, 12, 15_

- [x] 5. `DeskTable` component — Room 1
  - Create `src/components/home/rooms/DeskTable.tsx` accepting `{ roomZ, camRef }`, using memoised `buildRoomGeometry` with darker close-up palette (`#0d1520` walls) and `useEffect` disposal
  - Build procedural desk props: desk surface `BoxGeometry(4, 0.08, 2)`, 3–4 sticky-note `PlaneGeometry` planes, coffee mug `CylinderGeometry`, side monitor plane with `createMonitorTexture('code')` texture
  - Build mechanical keyboard: base `BoxGeometry` + `InstancedMesh` of ~70 key `BoxGeometry`s; animate emissive hue completing a full RGB cycle every 3 seconds in `useFrame`
  - Add desk lamp `SpotLight` color `#ffe8b0`, intensity driven by `proximityFade` in `useFrame`
  - Apply visibility culling (same pattern as Task 4); dispose all geometries, materials, and textures on unmount
  - _Requirements: 4.4–4.5, 12, 15_

- [x] 6. `CafeRoom` component — Room 2 with steam particles
  - Create `src/components/home/rooms/CafeRoom.tsx` accepting `{ roomZ, camRef, reducedMotion }`, using memoised `buildRoomGeometry` with warm palette (`#3d2010` walls) and `useEffect` disposal
  - Build procedural café props: 2–3 wooden tables (box top + cylinder legs, `roughness:0.85`), pendant lights (sphere shade + cylinder cord), coffee machine silhouette (stacked boxes at back wall)
  - Add 1–3 `PointLight`s color `#ff9a3c` with intensity driven by `proximityFade`; add emissive pendant glow
  - Implement steam particle system (skipped entirely when `reducedMotion` is `true`): `InstancedMesh` of 20 `PlaneGeometry(0.08, 0.12)` billboard planes; `useFrame` loop increments `y += speed * delta`, decrements `life -= delta * 0.4`, respawns particles at cup position with `life ∈ [0.6,1]` and `speed ∈ [0.3,0.5]` when `life <= 0`, calls `setMatrixAt` and sets `instanceMatrix.needsUpdate = true`
  - Apply visibility culling and dispose all resources on unmount
  - _Requirements: 4.6–4.7, 8, 12, 14.2, 15_

- [ ] 7. Wire rooms into `SceneInner` and update `HomeScrollPanels`
  - Import and render `DevRoom`, `DeskTable`, and `CafeRoom` inside `SceneInner` with `roomZ` from `ROOM_CENTRES[0..2]`, shared `camRef`, and `reducedMotion` passed to `CafeRoom`
  - Add per-room visibility culling at the `SceneInner` level: set each room group `visible = |camZ - roomCentreZ| <= ROOM_DEPTH`
  - In `HomeScrollPanels.tsx`, replace `NUM_BAYS` import with `NUM_ROOMS` and `ROOMS` from `DevRoomCorridor`; update `scroll-track` height to `${NUM_ROOMS * PANELS_PER_ROOM * 120}vh` (1080vh); update HUD to show room label from `ROOMS[activeRoomIndex].label`; replace 7 bay panels with 9 room-aware panels (3 per room: intro, detail, CTA per room)
  - _Requirements: 4.1, 11, 12.2_

- [~] 8. Wire `DevRoomCorridor` into `App.tsx`
  - Add `import { DevRoomCorridor } from './components/home/DevRoomCorridor'` to `App.tsx`
  - Replace the `<HomeCorridor ...>` JSX block with `<DevRoomCorridor visible={activeTab === 'home'} reducedMotion={reducedMotion} />` inside the existing `use3DCorridor` gate
  - Remove the `HomeCorridor` import from `App.tsx` after confirming no other references remain
  - Run `npm run build` (or `bun run build`) and confirm zero TypeScript errors
  - _Requirements: 1.2, 14.3_

- [~] 9. Property-based tests for correctness properties
  - Install `fast-check` as a dev dependency if not already present
  - Write PBT for Property 1 (Monotonic Z Travel): for all `s1 < s2 ∈ [0,1]`, `START_Z - s1 * TOTAL_DEPTH > START_Z - s2 * TOTAL_DEPTH`
  - Write PBT for Property 2 (`roomProgressCalc` output invariants): for all `s ∈ [0,1]`, `roomIndex ∈ {0,1,2}`, `blend ∈ [0,1]`, `localT ∈ [0,1]`
  - Write PBT for Property 3 (`smoothstep` monotonicity and bounds): for all `t ∈ [0,1]`, output in `[0,1]`; for all `t1 < t2`, `smoothstep(t1) <= smoothstep(t2)`
  - Write PBT for Property 4 (`proximityFade` bounds): for all `camZ`, `propZ`, `fadeRadius > 0`, output in `[0,1]`
  - Write PBT for Property 5 (`buildRoomGeometry` structural correctness): for each valid `RoomDefinition`, group has `>= 5` children, no NaN positions, no exception thrown
  - Write PBT for Property 6 (fog cross-fade continuity): extract pure `computeFogColor(s)` and verify no adjacent pair `[s, s+0.001]` produces channel delta `> 0.01`
  - Run all tests with `npm test` (or `bun test`) and confirm all pass
  - _Requirements: 2.7, 3.2–3.4, 6.4–6.5, 7.1–7.3, 16.3; Design Properties 1–6_

## Overview

Implements the scroll-driven 3D room walkthrough (`DevRoomCorridor`) that replaces
`HomeCorridor` on the home page. Tasks are ordered by dependency — each group begins
only after all tasks it depends on are complete.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2", "9"] },
    { "wave": 3, "tasks": ["3"] },
    { "wave": 4, "tasks": ["4", "5", "6"] },
    { "wave": 5, "tasks": ["7"] },
    { "wave": 6, "tasks": ["8"] }
  ]
}
```

## Notes

- `fast-check` may need to be added: `npm install -D fast-check` or `bun add -D fast-check`
- `HomeCorridor.tsx` and its `NUM_BAYS` export remain untouched until Task 8 confirms the replacement compiles; `HomeScrollPanels.tsx` imports `NUM_BAYS` from it today, so Tasks 7 and 8 must land together
- The workstation GLB is already present at `public/workstation/programmer_desk_setup__stylized_3d_room.glb` — no asset work needed
- `src/components/hero/monitorTexture.ts` exists and follows the canvas-texture pattern; Task 2 extends it rather than replacing it
- Keep `HomeCorridor` in `App.tsx` until Task 8 verifies the build; do not delete the file
