# AstroLens Observatory: Episodic Phase-by-Phase Implementation Plan

## Executive Overview
This implementation plan outlines the creation and seamless integration of **AstroLens: Explore the Wonders of Space** into the existing application. AstroLens will be introduced as a dedicated, first-class top-level mode alongside the **3D Planetarium**, **Star Map**, and **Cinematic Ebook**, featuring high-precision celestial exploration, multi-spectral wavelength observation filters (Visible, Infrared/JWST, X-Ray/Chandra, Radio/ALMA, Ultraviolet/Hubble), interactive target telemetry heads-up display (HUD), episodic deep-sky missions, and an observatory logbook with discovery tracking.

---

## Architecture & Integration Strategy

```
App Navigation Header
 ├── Home (Landing)
 ├── Solar System (3D Planets)
 ├── Star Map (Constellations & 3D Celestial Sphere)
 ├── Cinematic Ebook (Narrated Audio Chapters)
 └── [NEW] AstroLens (Deep-Space Multi-Spectral Observatory)
       ├── Episode Selector / Mission Carousel
       ├── High-Precision Deep Space Viewport (Pan, Zoom, Reticle)
       ├── Spectral Band Selector (Optical, Near/Mid-IR, Soft X-Ray, Sub-mm Radio, Far-UV)
       ├── Telemetry HUD (Target RA/Dec, Redshift z, Flux, Sensor Thermal, FOV, Resolution)
       ├── Spectral Analysis & Astrophysics Breakdown Drawer
       └── Observatory Logbook & Discovery Tracker (Discovered phenomena, spectral scans, snapshot captures)
```

---

## Phase 1: Foundation & Data Architecture
- **Objective:** Establish the comprehensive data models, types, and rich astronomical datasets required for episodic AstroLens deep-space observations.
- **Key Deliverables:**
  1. **Type Definitions (`src/types/astrolens.ts`):**
     - `AstroLensEpisode`: Episode metadata, celestial coordinates, classification (Supernova Remnant, Galaxy Cluster, Interacting Galaxies, Gravitational Lens, Stellar Nursery, Supermassive Black Hole), distance, redshift, constellation, difficulty, and lore.
     - `SpectralBand`: Wavelength configurations (`optical`, `infrared`, `xray`, `radio`, `ultraviolet`) including false-color mapping, sensor characteristics, instrument source (JWST NIRCam/MIRI, Hubble WFC3, Chandra ACIS, ALMA Array), and astrophysical insights unlocked at each band.
     - `AstroTelemetry`: Equatorial coordinates (RA, Dec), parallax, radial velocity, Doppler redshift ($z$), brightness magnitude, photon energy flux, angular resolution, sensor exposure status.
     - `DiscoveryProgress`: Local persistence interface tracking viewed targets, explored spectral wavelengths, acquired observation badges, and user-captured telescope frames.
  2. **High-Resolution Episodic Catalog (`src/data/astrolensData.ts`):**
     - Curate 8+ episodic observational targets with rich astrophysical details and curated high-resolution space photography:
       - **Episode 01:** *The Pillars of Creation (Eagle Nebula M16)* — Star-forming towers in gas and dust.
       - **Episode 02:** *Cassiopeia A & The Crab Pulsar* — Violent supernova shockwaves and neutron star core.
       - **Episode 03:** *Pandora's Cluster (Abell 2744)* — Mega-galaxy collision & gravitational lensing megastructure.
       - **Episode 04:** *The Cartwheel Galaxy* — Cosmic bullseye collision and intense ring starburst.
       - **Episode 05:** *Stephan's Quintet (HCG 92)* — Tidal shockwaves and galaxy gravitational dance.
       - **Episode 06:** *Sagittarius A\** — The gravitational titan at the Milky Way heart.
       - **Episode 07:** *The James Webb Deep Field (SMACS 0723)* — Ancient cosmological dawn and space-time curvature.
       - **Episode 08:** *Tarantula Nebula (30 Doradus)* — The most luminous extragalactic starburst nursery.
  3. **Local Discovery Storage Service (`src/services/astrolensStorage.ts`):**
     - Lightweight local state sync (`localStorage`) to record discoveries, spectral scan completions, and favorite captures across browser sessions.

---

## Phase 2: Core AstroLens Viewport & Spectral Simulation Engine
- **Objective:** Build the interactive, sharp, high-performance viewport with smooth pan/zoom, reticle aiming, and dynamic multi-spectral wavelength switching.
- **Key Deliverables:**
  1. **Multi-Spectral Viewport (`src/components/astrolens/AstroLensViewport.tsx`):**
     - Ultra-responsive, touch- and mouse-friendly canvas/SVG stage with interactive pan, zoom (0.5x to 6.0x), reset FOV, and target centering.
     - Real-time CSS and SVG composite filter shaders simulating optical wavelength transitions:
       - **Visible Light:** Natural color balance with atmospheric/stellar diffraction spikes.
       - **Infrared (JWST/Spitzer):** Penetrating dust clouds to reveal embedded proto-stars, glowing warm dust filaments, and deep cosmic red shifts.
       - **X-Ray (Chandra):** High-energy plasma shockwaves, accretion disk emissions, and magnetic reconnection flares (electric violet and cyan false-color).
       - **Radio (ALMA):** Cold molecular gas distributions, carbon monoxide clouds, and relativistic synchrotron jets (golden amber contours).
       - **Ultraviolet (Hubble):** Hot young O/B-type massive stars and violent ionized interstellar radiation fields (neon azure radiance).
     - Cross-spectral blend slider allowing split-screen or blended comparison between optical and multi-wavelength views.
  2. **Interactive Celestial Reticle & Hotspots (`src/components/astrolens/ObservationReticle.tsx`):**
     - Dynamic HUD reticle following the cursor or locking onto celestial features.
     - Interactive point-of-interest markers (e.g., "Active Pulsar", "Relativistic Jet", "Gravitationally Lensed Arc", "Proto-stellar Core") that reveal localized micro-telemetry when hovered or tapped.

