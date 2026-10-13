# Cosmic Phenomena Glossary & Interactive Ebook Cross-Linking

Add an astrophysical glossary view featuring an immersive 70% panoramic visual canvas paired with a 30% precision definition dossier, accompanied by an interactive phenomenon filmstrip and direct keyword popup transitions from the cinematic ebook reader.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX decisions were confirmed during Phase 1 clarification:
> - **70/30 Split Layout**: 70% panoramic visual canvas on the left displaying high-resolution cosmic phenomena with telemetry overlays, and a 30% definition dossier on the right for rigorous astrophysics explanations, key physical laws, and observed examples.
> - **Phenomena Browsing**: A horizontal filmstrip carousel with category filters (Gravitational Singularities, Stellar Evolution, Intergalactic Structures, Plasma & Planetary Dynamics) for browsing between phenomena.
> - **Ebook Keyword Integration**: In-line highlighted keywords and paragraph topic badges open a focused celestial popover with definition summary and a prominent "View in Glossary" button that transitions the view directly to the specific phenomenon.

---

### 1. Overview & Core Concept

- **What It Does**: Introduces a dedicated `GlossaryView` within the application navigation (`ActiveView = 'glossary'`), serving as an interactive encyclopedia of astrophysical phenomena. It bridges reading in the Ebook with deep visual inspection in the Glossary.
- **Target Audience / Persona**: Astronomy enthusiasts, students, and curious explorers seeking rigorous explanations of cosmic mechanisms (e.g., Gravitational Lensing, Event Horizons, Runaway Greenhouse, Relativistic Jets, Supernova Shockwaves) paired with authentic high-resolution visuals.
- **Key Value**: Provides an intuitive, museum-grade visual reference where readers can instantly cross-reference complex astrophysics terminology without losing their reading progress.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Glossary Exploration Flow*: The user opens "Glossary" from the top navigation. The screen reveals a full-bleed panoramic stage: left 70% showcases the active phenomenon in ultra-sharp detail with subtle focal reticles and coordinates; right 30% presents the phenomenon dossier with nomenclature, classification, mechanism breakdown, key equations/physical constants, and observed cosmic examples.
  2. *Filmstrip Selection*: Along the bottom of the 70% stage, a sleek horizontal filmstrip allows switching between phenomena (Black Holes, Gravitational Lensing, Supernovae, Molecular Clouds, Planetary Nebulae, Magnetars, etc.) with category pill filters.
  3. *Ebook Keyword Hop*: While reading any chapter in `CinematicEbookViewer`, clicking a highlighted keyword or the "Topic: [Term]" badge summons a refined glassmorphic definition card. The user can read the quick inline explanation or click "Explore in Glossary →", which instantly navigates to `GlossaryView` with that phenomenon pre-selected, while saving the return bookmark back to the active chapter.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Deep space obsidian (`#05070e`) with hairline slate structural borders (`rgba(255,255,255,0.12)`) and cyan/amber phosphor telemetry accents (`#22d3ee`, `#f59e0b`).
  - *Typography*: Clean neo-grotesque display headers paired with `font-mono tabular-nums` for scientific notation, physical scales, and coordinate data.
  - *Spatial Composition*: Desktop viewport is strictly divided into a 70% visual canvas (panoramic imagery, viewport zoom/pan toggle, scale reference HUD) and a 30% scrollable technical dossier card.
- **Interactive Feedback & Motion**:
  - Smooth image cross-fades when toggling phenomena via the filmstrip.
  - Interactive tooltip popovers in the ebook reader with micro-bounce entrance and clear dismiss triggers.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dedicated Glossary View vs. Modal Drawer**:
  - *Chosen Approach*: Dedicated top-level `ActiveView = 'glossary'` with URL/state persistence.
  - *Why*: Allows 70% panoramic screen estate without cramped modal borders, giving the imagery cinematic breathing room.
  - *Alternatives Considered*: Floating drawer (too constrained for a true 70% canvas) or modal overlay (blocks viewport context).
- **Decision 2: Return Bookmark to Ebook**:
  - *Chosen Approach*: When jumping from the reader to the glossary, record `returnChapterId` so a "← Return to Chapter" button appears in the glossary, restoring the reader immediately.
  - *Why*: Prevents users from losing their reading place when looking up a term mid-chapter.
- **Decision 3: Curated Phenomenon Dataset**:
  - *Chosen Approach*: Create `src/data/glossaryData.ts` mapping every keyword from the ebook chapters to rich phenomenological data (synopsis, astrophysics mechanism, physical constants, cosmic examples, and associated imagery).

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                               App.tsx                                  │
│  activeView: 'landing' | 'ebook' | 'planets' | 'starmap' | 'glossary'  │
│  selectedGlossaryTermId: string                                        │
│  glossaryReturnChapterId?: string                                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        CinematicEbookViewer          │  │         GlossaryView         │
│  - Interactive Keyword Highlights    │  │  - Left 70%: Panoramic Visual│
│  - Definition Popover                │  │  - Right 30%: Dossier Deck   │
│  - "Explore in Glossary →" Button    │  │  - Bottom Filmstrip Carousel │
└──────────────────────────────────────┘  │  - "Return to Ebook" Action  │
                                          └──────────────────────────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────────────┐
                                          │      glossaryData.ts         │
                                          │  - 10+ Curated Phenomena     │
                                          │  - Cross-references & Images │
                                          └──────────────────────────────┘
```

- **Data Entities**:
  - `GlossaryItem`: `id`, `term`, `category`, `shortDefinition`, `mechanismDescription`, `physicalLawOrEquation`, `observedExamples: string[]`, `imageKey: CosmicImageKey`, `associatedChapterId?: string`.
- **Component Hierarchy**:
  - `src/components/glossary/GlossaryView.tsx`: Main view with 70/30 split layout and bottom filmstrip.
  - `src/components/glossary/PhenomenonVisualStage.tsx`: 70% panoramic image canvas with scale anchors and telemetry overlay.
  - `src/components/glossary/PhenomenonDossier.tsx`: 30% technical dossier container with structured science sections.
  - `src/components/glossary/PhenomenaFilmstrip.tsx`: Horizontal carousel with category filters.
  - Navigation updates in `Header.tsx`, `Footer.tsx`, and `SearchModal.tsx`.
