# Requirements Document: Interactive Portal Windows

## Introduction

The Interactive Portal Windows feature enhances the Byte Brothers 3D corridor with clickable, interactive portals mounted on corridor walls and gallery shelves. This document formalizes all design decisions into testable, business-facing requirements covering functional, non-functional, technical, and quality aspects of the portal system. Windows support simultaneous activation (max 3 concurrent), raycasting-based hit detection, lazy-loaded content, and glass shader effects to maintain 60fps performance.

## Glossary

- **Portal**: An interactive 3D window in the corridor that displays content rendered via render-to-texture
- **Window**: The 3D geometry component consisting of a frame, glass pane, and trim material
- **Portal State**: Tracks whether a portal is active, loading, animating, and its current animation progress
- **Portal Manager**: System component managing all active portals and enforcing the 3-concurrent-portal limit
- **Render-to-Texture (RTT)**: Technique of rendering content to a texture for display on 3D surfaces
- **Raycasting**: Ray-geometry intersection testing for detecting window interactions
- **Lazy Loading**: Deferred content loading triggered only on first portal activation
- **Hover State**: Visual feedback when pointer is over a window but not clicked
- **Frustum Culling**: Optimization technique skipping off-screen objects
- **Frame Rate**: Target 60 frames per second for smooth animations

## Requirements

### Requirement 1: Portal Window Geometry Rendering

**User Story:** As a user, I want to see realistic 3D window frames with glass materials mounted on corridor walls, so that I can identify and interact with portal entry points.

#### Acceptance Criteria

1. WHEN the corridor is rendered, THE Window_Geometry_System SHALL generate window frames with all specified dimensions (small: 2.0×1.5, medium: 3.2×2.0, large: 4.8×3.2)
2. WHEN a window is created, THE Frame_Material SHALL apply brass or steel colors with metalness=0.7 and roughness=0.3 for realistic reflections
3. WHEN a window is rendered, THE Glass_Material SHALL have opacity=0.75 and apply a blue tint (0xccddff) for realistic glass appearance
4. WHEN the scene updates, EACH window frame SHALL maintain its position and rotation relative to the corridor structure without drifting

### Requirement 2: Window Positioning on Corridor Structure

**User Story:** As a developer, I want windows automatically positioned within corridor bays at correct wall locations, so that windows appear properly within the 3D environment.

#### Acceptance Criteria

1. WHEN a window is placed in a bay, THE Position_Calculator SHALL position it at x = ±half_width - 0.15 (wall offset) on left or right corridor walls
2. WHEN a window is positioned, THE Vertical_Placement SHALL position it at y = bay_height/2 + height_offset within valid range [0, HALF_HEIGHT]
3. WHEN a window is placed in a bay, THE Depth_Placement SHALL position it at z = bay_depth × bay_index along the corridor
4. WHEN multiple windows exist in one bay, EACH window SHALL be positioned without collision or overlap

### Requirement 3: Window Interaction Detection via Raycasting

**User Story:** As a user, I want to click on windows to activate portals and see hover effects when moving the pointer over windows, so that I can intuitively interact with the portal system.

#### Acceptance Criteria

1. WHEN the pointer moves over the corridor, THE Raycasting_Engine SHALL test for intersection with all visible windows using THREE.Raycaster
2. WHEN raycasting detects a window intersection, THE Result_Handler SHALL identify the closest window by distance and return the window ID and intersection point
3. WHEN the pointer enters a window bounding box, THE Hover_System SHALL activate hover state and apply glow effect to that window
4. WHEN the pointer exits a window bounding box, THE Hover_System SHALL deactivate hover state and remove the glow effect
5. WHEN a user clicks on a hovered window, THE Click_Handler SHALL trigger portal activation for that window with its associated content type
6. IF raycasting detects multiple overlapping windows, THEN THE System SHALL return only the closest window and ignore others

### Requirement 4: Maximum Concurrent Portals Constraint

**User Story:** As a system operator, I want to enforce a maximum of 3 simultaneous active portals, so that GPU memory and render-to-texture resources remain bounded and performance stays optimal.

#### Acceptance Criteria

1. WHEN a user activates a fourth portal, THE Portal_Manager SHALL automatically deactivate the oldest active portal first
2. WHEN a portal is deactivated, THE Animation_System SHALL trigger closing animation over 300ms before removing it
3. WHILE three portals are active, THE Portal_Manager SHALL prevent new portal activation until a portal closes
4. THE Portal_Manager SHALL never exceed 3 active portals at any moment in time
5. WHEN a portal closes completely, THE Resource_Cleanup_System SHALL dispose its GPU texture and render target

### Requirement 5: Portal State Machine Transitions

**User Story:** As a developer, I want portals to transition smoothly through well-defined states, so that behavior is predictable and animations play correctly.

#### Acceptance Criteria

1. WHEN a window is idle, THE Portal_State SHALL be 'idle' with no animation or visual effects
2. WHEN the pointer hovers over a window, THE Portal_State SHALL transition to 'hover' and apply a glow effect
3. WHEN a user clicks a hovered window, THE Portal_State SHALL transition to 'opening' and start opening animation
4. WHEN the opening animation completes, THE Portal_State SHALL transition to 'open' and display portal content
5. WHEN a user closes a portal or the 3-portal limit forces closure, THE Portal_State SHALL transition to 'closing' with closing animation
6. WHEN the closing animation completes, THE Portal_State SHALL transition to 'closed' and free all resources
7. IF a portal fails to load content, THE Portal_State SHALL transition to an error state and display error message to user

