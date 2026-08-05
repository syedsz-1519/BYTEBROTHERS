# Tasks: 360-Degree Rotatable Portfolio Website

## Phase 1: Foundation Setup

### 1.1 Project Structure and Dependencies
- [ ] 1.1.1 Create `/src/components/3d/rotatable/` directory structure
- [ ] 1.1.2 Verify Three.js, @react-three/fiber, and @react-three/drei are installed
- [ ] 1.1.3 Create TypeScript interfaces in `types/rotatable.ts` (SphereContentItem, RotationControlsOptions, etc.)
- [ ] 1.1.4 Set up Three.js scene configuration constants in `utils/threejsConfig.ts`

### 1.2 Base Three.js Setup
- [ ] 1.2.1 Create `RotatablePortfolioSphere.tsx` component with Canvas
- [ ] 1.2.2 Initialize PerspectiveCamera with proper aspect ratio handling
- [ ] 1.2.3 Set up basic lighting (directional, ambient, point lights)
- [ ] 1.2.4 Create placeholder sphere geometry (IcosahedronGeometry)
- [ ] 1.2.5 Test basic rendering and camera positioning

## Phase 2: Rotation Mechanics

### 2.1 Input Controls
- [ ] 2.1.1 Create `RotationControls.tsx` hook for unified input handling
- [ ] 2.1.2 Implement mouse event handlers (pointerdown, pointermove, pointerup)
- [ ] 2.1.3 Implement touch event handlers (touchstart, touchmove, touchend)
- [ ] 2.1.4 Calculate delta movement and convert to rotation angles
- [ ] 2.1.5 Test mouse and touch input separately on desktop and mobile

### 2.2 Quaternion-Based Rotation
- [ ] 2.2.1 Create rotation utility functions for quaternion math
- [ ] 2.2.2 Implement rotation application to sphere mesh
- [ ] 2.2.3 Convert pixel delta to 3D rotation quaternion
- [ ] 2.2.4 Test rotation smoothness and accuracy
- [ ] 2.2.5 Verify rotation works in all directions (X, Y, Z axes)

### 2.3 Inertia and Damping
- [ ] 2.3.1 Calculate angular velocity from final mouse/touch position
- [ ] 2.3.2 Implement exponential decay damping function
- [ ] 2.3.3 Apply inertia on each animation frame
- [ ] 2.3.4 Test momentum feel (smooth deceleration)
- [ ] 2.3.5 Tune damping factor for satisfying physics feel

## Phase 3: Content Management

### 3.1 Spherical Coordinate System
- [ ] 3.1.1 Create spherical coordinate calculation function
- [ ] 3.1.2 Distribute N items evenly on sphere surface (golden spiral algorithm)
- [ ] 3.1.3 Test position distribution with 10, 20, 50 items
- [ ] 3.1.4 Verify positions are at correct radius distance

### 3.2 Content Positioning
- [ ] 3.2.1 Create `SphereContent.tsx` component for rendering items
- [ ] 3.2.2 Implement billboard system (objects always face camera)
- [ ] 3.2.3 Create content item meshes with proper scale and rotation
- [ ] 3.2.4 Load content from studioData.ts (projects, services, etc.)
- [ ] 3.2.5 Test content appears at correct positions on sphere

### 3.3 LOD (Level of Detail) System
- [ ] 3.3.1 Calculate distance from camera to each content item
- [ ] 3.3.2 Implement LOD level determination (high, medium, low)
- [ ] 3.3.3 Create high-detail card meshes (full images, text, metadata)
- [ ] 3.3.4 Create medium-detail thumbnails (smaller images, title only)
- [ ] 3.3.5 Create low-detail dots (just position indicator)
- [ ] 3.3.6 Test LOD transitions as camera approaches/moves away

## Phase 4: Interaction & Selection

