# Improvement Prompts — Planet Disc Canvas (Rating 6 → 9)

## File: `src/components/ebook/PlanetDiscCanvas.tsx`

---

### Prompt 1: Handle DevicePixelRatio Changes

If the window is moved between displays with different DPRs (e.g., laptop to 4K monitor), the canvas becomes blurry.

**Elevation steps:**
1. Listen for DPR changes:
   ```ts
   useEffect(() => {
     const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
     const handler = () => resize();
     mq.addEventListener('change', handler);
     return () => mq.removeEventListener('change', handler);
   }, []);
   ```
2. Also re-check DPR on window resize (in case the window moved to a different display)

---

### Prompt 2: Add Crossfade Transition Between Planets

When `planetId` changes, the canvas is cleared and redrawn instantly — a jarring visual jump.

**Elevation steps:**
1. Use two stacked canvases (or a single canvas with a transition overlay)
2. On planet change:
   - Fade out the old canvas (opacity 1 → 0 over 500ms)
   - Draw the new planet on a second canvas
   - Fade in the new canvas (opacity 0 → 1 over 500ms)
3. This creates a smooth transition between planets

---

### Prompt 3: Add `prefers-reduced-motion` Support

The canvas is static (not animated), but the instant redraw on planet change can still be jarring.

**Elevation steps:**
1. Accept a `prefersReducedMotion` prop
2. When true, skip the crossfade transition and draw instantly
3. When false, use the smooth crossfade described in Prompt 2

---

### Prompt 4: Add Loading State

When the canvas is being drawn (especially for complex planets like Saturn with rings), there's a brief blank moment.

**Elevation steps:**
1. Add a `isDrawing` state
2. Show a subtle spinner or shimmer overlay while drawing
3. Hide it once the canvas render is complete