### Requirement 6: Portal Content Lazy Loading

**User Story:** As a performance optimizer, I want portal content loaded only on first activation, so that page load time is fast and memory is used efficiently.

#### Acceptance Criteria

1. WHEN a portal is created, THE Content_Loader SHALL NOT load content immediately
2. WHEN a user activates a portal for the first time, THE Content_Loader SHALL begin async loading of the portal content component
3. WHILE portal content is loading, THE Loading_Indicator SHALL display "Loading..." or similar feedback to the user
4. WHEN portal content finishes loading, THE Content_Renderer SHALL render it to the render-to-texture target
5. IF portal content loading exceeds 5 seconds, THE Error_Handler SHALL show loading timeout message and offer retry option
6. WHEN a user closes and reopens the same portal, THE Content_Cache SHALL reuse the previously loaded texture without reloading

### Requirement 7: Render-to-Texture Content Delivery

**User Story:** As a content provider, I want website section content (Portfolio, Services, About, Contact) rendered inside portal windows, so that users can view content without leaving the immersive corridor.

#### Acceptance Criteria

1. WHEN a portal activates, THE Render_Target SHALL create a WebGL render target with dimensions matching the window size (256px × 192px at half resolution for performance)
2. WHEN portal content is rendered, THE React_Portal_System SHALL render the content component to an offscreen canvas
3. WHEN the canvas is ready, THE Texture_Uploader SHALL convert the canvas to a THREE.CanvasTexture and upload to GPU VRAM
4. WHEN the texture is uploaded, THE Window_Material SHALL use this texture as the glass portal display
5. WHERE a portal is visible, THE Texture_Update_Rate SHALL refresh only when content changes or camera distance changes significantly
6. WHEN a portal closes, THE Texture_Cleanup_System SHALL dispose the render target and texture immediately to free GPU memory

### Requirement 8: Portal Animation Timing and Easing

**User Story:** As a UX designer, I want smooth opening/closing animations with proper easing, so that portals feel responsive and polished.

#### Acceptance Criteria

1. WHEN a portal opens, THE Animation_System SHALL animate openProgress from 0.0 to 1.0 over exactly 300 milliseconds
2. WHEN a portal closes, THE Animation_System SHALL animate openProgress from 1.0 to 0.0 over exactly 300 milliseconds
3. WHEN animating openProgress, THE Easing_Function SHALL apply cubic ease-out for smooth deceleration
4. WHEN portal animation progresses, THE Window_Scale_Transform SHALL scale the window from 0.8 to 1.0 during opening
5. WHEN portal animation progresses, THE Window_Opacity_Transform SHALL fade from 0.0 to 1.0 during opening
6. WHEN the opening animation completes, THE onAnimationComplete_Callback SHALL fire exactly once to enable portal interaction

### Requirement 9: Window Hover Visual Feedback

**User Story:** As a user, I want clear visual feedback when hovering over windows, so that I know which window is interactive.

#### Acceptance Criteria

1. WHEN the pointer enters a window, THE Glow_System SHALL apply a glowing effect to the window frame
2. WHEN a window is glowing, THE Glow_Intensity SHALL increase from 0 to a visible level over 150ms
3. WHEN a window has glow applied, THE Material_Emission SHALL brighten the brass/steel frame color by 30-50%
4. WHEN the pointer exits a window, THE Glow_System SHALL remove the glow effect over 150ms fade-out
5. WHILE multiple windows have hover state active, THE Hover_Focus SHALL reset to the last hovered window only
6. WHEN the pointer is not over any window, ALL window glow effects SHALL be cleared

### Requirement 10: Portal Content Type Association

**User Story:** As a content curator, I want each window to display specific content types (Portfolio, Services, About, Contact), so that users can explore different sections of the website through portals.

#### Acceptance Criteria

1. WHEN a window is created, THE Window_Config SHALL specify a contentType from the enumeration ['portfolio', 'services', 'about', 'contact']
2. WHEN a portal is activated, THE Content_Router SHALL load the React component matching the window's contentType
3. WHEN the portal opens, THE Content_Renderer SHALL display the correct website section inside the portal
4. IF contentType is missing or invalid, THE Error_Handler SHALL log an error and skip that window
5. WHEN a user views multiple portals, EACH portal SHALL display its associated content type independently

### Requirement 11: Performance: Target 60fps Frame Rate

**User Story:** As a performance engineer, I want the portal system to maintain 60fps even with multiple active portals, so that the user experience is smooth and responsive.

#### Acceptance Criteria

1. WHEN the scene renders with up to 3 active portals, THE Frame_Rate_Monitor SHALL maintain average frame rate ≥ 55fps on modern hardware
2. WHEN portals are rendering, THE Render_Pipeline SHALL complete all portal rendering within 16ms frame budget
3. WHEN render-to-texture updates, THE Update_Frequency SHALL limit RTT updates to necessary moments only (not every frame)
4. WHEN windows are far from the camera, THE Frustum_Culling SHALL skip rendering those windows entirely
5. WHERE render target resolution is reduced, THE Resolution_Optimizer SHALL use 256×192 at 0.5× pixel ratio to maintain frame rate while preserving visual quality