### 4.1 Raycasting and Selection
- [ ] 4.1.1 Implement raycasting from camera through mouse position
- [ ] 4.1.2 Detect which content item is under cursor
- [ ] 4.1.3 Create visual feedback for hovered items (glow, highlight)
- [ ] 4.1.4 Implement click handler for content selection
- [ ] 4.1.5 Test selection works across all sphere rotations

### 4.2 Visual Feedback
- [ ] 4.2.1 Add glow/emissive material to hovered items
- [ ] 4.2.2 Animate selection with scale and light effects
- [ ] 4.2.3 Create focus ring around selected item
- [ ] 4.2.4 Add hover cursor changes (pointer on interactive items)
- [ ] 4.2.5 Test visual feedback is clear and responsive

### 4.3 Modal Integration
- [ ] 4.3.1 Create `SphereContentModal.tsx` for detail view
- [ ] 4.3.2 Display full project/service/contact details
- [ ] 4.3.3 Animate modal open/close with transitions
- [ ] 4.3.4 Allow navigation between adjacent items
- [ ] 4.3.5 Test modal works with all content types

## Phase 5: Camera and Navigation

### 5.1 Camera Controller
- [ ] 5.1.1 Create `SphereCameraController.tsx` hook
- [ ] 5.1.2 Implement camera position tracking
- [ ] 5.1.3 Create smooth camera transitions with easing functions
- [ ] 5.1.4 Handle window resize and viewport updates
- [ ] 5.1.5 Test camera behavior on different screen sizes

### 5.2 Zoom Functionality
- [ ] 5.2.1 Implement zoom in/out with mouse wheel or touch pinch
- [ ] 5.2.2 Calculate new FOV or camera distance based on zoom level
- [ ] 5.2.3 Constrain zoom to reasonable range (0.5x to 3x)
- [ ] 5.2.4 Test zoom animations are smooth
- [ ] 5.2.5 Verify content visibility at all zoom levels

### 5.3 Auto-Rotation
- [ ] 5.3.1 Implement slow continuous rotation when idle
- [ ] 5.3.2 Detect user input to pause auto-rotation
- [ ] 5.3.3 Resume auto-rotation after idle timeout
- [ ] 5.3.4 Allow user to toggle auto-rotation on/off
- [ ] 5.3.5 Respect prefers-reduced-motion for auto-rotation

## Phase 6: Sphere Types and Content

### 6.1 Portfolio Sphere
- [ ] 6.1.1 Create sphere for displaying all portfolio projects
- [ ] 6.1.2 Load project data and position on sphere
- [ ] 6.1.3 Display project images as billboards
- [ ] 6.1.4 Show project titles and short descriptions
- [ ] 6.1.5 Test with actual project data from studioData.ts

### 6.2 Services Sphere
- [ ] 6.2.1 Create sphere for displaying services
- [ ] 6.2.2 Load services data and position on sphere
- [ ] 6.2.3 Create service cards with icons or images
- [ ] 6.2.4 Include service descriptions
- [ ] 6.2.5 Test services sphere navigation

### 6.3 About/Team Sphere
- [ ] 6.3.1 Create sphere for founder/team information
- [ ] 6.3.2 Position founder profiles on sphere
- [ ] 6.3.3 Display founder images and bios
- [ ] 6.3.4 Add founder roles and achievements
- [ ] 6.3.5 Test team sphere rendering

### 6.4 Contact Sphere
- [ ] 6.4.1 Create sphere for contact methods
- [ ] 6.4.2 Position contact options (email, phone, social, form)
- [ ] 6.4.3 Create clickable contact items
- [ ] 6.4.4 Integrate with existing contact functionality
- [ ] 6.4.5 Test contact sphere interactions

## Phase 7: UI Controls and HUD

### 7.1 Overlay Controls
- [ ] 7.1.1 Create HUD component for overlay controls
- [ ] 7.1.2 Add zoom in/out buttons
- [ ] 7.1.3 Add auto-rotate toggle button
- [ ] 7.1.4 Add sphere type selector (portfolio, services, about, contact)
- [ ] 7.1.5 Style controls with Times New Roman font

