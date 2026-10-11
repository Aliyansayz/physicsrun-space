/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveView } from './types';
import { Header } from './components/navigation/Header';
import { Footer } from './components/navigation/Footer';
import { LandingHero } from './components/home/LandingHero';
import { FeatureCardsSection } from './components/home/FeatureCardsSection';
import { CosmosExploreGrid } from './components/home/CosmosExploreGrid';
import { CinematicEbookViewer } from './components/ebook/CinematicEbookViewer';
import { EbookExploreView } from './components/ebook/EbookExploreView';
import { PlanetViewer3D } from './components/planets/PlanetViewer3D';
import { StarMap3D } from './components/starmap/StarMap3D';
import { AstroLensView } from './components/astrolens/AstroLensView';
import { SearchModal } from './components/search/SearchModal';
import { DetailModal, DetailModalData } from './components/common/DetailModal';
import { chaptersData } from './data/chaptersData';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [ebookSubMode, setEbookSubMode] = useState<'overview' | 'reader'>('overview');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('episode-01');
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [selectedConstellationId, setSelectedConstellationId] = useState<string>('orion');
  const [selectedStarId, setSelectedStarId] = useState<string | undefined>(undefined);
  const [selectedDsoId, setSelectedDsoId] = useState<string | undefined>(undefined);
  const [selectedAstroLensEpisodeId, setSelectedAstroLensEpisodeId] = useState<string>('ep-deepfield-smacs');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [detailModalData, setDetailModalData] = useState<DetailModalData | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // Global keyboard shortcuts (Cmd+K for search, L for AstroLens)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.key === 'l' || e.key === 'L') && !isInput && !(e.metaKey || e.ctrlKey || e.altKey)) {
        setActiveView('astrolens');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigate to specific chapter in Ebook
  const handleNavigateToChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setActiveView('ebook');
    setEbookSubMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to specific planet in 3D Studio
  const handleNavigateToPlanet = (planetId: string) => {
    setSelectedPlanetId(planetId);
    setActiveView('planets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to 3D Star Map with optional targeted object
  const handleNavigateToStarMap = (target?: { constellationId?: string; starId?: string; dsoId?: string }) => {
    if (target?.constellationId) setSelectedConstellationId(target.constellationId);
    if (target?.starId) setSelectedStarId(target.starId);
    if (target?.dsoId) setSelectedDsoId(target.dsoId);
    setActiveView('starmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to AstroLens Observatory
  const handleNavigateToAstroLens = (episodeId?: string) => {
    if (episodeId) setSelectedAstroLensEpisodeId(episodeId);
    setActiveView('astrolens');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch view helper
  const handleSwitchView = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'ebook') {
      setEbookSubMode('overview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-200 flex flex-col selection:bg-cyan-900/50 selection:text-cyan-200 font-sans relative">
      
      {/* Global Space Galactic Supernova Background Layer (visible through translucent glass cards) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/src/assets/images/supernova_cosmic_explosion_1791711683777.jpg"
          alt="Galactic Supernova Explosion"
          className="w-full h-full object-cover object-center opacity-30 filter brightness-[0.72] contrast-[1.2]"
          loading="eager"
        />
        {/* Subtle radial and linear depth scrims so typography retains high contrast */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#05070e]/50 to-[#05070e]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070e]/70 via-transparent to-[#05070e]/95" />
      </div>

      {/* Top 3-Zone Navigation Header (hidden in full-screen episode reader mode) */}
      {!(activeView === 'ebook' && ebookSubMode === 'reader') && (
        <div className="relative z-40">
          <Header
            activeView={activeView}
            setActiveView={handleSwitchView}
            onOpenSearch={() => setIsSearchOpen(true)}
            isAmbientPlaying={isAmbientPlaying}
            setIsAmbientPlaying={setIsAmbientPlaying}
          />
        </div>
      )}

      {/* Main Dynamic View Area */}
      <main className="flex-1 relative z-10">
        {activeView === 'landing' && (
          <div className="animate-in fade-in duration-300">
            {/* Hero Section */}
            <LandingHero
              onStartExploring={() => handleSwitchView('ebook')}
              onOpenPlanets={() => handleSwitchView('planets')}
              onOpenStarMap={() => handleSwitchView('starmap')}
            />

            {/* 4 Feature Exploration Cards */}
            <FeatureCardsSection
              onSelectPlanets={() => handleSwitchView('planets')}
              onSelectStarMap={() => handleSwitchView('starmap')}
              onSelectGalaxies={() => handleNavigateToChapter('episode-03')}
              onSelectDeepSpace={() => handleNavigateToAstroLens()}
            />

            {/* Featured Space Imagery & Dossiers Grid */}
            <CosmosExploreGrid
              onOpenModal={(data) => setDetailModalData(data)}
              onNavigateToChapter={handleNavigateToChapter}
              onNavigateToPlanet={handleNavigateToPlanet}
              onNavigateToStarMap={handleNavigateToStarMap}
            />
          </div>
        )}

        {activeView === 'astrolens' && (
          <div className="animate-in fade-in duration-300">
            <AstroLensView
              initialEpisodeId={selectedAstroLensEpisodeId}
              onNavigateToChapter={handleNavigateToChapter}
              onNavigateToStarMap={handleNavigateToStarMap}
            />
          </div>
        )}

        {activeView === 'ebook' && (
          <div className="w-full animate-in fade-in duration-300">
            {ebookSubMode === 'overview' ? (
              <EbookExploreView
                onOpenReader={(chapterId) => {
                  if (chapterId) setSelectedChapterId(chapterId);
                  setEbookSubMode('reader');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenPlanetStudio={handleNavigateToPlanet}
                onOpenStarMap={handleNavigateToStarMap}
                onOpenAstroLens={handleNavigateToAstroLens}
              />
            ) : (
              <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#05070e]">
                <CinematicEbookViewer
                  initialChapterId={selectedChapterId}
                  onBackToLibrary={() => {
                    setEbookSubMode('overview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenPlanetStudio={handleNavigateToPlanet}
                  onOpenStarMap={handleNavigateToStarMap}
                  onOpenAstroLens={handleNavigateToAstroLens}
                />
              </div>
            )}
          </div>
        )}

        {activeView === 'planets' && (
          <div className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto animate-in fade-in duration-300">
            <PlanetViewer3D
              initialPlanetId={selectedPlanetId}
              onSelectChapter={handleNavigateToChapter}
              compact={false}
            />
          </div>
        )}

        {activeView === 'starmap' && (
          <div className="pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto animate-in fade-in duration-300">
            <StarMap3D
              onSelectChapter={handleNavigateToChapter}
              initialConstellationId={selectedConstellationId}
              initialStarId={selectedStarId}
              initialDsoId={selectedDsoId}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveView={handleSwitchView} />

      {/* Global Astronomical Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToPlanet={handleNavigateToPlanet}
        onNavigateToChapter={handleNavigateToChapter}
        onNavigateToStarMap={handleNavigateToStarMap}
        onNavigateToAstroLens={handleNavigateToAstroLens}
      />

      {/* Detail Inspect Modal */}
      <DetailModal
        data={detailModalData}
        onClose={() => setDetailModalData(null)}
      />
    </div>
  );
}