### Requirement 12: Raycasting Performance Optimization

**User Story:** As a performance engineer, I want raycasting operations optimized to avoid frame rate drops, so that window detection remains responsive.

#### Acceptance Criteria

1. WHEN raycasting tests are performed, THE Spatial_Index SHALL use BVH or grid-based culling to skip distant windows
2. WHEN raycasting tests are performed, THE Frustum_Culling SHALL exclude windows outside the camera frustum before testing
3. WHEN pointer moves rapidly, THE Result_Cache SHALL reuse raycasting results for up to 16ms (one frame) to avoid redundant tests
4. WHEN raycasting processes all windows, THE Batch_Processing SHALL test all windows in a single raycasting operation per frame
5. WHEN windows are deactivated, THE Spatial_Index_Update SHALL remove them from the index efficiently

### Requirement 13: Memory Management for GPU Resources

**User Story:** As a resource manager, I want GPU memory properly managed and cleaned up, so that the application doesn't exhaust GPU VRAM over time.

#### Acceptance Criteria

1. WHEN a portal closes, THE Resource_Cleanup_System SHALL dispose all GPU textures and render targets immediately
2. WHEN a portal's render target is disposed, THE Memory_Monitor SHALL confirm the GPU memory is freed
3. WHILE three portals are active, THE Total_GPU_Memory_Usage SHALL not exceed estimated 24MB (3 portals × 8MB per render target)
4. IF GPU memory allocation fails, THE Error_Recovery_System SHALL automatically deactivate the oldest portal and retry
5. WHEN the application exits, ALL portal resources SHALL be cleaned up to prevent GPU memory leaks

### Requirement 14: Frustum Culling for Far Windows

**User Story:** As a performance optimizer, I want windows far from the camera to fade out and become non-interactive, so that GPU and CPU resources focus on visible content.

#### Acceptance Criteria

1. WHEN camera distance to window > CULL_DISTANCE (20 units), THE Window_Opacity SHALL gradually fade toward 0
2. WHEN a window is culled, THE Interactive_State SHALL become non-interactive and not respond to clicks
3. WHEN a window is culled, THE Raycasting_System SHALL skip testing that window against rays
4. WHEN camera moves closer to a culled window, THE Window_Opacity SHALL gradually fade back to full opacity
5. WHEN a portal is active on a culled window, THE Portal_Closure SHALL trigger to free resources

### Requirement 15: Camera Position Integration

**User Story:** As an integration engineer, I want portals to use current camera position for distance-based optimizations, so that portals work correctly as the user navigates the corridor.

#### Acceptance Criteria

1. WHEN the camera position updates, THE Portal_System SHALL query the new camera position
2. WHEN camera distance to window is calculated, THE Distance_Calculation SHALL use camera.position.distanceTo(window.position)
3. WHEN camera moves, THE Frustum_Culling_Trigger SHALL reevaluate which windows are in view frustum
4. WHILE the user scrolls through the corridor, THE Portal_State SHALL remain consistent across camera movements

### Requirement 16: Input Validation and Security

**User Story:** As a security engineer, I want all user inputs validated before processing, so that invalid data cannot cause crashes or security vulnerabilities.

#### Acceptance Criteria

1. WHEN a pointer event is received, THE Input_Validator SHALL verify clientX and clientY are within viewport bounds [0, width] × [0, height]
2. WHEN a window ID is used, THE ID_Whitelist SHALL validate it against the registered window registry before processing
3. WHEN contentType is specified, THE Type_Validator SHALL verify it is one of the allowed enum values ['portfolio', 'services', 'about', 'contact']
4. IF input validation fails, THE Error_Handler SHALL reject the input and prevent any state change
5. WHEN user input is processed, THE Security_Context SHALL prevent XSS attacks by sanitizing React component rendering

### Requirement 17: Content XSS Prevention

**User Story:** As a security engineer, I want portal content protected against cross-site scripting attacks, so that malicious content cannot execute arbitrary code.

#### Acceptance Criteria

1. WHEN portal content is rendered, THE React_Portal_System SHALL use React's built-in XSS protection (no dangerouslySetInnerHTML)
2. WHEN portal content is rendered, THE Content_Sanitizer SHALL escape all HTML special characters
3. WHEN dynamic content is included, THE Content_Escaping SHALL prevent execution of embedded scripts
4. WHEN portal content is updated, THE Update_Handler SHALL re-sanitize all new content before rendering

### Requirement 18: Portal Content Loading Timeout and Retry

**User Story:** As a reliability engineer, I want portal content loading to timeout gracefully and retry, so that users aren't stuck waiting indefinitely.

#### Acceptance Criteria

1. WHEN portal content starts loading, THE Timeout_Timer SHALL set a 5-second maximum loading duration
2. IF content loading exceeds 5 seconds, THE Timeout_Handler SHALL cancel the load and show timeout message
3. WHEN loading times out, THE Retry_System SHALL offer user option to retry immediately
4. WHEN user selects retry, THE Content_Loader SHALL reset the 5-second timer and attempt loading again
5. WHEN retry fails 3 times consecutively, THE Error_State SHALL display permanent error message

### Requirement 19: Portal Error Boundary and Fallback UI

**User Story:** As a UX designer, I want graceful error handling with fallback UI, so that portal failures don't break the entire corridor experience.

#### Acceptance Criteria

