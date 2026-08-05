# Requirements Document

## Introduction

This document defines the requirements for the **Immersive Dev Room Experience** feature.
The feature replaces the existing `HomeCorridor` 7-bay gallery on the home page with a
scroll-driven 3D walkthrough of three themed rooms: a Developer Room (full workstation
environment), a Developer's Table (close-up desk view), and a Café Room (warm café
environment). The camera travels forward through each space driven by page scroll
position, and content overlay panels (`HomeScrollPanels`) continue to render on the left
side of the viewport at each thematic section.

The new `DevRoomCorridor` component serves as a drop-in replacement for `HomeCorridor`
and is wired into `App.tsx` using the existing capability-check gate.

---

## Glossary

- **DevRoomCorridor**: The new root Three.js Canvas component that replaces `HomeCorridor`
  as the home-page 3D scene.
- **SceneInner**: The inner React Three Fiber component owned by `DevRoomCorridor` that
  hosts the animation loop, fog controller, and room group.
- **DevRoom**: Room 0 — the full developer environment containing the workstation GLB and
  monitor screens.
- **DeskTable**: Room 1 — the close-up desk view with procedural desk props.
- **CafeRoom**: Room 2 — the warm café environment with procedural props and steam
  particles.
- **RoomDefinition**: A data record describing one room's world-space position, camera
  parameters, fog settings, and ambient lighting values.
- **CameraController**: The per-frame logic inside `SceneInner` that lerps the camera
  position and FOV toward their target values.
- **FogController**: The per-frame logic inside `SceneInner` that cross-fades fog colour,
  fog near/far, and ambient light between adjacent rooms.
- **ProximityFade**: The function `proximityFade(camZ, propZ, fadeRadius)` that returns
  an opacity in [0, 1] based on distance between the camera and a prop.
- **HomeScrollPanels**: The existing DOM overlay component that renders content panels
  on the left side of the viewport, now updated to use `NUM_ROOMS` instead of `NUM_BAYS`.
- **useRoomProgress**: A hook that derives `roomIndex`, `blend`, and `localT` from a
  normalised `scrollProgress` value in [0, 1].
- **SteamParticle**: An individual instanced-plane particle in the café steam system.
- **LERP**: The camera position lerp factor (0.072) used for smooth camera travel.
- **LERP_FOV**: The camera FOV lerp factor used for smooth FOV transitions.
- **BOB_AMP**: The vertical bobbing amplitude applied to the camera's Y position.
- **NUM_ROOMS**: The constant `3` — the number of themed rooms in the walkthrough.
- **ROOM_DEPTH**: The depth of each room in world units (20).
- **TOTAL_DEPTH**: `ROOM_DEPTH × NUM_ROOMS` — the total world-space length of the walk.
- **START_Z**: The camera's world-space Z position at `scrollProgress = 0`.
- **END_Z**: The camera's world-space Z position at `scrollProgress = 1`.
- **WorkstationModel**: The GLB asset at `/workstation/programmer_desk_setup__stylized_3d_room.glb`.
- **MonitorCanvasTexture**: An animated canvas-based texture rendered onto monitor planes.
- **HomeMobileFallback**: The existing fallback component shown when 3D rendering is
  unavailable (e.g. after WebGL context loss).

---

## Requirements

### Requirement 1: DevRoomCorridor Component Integration

**User Story:** As a site visitor, I want the home page to display a scroll-driven 3D
room walkthrough, so that the experience feels immersive and memorable.

#### Acceptance Criteria

1. THE `DevRoomCorridor` SHALL accept a `reducedMotion` boolean prop and a `visible`
   boolean prop, mirroring the `HomeCorridor` interface.
2. WHEN `App.tsx` mounts the home-page 3D scene, THE `DevRoomCorridor` SHALL be used as
   a drop-in replacement for `HomeCorridor` under the same capability-check gate.
3. THE `DevRoomCorridor` SHALL render a fixed-position `<Canvas>` element that covers
   the full viewport (`100vw × 100vh`) with `zIndex: 1` and `pointerEvents: none`.
4. THE `DevRoomCorridor` SHALL wrap async GLB loading in a `<Suspense>` boundary so
   that a fallback mesh is displayed during asset loading without crashing the page.
5. WHEN the `visible` prop is `false`, THE `DevRoomCorridor` SHALL set the canvas
   container opacity to `0` and pause the render loop.
6. THE `DevRoomCorridor` Canvas SHALL use `dpr={[1, 1.5]}` to cap the device pixel
   ratio at 1.5.

---

### Requirement 2: Scroll-Driven Camera Animation

**User Story:** As a site visitor, I want the camera to travel smoothly through the
rooms as I scroll, so that the walk feels natural and tied to my intent.

#### Acceptance Criteria

