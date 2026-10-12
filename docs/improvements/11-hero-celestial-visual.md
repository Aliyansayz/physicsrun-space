# Improvement Prompts — Hero Celestial Visual (Rating 6 → 9)

## File: `src/components/ebook/HeroCelestialVisual.tsx`

---

### Prompt 1: Add `prefers-reduced-motion` Support

Images auto-rotate every 16 seconds unconditionally — users with motion sensitivity cannot disable it.

**Elevation steps:**
1. Accept a `prefersReducedMotion` prop from the parent
2. When true:
   - Do NOT start the `setInterval`
   - Show only the first image statically
   - The "Shuffle" button still works for manual control
3. In the parent (`EbookExploreView`), use the `usePrefersReducedMotion` hook

---

### Prompt 2: Add Pause on Hover

When the user hovers over the visual (e.g., to read the caption), the image may change mid-read.

**Elevation steps:**
1. Add `isHovered` state
2. On `mouseEnter`: clear the interval
3. On `mouseLeave`: restart the interval
4. This gives users time to read captions without the image changing

---

### Prompt 3: Add Crossfade Transition Between Images

Images switch instantly — a jarring visual jump.

**Elevation steps:**
1. Use two stacked `<img>` elements with opacity transitions
2. When the image changes, fade out the old one while fading in the new one:
   ```tsx
   <div className="relative">
     <img src={currentImage} className={`transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} />
     <img src={nextImage} className={`absolute inset-0 transition-opacity duration-1000 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`} />
   </div>
   ```
3. This creates a smooth 1-second crossfade

---

### Prompt 4: Add Keyboard Accessibility for Shuffle Button

The shuffle button is a `<div>` — not keyboard accessible.

**Elevation steps:**
1. Change to `<button>` element
2. Add `aria-label="Shuffle to a random cosmic image"`
3. Add `focus-visible:ring-2 focus-visible:ring-cyan-400/60`