1. WHEN portal content throws an error during rendering, THE Error_Boundary SHALL catch the error
2. WHEN an error is caught, THE Error_Display SHALL show "Error loading portal content. Please try again."
3. WHEN portal displays error state, THE Portal_Interaction SHALL still allow user to close the portal
4. WHEN user closes an errored portal, THE Portal_State SHALL transition cleanly to 'closed'
5. WHEN user clicks the portal again, THE Content_Retry SHALL attempt to reload and recover

### Requirement 20: Portal State Persistence and Cleanup

**User Story:** As a developer, I want portal state correctly maintained and cleaned up when portals close, so that there are no memory leaks or state corruption.

#### Acceptance Criteria

1. WHEN a portal is active, THE Portal_State SHALL maintain accurate state (isActive, isLoading, openProgress, texture)
2. WHEN a portal is deactivated, THE State_Cleanup SHALL set all state properties to defaults and clear references
3. WHEN portal texture is disposed, THE Texture_Reference SHALL be set to null
4. WHEN portal state is cleared, THE Event_Listeners SHALL be unsubscribed to prevent leaks
5. WHEN multiple portals are active, EACH portal's state SHALL be independent and isolated from others

### Requirement 21: Hover State Consistency

**User Story:** As a QA engineer, I want hover state to accurately track the pointer position, so that the visual glow matches what the user expects to click.

#### Acceptance Criteria

1. WHEN pointer moves over a window, THE Hover_Detector SHALL immediately apply hover state
2. WHEN pointer exits a window, THE Hover_Detector SHALL immediately remove hover state
3. WHILE pointer is over a window, THE Hover_State_Persistence SHALL maintain active until pointer leaves
4. IF raycasting detects pointer over window but hover state isn't active, THE State_Synchronizer SHALL correct the inconsistency
5. WHEN multiple windows have potential intersection, THE Hover_Focus SHALL only highlight the closest one

### Requirement 22: Window Size Variants Support

**User Story:** As a content designer, I want to create windows in three different sizes, so that I can design varied corridor layouts and visual hierarchy.

#### Acceptance Criteria

1. THE Window_System SHALL support three size variants: 'small' (2.0×1.5), 'medium' (3.2×2.0), 'large' (4.8×3.2)
2. WHEN a small window renders, THE Frame_Thickness SHALL be 0.12 units
3. WHEN a medium window renders, THE Frame_Thickness SHALL be 0.14 units
4. WHEN a large window renders, THE Frame_Thickness SHALL be 0.16 units
5. WHEN windows of different sizes are positioned together, EACH window SHALL render its correct dimensions without distortion

### Requirement 23: Portal Content Scrolling Support

**User Story:** As a user, I want to scroll within portal content to view more information, so that large content sections fit within the portal window.

#### Acceptance Criteria

1. WHEN portal content is displayed, THE Content_Container SHALL support vertical scrolling if content exceeds portal height
2. WHEN user scrolls within a portal, THE Scroll_Handler SHALL prevent scroll momentum from affecting corridor camera movement
3. WHILE user is scrolling inside a portal, THE Corridor_Camera SHALL not respond to scroll events
4. WHEN user scrolling in portal ends, THE Corridor_Camera SHALL resume responding to scroll events
5. WHEN portal content is scrolled, THE Scroll_Position SHALL be preserved if portal is closed and reopened

### Requirement 24: Glass Material Shader Effects

**User Story:** As a visual designer, I want realistic glass effects with reflections and refraction, so that portals feel integrated into the 3D environment.

#### Acceptance Criteria

1. WHEN glass material is rendered, THE Fresnel_Effect SHALL compute angle-dependent reflection (more reflection at grazing angles)
2. WHEN glass material is rendered, THE Environment_Reflection SHALL sample and display environment map reflections on glass
3. WHEN glass is viewed straight-on, THE Transparency_Level SHALL prioritize showing portal content
4. WHEN glass is viewed at extreme angles, THE Reflection_Level SHALL prioritize showing environment reflections
5. WHEN portal content is behind glass, THE Composite_Blend SHALL correctly blend content, reflection, and refraction

### Requirement 25: Window Material Properties

**User Story:** As a visual designer, I want high-fidelity window frame materials, so that portals look professional and integrated with the corridor aesthetic.

#### Acceptance Criteria

1. WHEN window frame is rendered, THE Frame_Metalness SHALL be set to 0.7 for realistic metal reflections
2. WHEN window frame is rendered, THE Frame_Roughness SHALL be set to 0.3 for semi-polished brass/steel look
3. WHEN window frame is rendered, THE Frame_Color SHALL match the specified color config (e.g., 0xc9a876 for brass)
4. WHEN glass pane is rendered, THE Glass_Opacity SHALL be set to 0.75 for semi-transparent appearance
5. WHEN glass pane is rendered, THE Glass_Tint SHALL apply blue tint (0xccddff) for cool glass aesthetic

### Requirement 26: Window Frame Geometry Composition

**User Story:** As a developer, I want window geometry composed of frame, glass, and trim components, so that windows have realistic structure.

#### Acceptance Criteria