1. WHEN the user scrolls the page, THE `CameraController` SHALL update the camera's
   target Z position as `START_Z − scrollProgress × TOTAL_DEPTH`.
2. WHILE `reducedMotion` is `false`, THE `CameraController` SHALL lerp
   `camera.position.z` toward the target Z using factor `LERP` (0.072) each frame.
3. WHILE `reducedMotion` is `false`, THE `CameraController` SHALL apply a sinusoidal
   vertical bobbing offset to `camera.position.y` with amplitude `BOB_AMP`.
4. WHEN `reducedMotion` is `true`, THE `CameraController` SHALL set
   `camera.position.z` and `camera.position.y` directly to their target values without
   lerp or bobbing.
5. THE `CameraController` SHALL lerp `camera.fov` toward the active room's target FOV
   using `LERP_FOV` each frame, and SHALL call `camera.updateProjectionMatrix()` after
   any FOV change.
6. THE `CameraController` SHALL clamp `camera.fov` to the range [45°, 65°] at all
   times.
7. THE `CameraController` SHALL ensure `camera.position.z` decreases monotonically as
   `scrollProgress` increases from 0 to 1; the camera SHALL never travel backward.

---

### Requirement 3: Room Progress Derivation

**User Story:** As a developer, I want a well-specified hook for deriving room state
from scroll progress, so that all room-aware components share a consistent source of
truth.

#### Acceptance Criteria

1. THE `useRoomProgress` hook SHALL accept a `scrollProgress` value in [0, 1] and
   return `{ roomIndex, blend, localT }`.
2. THE `useRoomProgress` hook SHALL ensure `roomIndex` is always a member of `{0, 1, 2}`.
3. THE `useRoomProgress` hook SHALL ensure `blend` is always in [0, 1].
4. THE `useRoomProgress` hook SHALL ensure `localT` is always in [0, 1].
5. WHEN `scrollProgress` is `0`, THE `useRoomProgress` hook SHALL return
   `roomIndex = 0` and `blend = 0`.
6. WHEN `scrollProgress` is `1`, THE `useRoomProgress` hook SHALL return
   `roomIndex = 2` and `blend` approaching `1`.

---

### Requirement 4: Three Themed Rooms

**User Story:** As a site visitor, I want to walk through three visually distinct rooms,
so that the experience communicates the team's range and personality.

#### Acceptance Criteria

1. THE `SceneInner` SHALL place `DevRoom` (Room 0) at `ROOM_CENTRES[0]`, `DeskTable`
   (Room 1) at `ROOM_CENTRES[1]`, and `CafeRoom` (Room 2) at `ROOM_CENTRES[2]`.
2. THE `DevRoom` SHALL position the `WorkstationModel` GLB at `roomZ` and scale it to
   `0.65`.
3. THE `DevRoom` SHALL use a cool blue ambient light (`#1a3a6e`) and include 2–3 monitor
   planes with animated `MonitorCanvasTexture` content.
4. THE `DeskTable` SHALL set the camera path Y override to `1.1` (lower than the default
   `1.6`) and FOV to `50°` to produce a close-up desk perspective.
5. THE `DeskTable` SHALL include procedural desk props: sticky-note planes, a coffee
   mug, a mechanical keyboard with animated RGB emissive strips, and a side monitor.
6. THE `CafeRoom` SHALL use a warm fog colour (`#3d2010`) and warm ambient light
   (`#7a4a1e`) with orange point lights (`#ff9a3c`).
7. THE `CafeRoom` SHALL include procedural café props: wooden tables, hanging pendant
   lights, a coffee machine silhouette, and a steam particle system over coffee cups.

---

### Requirement 5: Room Geometry Construction

**User Story:** As a developer, I want each room to be built from well-specified geometry,
so that the spatial structure is consistent and memory-safe.

#### Acceptance Criteria

1. THE `buildRoomGeometry` function SHALL accept a `RoomDefinition` and return a
   `THREE.Group` containing at minimum: a floor plane, a ceiling plane, a left wall, a
   right wall, and a back wall.
2. THE `buildRoomGeometry` function SHALL centre the returned group at
   `[0, ROOM_H / 2, room.roomZ]`.
3. ALL meshes in the returned group SHALL use `MeshStandardMaterial`.
4. IF `buildRoomGeometry` receives a `RoomDefinition` with a valid `id`, THEN THE
   function SHALL return a non-empty group without throwing an exception.
5. ALL `THREE.Geometry` and `THREE.Material` objects created by `buildRoomGeometry`
   SHALL be stored in `useMemo` and disposed in the corresponding `useEffect` cleanup.

---

### Requirement 6: Fog and Ambient Light Cross-Fade

**User Story:** As a site visitor, I want the atmosphere to transition smoothly between
rooms, so that there are no jarring visual cuts as the camera travels.

