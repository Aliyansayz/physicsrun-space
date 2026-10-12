# Improvement Prompts — Starry Night Sky (Rating 7 → 9)

## File: `src/components/home/StarryNightSky.tsx`

---

### Prompt 1: Cap Star Count for Large Displays

Star count scales with `window.innerWidth * innerHeight / 2800` — on 4K displays this produces 3000+ stars, impacting performance.

**Elevation steps:**
1. Cap the star count at a reasonable maximum:
   ```ts
   const MAX_STARS = 1500;
   const starCount = Math.min(Math.floor((canvas.width * canvas.height) / 2800), MAX_STARS);
   ```
2. On very large displays, increase star radius slightly to maintain visual density
3. Test on a 4K monitor to confirm smooth 60fps

---

### Prompt 2: Add `prefers-reduced-motion` Support

The animation runs unconditionally — users with motion sensitivity cannot disable it.

**Elevation steps:**
1. Accept a `prefersReducedMotion` prop from the parent (`LandingHero`)
2. When true:
   - Render a single static frame (call `drawSkyGradient` + `drawStars` once)
   - Do NOT start `requestAnimationFrame`
   - Do NOT spawn shooting stars
3. In `LandingHero.tsx`, use the `usePrefersReducedMotion` hook and pass the result

---

### Prompt 3: Use Delta-Time for Shooting Star Spawning

Shooting star spawn frequency is frame-rate dependent (uses `time` from `requestAnimationFrame` which varies by display refresh rate).

**Elevation steps:**
1. Track `lastFrameTime` in a ref
2. Calculate `deltaTime = (time - lastFrameTime) / 1000` (seconds)
3. Accumulate spawn timer: `spawnTimer += deltaTime`
4. Spawn when `spawnTimer > 3 + Math.random() * 5` (seconds, not frames)
5. This ensures consistent spawn rate on 60Hz, 120Hz, and 144Hz displays

---

### Prompt 4: Add Intersection Observer Pause

The animation runs even when the hero is scrolled off-screen, wasting CPU/GPU.

**Elevation steps:**
1. Accept a `isVisible` prop from the parent
2. In the animation loop, skip rendering when `isVisible === false`
3. In `LandingHero.tsx`, use `IntersectionObserver` on the `<section>` element:
   ```ts
   const [isVisible, setIsVisible] = useState(true);
   const sectionRef = useRef<HTMLElement>(null);
   useEffect(() => {
     const observer = new IntersectionObserver(([entry]) => {
       setIsVisible(entry.isIntersecting);
     });
     if (sectionRef.current) observer.observe(sectionRef.current);
     return () => observer.disconnect();
   }, []);
   ```
