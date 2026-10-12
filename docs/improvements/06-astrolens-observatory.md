# Improvement Prompts — AstroLens Observatory (Rating 7 → 9)

## Files: `src/components/astrolens/AstroLensViewport.tsx`, `AstroLensView.tsx`, `ObservationReticle.tsx`

---

### Prompt 1: Fix Fake Cursor Coordinates (Misleading Telemetry)

The RA/Dec displayed in the corner is calculated from cursor position relative to the container, not from actual celestial coordinates. This presents itself as real telemetry but is fabricated.

**Elevation steps:**
1. Remove the fake coordinate calculation from `onMouseMove`
2. Display the actual target's RA/Dec from the episode telemetry data:
   ```tsx
   <span>RA: {currentEpisode.telemetry.rightAscension}</span>
   <span>Dec: {currentEpisode.telemetry.declination}</span>
   ```
3. If you want to show cursor-relative position, label it clearly: "Cursor offset from center" with pixel coordinates

---

### Prompt 2: Handle CORS Failure on Snapshot Capture

`img.crossOrigin = 'anonymous'` + `toDataURL()` will throw if the image server doesn't send CORS headers. No try/catch around this.

**Elevation steps:**
1. Wrap the snapshot logic in try/catch:
   ```ts
   const handleCaptureSnapshot = () => {
     try {
       // ... existing snapshot logic
     } catch (err) {
       console.error('Snapshot failed:', err);
       // Show user-friendly toast: "Snapshot unavailable — CORS policy prevented capture"
     }
   };
   ```
2. Alternatively, ensure all images are served from the same origin (they are — local assets), so `crossOrigin` may not even be needed. Remove it and test.

---

### Prompt 3: Throttle `cursorCoords` State Updates

`cursorCoords` state updates on every `mousemove` — causes full re-render of the viewport on every mouse movement.

**Elevation steps:**
1. Replace `useState` with `useRef` for cursor coordinates
2. Update a `<span>` ref directly via `textContent` instead of triggering React re-render:
   ```ts
   const cursorRef = useRef<HTMLSpanElement>(null);
   // In onMouseMove:
   if (cursorRef.current) {
     cursorRef.current.textContent = `RA ${x}° Dec ${y}°`;
   }
   ```
3. If the coordinate display must be a component, throttle updates to ~10fps with `requestAnimationFrame`

---

### Prompt 4: Fix Fullscreen State Sync

The fullscreen toggle doesn't listen for `fullscreenchange` events — if the user presses ESC, `isFullscreen` state becomes stale.

**Elevation steps:**
1. Add a `useEffect` that listens for `fullscreenchange`:
   ```ts
   useEffect(() => {
     const handler = () => setIsFullscreen(!!document.fullscreenElement);
     document.addEventListener('fullscreenchange', handler);
     return () => document.removeEventListener('fullscreenchange', handler);
   }, []);
   ```
2. This keeps state in sync regardless of how fullscreen is exited

---

### Prompt 5: Debounce Hotspot Ping Sound

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

---

### Prompt 6: Add Tooltip Boundary Detection

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
