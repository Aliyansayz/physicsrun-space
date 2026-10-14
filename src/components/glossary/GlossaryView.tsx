import React, { useState, useMemo, useEffect } from 'react';
import { GlossaryPhenomenon } from '../../types';
import { glossaryPhenomena } from '../../data/glossaryData';
import { cosmicImages } from '../../assets/images';
import { ResponsiveImage } from '../common/ResponsiveImage';
import { narrationAudio } from '../../services/narrationAudio';
import { astroSonification } from '../../services/astroSonification';
import { PhenomenonEquationSolver } from './PhenomenonEquationSolver';
import { 
  ArrowLeft, 
  Compass, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Maximize2, 
  Minimize2,
  Atom,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Quote,
  Play,
  Pause,
  RotateCcw,
  Calculator,
  Camera,
  Crosshair,
  Filter,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface GlossaryViewProps {
  initialTermId?: string;
  returnChapterId?: string | null;
  onReturnToChapter?: (chapterId: string) => void;
  onNavigateToChapter?: (chapterId: string) => void;
  onNavigateToPlanet?: (planetId: string) => void;
  onNavigateToStarMap?: (target?: { dsoId?: string }) => void;
  onNavigateToAstroLens?: () => void;
}

export type SpectralFilterMode = 'rgb' | 'sho' | 'halpha' | 'inverted';

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  initialTermId,
  returnChapterId,
  onReturnToChapter,
  onNavigateToChapter,
  onNavigateToPlanet,
  onNavigateToStarMap,
  onNavigateToAstroLens,
}) => {
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (initialTermId) {
      const match = glossaryPhenomena.find(p => p.id === initialTermId);
      if (match) return match.id;
    }
    return glossaryPhenomena[0].id;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [showCanvasTelemetry, setShowCanvasTelemetry] = useState<boolean>(true);
  const [showAstroReticle, setShowAstroReticle] = useState<boolean>(true);
  const [showFilmstrip, setShowFilmstrip] = useState<boolean>(true);
  const [spectralFilter, setSpectralFilter] = useState<SpectralFilterMode>('rgb');

  // Astrophotography sensor integration simulation state
  const [isIntegrating, setIsIntegrating] = useState<boolean>(false);
  const [integrationProgress, setIntegrationProgress] = useState<number>(0);
  const [sensorStatusText, setSensorStatusText] = useState<string>('');
  const [justCaptured, setJustCaptured] = useState<boolean>(false);

  // Audio voice narration execution state
  const [isNarratingPrompt, setIsNarratingPrompt] = useState<boolean>(false);

  // Detail section toggles (kept closed by default to preserve the minimal aesthetic)
  const [showMechanism, setShowMechanism] = useState<boolean>(false);
  const [showFormulation, setShowFormulation] = useState<boolean>(false);
  const [showSkyTargets, setShowSkyTargets] = useState<boolean>(false);
  const [showAstroRig, setShowAstroRig] = useState<boolean>(false);
  const [showCrossLinks, setShowCrossLinks] = useState<boolean>(false);
  
  // Interactive live physics equation execution solver state
  const [isSolverActive, setIsSolverActive] = useState<boolean>(false);

  // Update selected if initialTermId changes from external navigation
  useEffect(() => {
    if (initialTermId) {
      const match = glossaryPhenomena.find(p => p.id === initialTermId);
      if (match) {
        setSelectedId(match.id);
        setIsZoomed(false);
      }
    }
  }, [initialTermId]);

  // Stop narration on unmount
  useEffect(() => {
    const unsub = narrationAudio.subscribe(state => {
      setIsNarratingPrompt(state.isSpeaking && !state.isPaused);
    });
    return () => {
      unsub();
      narrationAudio.stop();
    };
  }, []);

  const activePhenomenon = useMemo<GlossaryPhenomenon>(() => {
    return glossaryPhenomena.find(p => p.id === selectedId) || glossaryPhenomena[0];
  }, [selectedId]);

  // When switching phenomena, stop previous narration and reset solver
  useEffect(() => {
    narrationAudio.stop();
    setIsNarratingPrompt(false);
    setIsSolverActive(false);
    setIsIntegrating(false);
    setJustCaptured(false);
  }, [selectedId]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(glossaryPhenomena.map(p => p.category)));
    return ['All', ...list];
  }, []);

  const filteredPhenomena = useMemo(() => {
    if (selectedCategory === 'All') return glossaryPhenomena;
    return glossaryPhenomena.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const currentIndex = glossaryPhenomena.findIndex(p => p.id === activePhenomenon.id);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + glossaryPhenomena.length) % glossaryPhenomena.length;
    setSelectedId(glossaryPhenomena[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % glossaryPhenomena.length;
    setSelectedId(glossaryPhenomena[nextIdx].id);
  };

  // Execute episodic prompt narration audio
  const handleExecutePromptAudio = () => {
    if (isNarratingPrompt) {
      narrationAudio.stop();
      setIsNarratingPrompt(false);
    } else {
      const textToSpeak = `${activePhenomenon.term}. ${activePhenomenon.episodicPrompt} ${activePhenomenon.shortDefinition}`;
      narrationAudio.speak(textToSpeak, () => {
        setIsNarratingPrompt(false);
      });
      setIsNarratingPrompt(true);
    }
  };

  // Execute live Astrophotography sensor capture integration simulation
  const handleExecuteSensorCapture = () => {
    if (isIntegrating) return;
    setIsIntegrating(true);
    setIntegrationProgress(0);
    setJustCaptured(false);
    astroSonification.playShutterSound();
    setSensorStatusText('Opening sensor shutter: 24 sub-exposures stack init...');

    const interval = setInterval(() => {
      setIntegrationProgress(prev => {
        const next = prev + 12;
        if (next >= 100) {
          clearInterval(interval);
          setIsIntegrating(false);
          setJustCaptured(true);
          astroSonification.playSensorLockTone();
          setSensorStatusText('Stacking complete: 24/24 subs · SNR +48.2dB Locked');
          setTimeout(() => setJustCaptured(false), 4000);
          return 100;
        }
        if (next >= 75) {
          setSensorStatusText('Registering stars & drizzle integration 2x...');
        } else if (next >= 40) {
          setSensorStatusText('Integrating calibrated frames (Darks & Flats)...');
        } else {
          setSensorStatusText(`Exposing frame ${Math.ceil((next / 100) * 24)}/24 @ -15°C...`);
        }
        return next;
      });
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      if (isInput) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isZoomed]);

  const activeImage = cosmicImages[activePhenomenon.imageKey];

  const anyDetailsOpen = showMechanism || showFormulation || showSkyTargets || showAstroRig || showCrossLinks;

  const handleToggleAllDetails = () => {
    if (anyDetailsOpen) {
      setShowMechanism(false);
      setShowFormulation(false);
      setShowSkyTargets(false);
      setShowAstroRig(false);
      setShowCrossLinks(false);
      setIsSolverActive(false);
    } else {
      setShowMechanism(true);
      setShowFormulation(true);
      setShowSkyTargets(true);
      setShowAstroRig(true);
      setShowCrossLinks(true);
    }
  };

  // Astrophotography Spectral Filter CSS styling
  const getImageFilterClass = () => {
    switch (spectralFilter) {
      case 'sho':
        // Hubble SHO palette simulation (intense cyan/amber contrast)
        return 'hue-rotate-[160deg] saturate-[1.65] contrast-[1.2]';
      case 'halpha':
        // Deep H-Alpha red emission filter
        return 'sepia-[0.8] hue-rotate-[320deg] saturate-[2.2] contrast-[1.3]';
      case 'inverted':
        // Inverted luminance (astrophotographer deep faint-structure search)
        return 'invert contrast-[1.4] grayscale brightness-[1.05]';
      case 'rgb':
      default:
        return 'filter-none';
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] min-h-[640px] pt-20 flex flex-col overflow-hidden bg-[#05070e] text-slate-100 select-none">
      
      {/* Return to Chapter Bookmark Banner (if navigated from reader) */}
      {returnChapterId && onReturnToChapter && (
        <div className="bg-cyan-950/80 border-b border-cyan-500/30 px-6 py-2 flex items-center justify-between text-xs font-mono z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Viewing phenomenon referenced in Ebook chapter</span>
          </div>
          <button
            onClick={() => onReturnToChapter(returnChapterId)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all cursor-pointer shadow-md hover:scale-105"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Reading</span>
          </button>
        </div>
      )}

      {/* Main 70% / 30% Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden relative">
        
        {/* ========================================================================= */}
        {/* LEFT 70% SCREEN: Panoramic Phenomenon Visual Stage                        */}
        {/* ========================================================================= */}
        <section 
          className="relative w-full lg:w-[70%] h-[55vh] lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 bg-black flex flex-col justify-between group"
          aria-label="Phenomenon Visual Canvas (70% Screen Coverage)"
        >
          {/* Panoramic Cosmic Image Container */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className={`w-full h-full transition-all duration-700 ease-out ${getImageFilterClass()}`}>
              <ResponsiveImage
                picture={activeImage.picture}
                alt={activePhenomenon.term}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 group-hover:scale-[1.01]'
                }`}
                sizes="(min-width: 1024px) 70vw, 100vw"
                priority
              />
            </div>

            {/* Subtle atmospheric gradient scrims */}
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-[#05070e]/85 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-transparent to-black/35 pointer-events-none" />
          </div>

          {/* Flash overlay upon successful exposure capture */}
          {justCaptured && (
            <div className="absolute inset-0 bg-cyan-400/20 pointer-events-none z-30 animate-out fade-out duration-1000" />
          )}

          {/* Top Stage Controls (Astrophotography Telemetry HUD + Reticle Toggles) */}
          <div className="relative z-20 p-4 sm:p-6 flex items-start justify-between pointer-events-none">
            {showCanvasTelemetry ? (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-xs font-mono text-cyan-300 shadow-lg">
                  <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '16s' }} />
                  <span>{activePhenomenon.category}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">Scale: {activePhenomenon.scaleEstimate}</span>
                </div>
                {activePhenomenon.astrophotographyMeta && (
                  <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-sm">
                    <Camera className="w-3 h-3 text-cyan-400" />
                    <span>{activePhenomenon.astrophotographyMeta.telescope}</span>
                    <span className="text-slate-600">|</span>
                    <span>{activePhenomenon.astrophotographyMeta.exposureStack}</span>
                  </div>
                )}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Spectral Filter Selector Button Group */}
              <div className="hidden sm:flex items-center bg-slate-950/80 backdrop-blur-md rounded-xl p-1 border border-white/15 shadow-lg text-[11px] font-mono">
                <button
                  onClick={() => setSpectralFilter('rgb')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    spectralFilter === 'rgb' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="True Color RGB Broadband"
                >
                  RGB
                </button>
                <button
                  onClick={() => setSpectralFilter('sho')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    spectralFilter === 'sho' ? 'bg-amber-400 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Hubble SHO Narrowband (S-II, Ha, O-III)"
                >
                  SHO
                </button>
                <button
                  onClick={() => setSpectralFilter('halpha')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    spectralFilter === 'halpha' ? 'bg-rose-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Hydrogen-Alpha 656nm Emission Band"
                >
                  H-α
                </button>
                <button
                  onClick={() => setSpectralFilter('inverted')}
                  className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                    spectralFilter === 'inverted' ? 'bg-white text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Inverted Luminance (Deep Structure Detection)"
                >
                  Inv
                </button>
              </div>

              {/* Astrophotography Crosshair Reticle Toggle */}
              <button
                onClick={() => setShowAstroReticle(!showAstroReticle)}
                className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                  showAstroReticle
                    ? 'bg-cyan-950/70 border-cyan-400/60 text-cyan-300'
                    : 'bg-slate-950/60 hover:bg-slate-900/90 border-white/15 text-slate-400 hover:text-white'
                }`}
                title={showAstroReticle ? 'Hide Astrophotography Reticle & FOV Grid' : 'Show Astrophotography Reticle'}
                aria-label="Toggle astrophotography reticle"
              >
                <Crosshair className="w-4 h-4" />
              </button>

              {/* Telemetry Clean Mode Toggle */}
              <button
                onClick={() => setShowCanvasTelemetry(!showCanvasTelemetry)}
                className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                  showCanvasTelemetry
                    ? 'bg-slate-950/60 hover:bg-slate-900/90 border-white/15 text-slate-300 hover:text-cyan-300'
                    : 'bg-cyan-950/70 border-cyan-400/60 text-cyan-300'
                }`}
                title={showCanvasTelemetry ? 'Hide Telemetry (Pure Mode)' : 'Show Telemetry & Scale'}
                aria-label="Toggle telemetry HUD"
              >
                {showCanvasTelemetry ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Magnify Stage Toggle */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-900/90 border border-white/15 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title={isZoomed ? 'Reset Zoom' : 'Magnify Stage (70%)'}
                aria-label="Toggle zoom on phenomenon visual"
              >
                {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Center Astrophotography Reticle & Full-Frame FOV Bounds Overlay */}
          {showAstroReticle && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500">
              {/* Full-Frame 35mm Sensor Boundary Guide */}
              <div className="w-[82%] h-[68%] border border-cyan-500/20 rounded-lg relative flex items-center justify-center">
                <span className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/70 uppercase">
                  FOV 42′ × 28′ · 35mm FF
                </span>
                <span className="absolute bottom-2 right-2 text-[9px] font-mono text-cyan-400/70 uppercase">
                  0.73″ / pixel
                </span>

                {/* Celestial Orientation Compass in corner */}
                <div className="absolute top-2 right-2 flex flex-col items-center text-[9px] font-mono text-cyan-400/70">
                  <span>N ↑</span>
                  <span>E ←</span>
                </div>

                {/* Central Crosshair & Concentric Guide Rings */}
                <div className="w-48 h-48 border border-cyan-400/25 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 border border-dashed border-cyan-300/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400/90 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  </div>
                </div>

                {/* Crosshair ticks */}
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
                <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
              </div>
            </div>
          )}

          {/* Sensor Integration Stacking Progress HUD (When Execute Sensor Capture is running) */}
          {(isIntegrating || justCaptured) && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-md w-[90%] p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-400/60 backdrop-blur-xl shadow-2xl text-xs font-mono space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-cyan-300">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider">Astrophotography Stacking Engine</span>
                </div>
                <span className="text-cyan-400 font-bold">{integrationProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-200"
                  style={{ width: `${integrationProgress}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>{sensorStatusText}</span>
                {justCaptured && (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    STACK SAVED
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bottom Controls & Filmstrip Carousel */}
          <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-[#05070e] via-[#05070e]/85 to-transparent">
            
            {/* Filmstrip collapse / expand header */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.35)]'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900 border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilmstrip(!showFilmstrip)}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors ml-2 shrink-0 cursor-pointer"
                title={showFilmstrip ? 'Collapse Filmstrip' : 'Expand Filmstrip'}
              >
                <span>{showFilmstrip ? 'Hide Strip' : 'Show Strip'}</span>
                {showFilmstrip ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Horizontal Filmstrip Carousel */}
            {showFilmstrip && (
              <div className="flex items-center gap-2.5 relative pt-1 animate-in fade-in duration-200">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                  title="Previous phenomenon (←)"
                  aria-label="Previous phenomenon"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                  {filteredPhenomena.map(item => {
                    const isCurrent = item.id === activePhenomenon.id;
                    const itemImg = cosmicImages[item.imageKey];
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`group/thumb flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                          isCurrent
                            ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_12px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/50'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/30'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-slate-900">
                          <img
                            src={itemImg.url}
                            alt={item.term}
                            className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-left">
                          <div className={`text-xs font-medium leading-tight truncate max-w-[110px] sm:max-w-[130px] ${
                            isCurrent ? 'text-cyan-300 font-semibold' : 'text-slate-300'
                          }`}>
                            {item.term}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 truncate max-w-[110px] sm:max-w-[130px]">
                            {item.category}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                  title="Next phenomenon (→)"
                  aria-label="Next phenomenon"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RIGHT 30% SCREEN: Technical Definition & Astrophysics Dossier             */}
        {/* ========================================================================= */}
        <aside 
          className="w-full lg:w-[30%] h-[45vh] lg:h-full overflow-y-auto bg-[#060912]/95 p-6 sm:p-7 space-y-5 flex flex-col justify-between"
          aria-label="Phenomenon Technical Dossier (30% Screen Coverage)"
        >
          <div className="space-y-4">
            
            {/* Header: Term & Pronunciation */}
            <div className="space-y-1.5 border-b border-white/10 pb-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                <span>ASTROPHOTOGRAPHY DOSSIER</span>
                <span className="text-slate-500">#{activePhenomenon.id}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight leading-tight">
                {activePhenomenon.term}
              </h1>

              {activePhenomenon.pronunciation && (
                <div className="text-xs font-mono text-slate-400">
                  {activePhenomenon.pronunciation}
                </div>
              )}
            </div>

            {/* 1. EPISODIC OBSERVATIONAL PROMPT: Minimal evocative directive with Execute actions */}
            <div className="relative p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 shadow-sm space-y-3 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  <Quote className="w-3 h-3 text-cyan-400" />
                  <span>Observational Field Prompt</span>
                  {activePhenomenon.episodeReference && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 truncate">{activePhenomenon.episodeReference}</span>
                    </>
                  )}
                </div>

                {/* Audio pulse indicator */}
                {isNarratingPrompt && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
                    <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-150" />
                  </div>
                )}
              </div>
              
              <p className="text-xs sm:text-[13px] text-cyan-100 font-light italic leading-relaxed">
                "{activePhenomenon.episodicPrompt}"
              </p>

              {/* Execution Actions for the Episodic Prompt */}
              <div className="pt-2 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Action 1: Execute Audio Narration */}
                  <button
                    onClick={handleExecutePromptAudio}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shadow-sm ${
                      isNarratingPrompt
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-400/30'
                    }`}
                    title={isNarratingPrompt ? 'Stop Audio' : 'Execute Audio Narration'}
                  >
                    {isNarratingPrompt ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isNarratingPrompt ? 'Pause' : 'Audio Inscription'}</span>
                  </button>

                  {/* Action 2: Execute Sensor Capture Simulation */}
                  <button
                    onClick={handleExecuteSensorCapture}
                    disabled={isIntegrating}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer shadow-sm ${
                      isIntegrating
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/20'
                    }`}
                    title="Simulate Astrophotography Sensor Stacking"
                  >
                    <Camera className={`w-3 h-3 ${isIntegrating ? 'animate-spin' : 'text-cyan-400'}`} />
                    <span>{isIntegrating ? 'Stacking...' : 'Capture Stack'}</span>
                  </button>
                </div>

                {activePhenomenon.associatedChapterId && onNavigateToChapter && (
                  <button
                    onClick={() => onNavigateToChapter(activePhenomenon.associatedChapterId!)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Launch linked episode"
                  >
                    <span>Read Episode</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Concise 1-sentence Definition (Minimal, uncluttered read) */}
            <div className="text-xs sm:text-[13px] text-slate-300/90 font-light leading-relaxed">
              {activePhenomenon.shortDefinition}
            </div>

            {/* 2. INTERACTIVE DETAIL TOGGLE BUTTONS (Keeps minimal feel alive by hiding noise!) */}
            <div className="pt-2 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                  <span>Dossier Breakdowns</span>
                </span>
                <button
                  onClick={handleToggleAllDetails}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer lowercase font-normal"
                >
                  {anyDetailsOpen ? 'collapse all' : 'expand all'}
                </button>
              </div>

              {/* Toggle Buttons Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowMechanism(!showMechanism)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    showMechanism
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-slate-300 hover:text-white'
                  }`}
                  aria-expanded={showMechanism}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Mechanism</span>
                  </span>
                  {showMechanism ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                </button>

                <button
                  onClick={() => setShowFormulation(!showFormulation)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    showFormulation
                      ? 'bg-amber-950/60 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-slate-300 hover:text-white'
                  }`}
                  aria-expanded={showFormulation}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Atom className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Physics Law</span>
                  </span>
                  {showFormulation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                </button>

                <button
                  onClick={() => setShowSkyTargets(!showSkyTargets)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    showSkyTargets
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-slate-300 hover:text-white'
                  }`}
                  aria-expanded={showSkyTargets}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Targets ({activePhenomenon.observedExamples.length})</span>
                  </span>
                  {showSkyTargets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                </button>

                <button
                  onClick={() => setShowAstroRig(!showAstroRig)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    showAstroRig
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-slate-300 hover:text-white'
                  }`}
                  aria-expanded={showAstroRig}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Camera className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Astro Rig</span>
                  </span>
                  {showAstroRig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                </button>
              </div>

              {/* Extra toggle for deep cross links */}
              <button
                onClick={() => setShowCrossLinks(!showCrossLinks)}
                className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                  showCrossLinks
                    ? 'bg-slate-900 border-white/40 text-white shadow-md'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                aria-expanded={showCrossLinks}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Cross-Links & 3D Visualizer Connections</span>
                </span>
                {showCrossLinks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>

            {/* EXPANDABLE DETAIL CARD 1: Physical Mechanism */}
            {showMechanism && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Physical Mechanism & Spacetime Dynamics</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 font-light leading-relaxed">
                  {activePhenomenon.mechanismDescription}
                </div>
              </div>
            )}

            {/* EXPANDABLE DETAIL CARD 2: Governing Physical Law & Equation Execution */}
            {showFormulation && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Atom className="w-3.5 h-3.5 text-amber-400" />
                    <span>Governing Law & Formulation</span>
                  </div>
                  <button
                    onClick={() => setIsSolverActive(!isSolverActive)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      isSolverActive
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'bg-amber-950/40 text-amber-300 border border-amber-400/30 hover:bg-amber-900/60'
                    }`}
                  >
                    <Calculator className="w-3 h-3" />
                    <span>{isSolverActive ? 'Hide Solver' : 'Execute Computation'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-400/25 space-y-2 shadow-inner">
                  <div className="text-xs font-medium text-amber-300">
                    {activePhenomenon.physicalLawOrEquation.name}
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-amber-400/30 text-amber-200 font-mono text-xs text-center tracking-wider overflow-x-auto">
                    {activePhenomenon.physicalLawOrEquation.formula}
                  </div>
                  <p className="text-[11px] text-slate-300 font-light leading-normal">
                    {activePhenomenon.physicalLawOrEquation.explanation}
                  </p>
                </div>

                {/* Interactive Executable Physics Engine */}
                {isSolverActive && (
                  <PhenomenonEquationSolver phenomenon={activePhenomenon} />
                )}
              </div>
            )}

            {/* EXPANDABLE DETAIL CARD 3: Observed Cosmic Examples & Execution Coordinate Jump */}
            {showSkyTargets && activePhenomenon.observedExamples.length > 0 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Observed Sky Examples</span>
                </div>
                <div className="space-y-2">
                  {activePhenomenon.observedExamples.map((ex, i) => (
                    <div 
                      key={i}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 hover:border-cyan-400/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-100">
                        <span>{ex.name}</span>
                        {ex.distance && (
                          <span className="text-[10px] font-mono text-cyan-300/80">{ex.distance}</span>
                        )}
                      </div>
                      {ex.coordinates && (
                        <div className="text-[10px] font-mono text-slate-400">
                          {ex.coordinates}
                        </div>
                      )}
                      <p className="text-xs text-slate-300/90 font-light leading-relaxed">
                        {ex.note}
                      </p>

                      {/* Execute Observation Jump */}
                      {onNavigateToStarMap && (
                        <div className="pt-1.5 border-t border-white/5 flex justify-end">
                          <button
                            onClick={() => onNavigateToStarMap({ dsoId: activePhenomenon.relatedDsoId })}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            <span>Execute Star Map Jump</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPANDABLE DETAIL CARD 4: Astrophotography Rig & Field Protocol */}
            {showAstroRig && activePhenomenon.astrophotographyMeta && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Astrophotography Rig & Capture Protocol</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs font-mono space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <div className="text-slate-500 text-[10px]">OPTICS / TELESCOPE</div>
                      <div className="text-slate-200 truncate">{activePhenomenon.astrophotographyMeta.telescope}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">FOCAL SPECS</div>
                      <div className="text-slate-200">{activePhenomenon.astrophotographyMeta.focalLength} ({activePhenomenon.astrophotographyMeta.fRatio})</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">FILTERS</div>
                      <div className="text-emerald-300 truncate">{activePhenomenon.astrophotographyMeta.filters}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">STACK INTEGRATION</div>
                      <div className="text-slate-200">{activePhenomenon.astrophotographyMeta.exposureStack}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">SENSOR TEMP</div>
                      <div className="text-cyan-300">{activePhenomenon.astrophotographyMeta.sensorTemp}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">SKY BORTLE / GUIDING</div>
                      <div className="text-slate-300">{activePhenomenon.astrophotographyMeta.bortleScale}</div>
                    </div>
                  </div>

                  {activePhenomenon.astrophotographyDirectives && (
                    <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-sans font-light text-slate-300 italic">
                      💡 {activePhenomenon.astrophotographyDirectives}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXPANDABLE DETAIL CARD 5: Cross-Navigation Links */}
            {showCrossLinks && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Deep Cosmos Interconnections</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {activePhenomenon.associatedChapterId && onNavigateToChapter && (
                    <button
                      onClick={() => onNavigateToChapter(activePhenomenon.associatedChapterId!)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-200 hover:text-cyan-200 transition-all cursor-pointer text-left"
                    >
                      <span className="truncate">Open Full Chapter: {activePhenomenon.associatedChapterId}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
                    </button>
                  )}

                  {activePhenomenon.relatedPlanetId && onNavigateToPlanet && (
                    <button
                      onClick={() => onNavigateToPlanet(activePhenomenon.relatedPlanetId!)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-200 hover:text-cyan-200 transition-all cursor-pointer text-left"
                    >
                      <span className="truncate">Examine 3D Planet: {activePhenomenon.relatedPlanetId.toUpperCase()}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
                    </button>
                  )}

                  {onNavigateToStarMap && (
                    <button
                      onClick={() => onNavigateToStarMap({ dsoId: activePhenomenon.relatedDsoId })}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-amber-950/40 border border-white/10 hover:border-amber-400/40 text-xs font-mono text-slate-200 hover:text-amber-200 transition-all cursor-pointer text-left"
                    >
                      <span className="truncate">Target on 3D Star Map</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />
                    </button>
                  )}

                  {onNavigateToAstroLens && (
                    <button
                      onClick={() => onNavigateToAstroLens()}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-sky-950/40 border border-white/10 hover:border-sky-400/40 text-xs font-mono text-slate-200 hover:text-sky-200 transition-all cursor-pointer text-left"
                    >
                      <span className="truncate">Launch AstroLens Multi-Wavelength View</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dossier Footer Keyboard shortcuts badge */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Switch: ← / → Arrow Keys</span>
            <span>ESC: Reset View</span>
          </div>
        </aside>

      </div>
    </div>
  );
};
