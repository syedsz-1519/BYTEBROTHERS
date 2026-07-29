# Website Design & Interaction Rules
## Byte Brothers 3D Portfolio Brand Guidelines

**Document Version:** 1.0  
**Last Updated:** July 30, 2026

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components & Patterns](#components--patterns)
6. [Animations & Interactions](#animations--interactions)
7. [Micro-Interactions](#micro-interactions)
8. [Accessibility Rules](#accessibility-rules)
9. [Mobile Specifications](#mobile-specifications)
10. [Performance Rules](#performance-rules)

---

## Design Philosophy

### Core Principles

**Professional Premium**
- Elevated aesthetic reflecting enterprise expertise
- Quality over quantity (whitespace, careful composition)
- Attention to detail in every interaction

**Clarity & Purposefulness**
- Every element serves a clear function
- Information hierarchy guides user attention
- No decorative elements without purpose

**Performance-First**
- Design decisions consider performance impact
- Animations enhance, not distract
- Fast load times integral to brand perception

**Accessibility by Default**
- Inclusive design from the start
- WCAG 2.1 AA compliance mandatory
- Assistive technology support built-in

**Responsive Excellence**
- Seamless experience across all devices
- Touch-first mobile design
- Keyboard navigation always functional

---

## Color System

### Primary Palette

**Blue-600** (Primary Action)
- Hex: `#2563eb`
- RGB: `37, 99, 235`
- HSL: `217°, 91%, 54%`
- Usage: Primary CTA buttons, links, focus states

**Blue-900** (Dark Mode Accent)
- Hex: `#1e3a8a`
- RGB: `30, 58, 138`
- HSL: `217°, 65%, 33%`
- Usage: Dark mode backgrounds, deep emphasis

**Slate-950** (Dark Mode Background)
- Hex: `#0f172a`
- RGB: `15, 23, 42`
- HSL: `217°, 48%, 11%`
- Usage: Dark mode primary background

**Slate-100** (Light Foreground)
- Hex: `#f1f5f9`
- RGB: `241, 245, 249`
- HSL: `210°, 40%, 96%`
- Usage: Dark mode text, light mode background accents

### Accent Palette

**Emerald-400** (Success/Performance)
- Hex: `#34d399`
- RGB: `52, 211, 153`
- HSL: `160°, 84%, 52%`
- Usage: Success messages, positive indicators

**Amber-500** (Highlights/Caution)
- Hex: `#f59e0b`
- RGB: `245, 158, 11`
- HSL: `38°, 92%, 50%`
- Usage: Warnings, highlights, secondary emphasis

### Neutral Palette

| Name | Hex | RGB | Use Case |
|------|-----|-----|----------|
| White | `#ffffff` | 255,255,255 | Light mode background |
| Gray-50 | `#f9fafb` | 249,250,251 | Subtle backgrounds |
| Gray-100 | `#f3f4f6` | 243,244,246 | Card backgrounds |
| Gray-200 | `#e5e7eb` | 229,231,235 | Borders, dividers |
| Gray-400 | `#9ca3af` | 156,163,175 | Secondary text |
| Gray-600 | `#4b5563` | 75,85,99 | Body text |
| Gray-900 | `#111827` | 17,24,39 | Primary text |

### Color Usage Rules

```
Light Mode:
├── Background: White (#ffffff)
├── Primary Text: Gray-900 (#111827)
├── Secondary Text: Gray-600 (#4b5563)
├── Primary CTA: Blue-600 (#2563eb)
├── Hover CTA: Blue-700 (#1d4ed8)
└── Disabled: Gray-300 (#d1d5db)

Dark Mode:
├── Background: Slate-950 (#0f172a)
├── Primary Text: Slate-100 (#f1f5f9)
├── Secondary Text: Slate-300 (#cbd5e1)
├── Primary CTA: Blue-400 (#60a5fa)
├── Hover CTA: Blue-300 (#93c5fd)
└── Disabled: Slate-700 (#334155)
```

### Contrast Requirements

- Body text: Minimum 4.5:1 contrast ratio (WCAG AA)
- Large text (18pt+): Minimum 3:1 contrast ratio
- Focus indicators: Always visible (minimum 2:1 difference)
- Disabled states: Minimum 3:1 from background

---

## Typography

### Font Stack

**Headlines (h1-h3)**
- Family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
- Weight: 600-700 (semibold to bold)
- Letter-spacing: -0.02em (tight)
- Line-height: 1.2 (tight)

**Body Text (p, span)**
- Family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
- Weight: 400 (regular)
- Letter-spacing: 0 (normal)
- Line-height: 1.6 (relaxed)

### Type Scale

```
H1 (Page Title)
├── Desktop: 48px / 64px
├── Mobile: 32px / 40px
├── Weight: 700
└── Letter-spacing: -0.02em

H2 (Section Title)
├── Desktop: 36px
├── Mobile: 24px
├── Weight: 600
└── Letter-spacing: -0.01em

H3 (Subsection)
├── Desktop: 28px
├── Mobile: 20px
├── Weight: 600
└── Letter-spacing: -0.01em

Body (Regular Text)
├── Desktop: 16px
├── Mobile: 14px
├── Weight: 400
└── Line-height: 1.6

Small (Labels, Captions)
├── Desktop: 14px
├── Mobile: 12px
├── Weight: 500
└── Line-height: 1.5
```

### Typography Rules

1. **Hierarchy** - Always maintain visual hierarchy through size, weight, color
2. **Readability** - Minimum 14px on mobile, 16px on desktop
3. **Line Length** - 50-75 characters per line for body text
4. **Alignment** - Left-aligned for body text (right-to-left support future)
5. **Emphasis** - Use weight or color, not underlining or ALL CAPS

---

## Spacing & Layout

### Spacing Scale (8px Based)

```
xs:  4px    (tight spacing)
sm:  8px    (small spacing)
md:  16px   (default spacing)
lg:  24px   (medium spacing)
xl:  32px   (large spacing)
2xl: 48px   (extra large)
3xl: 64px   (triple)
4xl: 96px   (quad)
```

### Layout Grid

**Desktop (>1024px)**
- Max container width: 1280px (7xl)
- Horizontal padding: 24px
- Column gap: 24px
- Typical grid: 3-4 columns

**Tablet (768px - 1023px)**
- Max container width: full - 32px
- Horizontal padding: 16px
- Column gap: 16px
- Typical grid: 2 columns

**Mobile (<768px)**
- Max container width: full - 16px
- Horizontal padding: 12px
- Column gap: 12px
- Typical grid: 1 column

### Section Spacing

```
Between Major Sections:
├── Desktop: 96px vertical spacing
├── Tablet: 64px vertical spacing
└── Mobile: 48px vertical spacing

Within Section (items):
├── Between cards: 24px gap
├── Between paragraphs: 16px gap
├── List items: 12px gap
└── Inline elements: 8px gap
```

### Container Sizes

```
Hero Container: 100% viewport height
├── Desktop: max 1280px width
├── Mobile: 100% width, 60-80vh height
└── Padding: responsive

Section Container: 100% width
├── Max width: 1280px
├── Left/Right padding: 24px (desktop), 16px (tablet), 12px (mobile)
└── Top/Bottom padding: 96px (desktop), 64px (tablet), 48px (mobile)

Card Container: Fluid
├── Min width: 280px (mobile)
├── Max width: 100% container
├── Aspect ratio: Maintained via padding-bottom hack
└── Border radius: 8-12px
```

---

## Components & Patterns

### Button Specifications

**Primary Button**
- Background: Blue-600 (#2563eb)
- Text: White, 16px, 600 weight
- Padding: 12px 24px (height: 44px min touch target)
- Border radius: 6px
- Hover: Blue-700 background, scale 1.02
- Active: Blue-800 background, scale 0.98
- Disabled: Gray-300 background, 50% opacity
- Focus: 2px blue-500 outline, 4px offset
- Transition: 150ms ease-out
- Icon spacing: 8px left of text

**Secondary Button**
- Background: Gray-100
- Text: Gray-900, 16px, 600 weight
- Padding: 12px 24px
- Border: 1px solid Gray-300
- Hover: Gray-200 background
- All other specs: Same as primary

**Icon Button**
- Size: 40px x 40px minimum
- Icon: Center-aligned
- Hover: 10% background color shift
- Focus: Same as primary button

### Form Components

**Input Field**
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid Gray-300
- Border radius: 6px
- Font: 16px regular (prevent mobile zoom)
- Focus: Blue-500 border, 2px outline
- Placeholder: Gray-400, italic
- Error: Red-500 border, error message below
- Disabled: Gray-200 background, cursor not-allowed

**Textarea**
- Min height: 120px
- Resize: Vertical only
- All other specs: Same as input field

**Checkbox/Radio**
- Size: 20x20px
- Border: 2px
- Checked: Blue-600 background
- Focus: 2px offset outline
- Label: 12px offset, clickable

### Card Component

**Standard Card**
- Background: White (light mode), Slate-900 (dark mode)
- Border: 1px Gray-200 (light mode), Slate-800 (dark mode)
- Border radius: 8px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: Shadow increase, scale 1.02 (200ms)
- Responsive: Full width mobile, constrained desktop

### Badge/Tag Component

**Technology Tag**
- Background: Blue-100 (light mode), Blue-900 (dark mode)
- Text: Blue-600 (light mode), Blue-300 (dark mode)
- Padding: 4px 8px
- Border radius: 12px
- Font: 12px medium
- Icon: Optional left-aligned

---

## Animations & Interactions

### Animation Timing

```
Micro-interactions (hover, focus):
├── Duration: 150ms - 200ms
├── Easing: cubic-bezier(0.4, 0, 0.2, 1) [ease-out]
└── Property: opacity, transform (not position)

Scroll-triggered animations:
├── Duration: 400ms - 600ms
├── Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
└── Property: opacity, transform, clip-path

Loader/skeleton:
├── Duration: 1s - 2s
├── Easing: ease-in-out
└── Loop: Infinite until content loads

Page transitions:
├── Duration: 300ms - 400ms
├── Easing: ease-out
└── Direction: Fade in/out or slide
```

### Transform Effects

```
Scale Transform:
├── Hover state: scale(1.02)
├── Active state: scale(0.98)
├── Max scale: 1.05 (never excessive)
└── Applied to: buttons, cards, interactive elements

Translate Transform:
├── Hover: translateY(-2px) [lift effect]
├── Scroll reveal: translateY(20px) to translateY(0)
├── Applied to: cards, buttons, section headings
└── GPU accelerated: transform, not position

Rotate Transform:
├── 3D model: User-controlled via mouse/touch
├── Loading spinner: rotate(360deg) infinite
├── 3D parallax: Subtle rotateX/Y (max 5°)
└── Icon animations: rotateZ for accent effects
```

### Parallax Rules

**Parallax Velocity**
```
Background Layer:  0.5x scroll speed
Mid Layer:        0.75x scroll speed
Foreground Layer: 1.0x scroll speed (normal scroll)

Maximum displacement: 5px on desktop, 2px on mobile
GPU accelerated: transform: translate3d()
Mobile optimization: Disable on devices <768px width with low GPU
Accessibility: prefers-reduced-motion support (disable parallax)
```

### Scroll Animation Triggers

```
Intersection Observer Thresholds:
├── Visibility trigger: 75% of element entered viewport
├── Animation start: Fade in + translateY(20px) → (0, 0)
├── Animation duration: 500ms
├── Stagger effect: Each child 100ms delay
└── Once per page load: Animation fires only on first scroll

Scroll Progress Indicator:
├── Real-time update: 16ms refresh (60 FPS)
├── Visibility: 2px height, bottom-right position
├── Color: Blue-600 gradient
├── Animation: Smooth height transition
└── Mobile: Optimized for small screens
```

---

## Micro-Interactions

### Hover States

**Button Hover**
```
Duration: 150ms
Effect: scale(1.02) + shadow increase
Color shift: +5% lightness
Cursor: pointer
```

**Link Hover**
```
Duration: 150ms
Effect: underline appears (via border-bottom)
Color shift: Blue-700
Cursor: pointer
```

**Card Hover**
```
Duration: 200ms
Effect: scale(1.02) + shadow increase
Border color: Shift to Blue-300
Cursor: pointer (if clickable)
```

### Focus States

**Keyboard Focus**
```
Indicator: 2px solid Blue-500 outline
Offset: 4px from element edge
Duration: Immediate (no transition)
Visibility: Always visible (min 3:1 contrast)
Applied to: All interactive elements
```

**Focus Visible** (Keyboard only)
```
Show focus outline: Only for keyboard users
Hide for mouse users: :focus-visible pseudo-class
Exception: Explicit focus ring for accessibility
```

### Click/Press Feedback

**Button Press**
```
Effect: scale(0.98) + visual feedback
Duration: 50ms down, 100ms up
Color: Darken background 10%
```

**Touch Feedback** (Mobile)
```
Visual: Slight opacity shift or color change
Duration: 100ms
No ripple effect (performance on mobile)
```

### Loading States

**Skeleton Loader**
```
Background: Gray-200 (light), Slate-800 (dark)
Animation: Shimmer from left to right (1.5s)
Replaces: Actual content while loading
Prevents: Layout shift (CLS optimization)
```

**Spinner/Progress**
```
Style: Minimal circular spinner
Color: Blue-600
Duration: 1.5s per rotation (smooth)
Size: 24px (relative to context)
```

### Success/Error Feedback

**Toast Message** (appears top-right)
```
Success:
├── Background: Emerald-100
├── Text: Emerald-900
├── Icon: Checkmark
├── Duration: 3 seconds auto-dismiss
└── Animation: SlideIn 300ms, SlideOut 300ms

Error:
├── Background: Red-100
├── Text: Red-900
├── Icon: X or !
├── Duration: 5 seconds auto-dismiss
└── Animation: SlideIn 300ms, SlideOut 300ms
```

---

## Accessibility Rules

### Color & Contrast

✅ **MUST DO:**
- Maintain 4.5:1 contrast for body text
- Maintain 3:1 contrast for large text (18pt+)
- Never rely on color alone (always use icon/text)
- Test with colorblind simulators (Protanopia, Deuteranopia)

### Keyboard Navigation

✅ **MUST DO:**
- All interactive elements keyboard accessible (Tab)
- Logical tab order (left-to-right, top-to-bottom)
- Skip navigation link to main content
- Focus trap in modals (Tab loops within)
- Escape key closes modals

### Screen Reader Support

✅ **MUST DO:**
- Alt text on all images (descriptive, 10+ chars)
- Semantic HTML (nav, main, section, article)
- ARIA labels where semantic HTML insufficient
- Form labels associated with inputs (htmlFor attribute)
- List markup for lists (ul, ol, li)

### Motion & Animation

✅ **MUST DO:**
- Respect prefers-reduced-motion (disable animations)
- Auto-playing animations: Pausable within 2 seconds
- No flashing/strobing (no >3 flashes per second)
- Animations enhance, not distract from content

### Focus Indicators

✅ **MUST DO:**
- Visible focus outline on ALL interactive elements
- Minimum 2px width, sufficient contrast
- 4px offset from element
- Not removed or hidden in any state

---

## Mobile Specifications

### Touch Targets

**Minimum Size:** 44px x 44px
- Applies to all clickable elements
- Buttons, links, checkboxes, radio buttons
- Spacing: 8px minimum between touch targets
- Exception: Inline links (12px acceptable if well-spaced)

### Mobile Layout

**Viewport Meta Tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Breakpoints:**
```
Mobile:  320px - 767px  (1 column layouts)
Tablet:  768px - 1023px (2 column layouts)
Desktop: 1024px+        (3+ column layouts)
```

**Typography Scaling:**
- Desktop 16px → Mobile 14px (body)
- Desktop 48px → Mobile 32px (h1)
- Desktop 36px → Mobile 24px (h2)

**Image Sizing:**
```
Mobile: 1x (standard DPI)
Retina: 2x (high DPI devices)
WebP: Preferred format with JPEG fallback
Responsive srcset: Multiple sizes per image
```

### Mobile Touch Interactions

**Swipe Recognition**
- Horizontal swipe: Gallery/carousel navigation
- Vertical swipe: Page scroll (native)
- Swipe threshold: 50px minimum distance
- Duration: <300ms for recognition

**Pinch Zoom**
- Allow on 3D viewers (2-finger pinch)
- Prevent on page (meta viewport)
- Double-tap zoom: Disabled (use viewport meta)

---

## Performance Rules

### JavaScript Optimization

**Bundle Size:**
- Total gzipped: <500KB
- Critical path: <100KB
- Per-route: <150KB average

**Rendering:**
- Defer non-critical JavaScript
- Code splitting by route
- Lazy load heavy components

### CSS Optimization

**Critical CSS:**
- Inline on first page load
- Max 50KB critical path
- Async load remaining CSS
- Minimize style recalculations

### Image Optimization

**Formats:**
- WebP for modern browsers
- JPEG fallback for old browsers
- SVG for icons and simple graphics
- Avoid animated GIFs (use MP4 video)

**Sizing:**
- Responsive images (srcset)
- Max 2x DPI versions
- Compress: 80% quality minimum
- Lazy load below-fold images

### Animation Performance

**GPU Acceleration:**
- Use `transform` and `opacity` only
- Avoid animating: position, width, height
- Use `will-change` sparingly
- Test 60 FPS on mobile (30 FPS acceptable)

---

## Dark Mode Implementation

### Theme Detection

```
Priority:
1. User preference (localStorage)
2. OS preference (prefers-color-scheme)
3. Default: Light mode
```

### Dark Mode Colors

- Background: Slate-950 (#0f172a)
- Text: Slate-100 (#f1f5f9)
- Accents: Shifted to lighter shades
- Contrast: Verified 4.5:1 minimum

### Transition

- Smooth fade: 200ms duration
- No flash or flicker
- All components respond to theme change
- Persistent across page navigation

---

## Quality Checklist

Before launch, verify:

- [ ] All colors meet contrast requirements (WCAG AA)
- [ ] All interactions smooth and responsive (no jank)
- [ ] Mobile viewport sizes tested (5+ devices)
- [ ] Keyboard navigation fully functional
- [ ] Screen reader tested (NVDA, JAWS, VoiceOver)
- [ ] Focus indicators visible in all states
- [ ] Dark mode verified on all pages
- [ ] Animation disabled for prefers-reduced-motion
- [ ] Touch targets all >44px
- [ ] Performance targets met (Lighthouse >90)
- [ ] No console errors or warnings
- [ ] Form validation working correctly