#### Acceptance Criteria

1. WHEN the camera is between two rooms, THE `FogController` SHALL lerp
   `scene.fog.color` between `ROOMS[roomIndex].fogColor` and
   `ROOMS[roomIndex + 1].fogColor` using a `smoothstep`-weighted blend factor.
2. THE `FogController` SHALL lerp `fog.near` and `fog.far` between the active and next
   room values using the same blend factor.
3. THE `FogController` SHALL lerp `ambientLight.color` and `ambientLight.intensity`
   between the active and next room values using the same blend factor.
4. THE `FogController` SHALL ensure that all fog colour channel values and ambient light
   colour channel values remain in [0, 1] at all `scrollProgress` inputs.
5. THE `FogController` SHALL produce no step discontinuities in fog colour or ambient
   colour as `scrollProgress` crosses room boundaries.

---

### Requirement 7: Proximity Fade for Lights and Props

**User Story:** As a site visitor, I want lights and props to fade in as I approach
them and fade out as I leave, so that GPU load stays proportional to visible content.

#### Acceptance Criteria

1. THE `ProximityFade` function SHALL accept `camZ`, `propZ`, and `fadeRadius` and
   return an opacity value in [0, 1].
2. WHEN `camZ` equals `propZ`, THE `ProximityFade` function SHALL return `1.0`.
3. WHEN the absolute distance between `camZ` and `propZ` is greater than or equal to
   `fadeRadius`, THE `ProximityFade` function SHALL return `0.0`.
4. THE `ProximityFade` function SHALL apply `smoothstep` to the raw opacity before
   returning it, ensuring smooth entry and exit curves.
5. ALL room-specific spotlights, point lights, particle systems, and detail meshes SHALL
   use `ProximityFade` to set their intensity or material opacity each frame.
6. AT ANY given `scrollProgress`, AT MOST two rooms SHALL have non-zero light intensity;
   all other rooms SHALL have zero light intensity.

---

### Requirement 8: Steam Particle System

**User Story:** As a site visitor, I want to see steam rising from coffee cups in the
Café Room, so that the space feels alive and atmospheric.

#### Acceptance Criteria

1. THE `CafeRoom` SHALL maintain a steam particle system implemented as an instanced
   mesh of billboard planes.
2. WHEN a steam particle is updated each frame, THE steam system SHALL increment its `y`
   position by `particle.speed × deltaTime`, decrement `particle.life` by
   `deltaTime × 0.4`, and set `particle.alpha` proportional to `particle.life`.
3. THE steam system SHALL ensure every `SteamParticle` always has `life` in [0, 1].
4. WHEN a particle's `life` reaches `0`, THE steam system SHALL immediately respawn the
   particle at the coffee cup position with a new randomised `life` in [0.6, 1] and
   `speed` in [0.3, 0.5].
5. THE steam system SHALL call `updateInstanceMatrix` after mutating each particle so
   that the instanced mesh reflects the updated state each frame.

---

### Requirement 9: WorkstationModel GLB Loading

**User Story:** As a developer, I want the workstation GLB to be loaded safely and
efficiently, so that memory is managed correctly and the page does not crash on load
failure.

#### Acceptance Criteria

1. THE `DevRoom` SHALL load the `WorkstationModel` GLB using `useGLTF` and clone the
   scene graph via `cloneSceneGraph` before attaching it to the scene.
2. THE original `WorkstationModel` scene object SHALL never be mutated; all material
   configuration SHALL be applied to the cloned copy only.
3. THE cloned `WorkstationModel` SHALL be stored in `useMemo` and disposed when the
   `DevRoom` component unmounts.
4. IF the `WorkstationModel` GLB fails to load, THEN THE `Suspense` fallback SHALL
   render a `MeshStandardMaterial` box at the same world position without crashing the
   page.

---

### Requirement 10: Monitor Canvas Textures

**User Story:** As a site visitor, I want to see animated code or terminal content on
the monitor screens in the Developer Room, so that the environment feels authentic and
technical.

#### Acceptance Criteria

1. THE `createMonitorTexture` function SHALL accept a `MonitorContent` descriptor with a
   `type` field of `'code'`, `'terminal'`, or `'matrix'` and return a
   `CanvasTextureHandle`.
2. THE returned `CanvasTextureHandle` SHALL expose three members: `texture`
   (`THREE.CanvasTexture`), `draw(time: number)`, and `dispose()`.
3. WHEN `draw(time)` is called, THE `MonitorCanvasTexture` SHALL update the underlying
   canvas and set `texture.needsUpdate = true`.
4. WHEN `dispose()` is called, THE `MonitorCanvasTexture` SHALL dispose the
   `THREE.CanvasTexture` and null all internal references.

---

### Requirement 11: Scroll Panel Alignment