### 7.2 Instructions and Help
- [ ] 7.2.1 Create on-screen instructions (drag to rotate, click to select)
- [ ] 7.2.2 Show instructions on first load
- [ ] 7.2.3 Add collapsible help panel
- [ ] 7.2.4 Make instructions dismissible
- [ ] 7.2.5 Test instructions visibility and readability

### 7.3 Status Indicators
- [ ] 7.3.1 Add rotation direction/angle indicator
- [ ] 7.3.2 Show current sphere type indicator
- [ ] 7.3.3 Display frame rate monitor (dev mode)
- [ ] 7.3.4 Show loading state for content
- [ ] 7.3.5 Test all indicators update correctly

## Phase 8: Responsive Design

### 8.1 Desktop Optimization
- [ ] 8.1.1 Test on 1920x1080 resolution
- [ ] 8.1.2 Test on 2560x1440 resolution
- [ ] 8.1.3 Test on ultra-wide displays (3840x1080)
- [ ] 8.1.4 Verify performance maintains 60 FPS
- [ ] 8.1.5 Test with mouse and trackpad inputs

### 8.2 Mobile Optimization
- [ ] 8.2.1 Test on mobile portrait (360x640)
- [ ] 8.2.2 Test on mobile landscape (800x600)
- [ ] 8.2.3 Test on tablets (1024x768)
- [ ] 8.2.4 Optimize touch controls for mobile
- [ ] 8.2.5 Ensure performance above 30 FPS on average devices

### 8.3 Layout Adaptation
- [ ] 8.3.1 Adjust HUD control positioning for mobile
- [ ] 8.3.2 Scale content item sizes based on viewport
- [ ] 8.3.3 Optimize modal for mobile screens
- [ ] 8.3.4 Test landscape/portrait orientation changes
- [ ] 8.3.5 Verify no content is cut off at any breakpoint

## Phase 9: Performance Optimization

### 9.1 Rendering Optimization
- [ ] 9.1.1 Implement frustum culling
- [ ] 9.1.2 Implement object pooling for particles (if used)
- [ ] 9.1.3 Optimize sphere mesh geometry (use appropriate segment count)
- [ ] 9.1.4 Implement texture atlasing for content images
- [ ] 9.1.5 Measure and optimize render loop

### 9.2 Memory Management
- [ ] 9.2.1 Profile memory usage during scene setup
- [ ] 9.2.2 Implement lazy loading for content images
- [ ] 9.2.3 Cleanup three.js resources in useEffect cleanup
- [ ] 9.2.4 Monitor memory usage during extended sessions
- [ ] 9.2.5 Implement garbage collection where needed

### 9.3 Asset Optimization
- [ ] 9.3.1 Compress all project/service images
- [ ] 9.3.2 Generate multiple resolution variants (2x, 1x, 0.5x)
- [ ] 9.3.3 Use WebP format with PNG fallback
- [ ] 9.3.4 Optimize 3D model assets if any
- [ ] 9.3.5 Test CDN loading and caching

## Phase 10: Accessibility

### 10.1 Keyboard Navigation
- [ ] 10.1.1 Implement Tab key cycling through content items
- [ ] 10.1.2 Implement arrow keys for sphere rotation
- [ ] 10.1.3 Implement Enter/Space for selection
- [ ] 10.1.4 Implement Escape to close modals
- [ ] 10.1.5 Test keyboard-only navigation workflow

### 10.2 Screen Reader Support
- [ ] 10.2.1 Add ARIA labels to all interactive elements
- [ ] 10.2.2 Announce sphere type on load
- [ ] 10.2.3 Announce selected item details
- [ ] 10.2.4 Provide context for current rotation state
- [ ] 10.2.5 Test with screen reader (NVDA, JAWS, VoiceOver)

