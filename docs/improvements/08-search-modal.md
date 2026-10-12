# Improvement Prompts — Search Modal (Rating 6 → 9)

## File: `src/components/search/SearchModal.tsx`

---

### Prompt 1: Add Debounce to Search Input

Every keystroke triggers a full scan of all data arrays (chapters, planets, constellations, stars, DSOs, episodes).

**Elevation steps:**
1. Add a `useDeferredValue` or manual debounce:
   ```ts
   const [query, setQuery] = useState('');
   const debouncedQuery = useDebouncedValue(query, 200);
   ```
2. Create `src/hooks/useDebouncedValue.ts` if it doesn't exist
3. Use `debouncedQuery` for filtering instead of `query`
4. Show a subtle loading spinner while `query !== debouncedQuery`

---

### Prompt 2: Add Focus Trap

Keyboard users can tab out of the modal into the background content.

**Elevation steps:**
1. Track the search input and the last result button
2. On Tab keydown at the last element, wrap to the search input
3. On Shift+Tab at the search input, wrap to the last element
4. When the modal opens, focus is already on the input (good) — just ensure it stays trapped

---

### Prompt 3: Add Keyboard Navigation Through Results

Results are not keyboard navigable — users must click with a mouse.

**Elevation steps:**
1. Track `activeIndex` state (default 0 when results appear)
2. On `ArrowDown`: increment `activeIndex` (wrap to 0 at end)
3. On `ArrowUp`: decrement `activeIndex` (wrap to end at 0)
4. On `Enter`: trigger `onClick` for the active result
5. Highlight the active result with `bg-cyan-500/20 ring-1 ring-cyan-400/40`
6. Add `aria-activedescendant` on the input pointing to the active result ID

---

### Prompt 4: Group Results by Category

A long list of mixed results (chapters + planets + stars + DSOs) is hard to scan.

**Elevation steps:**
1. Group results by category: Chapters, Planets, Stars, DSOs, Episodes
2. Render each group with a sub-heading: "CHAPTERS", "PLANETS", etc.
3. Limit each group to 5 results with a "Show more" link
4. This makes the results page scannable at a glance

---

### Prompt 5: Add Search Highlight

When a result matches the query, the matching text is not visually highlighted.

**Elevation steps:**
1. Create a `HighlightText` component:
   ```tsx
   const HighlightText = ({ text, query }) => {
     if (!query) return text;
     const regex = new RegExp(`(${query})`, 'gi');
     const parts = text.split(regex);
     return parts.map((part, i) =>
       regex.test(part) ? <mark key={i} className="bg-cyan-400/30 text-white">{part}</mark> : part
     );
   };
   ```
2. Use it in result titles and descriptions
