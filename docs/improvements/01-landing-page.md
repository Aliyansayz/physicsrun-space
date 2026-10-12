# Improvement Prompts — Landing Page (Rating 7 → 9)

## File: `src/components/home/LandingHero.tsx`

---

### Prompt 1: Remove Dead Props

The `LandingHeroProps` interface declares `onOpenPlanets?` and `onOpenStarMap?` but neither is destructured or used in the component body. This creates confusion for future developers.

**Elevation steps:**
1. Remove `onOpenPlanets?: () => void` from the interface
2. Remove `onOpenStarMap?: () => void` from the interface
3. Verify no other file passes these props to `LandingHero`

---

### Prompt 2: Make Scroll Indicator Accessible

The scroll-down indicator is a `<div>` with `onClick` but no keyboard support. Keyboard-only users cannot trigger the scroll action.

**Elevation steps:**
1. Change the outer `<div>` to a `<button>` element
2. Add `aria-label="Scroll to explore section"` for screen readers
3. Remove the `cursor-pointer` class (buttons have their own cursor)
4. Add `focus-visible:ring-2 focus-visible:ring-cyan-400/60` for visible focus indicator
5. Keep the existing click handler and smooth scroll behavior

---

### Prompt 3: Add `prefers-reduced-motion` Support to StarryNightSky

The `StarryNightSky` canvas animation runs unconditionally. Users with motion sensitivity cannot disable it.

**Elevation steps:**
1. Import `useMediaQuery` hook (create a small utility: `src/hooks/useMediaQuery.ts`)
2. Add `const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')`
3. When `prefersReducedMotion` is true:
   - Render a static star field (single `drawStars` call without `requestAnimationFrame`)
   - Disable shooting stars
   - Skip nebula glow animation (render static gradient only)
4. In `StarryNightSky.tsx`, pass the flag as a prop or read it directly

---

### Prompt 4: Add Error Boundary

If the canvas fails to initialize (e.g., WebGL not supported), the entire landing page crashes.

**Elevation steps:**
1. Create `src/components/common/CanvasFallback.tsx` — a simple gradient div
2. Wrap `<StarryNightSky />` in an error boundary class component
3. On error, render the fallback with the same dimensions

---

### Prompt 5: Optimize Performance

The starfield animation runs at 60fps but doesn't pause when the hero is off-screen (e.g., user scrolls down).

**Elevation steps:**
1. Use `IntersectionObserver` to detect when the hero section is visible
2. Pause `requestAnimationFrame` when `isIntersecting === false`
3. Resume when it re-enters the viewport
4. This saves CPU/GPU when the user is viewing other sections