**User Story:** As a site visitor, I want the content overlay panels to stay in sync
with the 3D rooms I am walking through, so that text and visuals reinforce each other.

#### Acceptance Criteria

1. THE `HomeScrollPanels` component SHALL import `NUM_ROOMS` and `ROOMS` from
   `DevRoomCorridor` instead of `NUM_BAYS` from `HomeCorridor`.
2. THE `scroll-track` DOM element height SHALL be set to
   `NUM_ROOMS × PANELS_PER_ROOM × 120vh` (i.e. `3 × 3 × 120 = 1080vh`).
3. THE `HomeScrollPanels` HUD SHALL display the current room index (1-based) and the
   current room label from the active `RoomDefinition`.
4. WHEN `scrollProgress` is `0`, THE `HomeScrollPanels` SHALL display the first panel
   at full opacity and the scroll-cue indicator SHALL be visible.
5. WHEN `scrollProgress` is `1`, THE `HomeScrollPanels` SHALL display the last panel at
   full opacity.

---

### Requirement 12: Performance and Visibility Culling

**User Story:** As a site visitor on a mid-range device, I want the experience to run at
a consistently high frame rate, so that the walkthrough does not stutter or degrade the
page.

#### Acceptance Criteria

1. THE `DevRoomCorridor` Canvas SHALL configure `dpr={[1, 1.5]}` to prevent the pixel
   ratio from exceeding 1.5.
2. THE `SceneInner` SHALL set `group.visible = false` for any room group whose centre
   is more than `ROOM_DEPTH` world units beyond the current `camera.position.z`.
3. THE `DevRoomCorridor` SHALL use instanced meshes for steam particles, sticky notes,
   and keyboard keys to minimise per-object draw calls.
4. WHERE `navigator.hardwareConcurrency` is `4` or fewer, THE `DevRoom` SHALL render
   the `WorkstationModel` at 50% scale with a simplified material set.

---

### Requirement 13: Error Handling and Resilience

**User Story:** As a site visitor, I want the page to remain functional even when 3D
rendering encounters errors, so that I can still access content.

#### Acceptance Criteria

1. IF the `WorkstationModel` GLB fails to load, THEN THE `DevRoomCorridor` SHALL render
   a fallback `MeshStandardMaterial` box at the GLB's expected world position.
2. IF the WebGL context is lost, THEN THE `DevRoomCorridor` SHALL pause the render loop
   and display `HomeMobileFallback`.
3. WHEN the WebGL context is restored, THE `DevRoomCorridor` SHALL re-initialise the
   renderer automatically without requiring a page reload.
4. IF `document.getElementById('scroll-track')` returns `null`, THEN THE
   `useScrollProgress` hook SHALL set `scrollProgress` to `0` and log a console
   warning.

---

### Requirement 14: Reduced-Motion Accessibility

**User Story:** As a site visitor with motion sensitivity, I want the 3D experience to
respect my operating-system motion preference, so that I can use the site comfortably.

#### Acceptance Criteria

1. WHEN `reducedMotion` is `true`, THE `CameraController` SHALL snap the camera
   position directly to its target values each frame without applying lerp or bobbing.
2. WHEN `reducedMotion` is `true`, THE `CafeRoom` steam particle system SHALL be
   disabled and particles SHALL not be updated or rendered.
3. THE `DevRoomCorridor` SHALL read the `reducedMotion` prop passed from `App.tsx`,
   which derives it from `window.matchMedia("(prefers-reduced-motion: reduce)")`.

---

### Requirement 15: Memory and Resource Management

**User Story:** As a developer, I want all Three.js resources to be properly disposed
when components unmount, so that the application does not leak GPU memory.

#### Acceptance Criteria

1. ALL `THREE.BufferGeometry`, `THREE.Material`, and `THREE.Texture` objects created
   inside `DevRoomCorridor` sub-components SHALL be stored in `useMemo` and disposed in
   the corresponding `useEffect` return cleanup function.
2. THE `WorkstationModel` clone SHALL be disposed when `DevRoom` unmounts.
3. THE `MonitorCanvasTexture` handle's `dispose()` method SHALL be called when the
   monitor component unmounts.

---

### Requirement 16: `smoothstep` Utility Function

**User Story:** As a developer, I want a correct smoothstep implementation available
for all transition calculations, so that room transitions feel visually smooth.

#### Acceptance Criteria

1. THE `smoothstep` function SHALL implement Ken Perlin's formula `3t² − 2t³`.
2. THE `smoothstep` function SHALL return `0` when `t = 0` and `1` when `t = 1`.
3. THE `smoothstep` function SHALL be monotonically non-decreasing for all `t` in [0, 1].
4. THE `smoothstep` function SHALL have a first derivative of `0` at both `t = 0` and
   `t = 1`.
