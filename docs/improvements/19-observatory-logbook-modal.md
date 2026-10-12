# Improvement Prompts — Observatory Logbook Modal (Rating 6 → 9)

## File: `src/components/astrolens/ObservatoryLogbookModal.tsx`

---

### Prompt 1: Add Focus Trap

The modal doesn't trap focus — keyboard users can tab out of the modal into the background.

**Elevation steps:**
1. Track the first and last focusable elements in the modal
2. On Tab keydown at the last element, wrap to the first
3. On Shift+Tab at the first element, wrap to the last
4. When the modal opens, focus the close button
5. When the modal closes, return focus to the element that opened it

---

### Prompt 2: Add Delete Confirmation

`handleDeleteSnapshot` doesn't confirm before deleting — destructive action without confirmation.

**Elevation steps:**
1. Add a confirmation state:
   ```ts
   const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
   ```
2. On first click: set `confirmingDeleteId` and show "Are you sure?" inline
3. On second click: actually delete
4. Auto-reset the confirmation after 3 seconds
5. Add `aria-live="polite"` to the confirmation message for screen readers

---

### Prompt 3: Revoke Object URLs on Download

`handleDownloadSnapshot` creates an `<a>` element, clicks it, and removes it — but doesn't revoke the object URL (not applicable for data URLs, but still good practice).

**Elevation steps:**
1. For data URLs (current implementation): no revocation needed
2. If switching to blob URLs in the future:
   ```ts
   const url = URL.createObjectURL(blob);
   a.href = url;
   a.click();
   URL.revokeObjectURL(url);
   ```

---

### Prompt 4: Add `prefers-reduced-motion` Guard

Modal open/close animation and badge unlock animation run unconditionally.

**Elevation steps:**
1. Check `prefers-reduced-motion` on mount
2. If preferred, make modal appear instantly (no scale/fade transition)
3. Disable badge unlock celebration animation

---

### Prompt 5: Add Escape Key Handler

The modal doesn't close on Escape key.

**Elevation steps:**
1. Add a `useEffect` when the modal is open:
   ```ts
   useEffect(() => {
     if (!isOpen) return;
     const handler = (e: KeyboardEvent) => {
       if (e.key === 'Escape') onClose();
     };
     window.addEventListener('keydown', handler);
     return () => window.removeEventListener('keydown', handler);
   }, [isOpen, onClose]);
   ```