---

## Phase 3: Telemetry Heads-Up Display (HUD) & Astrophysics Drawer
- **Objective:** Provide a sharp, refined, pleasant observatory cockpit experience with live telemetry readouts and deep astrophysical analysis.
- **Key Deliverables:**
  1. **Observatory Telemetry HUD (`src/components/astrolens/TelemetryHUD.tsx`):**
     - Top & side glassmorphic HUD overlays displaying:
       - Celestial Coordinates: Right Ascension (RA), Declination (Dec), Galactic Latitude/Longitude.
       - Signal Quality: Signal-to-Noise Ratio (SNR), Exposure Time, Detector Temperature (-233°C cryogenic sensor indicator).
       - Observational Metrics: Doppler Redshift ($z$), Angular Scale (arcseconds/pixel), Estimated Distance in Millions of Light-Years.
       - Target Status Indicator with real-time coordinate calibration lock.
  2. **Astrophysics Insights & Spectral Breakdown Drawer (`src/components/astrolens/SpectralAnalysisDrawer.tsx`):**
     - Collapsible deep-dive drawer explaining why specific phenomena emit in each wavelength band.
     - Interactive photon energy spectrum diagram illustrating wavelength ($\lambda$), frequency ($\nu$), and observatory telescope instrumentation.
     - Audio soundscape option: Eerie acoustic sonification synthesizers representing frequency data for each celestial target.

---

## Phase 4: Episodic Mission Browser & Discovery Tracker
- **Objective:** Allow users to freely browse cosmic episodes, track their observational journey, and collect celestial field notes.
- **Key Deliverables:**
  1. **Episodic Mission Carousel & Filter Bar (`src/components/astrolens/EpisodeSelector.tsx`):**
     - Horizontal carousel with fluid card previews, thumbnail visualizers, difficulty ratings, category chips (Supernova, Deep Galaxy, Cluster, Nebula), and discovery badges.
     - Quick search and filtering by celestial phenomenon type.
  2. **Observatory Logbook & Discovery Tracker (`src/components/astrolens/ObservatoryLogbookModal.tsx`):**
     - Visual progression tracker showing percentage of cosmos mapped (e.g., "6 of 8 Targets Fully Analyzed", "All 5 Spectral Bands Calibrated").
     - Discovery milestones and badges ("Infrared Pioneer", "High-Energy Astronomer", "Cosmic Cartographer").
     - Telescope snapshot tool allowing users to take high-res cropped captures with custom HUD stamps and download or save to their logbook.

---

## Phase 5: Top-Level Integration & Polishing
- **Objective:** Wire AstroLens into the primary application shell, ensure responsive design, zero-pill aesthetic discipline, and sharp visual feedback.
- **Key Deliverables:**
  1. **Application Navigation Integration (`src/components/navigation/Header.tsx` & `src/App.tsx`):**
     - Add `AstroLens` to the primary navigation tabs with distinctive iconography and active state indicator.
     - Update global keyboard shortcuts (`L` for AstroLens, `1-5` for quick wavelength switching).
     - Cross-linking from Ebook chapters and 3D Star Map directly into AstroLens targets (e.g., clicking "Observe with AstroLens" in the Crab Nebula star map detail launches the AstroLens viewer focused on Cas A/Crab Pulsar).
  2. **Aesthetic Refinement & Polish:**
     - Dark-sky glassmorphism, crisp typography (`font-mono` for telemetry metrics, refined headings), sharp reticles, and pleasant smooth transitions.
     - Full mobile and tablet responsiveness with touch pinch-to-zoom and collapsible HUD panels.

---

## Verification Plan

### Automated & Build Verification
1. **Compilation & Type Safety:** Run `compile_applet` to ensure TypeScript compilation passes with zero type errors.
2. **Linting Verification:** Run `lint_applet` to verify standard syntax, clean imports, and code consistency.

### Functional Verification Checklist
1. **Top-Level Navigation:** Verify seamless switching between Landing, Planets 3D, Star Map, Cinematic Ebook, and AstroLens.
2. **Multi-Spectral Filters:** Verify that clicking Optical, Infrared, X-Ray, Radio, and UV transitions smoothly, changes telemetry data, and displays appropriate false-color filters.
3. **Viewport Controls:** Test zoom in/out, pan drag, reset viewport, and fullscreen toggle.
4. **Episode Switching:** Switch between all 8 cosmic episodes without lag; ensure telemetry and descriptions update accurately.
5. **Discovery Tracking:** Verify that scanning targets and switching wavelengths updates the discovery progress stored in `localStorage`.
6. **Telemetry & Reticle:** Ensure coordinates and values update dynamically, and hover hotspots display localized astrophysical callouts.
7. **Snapshot Capture:** Test the capture tool to ensure clean HUD-framed snapshot generation.