1. WHEN window geometry is created, THE Frame_Component SHALL be a box geometry representing the frame borders
2. WHEN window geometry is created, THE Glass_Component SHALL be a plane geometry representing the transparent glass pane
3. WHEN window geometry is created, THE Trim_Component SHALL be box geometries at edges for realistic corner detail
4. WHEN window is rendered, ALL three components SHALL be positioned correctly relative to each other
5. WHEN raycasting tests window, THE Test_Target SHALL be the outer frame and glass bounding box

### Requirement 27: Viewport Boundary Validation

**User Story:** As a developer, I want viewport coordinates validated before raycasting, so that invalid pointer positions don't cause errors.

#### Acceptance Criteria

1. WHEN pointer event is processed, THE Coordinate_Validator SHALL check that x ∈ [0, viewportWidth]
2. WHEN pointer event is processed, THE Coordinate_Validator SHALL check that y ∈ [0, viewportHeight]
3. IF coordinates are out of bounds, THE Invalid_Handler SHALL reject the event
4. WHEN NDC (Normalized Device Coordinates) are calculated, THE NDC_Conversion SHALL properly map [0, viewport] to [-1, 1] range

### Requirement 28: Portal Activation Queuing

**User Story:** As a developer, I want portal activation to queue content loading asynchronously, so that portals activate immediately while content loads in background.

#### Acceptance Criteria

1. WHEN a portal is activated, THE Portal_State SHALL immediately transition to 'opening'
2. WHEN portal is activated, THE Content_Loading SHALL begin asynchronously without blocking animation
3. WHILE content is loading, THE Loading_Indicator SHALL display to user
4. WHEN content loading completes, THE Portal_Content SHALL be displayed without interrupting animations
5. IF user closes portal before content finishes loading, THE Load_Cancellation SHALL stop the pending load

### Requirement 29: Portal Window Placement in Multiple Bays

**User Story:** As a content curator, I want to place multiple windows across different corridor bays, so that the entire corridor offers multiple portal entry points.

#### Acceptance Criteria

1. WHEN multiple bays exist in corridor, THE Window_Placement_System SHALL support windows in each bay independently
2. WHEN windows are placed across bays, EACH window SHALL have correct z-position based on its bay index
3. WHEN user navigates between bays, EACH bay's windows SHALL remain interactive and correctly positioned
4. WHILE user is at a specific bay location, THE Portal_System SHALL prioritize rendering nearby windows
5. WHEN user scrolls to a far bay, THE Distant_Windows SHALL fade out based on frustum culling

### Requirement 30: Configuration File for Window Definitions

**User Story:** As a developer, I want window definitions stored in configuration, so that windows can be easily added/removed without code changes.

#### Acceptance Criteria

1. WHEN the corridor loads, THE Config_Loader SHALL read window definitions from a configuration file or data structure
2. WHEN config is loaded, THE Window_Registry SHALL be populated with all defined windows
3. WHEN a window definition is invalid, THE Config_Validator SHALL log error and skip that window
4. WHEN corridor renders, EACH window in config SHALL be instantiated and positioned according to config values
5. WHEN config is updated, THE Scene_Update SHALL reflect changes on next corridor load

### Requirement 31: Bounding Geometry for Raycasting

**User Story:** As a developer, I want efficient raycasting using precomputed bounding geometry, so that hit detection is fast and accurate.

#### Acceptance Criteria

1. WHEN a window is created, THE Bounding_Geometry SHALL be a box encompassing the entire frame and glass
2. WHEN raycasting tests a window, THE Test_Geometry SHALL be the precomputed bounding box
3. WHEN raycasting hits bounding box, THE Hit_Confirmation SHALL use fine-grained geometry for accuracy
4. WHEN bounding geometry is cached, THE Cache_Persistence SHALL maintain it until window is removed
5. WHEN window is destroyed, THE Geometry_Cleanup SHALL dispose the bounding box geometry

### Requirement 32: Portal State Queries

**User Story:** As a developer, I want to query portal state for conditional rendering and logic, so that UI and behavior respond correctly to portal state.

#### Acceptance Criteria

1. WHEN querying portal state, THE State_Query_API SHALL provide getPortalState(windowId) returning PortalState or null
2. WHEN querying active portals, THE State_Query_API SHALL provide getActivePortals() returning array of active portals (max 3)
3. WHEN querying max portals check, THE State_Query_API SHALL provide canActivatePortal() returning true/false
4. WHEN checking portal visibility, THE State_Query_API SHALL provide isWindowVisible(windowId) based on frustum and distance
5. WHEN rendering UI, THE State_Integration SHALL use these queries to conditionally render loading spinners, error messages, etc.

### Requirement 33: WebGL Render Target Creation

**User Story:** As a developer, I want render targets created with proper WebGL configuration, so that content renders correctly to texture.

#### Acceptance Criteria

1. WHEN a render target is created, THE RenderTarget_Config SHALL use THREE.RGBAFormat for RGBA color data
2. WHEN a render target is created, THE RenderTarget_Config SHALL use THREE.UnsignedByteType for 8-bit channels
3. WHEN a render target is created, THE Dimensions SHALL match portal window size (small: 128×96, medium: 160×100, large: 240×160 at 0.5 pixel ratio)
4. WHEN render target is created, THE Filter_Config SHALL use THREE.LinearFilter for both mag and min filtering
5. WHEN render target is disposed, THE GPU_Memory SHALL be freed immediately

### Requirement 34: React Component Dynamic Importing

**User Story:** As a developer, I want portal content components lazy-loaded from React pages, so that page code doesn't load until portal is opened.

