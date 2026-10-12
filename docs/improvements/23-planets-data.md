# Improvement Prompts — Planets Data (Rating 6 → 9)

## File: `src/data/planetsData.ts`

---

### Prompt 1: Add Missing Uranus Entry

Uranus is missing from `planetsData` but is referenced in `PlanetDiscCanvas` and `EbookExploreView`. Clicking Uranus in the ebook falls back to Earth in the 3D viewer.

**Elevation steps:**
1. Add a complete Uranus entry to the `planetsData` array:
   ```ts
   {
     id: 'uranus',
     name: 'Uranus',
     classification: 'Ice Giant',
     tagline: 'The Sideways World',
     diameterKm: 50724,
     massKg: 8.681e25,
     surfaceGravity: '8.87 m/s²',
     orbitalPeriodDays: 30688,
     distanceFromSunAU: 19.22,
     meanTemperatureC: -195,
     atmosphereComposition: 'Hydrogen, Helium, Methane',
     moonsCount: 28,
     dayLengthHours: 17.24,
     axialTiltDegrees: 97.77,
     description: '...',
     funFact: '...',
     colorHex: '#9ad1e5',
     atmosphereGlowHex: '#9ad1e5',
     layers: [...],
   }
   ```
2. Verify the 3D viewer correctly finds Uranus by ID
3. Test the full flow: Ebook → Planet Studio → Uranus 3D view

---

### Prompt 2: Store Gravity as Number

`surfaceGravity` is a string like `"9.81 m/s²"` — parsed with `parseFloat` in multiple places, which works but is fragile.

**Elevation steps:**
1. Add a `surfaceGravityValue: number` field to each planet
2. Keep `surfaceGravity` as the display string
3. Update all components to use `surfaceGravityValue` for calculations
4. This separates display formatting from numeric computation

---

### Prompt 3: Use Actual Ring Data

Saturn's `hasRings`, `ringInnerRadius`, `ringOuterRadius` are present, but the 3D viewer hardcodes ring geometry.

**Elevation steps:**
1. Ensure all ring-related fields are present and accurate for Saturn
2. Add ring data for Uranus (faint ring system)
3. Update `PlanetViewer3D.tsx` to read from the data instead of hardcoding
