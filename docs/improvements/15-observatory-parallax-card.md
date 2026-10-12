# Improvement Prompts — Observatory Parallax Card (Rating 7 → 9)

## File: `src/components/home/CosmosExploreGrid.tsx` (inner component)

---

### Prompt 1: Make Entire Card Clickable

Currently only the image area opens the modal — the card body (title, description, metrics) is dead space.

**Elevation steps:**
1. Move the `onClick` handler from the image `<div>` to the outer card `<div>`
2. Remove the separate `onClick` on the image frame
3. Keep `stopPropagation()` on the action buttons ("Learn More", "Read Chapter")
4. Add `role="button"`, `tabIndex={0}`, and `onKeyDown` (Enter/Space) to the card
5. Add `aria-label={`${topic.title} — ${topic.shortDesc}`}`

---

### Prompt 2: Add `prefers-reduced-motion` Guard on Hover Scale

`hover:scale-105` can cause discomfort for motion-sensitive users.

**Elevation steps:**
1. Use the `usePrefersReducedMotion` hook
2. Conditionally apply the scale class:
   ```tsx
   const scaleClass = prefersReducedMotion ? '' : 'hover:scale-105';
   ```
3. Apply it to the card's className

---

### Prompt 3: Add Image Lazy Loading

All 8 card images load immediately, even those below the fold.

**Elevation steps:**
1. Add `loading="lazy"` to the `<ResponsiveImage>` component (if supported)
2. Or use `IntersectionObserver` to only render the image when the card is near the viewport
3. This reduces initial page load time significantly

---

### Prompt 4: Add Error State for Failed Images

If an image fails to load, the card shows a broken image icon with no fallback.

**Elevation steps:**
1. Add an `onError` handler to the image
2. On error, show a placeholder gradient with the topic badge text:
   ```tsx
   <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
     <span className="text-xs text-slate-500">{topic.badge}</span>
   </div>
   ```
