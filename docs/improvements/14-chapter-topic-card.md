# Improvement Prompts — Chapter Topic Card (Rating 6 → 9)

## File: `src/components/ebook/EbookChapterTopicsHeader.tsx`

---

### Prompt 1: Replace Hardcoded Episode Number Checks

Filter logic uses `episodeNumber === 1 || episodeNumber === 5` — fragile, breaks if chapters are reordered.

**Elevation steps:**
1. Add a `tags` field to `ChapterData` in `chaptersData.ts`:
   ```ts
   tags: ('solar' | 'galaxies' | 'black-holes' | 'deep-sky')[]
   ```
2. Tag each chapter explicitly in the data file
3. Filter by tag instead of episode number:
   ```ts
   const filtered = activeTag === 'all'
     ? chapters
     : chapters.filter(ch => ch.tags.includes(activeTag));
   ```
4. This survives chapter reordering and makes the data self-documenting

---

### Prompt 2: Fix Carousel Scroll Increment

Carousel scroll uses a fixed `380px` increment — doesn't account for actual card widths at different breakpoints.

**Elevation steps:**
1. Measure the actual card width dynamically:
   ```ts
   const scrollBy = () => {
     const card = cardRef.current;
     if (!card) return 380;
     const gap = 24; // gap-6
     return card.offsetWidth + gap;
   };
   ```
2. Use `scrollBy({ left: scrollBy(), behavior: 'smooth' })` instead of a fixed value
3. This ensures the carousel scrolls exactly one card at any breakpoint

---

### Prompt 3: Make Cards Keyboard Accessible

Chapter cards are `<div onClick>` — not keyboard accessible.

**Elevation steps:**
1. Add `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space), and `aria-label` to each card
2. Add `focus-visible:ring-2 focus-visible:ring-cyan-400/60` for visible focus indicator
3. Ensure the "Read Chapter" button inside the card stops propagation so it doesn't trigger the card click

---

### Prompt 4: Add `prefers-reduced-motion` Guard

Carousel smooth scroll and card hover animations run unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If preferred, use `behavior: 'auto'` instead of `'smooth'` for carousel scrolling
3. Disable card hover lift/scale animations
