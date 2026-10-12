# Improvement Prompts — Observation Reticle (Rating 6 → 9)

## File: `src/components/astrolens/ObservationReticle.tsx`

---

### Prompt 1: Debounce Hotspot Ping Sound

`handleHotspotMouseEnter` plays a ping sound on every hover — annoying if the user is just moving the mouse across the viewport.

**Elevation steps:**
1. Add a cooldown ref:
   ```ts
   const lastPingRef = useRef(0);
   const handleHotspotMouseEnter = () => {
     const now = Date.now();
     if (now - lastPingRef.current > 2000) {
       lastPingRef.current = now;
       playPingSound();
     }
   };
   ```
2. This limits pings to once per 2 seconds per hotspot
3. Alternatively, only play the sound on click, not hover

---

### Prompt 2: Add Tooltip Boundary Detection

Tooltip position is `absolute` relative to the hotspot — can overflow the container on edges.

**Elevation steps:**
1. Measure tooltip dimensions before showing
2. Check if tooltip would overflow right/bottom edges
3. Flip position to the opposite side if needed:
   ```ts
   const rect = hotspotRef.current.getBoundingClientRect();
   const flipX = rect.left > containerRect.width / 2;
   const flipY = rect.top > containerRect.height / 2;
   ```
4. Apply `translate-x-full` or `translate-y-full` conditionally

---

### Prompt 3: Add `prefers-reduced-motion` Guard

Radar ping animation and tooltip fade-in run unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If preferred, disable the radar ping animation
3. Make tooltip appear instantly (no fade transition)

---

### Prompt 4: Add Keyboard Accessibility for Hotspots

Hotspot buttons are `<button>` elements (good), but they may not have proper ARIA labels.

**Elevation steps:**
1. Add `aria-label` to each hotspot button describing the feature
2. Add `aria-describedby` pointing to the tooltip content
3. Ensure tooltips are shown on keyboard focus (not just mouse hover):
   ```tsx
   onMouseEnter={showTooltip}
   onFocus={showTooltip}
   onMouseLeave={hideTooltip}
   onBlur={hideTooltip}
   ```
