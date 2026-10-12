import React, { useState, useMemo } from 'react';
import { Search, Lightbulb, ArrowRight, Disc, Sparkles, Orbit, Cloud, CircleDot, Compass, Layers, BookOpen } from 'lucide-react';
import { HeroCelestialVisual } from './HeroCelestialVisual';
import { PlanetDiscCanvas } from './PlanetDiscCanvas';
import { EbookChapterTopicsHeader } from './EbookChapterTopicsHeader';
import { CosmicShockers } from './CosmicShockers';
import { cosmicImages } from '../../assets/images';
import { ResponsiveImage } from '../common/ResponsiveImage';

interface EbookExploreViewProps {
  onOpenReader?: (chapterId?: string) => void;
  onOpenPlanetStudio?: (planetId: string) => void;
  onOpenStarMap?: (target?: { constellationId?: string; starId?: string; dsoId?: string }) => void;
  onOpenAstroLens?: (episodeId?: string) => void;
}

type CategoryType = 'planets' | 'stars' | 'galaxies' | 'nebulae' | 'black-holes' | 'asteroids' | 'other';

interface CelestialCardItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  planetId?: string;
  actionType: 'planet' | 'chapter' | 'starmap' | 'astrolens';
  targetId?: string;
}

export const EbookExploreView: React.FC<EbookExploreViewProps> = ({
  onOpenReader,
  onOpenPlanetStudio,
  onOpenStarMap,
  onOpenAstroLens,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('planets');
  const [searchQuery, setSearchQuery] = useState('');

  // 8 Canonical Planets from the Reference Image
  const planetCards: CelestialCardItem[] = [
    {
      id: 'mercury',
      name: 'Mercury',
      category: 'Planets',
      planetId: 'mercury',
      description: 'The smallest and innermost planet in our solar system.',
      actionType: 'planet',
      targetId: 'mercury',
    },
    {
      id: 'venus',
      name: 'Venus',
      category: 'Planets',
      planetId: 'venus',
      description: 'The hottest planet with a thick atmosphere.',
      actionType: 'planet',
      targetId: 'venus',
    },
    {
      id: 'earth',
      name: 'Earth',
      category: 'Planets',
      planetId: 'earth',
      description: 'Our home, the only known planet with life.',
      actionType: 'planet',
      targetId: 'earth',
    },
    {
      id: 'mars',
      name: 'Mars',
      category: 'Planets',
      planetId: 'mars',
      description: 'The red planet, a target for future exploration.',
      actionType: 'planet',
      targetId: 'mars',
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      category: 'Planets',
      planetId: 'jupiter',
      description: 'The largest planet in our solar system.',
      actionType: 'planet',
      targetId: 'jupiter',
    },
    {
      id: 'saturn',
      name: 'Saturn',
      category: 'Planets',
      planetId: 'saturn',
      description: 'Famous for its stunning ring system.',
      actionType: 'planet',
      targetId: 'saturn',
    },
    {
      id: 'uranus',
      name: 'Uranus',
      category: 'Planets',
      planetId: 'uranus',
      description: 'An ice giant with a unique axial tilt.',
      actionType: 'planet',
      targetId: 'uranus',
    },
    {
      id: 'neptune',
      name: 'Neptune',
      category: 'Planets',
      planetId: 'neptune',
      description: 'The farthest planet in our solar system.',
      actionType: 'planet',
      targetId: 'neptune',
    },
  ];

  // Additional categories data for full depth
  const starsCards: CelestialCardItem[] = [
    { id: 'sol', name: 'Sol (The Sun)', category: 'Stars', description: 'G-type main-sequence star sustaining Earth’s biosphere.', image: cosmicImages.celestialMoon.url, actionType: 'planet', targetId: 'earth' },
    { id: 'sirius', name: 'Sirius A', category: 'Stars', description: 'The brightest star in the night sky, located in Canis Major.', image: cosmicImages.spiralGalaxyCore.url, actionType: 'starmap', targetId: 'canis-major' },
    { id: 'betelgeuse', name: 'Betelgeuse', category: 'Stars', description: 'Red supergiant nearing supernova detonation in Orion.', image: cosmicImages.supernovaCosmicExplosion.url, actionType: 'starmap', targetId: 'orion' },
    { id: 'rigel', name: 'Rigel', category: 'Stars', description: 'Luminous blue supergiant 40,000 times brighter than the Sun.', image: cosmicImages.cosmicStellarNebula.url, actionType: 'starmap', targetId: 'orion' },
    { id: 'proxima', name: 'Proxima Centauri', category: 'Stars', description: 'Our closest stellar neighbor at 4.246 light-years away.', image: cosmicImages.galaxyClusterDeepfield.url, actionType: 'chapter', targetId: 'episode-01' },
    { id: 'vega', name: 'Vega', category: 'Stars', description: 'Former North Star and photometric calibration standard.', image: cosmicImages.spiralGalaxyCore.url, actionType: 'starmap', targetId: 'lyra' },
    { id: 'polaris', name: 'Polaris', category: 'Stars', description: 'Current northern pole star anchor of celestial navigation.', image: cosmicImages.galaxyClusterDeepfield.url, actionType: 'starmap', targetId: 'ursa-minor' },
    { id: 'canis-majoris', name: 'VY Canis Majoris', category: 'Stars', description: 'Extreme hypergiant spanning over 1.4 billion kilometers.', image: cosmicImages.supernovaRemnantVeil.url, actionType: 'chapter', targetId: 'episode-02' },
  ];

  const galaxiesCards: CelestialCardItem[] = [
    { id: 'andromeda', name: 'Andromeda Galaxy (M31)', category: 'Galaxies', description: 'Nearest major spiral galaxy to the Milky Way.', image: cosmicImages.andromedaGalaxyM31.url, actionType: 'chapter', targetId: 'episode-03' },
    { id: 'milkyway', name: 'Milky Way Core', category: 'Galaxies', description: 'Barred spiral galaxy spanning 100,000 light-years.', image: cosmicImages.supermassiveBlackHole.url, actionType: 'chapter', targetId: 'episode-03' },
    { id: 'triangulum', name: 'Triangulum Galaxy (M33)', category: 'Galaxies', description: 'Third-largest member of our Local Group cluster.', image: cosmicImages.galaxyClusterDeepfield.url, actionType: 'astrolens', targetId: 'ep-deepfield-smacs' },
    { id: 'sombrero', name: 'Sombrero Galaxy (M104)', category: 'Galaxies', description: 'Brilliant white bulbous core with dark dust lane.', image: cosmicImages.spiralGalaxyCore.url, actionType: 'astrolens', targetId: 'ep-stephans-quintet' },
    { id: 'whirlpool', name: 'Whirlpool Galaxy (M51)', category: 'Galaxies', description: 'Grand-design spiral interacting with NGC 5195.', image: cosmicImages.galaxyClusterCollision.url, actionType: 'chapter', targetId: 'episode-03' },
    { id: 'cartwheel', name: 'Cartwheel Galaxy', category: 'Galaxies', description: 'Rare ring galaxy formed by cosmic bullseye collision.', image: cosmicImages.galaxyClusterCollision.url, actionType: 'astrolens', targetId: 'ep-stephans-quintet' },
    { id: 'magellanic', name: 'Large Magellanic Cloud', category: 'Galaxies', description: 'Satellite galaxy harboring the Tarantula Nebula.', image: cosmicImages.cosmicStellarNebula.url, actionType: 'chapter', targetId: 'episode-03' },
    { id: 'cigar', name: 'Cigar Galaxy (M82)', category: 'Galaxies', description: 'Starburst galaxy with intense hydrogen outflow jets.', image: cosmicImages.supernovaRemnantVeil.url, actionType: 'chapter', targetId: 'episode-03' },
  ];

  const nebulaeCards: CelestialCardItem[] = [
    { id: 'orion-nebula', name: 'Orion Nebula (M42)', category: 'Nebulae', description: 'Vast stellar nursery visible to the naked eye.', image: cosmicImages.cosmicStellarNebula.url, actionType: 'chapter', targetId: 'episode-02' },
    { id: 'carina', name: 'Carina Nebula', category: 'Nebulae', description: 'Home to the volatile hypergiant Eta Carinae.', image: cosmicImages.supernovaCosmicExplosion.url, actionType: 'astrolens', targetId: 'ep-carina-nebula' },
    { id: 'pillars', name: 'Eagle Nebula (Pillars)', category: 'Nebulae', description: 'Famous elephant trunks of interstellar interstellar dust.', image: cosmicImages.cosmicStellarNebula.url, actionType: 'chapter', targetId: 'episode-02' },
    { id: 'ring-nebula', name: 'Ring Nebula (M57)', category: 'Nebulae', description: 'Planetary nebula shell ejected by dying Sun-like star.', image: cosmicImages.supernovaRemnantVeil.url, actionType: 'astrolens', targetId: 'ep-southern-ring' },
    { id: 'crab-nebula', name: 'Crab Nebula (M1)', category: 'Nebulae', description: 'Supernova remnant from the historical 1054 CE blast.', image: cosmicImages.supernovaRemnantVeil.url, actionType: 'chapter', targetId: 'episode-02' },
    { id: 'helix', name: 'Helix Nebula (NGC 7293)', category: 'Nebulae', description: 'Often called the Eye of God due to its concentric rings.', image: cosmicImages.spiralGalaxyCore.url, actionType: 'chapter', targetId: 'episode-02' },
    { id: 'veil-nebula', name: 'Veil Nebula', category: 'Nebulae', description: 'Delicate glowing filaments of a Cygnus Loop supernova.', image: cosmicImages.supernovaRemnantVeil.url, actionType: 'chapter', targetId: 'episode-02' },
    { id: 'butterfly', name: 'Butterfly Nebula (NGC 6302)', category: 'Nebulae', description: 'Bipolar planetary nebula with 250,000°C central star.', image: cosmicImages.supernovaCosmicExplosion.url, actionType: 'chapter', targetId: 'episode-02' },
  ];

  const blackHolesCards: CelestialCardItem[] = [
    { id: 'sag-a', name: 'Sagittarius A*', category: 'Black Holes', description: 'Supermassive black hole at the center of the Milky Way.', image: cosmicImages.supermassiveBlackHole.url, actionType: 'chapter', targetId: 'episode-04' },
    { id: 'm87', name: 'M87* Central Engine', category: 'Black Holes', description: 'First ever directly imaged black hole event horizon.', image: cosmicImages.supermassiveBlackHole.url, actionType: 'chapter', targetId: 'episode-04' },
    { id: 'cygnus-x1', name: 'Cygnus X-1', category: 'Black Holes', description: 'First confirmed stellar-mass black hole candidate.', image: cosmicImages.supernovaCosmicExplosion.url, actionType: 'starmap', targetId: 'cygnus' },
    { id: 'ton-618', name: 'TON 618 Hypermassive Hole', category: 'Black Holes', description: 'Weighs 66 billion solar masses with a brilliant quasar.', image: cosmicImages.galaxyClusterDeepfield.url, actionType: 'chapter', targetId: 'episode-04' },
    { id: 'gw150914', name: 'GW150914 Merger', category: 'Black Holes', description: 'Historic binary black hole gravitational wave source.', image: cosmicImages.galaxyClusterCollision.url, actionType: 'chapter', targetId: 'episode-04' },
    { id: 'v404-cygni', name: 'V404 Cygni', category: 'Black Holes', description: 'Microquasar with relativistic relativistic jets.', image: cosmicImages.supermassiveBlackHole.url, actionType: 'chapter', targetId: 'episode-04' },
    { id: 'smbh-cluster', name: 'SMACS Lensing Black Holes', category: 'Black Holes', description: 'High-redshift early black holes revealed by JWST.', image: cosmicImages.galaxyClusterDeepfield.url, actionType: 'astrolens', targetId: 'ep-deepfield-smacs' },
    { id: 'stephans-core', name: 'NGC 7319 Active Core', category: 'Black Holes', description: 'Accreting central black hole in compact group.', image: cosmicImages.galaxyClusterCollision.url, actionType: 'astrolens', targetId: 'ep-stephans-quintet' },
  ];

  const categoryMap: Record<CategoryType, { title: string; subtitle: string; cards: CelestialCardItem[] }> = {
    planets: {
      title: 'Planets',
      subtitle: 'Explore our solar system and the fascinating worlds beyond.',
      cards: planetCards,
    },
    stars: {
      title: 'Stars',
      subtitle: 'Thermonuclear beacons lighting up cosmic spacetime.',
      cards: starsCards,
    },
    galaxies: {
      title: 'Galaxies',
      subtitle: 'Vast gravitationally bound islands of billions of stars.',
      cards: galaxiesCards,
    },
    nebulae: {
      title: 'Nebulae',
      subtitle: 'Luminescent interstellar clouds of dust and ionized gases.',
      cards: nebulaeCards,
    },
    'black-holes': {
      title: 'Black Holes',
      subtitle: 'Extreme gravitational singularities warping spacetime.',
      cards: blackHolesCards,
    },
    asteroids: {
      title: 'Asteroids & Comets',
      subtitle: 'Primordial planetary building blocks from the dawn of Sol.',
      cards: planetCards, // fallback or similar
    },
    other: {
      title: 'Other Celestial Curiosities',
      subtitle: 'Deep-sky phenomena, cosmic rays, and mysterious voids.',
      cards: galaxiesCards, // fallback
    },
  };

  const currentCategoryData = categoryMap[selectedCategory];

  const displayedCards = useMemo(() => {
    if (!searchQuery.trim()) return categoryMap[selectedCategory].cards;
    const q = searchQuery.toLowerCase();
    const all = [
      ...planetCards,
      ...starsCards,
      ...galaxiesCards,
      ...nebulaeCards,
      ...blackHolesCards,
    ];
    return all.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedCategory]);

  const handleCardClick = (card: CelestialCardItem) => {
    if (card.actionType === 'planet' && card.planetId && onOpenPlanetStudio) {
      onOpenPlanetStudio(card.planetId);
    } else if (card.actionType === 'chapter' && onOpenReader) {
      onOpenReader(card.targetId || 'episode-01');
    } else if (card.actionType === 'starmap' && onOpenStarMap) {
      onOpenStarMap({ constellationId: card.targetId });
    } else if (card.actionType === 'astrolens' && onOpenAstroLens) {
      onOpenAstroLens(card.targetId);
    } else if (onOpenReader) {
      onOpenReader('episode-01');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 pt-24 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">


      <div className="max-w-7xl mx-auto space-y-14 relative z-10">

        {/* 1. Existing Topics of Ebook Chapters and their Chapter Images (At First and Top of Page) */}
        <EbookChapterTopicsHeader
          onSelectChapter={(chapterId) => onOpenReader?.(chapterId)}
        />

        {/* Top Header Mode Banner / Quick Switch - Translucent Glass Bar */}
        <div className="flex items-center justify-between py-2.5 px-4 rounded-2xl backdrop-blur-xl bg-slate-950/35 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] text-xs font-light text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-300">EXPLORE ARCHIVE OVERVIEW</span>
            <span className="text-slate-500">•</span>
            <span>AstroLens Visual Celestial Codex</span>
          </div>

          {onOpenReader && (
            <button
              onClick={() => onOpenReader('episode-01')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full backdrop-blur-md bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all cursor-pointer font-mono"
            >
              <BookOpen className="w-3 h-3 text-cyan-400" />
              <span>Open Chapter Reader</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* =========================================================================
            HERO SECTION: 1:1 Matching Reference Image
            - Left: EXPLORE label, Discover the Wonders of Space, Search Input
            - Right: Animated Rotating Celestial Horizon with Random Ebook Pictures
        ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading, Subtitle & Search Bar */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            
            {/* Category Pill Tag & Handwritten Kicker */}
            <div className="flex items-center space-x-3 text-xs font-light tracking-[0.25em] text-slate-400 uppercase select-none">
              <span>EXPLORE</span>
              <span className="text-slate-600 font-bold">•</span>
              <span className="font-handwriting text-cyan-300 text-lg tracking-normal normal-case -rotate-1">
                ✦ celestial field notes
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1] select-none">
              Discover the <br />
              <span className="font-handwriting font-normal text-5xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 inline-block drop-shadow-[0_0_24px_rgba(56,189,248,0.35)] -rotate-1 origin-left">
                Wonders of Space
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-lg select-none">
              From nearby planets to distant galaxies, explore the most fascinating objects in our universe.
            </p>

            {/* Search Input Bar (Translucent glass pill input) */}
            <div className="pt-2">
              <div className="relative max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search planets, galaxies, stars..."
                  className="w-full backdrop-blur-xl bg-slate-950/40 hover:bg-slate-900/50 focus:bg-slate-950/60 border border-white/15 focus:border-cyan-400/70 rounded-full py-3.5 pl-11 pr-5 text-sm font-light text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Animated Rotating Celestial Horizon with Random Ebook Pictures */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <HeroCelestialVisual />
          </div>

        </section>

        {/* Cosmic Shockers — Shocking Physics & Energy Facts */}
        <CosmicShockers />

        {/* =========================================================================
            MIDDLE SECTION:
            - Left Sidebar: Categories (Planets, Stars, Galaxies, Nebulae, Black Holes...)
            - Right Panel: 4x2 Cards Grid (Mercury, Venus, Earth, Mars, Jupiter, Saturn...)
        ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">

          {/* Left Sidebar Categories List - Translucent Glass Card */}
          <div className="lg:col-span-3 space-y-1.5 p-3 rounded-2xl backdrop-blur-xl bg-slate-950/35 border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            {[
              { id: 'planets' as CategoryType, label: 'Planets', count: 8, icon: Orbit },
              { id: 'stars' as CategoryType, label: 'Stars', count: 12, icon: Sparkles },
              { id: 'galaxies' as CategoryType, label: 'Galaxies', count: 10, icon: Disc },
              { id: 'nebulae' as CategoryType, label: 'Nebulae', count: 14, icon: Cloud },
              { id: 'black-holes' as CategoryType, label: 'Black Holes', count: 6, icon: CircleDot },
              { id: 'asteroids' as CategoryType, label: 'Asteroids & Comets', count: 8, icon: Compass },
              { id: 'other' as CategoryType, label: 'Other', count: 5, icon: Layers },
            ].map((cat) => {
              const IconComp = cat.icon;
              const isActive = selectedCategory === cat.id && !searchQuery;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-light transition-all cursor-pointer select-none ${
                    isActive
                      ? 'backdrop-blur-md bg-cyan-500/15 text-cyan-200 font-medium border border-cyan-400/50 shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                  </div>
                  <span className={`text-xs font-mono ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Main Grid Panel */}
          <div className="lg:col-span-9 space-y-6">

            {/* Header: Title + Subtitle + View All */}
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-light text-white tracking-tight">
                  {searchQuery ? `Search Results for "${searchQuery}"` : currentCategoryData.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
                  {searchQuery ? `Found ${displayedCards.length} matching cosmic targets` : currentCategoryData.subtitle}
                </p>
              </div>

              {!searchQuery && (
                <button
                  onClick={() => onOpenReader && onOpenReader('episode-01')}
                  className="inline-flex items-center space-x-1 text-xs sm:text-sm font-light text-cyan-400 hover:text-cyan-300 transition-colors group cursor-pointer"
                >
                  <span>View All</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </div>

            {/* 4 Columns x 2 Rows Grid (8 Cards) - Translucent Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayedCards.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="group flex flex-col justify-between backdrop-blur-xl bg-slate-950/30 hover:bg-slate-900/45 border border-white/15 hover:border-cyan-400/50 rounded-2xl p-5 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.2)] hover:-translate-y-1.5 cursor-pointer select-none min-h-[290px]"
                >
                  {/* Visual Body: Canvas Planet or High-Res Image */}
                  <div className="flex items-center justify-center py-4 relative">
                    {item.planetId ? (
                      <PlanetDiscCanvas planetId={item.planetId} size={110} />
                    ) : item.image ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 shadow-md relative group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full backdrop-blur-md bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-500">
                        <Sparkles className="w-8 h-8 text-cyan-500/40" />
                      </div>
                    )}
                  </div>

                  {/* Card Information */}
                  <div className="space-y-2 mt-auto">
                    <h3 className="text-base font-medium text-white group-hover:text-cyan-200 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-light line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Learn More link with clean arrow (NO book icon!) */}
                    <div className="pt-2">
                      <span className="inline-flex items-center text-xs font-light text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        <span>Learn More</span>
                        <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </section>

        {/* =========================================================================
            BOTTOM FEATURED SECTION:
            - Left: 2/3 wide Andromeda Galaxy Featured Card
            - Right: 1/3 wide Quick Facts + Did you know? Card
        ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">

          {/* Left 2/3 Wide Featured Galaxy Card - Translucent Glass Card */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-2xl border border-white/15 backdrop-blur-xl bg-slate-950/35 min-h-[380px] flex flex-col justify-between p-7 sm:p-9 group shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            
            {/* Background Andromeda Galaxy Image with Atmospheric Scrim */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <ResponsiveImage
                picture={cosmicImages.andromedaGalaxyM31.picture}
                alt="Andromeda Galaxy (M31)"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out brightness-100 contrast-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060913]/90 via-[#060913]/35 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/65 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Top Badge: FEATURED */}
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase backdrop-blur-md bg-slate-950/60 text-cyan-300 border border-white/15 shadow-lg">
                FEATURED
              </span>
            </div>

            {/* Bottom Content: GALAXY, Title, Description & Button */}
            <div className="relative z-10 pt-16 space-y-4 max-w-xl">
              <div>
                <div className="text-[11px] font-mono tracking-[0.22em] text-slate-400 uppercase mb-1.5">
                  GALAXY
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  Andromeda Galaxy
                </h3>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                The nearest spiral galaxy to our Milky Way, and one of the most massive galaxies in the Local Group.
              </p>

              <div>
                <button
                  onClick={() => onOpenReader ? onOpenReader('episode-03') : null}
                  className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-full border border-white/15 hover:border-cyan-400/60 backdrop-blur-md bg-slate-950/60 hover:bg-slate-900/80 text-white text-xs font-light transition-all shadow-xl group/btn cursor-pointer"
                >
                  <span>Explore Galaxy</span>
                  <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right 1/3 Wide Quick Facts & Did You Know Card - Translucent Glass Card */}
          <div className="lg:col-span-4 rounded-2xl border border-white/15 backdrop-blur-xl bg-slate-950/35 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            
            {/* Quick Facts Section */}
            <div>
              {/* Spiral Icon */}
              <div className="mb-4 text-cyan-400">
                <Disc className="w-5 h-5 stroke-[1.6]" />
              </div>

              <h3 className="text-lg font-light text-white tracking-tight mb-5">
                Quick Facts
              </h3>

              {/* Facts Table */}
              <div className="space-y-3.5 text-xs font-light">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Type</span>
                  <span className="text-white font-normal">Spiral Galaxy</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Distance from Earth</span>
                  <span className="text-white font-normal">2.54 million light-years</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Diameter</span>
                  <span className="text-white font-normal">~ 220,000 light-years</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Constellation</span>
                  <span className="text-white font-normal">Andromeda</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Age</span>
                  <span className="text-white font-normal">~ 10 billion years</span>
                </div>
              </div>
            </div>

            {/* Did You Know? Callout Box - Translucent Glass */}
            <div className="rounded-xl backdrop-blur-md bg-white/[0.04] border border-white/10 p-4 flex items-start space-x-3.5">
              <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-medium text-white">
                  Did you know?
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  The Andromeda Galaxy is on a collision course with the Milky Way and will likely merge in about 4–5 billion years.
                </p>
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
};
