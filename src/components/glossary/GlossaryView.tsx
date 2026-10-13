import React, { useState, useMemo, useEffect } from 'react';
import { GlossaryPhenomenon } from '../../types';
import { glossaryPhenomena } from '../../data/glossaryData';
import { cosmicImages } from '../../assets/images';
import { ResponsiveImage } from '../common/ResponsiveImage';
import { 
  ArrowLeft, 
  BookOpen, 
  Compass, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Atom,
  HelpCircle
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

  const activePhenomenon = useMemo<GlossaryPhenomenon>(() => {
    return glossaryPhenomena.find(p => p.id === selectedId) || glossaryPhenomena[0];
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

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] min-h-[640px] pt-20 flex flex-col overflow-hidden bg-[#05070e] text-slate-100 select-none">
      
      {/* Return to Chapter Banner (if navigated from reader) */}
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
            <ResponsiveImage
              picture={activeImage.picture}
              alt={activePhenomenon.term}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 group-hover:scale-[1.02]'
              }`}
              sizes="(min-width: 1024px) 70vw, 100vw"
              priority
            />

            {/* Cinematic space vignette & contrast scrims */}
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-[#05070e]/85 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Top HUD Overlay (Coordinates, scale, reticle indicator) */}
          <div className="relative z-20 p-4 sm:p-6 flex items-start justify-between pointer-events-none">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15 text-xs font-mono text-cyan-300">
                <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
                <span>{activePhenomenon.category}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">Scale: {activePhenomenon.scaleEstimate}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400/80 px-1 drop-shadow">
                Index: #{String(currentIndex + 1).padStart(2, '0')} / {String(glossaryPhenomena.length).padStart(2, '0')}
              </div>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-900/90 border border-white/15 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title={isZoomed ? 'Reset View Zoom' : 'Magnify Panoramic Stage'}
                aria-label="Toggle zoom on phenomenon visual"
              >
                {isZoomed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Center Subtle Focal Observation Reticle Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <div className="w-64 h-64 border border-cyan-400/40 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border border-dashed border-cyan-300/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Bottom Controls & Integrated Filmstrip Carousel */}
          <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-[#05070e] via-[#05070e]/80 to-transparent">
            {/* Category Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Horizontal Filmstrip Carousel of Phenomena */}
            <div className="flex items-center gap-3 relative">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                title="Previous phenomenon (Left Arrow)"
                aria-label="Previous phenomenon"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
                {filteredPhenomena.map(item => {
                  const isCurrent = item.id === activePhenomenon.id;
                  const itemImg = cosmicImages[item.imageKey];
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`group/thumb flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                        isCurrent
                          ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_14px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400/50'
                          : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/30'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-slate-900">
                        <img
                          src={itemImg.url}
                          alt={item.term}
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-left">
                        <div className={`text-xs font-medium leading-tight truncate max-w-[120px] sm:max-w-[140px] ${
                          isCurrent ? 'text-cyan-300 font-semibold' : 'text-slate-300'
                        }`}>
                          {item.term}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400/80 truncate max-w-[120px] sm:max-w-[140px]">
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
                title="Next phenomenon (Right Arrow)"
                aria-label="Next phenomenon"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RIGHT 30% SCREEN: Technical Definition & Astrophysics Dossier             */}
        {/* ========================================================================= */}
        <aside 
          className="w-full lg:w-[30%] h-[45vh] lg:h-full overflow-y-auto bg-[#070b14]/95 p-6 sm:p-8 space-y-6 flex flex-col justify-between"
          aria-label="Phenomenon Technical Dossier (30% Screen Coverage)"
        >
          <div className="space-y-6">
            
            {/* Header: Term & Pronunciation */}
            <div className="space-y-2 border-b border-white/10 pb-5">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <span>ASTROPHYSICS DOSSIER</span>
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

              <p className="text-sm text-cyan-200/90 font-light leading-relaxed pt-1">
                {activePhenomenon.shortDefinition}
              </p>
            </div>

            {/* Section 1: Physical Mechanism */}
            <div className="space-y-2">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Physical Mechanism & Spacetime Dynamics</span>
              </h2>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
                {activePhenomenon.mechanismDescription}
              </div>
            </div>

            {/* Section 2: Governing Physical Law & Equation */}
            <div className="space-y-2">
              <h2 className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-amber-400" />
                <span>Governing Law & Formulation</span>
              </h2>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-400/20 space-y-2 shadow-inner">
                <div className="text-xs font-medium text-amber-300">
                  {activePhenomenon.physicalLawOrEquation.name}
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-amber-400/30 text-amber-200 font-mono text-xs sm:text-sm text-center tracking-wider overflow-x-auto">
                  {activePhenomenon.physicalLawOrEquation.formula}
                </div>
                <p className="text-[11px] text-slate-300 font-light leading-normal">
                  {activePhenomenon.physicalLawOrEquation.explanation}
                </p>
              </div>
            </div>

            {/* Section 3: Observed Cosmic Examples */}
            {activePhenomenon.observedExamples.length > 0 && (
              <div className="space-y-2.5">
                <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Observed Sky Examples</span>
                </h2>
                <div className="space-y-2">
                  {activePhenomenon.observedExamples.map((ex, i) => (
                    <div 
                      key={i}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1 hover:border-cyan-400/30 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-100">
                        <span>{ex.name}</span>
                        {ex.distance && (
                          <span className="text-[11px] font-mono text-cyan-300/80">{ex.distance}</span>
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Cross-Navigation Links */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Cross-Reference Deep Space Links
              </div>
              <div className="flex flex-wrap gap-2">
                {activePhenomenon.associatedChapterId && onNavigateToChapter && (
                  <button
                    onClick={() => onNavigateToChapter(activePhenomenon.associatedChapterId!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 text-xs font-mono transition-all cursor-pointer hover:scale-105"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read in Ebook Chapter</span>
                  </button>
                )}

                {activePhenomenon.relatedPlanetId && onNavigateToPlanet && (
                  <button
                    onClick={() => onNavigateToPlanet(activePhenomenon.relatedPlanetId!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-slate-200 text-xs font-mono transition-all cursor-pointer hover:scale-105"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Explore 3D Planet</span>
                  </button>
                )}

                {activePhenomenon.relatedDsoId && onNavigateToStarMap && (
                  <button
                    onClick={() => onNavigateToStarMap({ dsoId: activePhenomenon.relatedDsoId })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-slate-200 text-xs font-mono transition-all cursor-pointer hover:scale-105"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Locate on 3D Star Map</span>
                  </button>
                )}

                {onNavigateToAstroLens && (
                  <button
                    onClick={onNavigateToAstroLens}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-slate-200 text-xs font-mono transition-all cursor-pointer hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AstroLens Observatory</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Quick Glossary Help Footer Note */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              Use ← / → keys to browse
            </span>
            <span>{glossaryPhenomena.length} Phenomena Total</span>
          </div>
        </aside>

      </div>
    </div>
  );
};
