# Improvement Prompts — Human Scale Anchors (Rating 7 → 9)

## File: `src/components/planets/HumanScaleAnchors.tsx`

---

### Prompt 1: Add Missing Uranus Sensory Text

Sensory text for Uranus is missing — falls through to `default` even though Uranus is in the planets data.

**Elevation steps:**
1. Add a Uranus entry to the sensory descriptions:
   ```ts
   uranus: {
     sky: 'A pale cyan haze — featureless and eerily uniform.',
     sound: 'A high-pitched whine from the supersonic winds at the terminator.',
     survival: 'Instant death. The atmosphere is 83% hydrogen with methane rains.',
   }
   ```
2. Verify all 8 planets (Mercury through Neptune) + Moon have entries

---

### Prompt 2: Fix Fragile Gravity Parsing

`parseFloat(planet.surfaceGravity)` works by accident but breaks if the format changes.

**Elevation steps:**
1. Create `src/utils/physics.ts` with a `parseGravity` helper
2. Replace all `parseFloat(planet.surfaceGravity)` calls with the helper
3. Alternatively, change `planetsData.ts` to store gravity as a number

---

### Prompt 3: Fix Hidden Coupling in Distance Calculation

`Math.abs(planet.distanceFromSunAU - 1.0)` assumes Earth is at 1.0 AU — correct, but the Moon's `distanceFromSunAU` is 1.0, so `|| 0.00257` fallback is used. This is a hidden coupling.

**Elevation steps:**
1. Add a `distanceFromEarthAU` field to `PlanetData` in the data file
2. Use this explicit field instead of the implicit `distanceFromSunAU - 1.0` calculation
3. This makes the data self-documenting and removes the hidden assumption

---

### Prompt 4: Add `prefers-reduced-motion` Guard

Tab transitions and slider animations run unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If preferred, make tab content switches instant (no fade/slide transition)
3. Disable slider thumb animation