#### Acceptance Criteria

1. WHEN portal content type is determined, THE Import_System SHALL dynamically import the matching React component
2. WHEN importing Portfolio content, THE Import_Path SHALL reference PortfolioPage component
3. WHEN importing Services content, THE Import_Path SHALL reference ServicesPage component
4. WHEN importing About content, THE Import_Path SHALL reference AboutPage component
5. WHEN importing Contact content, THE Import_Path SHALL reference ContactPage component
6. IF component import fails, THE Error_Handler SHALL display error and prevent portal opening

### Requirement 35: HTML Canvas Conversion to Texture

**User Story:** As a developer, I want React DOM converted to canvas then to WebGL texture, so that arbitrary React content renders inside portals.

#### Acceptance Criteria

1. WHEN portal content renders, THE React_Render SHALL render component to offscreen DOM
2. WHEN React DOM is ready, THE Canvas_Conversion SHALL use html2canvas to convert DOM to canvas
3. WHEN canvas is captured, THE Texture_Creation SHALL create THREE.CanvasTexture from the canvas
4. WHEN texture is created, THE GPU_Upload SHALL upload texture to GPU VRAM
5. WHEN texture is no longer needed, THE Texture_Disposal SHALL dispose the canvas and texture

### Requirement 36: Texture Caching for Portals

**User Story:** As a performance optimizer, I want portal textures cached in GPU memory while portal is active, so that content doesn't need to re-render every frame.

#### Acceptance Criteria

1. WHEN portal content is rendered to texture, THE Texture_Cache SHALL store the texture in state manager
2. WHILE portal is open, THE Cached_Texture SHALL persist in GPU VRAM
3. WHEN portal content needs update, THE Update_Flag SHALL trigger re-rendering only for changed sections
4. WHEN portal closes, THE Cache_Invalidation SHALL remove texture from GPU memory
5. WHEN user reopens same portal, THE Cache_Reuse SHALL check if texture is still cached and reuse if available

### Requirement 37: Portal Content Scrolling Isolation

**User Story:** As a developer, I want scrolling inside portals isolated from corridor camera movement, so that users can scroll portal content without affecting navigation.

#### Acceptance Criteria

1. WHEN pointer is over portal content, THE Event_Capture SHALL capture scroll/wheel events
2. WHEN scroll is captured, THE Portal_Scroll_Handler SHALL process scroll within portal container
3. WHEN portal scroll completes, THE Event_Bubble SHALL NOT bubble scroll to corridor camera
4. WHILE portal content is being scrolled, THE Corridor_Movement SHALL be disabled
5. WHEN pointer leaves portal, THE Event_Release SHALL resume normal scroll handling for corridor

### Requirement 38: Window Glow Intensity Animation

**User Story:** As a UX designer, I want smooth glow intensity animation on hover, so that the hover effect feels responsive.

#### Acceptance Criteria

1. WHEN pointer enters window, THE Glow_Animate SHALL increase glowIntensity from 0 to maxIntensity over 150ms
2. WHEN pointer exits window, THE Glow_Animate SHALL decrease glowIntensity from maxIntensity to 0 over 150ms
3. WHEN glowIntensity increases, THE Material_Emission SHALL brighten frame color proportionally
4. WHEN glow animation completes, THE Glow_State SHALL remain stable until pointer re-enters
5. WHERE multiple windows show glow simultaneously, THE Glow_Isolation SHALL maintain independent animations

### Requirement 39: Portal Scale and Opacity Animation

**User Story:** As a UX designer, I want opening portals to scale and fade in smoothly, so that portal appearance is polished.

#### Acceptance Criteria

1. WHEN portal begins opening, THE Scale_Animation SHALL animate from 0.8 to 1.0 over 300ms
2. WHEN portal begins opening, THE Opacity_Animation SHALL animate from 0.0 to 1.0 over 300ms
3. WHEN portal closes, THE Scale_Animation SHALL animate from 1.0 to 0.8 over 300ms
4. WHEN portal closes, THE Opacity_Animation SHALL animate from 1.0 to 0.0 over 300ms
5. WHEN animation completes, THE Transform_Finalization SHALL set final values exactly (1.0 scale, 1.0 opacity for open state)

### Requirement 40: Nearest Window Priority in Raycasting

**User Story:** As a developer, I want raycasting to return only the nearest window when multiple overlap, so that click behavior is unambiguous.

#### Acceptance Criteria

1. WHEN raycasting tests multiple windows, THE Hit_Ranking SHALL compute distance to each intersection
2. WHEN multiple windows are hit, THE Closest_Selection SHALL select the window with minimum distance
3. WHEN closest window is selected, THE Hit_Return SHALL provide only that window's ID and point
4. WHEN windows are equidistant, THE Tie_Breaker SHALL use a consistent ordering (e.g., registry order)
5. WHEN only one window is hit, THE Single_Hit_Return SHALL provide that window without ranking overhead

### Requirement 41: Scroll Progress Integration

**User Story:** As an integration engineer, I want portal system to integrate with corridor scroll progress tracking, so that portals move with user navigation.

#### Acceptance Criteria

