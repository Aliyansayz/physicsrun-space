# Improvement Prompts — Cosmos Explore Grid (Rating 7 → 9)

## File: `src/components/home/CosmosExploreGrid.tsx`

---

### Prompt 1: Add Visible Focus Indicators to Filter Buttons

Filter buttons lack visible focus indicators — keyboard users can't tell which button is focused.

**Elevation steps:**
1. Add `focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:outline-none` to all filter buttons
2. Add `focus-visible:ring-2 focus-visible:ring-cyan-400/60` to "Learn More" and "Read Chapter" buttons
3. Ensure the ring color contrasts well against both active and inactive button states

---

### Prompt 2: Make Entire Card Clickable (Consistent Interaction)

Currently only the image area opens the modal — the card body is dead space. This is inconsistent and confusing.

**Elevation steps:**
1. Move the `onClick` handler from the image `<div>` to the outer card `<div>`
2. Remove the separate `onClick` on the image frame
3. Keep `stopPropagation()` on the action buttons ("Learn More", "Read Chapter") so they don't trigger the modal
4. Add `role="button"` and `tabIndex={0}` to the card for keyboard accessibility
5. Add `onKeyDown` handler for Enter/Space keys

---

### Prompt 3: Add `prefers-reduced-motion` Guard on Card Scale

`hover:scale-105` on cards can cause discomfort for motion-sensitive users.

**Elevation steps:**
1. Create `src/hooks/usePrefersReducedMotion.ts`:
   ```ts
   export function usePrefersReducedMotion(): boolean {
     const [reduced, setReduced] = useState(() =>
       window.matchMedia('(prefers-reduced-motion: reduce)').matches
     );
     useEffect(() => {
       const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
       const handler = () => setReduced(mq.matches);
       mq.addEventListener('change', handler);
       return () => mq.removeEventListener('change', handler);
     }, []);
     return reduced;
   }
   ```
2. In `ObservatoryParallaxCard`, conditionally apply the scale class:
   ```tsx
   const scaleClass = prefersReducedMotion ? '' : 'hover:scale-105';
   ```

---

### Prompt 4: Add Skeleton Loading State

When the filter changes, cards disappear and reappear instantly — jarring UX.

**Elevation steps:**
1. Add a brief 200ms skeleton shimmer when `activeFilter` changes
2. Render 8 placeholder cards with `animate-pulse` and `bg-slate-800/50`
3. This gives visual continuity during the filter transition
