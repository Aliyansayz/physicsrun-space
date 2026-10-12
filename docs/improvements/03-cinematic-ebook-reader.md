# Improvement Prompts — Cinematic Ebook Reader (Rating 7 → 9)

## File: `src/components/ebook/CinematicEbookViewer.tsx`

---

### Prompt 1: Memoize Sentence-Splitting Logic

`getParagraphSentences` is called inside the render loop for every paragraph, executing expensive regex on each render.

**Elevation steps:**
1. Extract `getParagraphSentences` to a utility file: `src/utils/textProcessing.ts`
2. Wrap the result in `useMemo` keyed on `currentChapter.id`
3. Pre-compute all sentence ranges once per chapter load:
   ```ts
   const allSentences = useMemo(() => {
     return currentChapter.paragraphs.map(p => getParagraphSentences(p.text));
   }, [currentChapter]);
   ```
4. This reduces O(paragraphs × renders) regex calls to O(paragraphs × 1)

---

### Prompt 2: Add Error Boundary for Narration Engine

If `SpeechSynthesis` throws or the voice fails to load, the entire reader crashes.

**Elevation steps:**
1. Create `src/components/common/NarrationErrorBoundary.tsx` — a class component with `componentDidCatch`
2. Wrap the narration UI (play button, rate control, highlighting) in this boundary
3. On error, show a fallback UI: "Audio narration is unavailable. You can still read the text."
4. Log the error for debugging

---

### Prompt 3: Fix Stale Popup Position After Scroll

The text highlighter popup uses `position: fixed` with coordinates from `getBoundingClientRect`, which becomes stale after scrolling.

**Elevation steps:**
1. Add a scroll listener while the popup is open
2. On scroll, recalculate the selection's `getBoundingClientRect()` and update popup position
3. Close the popup on scroll if the selection goes out of viewport
4. Alternatively, dismiss the popup on scroll start for simplicity

---

### Prompt 4: Fix Narration Cleanup Race Condition

The cleanup function calls `narrationAudio.stop()` — if multiple instances mount/unmount, this could kill narration unexpectedly.

**Elevation steps:**
1. Use a ref to track if this component instance is still mounted
2. In cleanup, only call `stop()` if the ref indicates this instance is active
3. Consider using a unique session ID per reader instance to prevent cross-instance interference

---

### Prompt 5: Respect `prefers-reduced-motion`

The scroll progress bar and paragraph highlighting animations run unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If reduced motion is preferred, disable smooth transitions on the progress bar
3. Make sentence highlighting instant (no fade animation)
