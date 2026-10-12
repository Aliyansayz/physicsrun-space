# Improvement Prompts — 3D Star Map (Rating 6 → 9)

## File: `src/components/starmap/StarMap3D.tsx`

---

### Prompt 1: Stop Recreating the Scene on Filter Toggles

The main `useEffect` depends on `[selectedConstellation, showConstellationLines, showSpectralColors, showDSOs, showGrid, autoRotateSky, observerMode, selectedSpectralFilter]` — toggling any filter recreates the entire scene.

**Elevation steps:**
1. Split into multiple effects:
   - **Effect A** (deps: `[]` — mount only): Create scene, camera, renderer, celestial sphere, background stars. Store all in refs.
   - **Effect B** (deps: `[selectedConstellation]`): Update constellation line visibility only.
   - **Effect C** (deps: `[showConstellationLines, showSpectralColors, showDSOs, showGrid]`): Toggle visibility of groups via `group.visible = false/true`.
   - **Effect D** (deps: `[autoRotateSky]`): Toggle auto-rotation flag read in the animation loop.
   - **Effect E** (deps: `[observerMode]`): Update camera position/background color.
2. Store all Three.js objects in a single `useRef<StarMapScene>` object
3. This reduces filter toggle cost from ~150ms to ~2ms

---

### Prompt 2: Cache Star Name Lookups

`starsData.find(s => s.name === star1Name)` is called inside nested loops for constellation lines — O(n×m) comparisons per rebuild.

**Elevation steps:**
1. Create a `Map<string, StarData>` at module level:
   ```ts
   const starNameMap = new Map(starsData.map(s => [s.name, s]));
   ```
2. Replace `starsData.find(s => s.name === star1Name)` with `starNameMap.get(star1Name)`
3. This reduces constellation line building from O(n×m) to O(m)

---

### Prompt 3: Add Canvas Accessibility Fallback

The 3D canvas has no fallback content, no ARIA labels, and no keyboard interaction for star/DSO selection.

**Elevation steps:**
1. Add `role="img"` and `aria-label="Interactive 3D star map. Use the constellation selector or DSO strip below to navigate."` to the canvas container
2. Below the canvas, render a visually-hidden list of all selectable stars and DSOs with real `<button>` elements
3. Add keyboard navigation: arrow keys to cycle through stars, Enter to select
4. Add a "List view" toggle that shows the star/DSO data as an accessible table

---

### Prompt 4: Fix Click vs Drag Threshold

The `dragDistanceRef` threshold of 6px is arbitrary and may feel inconsistent.

**Elevation steps:**
1. Make the threshold configurable (e.g., `const DRAG_THRESHOLD = 8`)
2. Use both distance AND time: if the pointer moved >8px within 200ms, it's a drag; otherwise it's a click
3. Add visual feedback during drag (cursor changes to `grabbing`)

---

### Prompt 5: Add `prefers-reduced-motion` Support

Auto-rotation and smooth transitions run unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If preferred, disable auto-rotation by default
3. Make constellation selection transitions instant (no fade)