### 10.3 Visual Accessibility
- [ ] 10.3.1 Ensure text contrast ratio 4.5:1 minimum
- [ ] 10.3.2 Use minimum 16px font size for body text
- [ ] 10.3.3 Provide focus indicators (visible focus ring)
- [ ] 10.3.4 Avoid color-only information encoding
- [ ] 10.3.5 Test with color blindness simulator

### 10.4 Motion and Animation
- [ ] 10.4.1 Respect prefers-reduced-motion media query
- [ ] 10.4.2 Disable auto-rotation if reduced motion preferred
- [ ] 10.4.3 Remove momentum/inertia if reduced motion preferred
- [ ] 10.4.4 Use instant transitions instead of animations
- [ ] 10.4.5 Test with screen reader and reduced motion enabled

## Phase 11: Browser Compatibility

### 11.1 Cross-Browser Testing
- [ ] 11.1.1 Test on Chrome (latest)
- [ ] 11.1.2 Test on Firefox (latest)
- [ ] 11.1.3 Test on Safari (latest)
- [ ] 11.1.4 Test on Edge (latest)
- [ ] 11.1.5 Test on Samsung Internet (mobile)

### 11.2 WebGL Fallback
- [ ] 11.2.1 Detect WebGL support
- [ ] 11.2.2 Create 2D fallback view (grid layout)
- [ ] 11.2.3 Provide all functionality in fallback mode
- [ ] 11.2.4 Test fallback on browsers without WebGL
- [ ] 11.2.5 Warn user gracefully if WebGL unavailable

### 11.3 Legacy Browser Support
- [ ] 11.3.1 Test on WebGL 1.0 contexts
- [ ] 11.3.2 Provide polyfills if needed
- [ ] 11.3.3 Graceful degradation for unsupported features
- [ ] 11.3.4 Test error messages are helpful
- [ ] 11.3.5 Document minimum browser versions

## Phase 12: Integration with Existing App

### 12.1 Routing Integration
- [ ] 12.1.1 Create `RotatablePortfolioPage.tsx` page component
- [ ] 12.1.2 Add route to App.tsx navigation
- [ ] 12.1.3 Update Navbar to include rotatable portfolio tab
- [ ] 12.1.4 Implement navigation between pages
- [ ] 12.1.5 Test page transitions work smoothly

### 12.2 Data Integration
- [ ] 12.2.1 Connect to existing studioData.ts
- [ ] 12.2.2 Load project data correctly
- [ ] 12.2.3 Load services data correctly
- [ ] 12.2.4 Load about/team data correctly
- [ ] 12.2.5 Test with real app data

### 12.3 Theme Integration
- [ ] 12.3.1 Apply ThemeContext colors to 3D scene
- [ ] 12.3.2 Update sphere materials on theme change
- [ ] 12.3.3 Update lighting on theme change
- [ ] 12.3.4 Test dark/light mode switching
- [ ] 12.3.5 Ensure consistent branding

## Phase 13: Testing and QA

### 13.1 Unit Tests
- [ ] 13.1.1 Test spherical coordinate calculations
- [ ] 13.1.2 Test quaternion rotation math
- [ ] 13.1.3 Test inertia decay algorithm
- [ ] 13.1.4 Test LOD level determination
- [ ] 13.1.5 Test content positioning algorithm

### 13.2 Integration Tests
- [ ] 13.2.1 Test input handling (mouse, touch, combined)
- [ ] 13.2.2 Test content loading and population
- [ ] 13.2.3 Test camera transitions
- [ ] 13.2.4 Test modal interactions
- [ ] 13.2.5 Test theme switching

### 13.3 E2E Tests
- [ ] 13.3.1 Test complete user journey (load → rotate → select → view modal)
- [ ] 13.3.2 Test navigation between sphere types
- [ ] 13.3.3 Test mobile vs desktop workflows
- [ ] 13.3.4 Test accessibility workflows
- [ ] 13.3.5 Test error scenarios

