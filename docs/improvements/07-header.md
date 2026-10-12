# Improvement Prompts — Header (Rating 6 → 9)

## File: `src/components/navigation/Header.tsx`

---

### Prompt 1: Remove Dead `scrolled` State

The `scrolled` state is tracked via a scroll listener but never used in the render output.

**Elevation steps:**
1. Remove the `scrolled` state variable
2. Remove the scroll listener that sets it
3. Remove the unused `useEffect` if it becomes empty
4. If you want a style change on scroll (e.g., solid background), actually use it:
   ```tsx
   className={`fixed top-0 ... ${scrolled ? 'bg-[#060913]/95 backdrop-blur-md' : 'bg-transparent'}`}
   ```

---

### Prompt 2: Fix Fragile `setTimeout` for About Click

`handleAboutClick` uses `setTimeout` with 100ms delay to wait for view change — fragile and race-prone.

**Elevation steps:**
1. Replace with `flushSync` from React DOM:
   ```ts
   import { flushSync } from 'react-dom';
   const handleAboutClick = () => {
     flushSync(() => onNavigate('landing'));
     setTimeout(() => {
       document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
     }, 50);
   };
   ```
2. Or better: use a `useEffect` in the Landing page that scrolls to `#about-section` when it mounts

---

### Prompt 3: Add Escape Handler to Mobile Drawer

The mobile hamburger menu doesn't close on Escape key.

**Elevation steps:**
1. Add a `useEffect` when `mobileMenuOpen` is true:
   ```ts
   useEffect(() => {
     if (!mobileMenuOpen) return;
     const handler = (e: KeyboardEvent) => {
       if (e.key === 'Escape') setMobileMenuOpen(false);
     };
     window.addEventListener('keydown', handler);
     return () => window.removeEventListener('keydown', handler);
   }, [mobileMenuOpen]);
   ```
2. Add `aria-expanded={mobileMenuOpen}` to the hamburger button
3. Add `role="dialog"` and `aria-label="Navigation menu"` to the drawer

---

### Prompt 4: Add Focus Trap to Mobile Drawer

Keyboard users can tab out of the mobile drawer into the background content.

**Elevation steps:**
1. Track the first and last focusable elements in the drawer
2. On Tab keydown at the last element, wrap to the first
3. On Shift+Tab at the first element, wrap to the last
4. When the drawer opens, focus the first nav link

---

### Prompt 5: Stabilize Callback Props

`handleAboutClick` and similar handlers are recreated every render, causing child components to re-render unnecessarily.

**Elevation steps:**
1. Wrap handlers in `useCallback` with proper dependency arrays
2. Or define them as `useRef` stable handlers that call the latest props