1. WHEN corridor scroll progress changes, THE Portal_System SHALL track the new progress
2. WHEN user scrolls to different bay, THE Visible_Windows SHALL update based on camera position
3. WHEN user is at specific scroll position, THE Portal_State SHALL be consistent with camera location
4. WHILE user navigates corridor, EXISTING portals shall remain open and visible if in current view
5. WHEN user scrolls far from an open portal, THE Portal_Fade SHALL gracefully fade portal opacity

### Requirement 42: Async Content Loading Queue

**User Story:** As a developer, I want multiple portals to queue content loading sequentially to avoid GPU flooding, so that system remains stable under rapid activation.

#### Acceptance Criteria

1. WHEN first portal activates, THE Content_Queue SHALL begin loading its content immediately
2. WHEN second portal activates before first completes, THE Content_Queue SHALL queue its content behind first
3. WHEN first portal's content finishes, THE Queue_Processing SHALL proceed with next queued content
4. WHILE content is loading, THE Queue_Status SHALL prevent duplicate loads for same window
5. IF user closes a queued portal before loading starts, THE Queue_Removal SHALL cancel that load

### Requirement 43: Performance Monitoring and Debugging

**User Story:** As a developer, I want to monitor portal system performance metrics, so that I can identify and fix performance issues.

#### Acceptance Criteria

1. WHEN system is running, THE Perf_Monitor SHALL track frame rate (target ≥55fps)
2. WHEN portals are rendering, THE Perf_Monitor SHALL measure render-to-texture time per portal
3. WHEN raycasting occurs, THE Perf_Monitor SHALL measure raycasting time per frame
4. WHEN portal state changes, THE Debug_Logger SHALL log state transition and timing
5. WHERE performance drops below target, THE Alert_System SHALL flag underperforming portals or systems

### Requirement 44: Browser Compatibility

**User Story:** As a developer, I want portal system compatible with modern browsers, so that users on different platforms can use portals.

#### Acceptance Criteria

1. THE Portal_System SHALL work in browsers supporting WebGL 2.0 (Chrome, Firefox, Safari, Edge)
2. THE Portal_System SHALL use Pointer Events API supported by all modern browsers
3. WHEN using async/await for content loading, THE Transpilation SHALL target ES2020+ JavaScript
4. WHEN using WeakMap for efficient data structures, THE Browser_Support SHALL be verified for all targets
5. WHEN using Canvas rendering, THE Canvas_Context SHALL use 2D context with standard API

### Requirement 45: Mobile Input Support

**User Story:** As a user, I want portals to work with touch input on mobile devices, so that I can interact with portals on tablets and phones.

#### Acceptance Criteria

1. WHEN using touch input, THE Touch_Handler SHALL convert touch events to pointer events
2. WHEN user taps a window, THE Tap_Detection SHALL activate portal (same as click on desktop)
3. WHEN user touches and moves pointer over windows, THE Touch_Hover SHALL apply hover state to touched window
4. WHEN user releases touch, THE Touch_Release SHALL finalize any activation or interaction
5. WHERE touch device has multiple touches, THE Multi_Touch_Handling SHALL process only primary touch for window interaction

### Requirement 46: Accessibility: Keyboard Navigation

**User Story:** As a user with mobility limitations, I want to navigate and activate portals using keyboard, so that I can access portals without mouse/touch.

#### Acceptance Criteria

1. WHEN Tab key is pressed, THE Keyboard_Focus SHALL cycle through windows in logical order
2. WHEN window has keyboard focus, THE Visual_Indicator SHALL show which window is focused (frame highlight)
3. WHEN Enter key is pressed on focused window, THE Keyboard_Activation SHALL activate that portal
4. WHEN Escape key is pressed, THE Portal_Close SHALL close currently open portal
5. WHEN arrow keys are pressed, THE Window_Navigation SHALL move focus between nearby windows in that direction

### Requirement 47: Portal Content Aria Labels

**User Story:** As an accessibility advocate, I want portal content to have proper ARIA labels, so that screen reader users understand portal purpose.

#### Acceptance Criteria

1. WHEN window is rendered, THE Aria_Role SHALL be set to button-like semantic role
2. WHEN window is rendered, THE Aria_Label SHALL indicate portal content type (e.g., "Portfolio portal")
3. WHEN window is hovered, THE Aria_Live_Region SHALL announce "Window interactive" to screen readers
4. WHEN portal is opening, THE Aria_Live_Region SHALL announce "Portal opening, content loading"
5. WHEN portal content finishes loading, THE Aria_Live_Region SHALL announce "Portal content ready"

### Requirement 48: Portal Window Position Relative to Corridor

**User Story:** As a developer, I want window positions calculated relative to corridor geometry, so that windows align correctly in 3D space.

#### Acceptance Criteria

1. WHEN calculating window position, THE Position_Calc SHALL use bay index to determine z-coordinate (z = bay_depth × bay_index)
2. WHEN calculating window position, THE Position_Calc SHALL use side (left/right) to determine x-coordinate (x = ±half_width - offset)
3. WHEN calculating window position, THE Position_Calc SHALL use heightOffset to determine y-coordinate (y = height/2 + heightOffset)
4. WHEN window is positioned, ALL coordinates SHALL be in corridor's local space, not world space initially
5. WHEN corridor transforms, THE Window_Transform SHALL move with corridor geometry

### Requirement 49: Glow Color Consistency

**User Story:** As a visual designer, I want window glow color to match frame material color, so that hover effect looks visually cohesive.

#### Acceptance Criteria

