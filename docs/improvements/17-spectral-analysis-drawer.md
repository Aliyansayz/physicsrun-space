# Improvement Prompts — Spectral Analysis Drawer (Rating 7 → 9)

## File: `src/components/astrolens/SpectralAnalysisDrawer.tsx`

---

### Prompt 1: Derive Spectrum Colors from Data

The spectrum visualizer uses hardcoded color classes for 6 bands — not driven by `SPECTRAL_BANDS` data, so if band colors change, this won't update.

**Elevation steps:**
1. Read `accentColor` from the `SPECTRAL_BANDS` record:
   ```ts
   const band = SPECTRAL_BANDS[activeWavelength];
   const accentColor = band.accentColor;
   ```
2. Use inline styles or dynamic Tailwind classes derived from the data
3. Remove the hardcoded color mapping

---

### Prompt 2: Add `prefers-reduced-motion` Guard

Drawer expand/collapse animation runs unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If preferred, make the expand/collapse instant (no height transition)
3. Disable the spectrum bar animation

---

### Prompt 3: Add Keyboard Accessibility for Drawer Toggle

The drawer toggle button may not have proper ARIA attributes.

**Elevation steps:**
1. Add `aria-expanded={isOpen}` to the toggle button
2. Add `aria-controls="spectral-drawer-content"` to the toggle
3. Add `id="spectral-drawer-content"` to the drawer content panel
4. Ensure the toggle is a `<button>` element (not a `<div>`)