### 13.4 Performance Tests
- [ ] 13.4.1 Profile frame rate on desktop (target 60 FPS)
- [ ] 13.4.2 Profile frame rate on mobile (target 30+ FPS)
- [ ] 13.4.3 Measure input latency (target < 16ms)
- [ ] 13.4.4 Profile memory usage
- [ ] 13.4.5 Measure initial load time (target < 3s on 4G)

## Phase 14: Documentation and Deployment

### 14.1 Code Documentation
- [ ] 14.1.1 Add JSDoc comments to all exported functions
- [ ] 14.1.2 Document complex algorithms (spherical coords, quaternions, inertia)
- [ ] 14.1.3 Create README for rotatable portfolio system
- [ ] 14.1.4 Add usage examples in comments
- [ ] 14.1.5 Document TypeScript interfaces and types

### 14.2 User Documentation
- [ ] 14.2.1 Create user guide for rotating portfolio
- [ ] 14.2.2 Add keyboard shortcuts reference
- [ ] 14.2.3 Document touch gesture controls
- [ ] 14.2.4 Create troubleshooting section
- [ ] 14.2.5 Add accessibility instructions

### 14.3 Deployment Preparation
- [ ] 14.3.1 Run TypeScript compiler check
- [ ] 14.3.2 Run linting on all new code
- [ ] 14.3.3 Verify all assets are optimized
- [ ] 14.3.4 Test production build
- [ ] 14.3.5 Create deployment checklist

### 14.4 Go-Live
- [ ] 14.4.1 Deploy to staging environment
- [ ] 14.4.2 Perform final QA on staging
- [ ] 14.4.3 Deploy to production
- [ ] 14.4.4 Monitor performance metrics
- [ ] 14.4.5 Collect user feedback

## Phase 15: Post-Launch Monitoring

### 15.1 Performance Monitoring
- [ ] 15.1.1 Monitor frame rate performance in production
- [ ] 15.1.2 Track Core Web Vitals (LCP, CLS, FID)
- [ ] 15.1.3 Monitor error rates and exceptions
- [ ] 15.1.4 Track user interaction patterns
- [ ] 15.1.5 Analyze performance trends over time

### 15.2 User Feedback
- [ ] 15.2.1 Collect user feedback on portfolio experience
- [ ] 15.2.2 Track which sphere types are most used
- [ ] 15.2.3 Monitor bounce rate changes
- [ ] 15.2.4 Analyze engagement metrics
- [ ] 15.2.5 Identify improvement opportunities

### 15.3 Maintenance
- [ ] 15.3.1 Monitor for WebGL-related issues
- [ ] 15.3.2 Track browser compatibility issues
- [ ] 15.3.3 Fix reported bugs promptly
- [ ] 15.3.4 Optimize based on performance data
- [ ] 15.3.5 Plan future enhancements

## Success Criteria

### Functional Criteria
- [x] 360-degree sphere renders without errors
- [x] All input methods (mouse, touch, keyboard) work correctly
- [x] Content populates correctly from data source
- [x] Selection and modal interactions work as designed
- [x] Navigation between sphere types is smooth
- [x] Theme switching works correctly

### Performance Criteria
- [x] 60 FPS maintained on desktop during normal rotation
- [x] 30+ FPS maintained on mobile during normal rotation
- [x] Input latency < 16ms for rotation response
- [x] Memory usage < 50MB for 3D assets
- [x] Initial load time < 3 seconds on 4G network

### UX Criteria
- [x] Rotation feels natural and responsive
- [x] Momentum/inertia feels satisfying
- [x] Content is clearly visible and selectable
- [x] All sphere types are easily navigable
- [x] UI controls are intuitive and accessible

### Quality Criteria
- [x] Code passes TypeScript strict mode
- [x] All tests pass (unit, integration, E2E)
- [x] No console errors or warnings
- [x] Accessibility standards met (WCAG 2.1 AA)
- [x] Browser compatibility matrix verified