1. WHEN window has glow applied, THE Glow_Color SHALL be derived from frame material color
2. WHEN frame is brass (0xc9a876), THE Glow_Color SHALL brighten the brass tone by 30-50%
3. WHEN frame is steel (other colors), THE Glow_Color SHALL brighten that color similarly
4. WHEN glow animates in/out, THE Color_Interpolation SHALL smoothly blend from base to glow color
5. WHEN multiple windows glow, EACH glow color SHALL reflect its corresponding frame color

### Requirement 50: Portal Opening Transition Completion Signal

**User Story:** As a developer, I want to know when portal opening completes so I can enable interactions, so that portals don't accept clicks before fully opened.

#### Acceptance Criteria

1. WHEN portal animation completes, THE onAnimationComplete_Callback SHALL fire exactly once
2. WHEN callback fires, THE Portal_State SHALL be 'open' and fully interactive
3. WHEN callback fires, THE Portal_Content SHALL be fully rendered and visible
4. IF portal is interrupted (user closes), THE Callback SHALL NOT fire
5. WHEN callback completes, THE Portal_Interaction_Enable SHALL allow clicks inside portal content

### Requirement 51: Window Registry Spatial Indexing

**User Story:** As a developer, I want windows stored in spatial index for efficient queries, so that raycasting and culling are fast.

#### Acceptance Criteria

1. WHEN windows are created, THE Window_Registry SHALL build spatial index (BVH or grid)
2. WHEN querying visible windows, THE Registry_Query SHALL return subset of windows efficiently
3. WHEN window is added to corridor, THE Registry_Update SHALL add it to spatial index
4. WHEN window is removed from corridor, THE Registry_Update SHALL remove it from spatial index
5. WHEN querying windows near camera, THE Spatial_Query SHALL return only nearby windows

### Requirement 52: Corridor Scene Integration

**User Story:** As a developer, I want portals integrated into the main HomeCorridor or GalleryScene component, so that portals render with the corridor.

#### Acceptance Criteria

1. WHEN HomeCorridor renders, THE Portal_System SHALL initialize and be ready for interactions
2. WHEN corridor scene loads, THE Window_Instantiation SHALL create all windows from configuration
3. WHEN portal system is active, ALL portals shall render as part of the main Three.js scene
4. WHEN user navigates corridor, THE Portal_Persistence SHALL maintain portal state across scene updates
5. WHEN user leaves corridor, THE Portal_Cleanup SHALL dispose all resources and deactivate portals

### Requirement 53: Three.js Material and Geometry Pooling

**User Story:** As a performance optimizer, I want to reuse geometries and materials across windows, so that memory usage stays low.

#### Acceptance Criteria

1. WHEN creating windows of same size, THE Geometry_Pool SHALL reuse frame geometry across instances
2. WHEN creating windows with same frame color, THE Material_Pool SHALL reuse frame material across instances
3. WHEN pooled resources are updated, THE Update_Distribution SHALL update all instances consistently
4. WHEN removing a window, THE Pool_Retention SHALL keep pooled resources if other windows use them
5. WHEN removing all windows of a size, THE Pool_Cleanup SHALL dispose the pooled resources

### Requirement 54: Pointer Event Type Support

**User Story:** As a developer, I want pointer events properly detected for both mouse and touch, so that interactions work on all input devices.

#### Acceptance Criteria

1. WHEN user moves mouse, THE Mouse_Events SHALL be processed via pointermove event
2. WHEN user taps touch screen, THE Touch_Events SHALL be processed via pointerdown/pointerup events
3. WHEN using stylus on tablet, THE Stylus_Events SHALL be processed via pointer events
4. WHEN event is processed, THE Event_Type_Detection SHALL determine input device correctly
5. WHEN multi-touch is used, THE Primary_Touch SHALL be processed for window interaction

### Requirement 55: NDC Conversion for Raycasting

**User Story:** As a developer, I want mouse coordinates correctly converted to Normalized Device Coordinates for raycasting, so that hit detection aligns with visual pointer position.

#### Acceptance Criteria

1. WHEN mouse event is received, THE Coordinate_Mapping SHALL convert screenX to NDC: (screenX / viewportWidth) × 2 - 1
2. WHEN mouse event is received, THE Coordinate_Mapping SHALL convert screenY to NDC: -(screenY / viewportHeight) × 2 + 1
3. WHEN NDC is calculated, THE Result_Range SHALL be in [-1, 1] for both X and Y
4. WHEN NDC is used in raycaster, THE Ray_Direction SHALL correctly point through mouse position in camera space
5. WHEN viewport is resized, THE Coordinate_Recalculation SHALL adapt to new viewport dimensions

### Requirement 56: Max Portal Enforcement During Rapid Clicks

**User Story:** As a developer, I want the 3-portal limit enforced even with rapid clicks, so that users can't exceed resource limits through rapid interaction.

#### Acceptance Criteria

1. WHEN user rapidly clicks multiple windows, THE Activation_Queue SHALL process them sequentially, not in parallel
2. WHEN fourth window is clicked while three are open, THE Lock_Mechanism SHALL prevent new activation
3. WHEN oldest portal closes, THE Unlock_Handler SHALL allow next queued window to activate
4. WHILE three portals are active, THE Interaction_Block SHALL reject new portal activations
5. WHEN user closes a portal manually, THE Count_Decrement SHALL immediately allow new activation
