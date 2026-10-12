# Improvement Prompts — Ebook Overview (Rating 6 → 9)

## File: `src/components/ebook/EbookExploreView.tsx`

---

### Prompt 1: Extract Inline Data Arrays to Module-Level Constants

All card data arrays (`planetCards`, `starsCards`, `galaxiesCards`, `nebulaeCards`, `blackHolesCards`) are defined inside the component body, causing them to be recreated on every render.

**Elevation steps:**
1. Create a new file: `src/data/ebookCardsData.ts`
2. Move all 5 card arrays into this file as `export const` declarations
3. Import them in `EbookExploreView.tsx`:
   ```ts
   import { planetCards, starsCards, galaxiesCards, nebulaeCards, blackHolesCards } from '../../data/ebookCardsData';
   ```
4. Delete the inline definitions from the component

---

### Prompt 2: Fix `useMemo` Dependency Array

`displayedCards` uses `useMemo` but has `currentCategoryData` (a new object created every render) in its dependency array, completely defeating memoization.

**Elevation steps:**
1. Replace `currentCategoryData` with a stable primitive dependency (e.g., `activeCategory`)
2. Move the category-to-data mapping to a `useRef` or module-level `Map`
3. Verify with React DevTools that the memo only recalculates when the category actually changes

---

### Prompt 3: Fix Hardcoded Image URL

The Andromeda featured card uses a hardcoded path `/assets/images/spiral_galaxy_core_1791661096182.png` instead of the `cosmicImages` registry.

**Elevation steps:**
1. Import `cosmicImages` at the top of the file
2. Replace the hardcoded `src` with `cosmicImages.spiralGalaxyCore.url`
3. Add responsive `srcSet` using `cosmicImages.spiralGalaxyCore.picture` if needed
4. This ensures the image path stays correct if the build output changes

---

### Prompt 4: Make Cards Keyboard Accessible

All card `<div onClick>` elements are not keyboard accessible.

**Elevation steps:**
1. For each card `<div>`, add:
   - `role="button"`
   - `tabIndex={0}`
   - `onKeyDown` handler that triggers `onClick` for `Enter` and `Space` keys
   - `aria-label` describing the card content
2. Add `focus-visible:ring-2 focus-visible:ring-cyan-400/60` to show focus indicator
3. Consider extracting to a reusable `AccessibleCard` component if the pattern repeats

---

### Prompt 5: Add Loading and Empty States

When switching categories, there is no loading indicator. If a category has no cards, the grid is silently empty.

**Elevation steps:**
1. Add a brief skeleton shimmer (3-5 placeholder cards) when switching categories
2. If `displayedCards.length === 0`, show a friendly empty state:
   - Icon (e.g., `Sparkles` from lucide)
   - Message: "No cosmic objects in this category yet."
   - Button: "View All Categories"

---

### Prompt 6: Fix Silent Error Swallowing in `handleCardClick`

The fallback `else` branch navigates to `episode-01` for unknown action types, silently swallowing errors.

**Elevation steps:**
1. Add a `console.warn` with the unknown `actionType` value
2. Consider showing a toast notification: "This feature is coming soon."
3. Log to an error tracking service if available
