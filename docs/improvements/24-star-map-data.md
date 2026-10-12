# Improvement Prompts — Star Map Data (Rating 6 → 9)

## File: `src/data/starMapData.ts`

---

### Prompt 1: Fix Constellation ID Mismatches

`starsData` references constellation IDs like `'canis_major'`, `'ursa_minor'`, `'lyra'` which are NOT in `constellationsData` (which only has 6 constellations). These stars render on the sphere but don't connect to any constellation lines.

**Elevation steps:**
1. Add the missing constellations to `constellationsData`:
   - Canis Major (for Sirius)
   - Ursa Minor (for Polaris)
   - Lyra (for Vega)
2. Each needs: `id`, `name`, `mainStars`, `connections`, `lore`, `astrophysicsNote`, `audioNarrationScript`
3. Verify all `starsData` entries have a matching `constellationId` in `constellationsData`

---

### Prompt 2: Use ID-Based Star Matching

Constellation `connections` use star names (strings), but `starsData` uses `id` (slugs). The `StarMap3D` component does `starsData.find(s => s.name === star1Name)` — fragile.

**Elevation steps:**
1. Change `connections` to use star IDs instead of names:
   ```ts
   connections: [[0, 1], [1, 2], ...] // indices into mainStars
   ```
2. Or use star IDs:
   ```ts
   connections: [['betelgeuse', 'rigel'], ['rigel', 'bellatrix'], ...]
   ```
3. Update `StarMap3D.tsx` to match by ID instead of name
4. This survives star name changes and is more explicit

---

### Prompt 3: Add More Constellations

Only 6 constellations are included — the star map feels sparse.

**Elevation steps:**
1. Add 4-6 more constellations (e.g., Leo, Aquila, Pegasus, Andromeda, Perseus, Auriga)
2. Each needs at least 3-5 main stars with connections
3. Add corresponding entries to `starsData` for any new stars
4. This makes the star map feel richer and more explorable

---

### Prompt 4: Add `ariaLabel` Fields

Stars and DSOs have no accessibility labels for screen readers.

**Elevation steps:**
1. Add `ariaLabel` to each star and DSO:
   ```ts
   ariaLabel: 'Betelgeuse — Red supergiant in Orion, 640 light years away'
   ```
2. Use these labels in the `StarMap3D` component's hidden accessible list
