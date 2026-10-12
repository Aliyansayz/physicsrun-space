# Improvement Prompts — 3D Planet Viewer (Rating 7 → 9)

## File: `src/components/planets/PlanetViewer3D.tsx`

---

### Prompt 1: Stop Recreating the Entire Scene on State Changes

The main `useEffect` depends on `[selectedPlanet, viewMode, activeLayerIndex, sunIntensity, sunAngle, showMoons]` — every change tears down and recreates the entire Three.js scene including textures.

**Elevation steps:**
1. Split into multiple effects:
   - **Effect A** (deps: `[selectedPlanet]`): Create scene, camera, renderer, lights. Rebuild planet mesh.
   - **Effect B** (deps: `[viewMode, activeLayerIndex]`): Update cross-section visibility and layer materials only.
   - **Effect C** (deps: `[sunIntensity, sunAngle]`): Update light position and intensity via refs.
   - **Effect D** (deps: `[showMoons]`): Toggle moon group visibility via refs.
2. Store Three.js objects (scene, camera, renderer, planet group, moon group) in a `useRef`
3. Mutate object properties instead of rebuilding from scratch
4. This reduces scene rebuild cost from ~200ms to ~5ms for filter changes

---

### Prompt 2: Fix Fragile Gravity Parsing

`parseFloat(selectedPlanet.surfaceGravity)` works by accident (parses "9.81 m/s²" as 9.81) but breaks if the format changes.

**Elevation steps:**
1. Create `src/utils/physics.ts`:
   ```ts
   export function parseGravity(value: string): number {
     const match = value.match(/[\d.]+/);
     return match ? parseFloat(match[0]) : 0;
   }
   ```
2. Replace all `parseFloat(planet.surfaceGravity)` calls with `parseGravity(planet.surfaceGravity)`
3. Alternatively, change `planetsData.ts` to store gravity as a number and display it with a formatter

---

### Prompt 3: Use Actual Ring Data from `planetsData`

The 3D viewer hardcodes `RingGeometry(1.5, 2.7, 64)` instead of using `ringInnerRadius` and `ringOuterRadius` from `planetsData`.

**Elevation steps:**
1. In the planet creation effect, check `selectedPlanet.hasRings`
2. If true, read `selectedPlanet.ringInnerRadius` and `selectedPlanet.ringOuterRadius`
3. Scale the ring geometry proportionally to the planet radius
4. Remove the hardcoded values

---

### Prompt 4: Fix Non-Null Assertion on Earth

`planetsData.find(p => p.id === 'earth')!` will crash if Earth is ever removed from the data.

**Elevation steps:**
1. Replace with a safe fallback:
   ```ts
   const earth = planetsData.find(p => p.id === 'earth') ?? planetsData[0];
   ```
2. Add a guard: if `planetsData` is empty, show an error state instead of crashing

---

### Prompt 5: Smooth Zoom with Lerp

`handleWheel` modifies `camera.position.z` directly — feels abrupt and jerky.

**Elevation steps:**
1. Store `targetZoom` in a ref
2. In the animation loop, lerp current zoom toward target:
   ```ts
   camera.position.z += (targetZoom - camera.position.z) * 0.1;
   ```
3. Update `targetZoom` in `handleWheel` instead of `camera.position.z` directly
4. This gives a smooth, professional zoom feel

---

### Prompt 6: Add `prefers-reduced-motion` Support

Auto-rotation and smooth zoom animations run unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If preferred, disable auto-rotation by default
3. Make zoom instant (no lerp) for reduced motion users
