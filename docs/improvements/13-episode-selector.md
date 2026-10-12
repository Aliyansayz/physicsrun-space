# Improvement Prompts — Episode Selector (Rating 7 → 9)

## File: `src/components/astrolens/EpisodeSelector.tsx`

---

### Prompt 1: Make Cards Keyboard Accessible

Episode cards are `<div onClick>` — not keyboard accessible.

**Elevation steps:**
1. Add to each card `<div>`:
   - `role="button"`
   - `tabIndex={0}`
   - `onKeyDown` handler: trigger `onClick` for Enter and Space keys
   - `aria-label={`${ep.title} — ${ep.subtitle}`}`
2. Add `focus-visible:ring-2 focus-visible:ring-cyan-400/60` to show focus indicator
3. Ensure the focus ring is visible against both selected and unselected card backgrounds

---

### Prompt 2: Memoize `filteredEpisodes`

`filteredEpisodes` is computed on every render — fine for 8 items, but bad practice that doesn't scale.

**Elevation steps:**
1. Wrap in `useMemo`:
   ```ts
   const filteredEpisodes = useMemo(() => {
     return ASTROLENS_EPISODES.filter((ep) => { ... });
   }, [selectedCategory, searchQuery]);
   ```
2. This ensures the filter only recalculates when the category or query actually changes

---

### Prompt 3: Add Loading Skeleton

When switching categories or typing in search, cards disappear and reappear instantly.

**Elevation steps:**
1. Add a brief 150ms skeleton shimmer when `selectedCategory` or `searchQuery` changes
2. Render 8 placeholder cards with `animate-pulse` and `bg-slate-800/50`
3. This gives visual continuity during the filter transition

---

### Prompt 4: Add `aria-live` Region for Results Count

Screen readers don't announce how many episodes match the current filter.

**Elevation steps:**
1. Add a visually-hidden `aria-live="polite"` region:
   ```tsx
   <span className="sr-only" aria-live="polite">
     {filteredEpisodes.length} episodes found
   </span>
   ```
2. This announces the count whenever the filter changes
