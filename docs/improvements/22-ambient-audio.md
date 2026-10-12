# Improvement Prompts — Ambient Audio Service (Rating 7 → 9)

## File: `src/services/ambientAudio.ts`

---

### Prompt 1: Fix `toggle()` Return Value

`toggle()` calls `start(this.currentPreset)` but doesn't await the Promise — the return value is `true` even if the audio fails to start.

**Elevation steps:**
1. Make `toggle` return the actual success state:
   ```ts
   async toggle(): Promise<boolean> {
     if (this.isPlaying) {
       this.stop();
       return false;
     }
     try {
       await this.start(this.currentPreset);
       return true;
     } catch (err) {
       console.error('Failed to start ambient audio:', err);
       return false;
     }
   }
   ```
2. Update the caller in `App.tsx` to handle the async result

---

### Prompt 2: Add Error Logging

All `catch` blocks are empty — silent failures make debugging impossible.

**Elevation steps:**
1. Add `console.error` in each catch block:
   ```ts
   catch (err) {
     console.error('Ambient audio error:', err);
   }
   ```
2. Consider showing a user-facing message if audio fails to start

---

### Prompt 3: Add Volume Control

There's no way to adjust the ambient volume — only on/off.

**Elevation steps:**
1. Add a `setVolume(level: number)` method (0.0 to 1.0)
2. Store the volume in a ref and apply it to the master gain node
3. Add a volume slider to the Header or a settings panel
4. Persist the volume preference in localStorage

---

### Prompt 4: Add `prefers-reduced-motion` Consideration

Auto-starting ambient audio may be unwanted by users who prefer minimal sensory input.

**Elevation steps:**
1. Check `prefers-reduced-motion` before auto-starting ambient audio
2. If preferred, don't auto-start — show a prominent "Enable Ambient Sound" button instead
3. This gives users control over their audio environment
