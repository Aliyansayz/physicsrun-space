# Improvement Prompts — Narration Audio Service (Rating 6 → 9)

## File: `src/services/narrationAudio.ts`

---

### Prompt 1: Fix `setRate` Restarting from Beginning

`setRate` re-speaks the entire text from the beginning when rate changes mid-speech — contradicts the comment "update without jumping back to 0".

**Elevation steps:**
1. Track the current word boundary index in a ref
2. When `setRate` is called:
   - Cancel the current utterance
   - Create a new utterance starting from the current word
   - Use `utterance.rate = newRate`
3. This requires splitting the text into word chunks and tracking position
4. Alternative: use `utterance.rate` directly on the existing utterance (works in some browsers)

---

### Prompt 2: Add Error Logging

The `utterance.onerror` handler swallows errors silently.

**Elevation steps:**
1. Add `console.error` in the error handler:
   ```ts
   utterance.onerror = (event) => {
     console.error('Narration error:', event.error);
     // ... existing error handling
   };
   ```
2. Consider showing a toast notification to the user: "Audio narration encountered an error."

---

### Prompt 3: Fix Chrome Keep-Alive Glitch

The keep-alive interval calls `pause()` then `resume()` — this is a known Chrome bug workaround, but it can cause audio glitches.

**Elevation steps:**
1. Only run the keep-alive when narration is actively speaking
2. Clear the interval when narration stops
3. Consider using the `voiceschanged` event instead of a timer
4. Test on Chrome, Firefox, and Safari to ensure consistent behavior

---

### Prompt 4: Add `prefers-reduced-motion` Consideration

Auto-narration on chapter load may be unwanted by motion-sensitive users.

**Elevation steps:**
1. Check `prefers-reduced-motion` before auto-starting narration
2. If preferred, don't auto-start — show a prominent "Play" button instead
3. This gives users control over when audio begins
