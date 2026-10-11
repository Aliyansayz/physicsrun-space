import React, { useState, useEffect } from 'react';
import { AstroLensEpisode, SpectralWavelength, DiscoveryProgress } from '../../types/astrolens';
import { ASTROLENS_EPISODES } from '../../data/astrolensData';
import { AstroLensViewport } from './AstroLensViewport';
import { SpectralBandSelector } from './SpectralBandSelector';
import { SpectralAnalysisDrawer } from './SpectralAnalysisDrawer';
import { EpisodeSelector } from './EpisodeSelector';
import { ObservatoryLogbookModal } from './ObservatoryLogbookModal';
import {
  getDiscoveryProgress,
  recordEpisodeView,
} from '../../services/astrolensStorage';
import {
  Award,
  Sparkles,
  BookOpen,
  Compass,
  Radio,
  Layers,
  Info,
} from 'lucide-react';

interface AstroLensViewProps {
  initialEpisodeId?: string;
  onNavigateToChapter?: (chapterId: string) => void;
  onNavigateToStarMap?: (target?: { constellationId?: string; starId?: string; dsoId?: string }) => void;
}

export const AstroLensView: React.FC<AstroLensViewProps> = ({
  initialEpisodeId = 'ep-deepfield-smacs',
  onNavigateToChapter,
  onNavigateToStarMap,
}) => {
  const [currentEpisode, setCurrentEpisode] = useState<AstroLensEpisode>(() => {
    const found = ASTROLENS_EPISODES.find((e) => e.id === initialEpisodeId);
    return found || ASTROLENS_EPISODES[0];
  });

  const [activeWavelength, setActiveWavelength] = useState<SpectralWavelength>('optical');
  const [isLogbookOpen, setIsLogbookOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<DiscoveryProgress>(() => getDiscoveryProgress());

  // Record episode viewing
  useEffect(() => {
    const updated = recordEpisodeView(currentEpisode.id);
    setProgress(updated);
  }, [currentEpisode.id]);

  const handleSelectEpisode = (ep: AstroLensEpisode) => {
    setCurrentEpisode(ep);
    // Smooth scroll to top of viewport
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const currentAnalyzedBands = progress.analyzedWavelengthsByEpisode[currentEpisode.id] || [];

  return (
    <div className="w-full min-h-screen bg-[#030611] text-slate-200 pb-24 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto selection:bg-cyan-900/50">
      
      {/* Hero Header Section matching reference image */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">
              DEEP-SPACE OBSERVATORY // CRYOGENIC TELESCOPE ARRAY
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
            AstroLens: <span className="font-normal text-cyan-200">Explore the Wonders of Space</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-2 font-light leading-relaxed">
            Multi-spectral deep space observatory synthesizing observations from the James Webb Space Telescope (JWST), Chandra X-Ray Observatory, ALMA Radio Interferometer, and Hubble Space Telescope.
          </p>
        </div>

        {/* Action Controls & Logbook Pill */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLogbookOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/40 text-cyan-200 text-xs font-mono transition-all duration-200 shadow-lg shadow-black/30 cursor-pointer group"
          >
            <Award className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>OBSERVATORY LOGBOOK</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300">
              {progress.viewedEpisodeIds.length}/{ASTROLENS_EPISODES.length} MAPPED
            </span>
          </button>
        </div>
      </div>

      {/* Main Interactive Space */}
      <div className="space-y-4">
        {/* Wavelength Filter Switcher */}
        <SpectralBandSelector
          currentWavelength={activeWavelength}
          onSelectWavelength={setActiveWavelength}
          analyzedWavelengths={currentAnalyzedBands}
          baseToneHz={currentEpisode.spectralObservations[activeWavelength].sonificationToneHz}
        />

        {/* Central Observation Viewport with Telemetry HUD */}
        <AstroLensViewport
          episode={currentEpisode}
          activeWavelength={activeWavelength}
          onChangeWavelength={setActiveWavelength}
          onOpenLogbook={() => setIsLogbookOpen(true)}
        />

        {/* Astrophysics Breakdown & Diagnostic Drawer */}
        <SpectralAnalysisDrawer
          episode={currentEpisode}
          activeWavelength={activeWavelength}
          onNavigateToChapter={onNavigateToChapter}
          onNavigateToStarMap={() => {
            if (onNavigateToStarMap) {
              onNavigateToStarMap({
                constellationId: currentEpisode.associatedConstellationId,
                dsoId: currentEpisode.associatedDsoId,
              });
            }
          }}
        />
      </div>

      {/* Episodic Missions Carousel / Explorer Section */}
      <div className="mt-14 pt-8 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xl font-light text-white tracking-tight">
                Cosmic Expeditions & Deep Sky Catalog
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any episode below to lock onto target coordinates in the AstroLens viewport.
            </p>
          </div>
        </div>

        <EpisodeSelector
          currentEpisodeId={currentEpisode.id}
          onSelectEpisode={handleSelectEpisode}
          analyzedWavelengthsByEpisode={progress.analyzedWavelengthsByEpisode}
        />
      </div>

      {/* Observatory Logbook Modal */}
      <ObservatoryLogbookModal
        isOpen={isLogbookOpen}
        onClose={() => setIsLogbookOpen(false)}
        progress={progress}
        onProgressUpdated={setProgress}
      />
    </div>
  );
};
