import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChapterData } from '../../types';
import { chaptersData } from '../../data/chaptersData';
import { narrationAudio } from '../../services/narrationAudio';
import { glossaryPhenomena } from '../../data/glossaryData';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown,
  HelpCircle, 
  ExternalLink,
  Sparkles,
  Highlighter,
  ArrowLeft,
  Camera,
  Crosshair,
  Quote
} from 'lucide-react';

interface CinematicEbookViewerProps {
  initialChapterId?: string;
  onBackToLibrary?: () => void;
  onOpenPlanetStudio?: (planetId: string) => void;
  onOpenStarMap?: (target?: { constellationId?: string; starId?: string; dsoId?: string }) => void;
  onOpenAstroLens?: (episodeId?: string) => void;
  onOpenGlossary?: (termId?: string, fromChapterId?: string) => void;
}

interface HighlightItem {
  id: string;
  chapterId: string;
  text: string;
  color: string;
  timestamp: number;
}

export const CinematicEbookViewer: React.FC<CinematicEbookViewerProps> = ({
  initialChapterId = 'episode-01',
  onBackToLibrary,
  onOpenPlanetStudio,
  onOpenStarMap,
  onOpenAstroLens,
  onOpenGlossary,
}) => {
  const [currentChapter, setCurrentChapter] = useState<ChapterData>(() => {
    return chaptersData.find(c => c.id === initialChapterId) || chaptersData[0];
  });

  useEffect(() => {
    if (initialChapterId) {
      const match = chaptersData.find(c => c.id === initialChapterId);
      if (match) {
        setCurrentChapter(match);
        setActiveParagraphIndex(null);
        setActiveSentenceIndex(null);
        if (contentContainerRef.current) {
          contentContainerRef.current.scrollTop = 0;
        }
      }
    }
  }, [initialChapterId]);

  // Highlights state
  const [highlights, setHighlights] = useState<HighlightItem[]>(() => {
    try {
      const saved = localStorage.getItem('astrolens_highlights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Floating text selection highlighter popup state
  const [selectionPopup, setSelectionPopup] = useState<{ text: string; x: number; y: number } | null>(null);

  // Audio Narration State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  // Active Term Annotation Card with glossary linkage
  const [activeAnnotation, setActiveAnnotation] = useState<{ term: string; explanation: string; termId?: string } | null>(null);

  // Astrophotography Reticle HUD state
  const [isReticleActive, setIsReticleActive] = useState(false);

  // Helper to map term names to glossary IDs
  const findGlossaryTermId = (termName: string): string => {
    const normalized = termName.toLowerCase().trim();
    const direct = glossaryPhenomena.find(p => p.term.toLowerCase() === normalized || p.id === normalized);
    if (direct) return direct.id;
    const partial = glossaryPhenomena.find(p => 
      normalized.includes(p.term.toLowerCase()) || 
      p.term.toLowerCase().includes(normalized) ||
      p.id.replace(/-/g, ' ').includes(normalized)
    );
    return partial ? partial.id : 'gravitational-lensing';
  };

  // Reading progress scroll tracker
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const paragraphCharRanges = useMemo(() => {
    let offset = 0;
    const prefix = `${currentChapter.title}. ${currentChapter.subtitle}. ${currentChapter.audioTranscript} `;
    offset += prefix.length;

    return currentChapter.paragraphs.map(p => {
      const start = offset;
      const end = offset + p.text.length + 1;
      offset = end;
      return { start, end };
    });
  }, [currentChapter]);

  // Memoize sentence splitting per chapter — expensive regex, only recompute on chapter change
  const allParagraphSentences = useMemo(() => {
    return currentChapter.paragraphs.map(p => {
      const regex = /[^.!?]+[.!?]+(\s|$)/g;
      let match;
      const sentences: { text: string; start: number; end: number }[] = [];
      let lastIdx = 0;

      while ((match = regex.exec(p.text)) !== null) {
        const sText = match[0];
        const start = match.index;
        const end = start + sText.length;
        sentences.push({ text: sText, start, end });
        lastIdx = end;
      }

      if (lastIdx < p.text.length) {
        sentences.push({ text: p.text.substring(lastIdx), start: lastIdx, end: p.text.length });
      }

      return sentences.length > 0 ? sentences : [{ text: p.text, start: 0, end: p.text.length }];
    });
  }, [currentChapter]);

  const getParagraphSentences = (paragraphIndex: number) => {
    return allParagraphSentences[paragraphIndex] || [];
  };

  useEffect(() => {
    const unsubscribe = narrationAudio.subscribe(state => {
      setIsSpeaking(state.isSpeaking);
      setIsPaused(state.isPaused);

      if (state.isSpeaking) {
        const charIdx = state.charIndex;
        const foundIdx = paragraphCharRanges.findIndex(
          range => charIdx >= range.start && charIdx <= range.end
        );
        if (foundIdx !== -1) {
          setActiveParagraphIndex(foundIdx);
          const p = currentChapter.paragraphs[foundIdx];
          const range = paragraphCharRanges[foundIdx];
          const localChar = charIdx - range.start;
          const sentences = getParagraphSentences(foundIdx);
          const sIdx = sentences.findIndex(s => localChar >= s.start && localChar <= s.end);
          setActiveSentenceIndex(sIdx !== -1 ? sIdx : 0);
        } else if (charIdx < (paragraphCharRanges[0]?.start || 0)) {
          setActiveParagraphIndex(0);
          setActiveSentenceIndex(0);
        }
      } else {
        setActiveParagraphIndex(null);
        setActiveSentenceIndex(null);
      }
    });

    return () => {
      unsubscribe();
      narrationAudio.stop();
    };
  }, [paragraphCharRanges, currentChapter]);

  const handleScroll = () => {
    if (!contentContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.round((scrollTop / maxScroll) * 100)));
    }
  };

  // Text selection highlighter listener
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setTimeout(() => {
        const activeSel = window.getSelection();
        if (!activeSel || activeSel.isCollapsed) setSelectionPopup(null);
      }, 200);
      return;
    }
    const text = sel.toString().trim();
    if (text.length > 3) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionPopup({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const addHighlight = (textToHighlight: string, color = 'amber') => {
    const newItem: HighlightItem = {
      id: Math.random().toString(36).substring(2, 9),
      chapterId: currentChapter.id,
      text: textToHighlight,
      color,
      timestamp: Date.now()
    };
    const next = [newItem, ...highlights];
    setHighlights(next);
    try {
      localStorage.setItem('astrolens_highlights', JSON.stringify(next));
    } catch {}
    setSelectionPopup(null);
    window.getSelection()?.removeAllRanges();
  };

  const handlePlayNarration = () => {
    if (isPaused) {
      narrationAudio.resume();
    } else {
      const fullText = `${currentChapter.title}. ${currentChapter.subtitle}. ${currentChapter.audioTranscript} ${currentChapter.paragraphs.map(p => p.text).join(' ')}`;
      narrationAudio.speak(fullText, () => {
        setIsSpeaking(false);
        setActiveParagraphIndex(null);
      });
      setActiveParagraphIndex(0);
    }
  };

  const handlePauseNarration = () => {
    narrationAudio.pause();
  };

  const handleStopNarration = () => {
    narrationAudio.stop();
    setActiveParagraphIndex(null);
  };

  const handleCycleRate = () => {
    const rates = [0.8, 1.0, 1.25];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    narrationAudio.setRate(nextRate);
  };

  const currentIndex = chaptersData.findIndex(c => c.id === currentChapter.id);

  const handleNextChapter = () => {
    if (currentIndex < chaptersData.length - 1) {
      narrationAudio.stop();
      setCurrentChapter(chaptersData[currentIndex + 1]);
      setActiveParagraphIndex(null);
      if (contentContainerRef.current) contentContainerRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="relative w-full h-full bg-[#05070e] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 1. Full-Bleed Episode Image Background (Clear, Vivid, Cinematic) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <img 
          src={currentChapter.heroImage} 
          alt={currentChapter.title}
          className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.05] transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        {/* Soft atmospheric gradient allowing full visual picture clarity at the top & subtle text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070e]/90 via-[#05070e]/15 to-[#05070e]/30 pointer-events-none" />

        {/* Astrophotography Crosshair and FOV Frame Overlay */}
        {isReticleActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-60 animate-in fade-in duration-300">
            <div className="w-[85%] h-[75%] border border-cyan-400/30 rounded-lg relative flex items-center justify-center">
              <span className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Full-Frame 35mm · {currentChapter.opticalTelemetry?.focalLength || '850mm f/5.6'}
              </span>
              <span className="absolute top-3 right-3 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                N ↑ · E ←
              </span>
              <span className="absolute bottom-3 right-3 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                {currentChapter.opticalTelemetry?.bortleClass || 'Bortle 1 (Atacama)'}
              </span>
              <div className="w-56 h-56 border border-cyan-400/25 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Top Edge Reading Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-950/40 z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 3. Back to Ebook Catalog (Reduced size, sleek glassmorphic pill) */}
      <div className="fixed top-3.5 left-3.5 sm:top-5 sm:left-6 z-40">
        <button
          onClick={onBackToLibrary}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/50 hover:bg-slate-900/80 border border-white/15 hover:border-cyan-400/70 text-slate-300 hover:text-cyan-200 text-xs font-medium tracking-wide shadow-lg backdrop-blur-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          title="Back to Ebook Catalog"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to catalog</span>
        </button>
      </div>

      {/* 4. Top Right: Astrophotography Reticle Toggle Button */}
      <div className="fixed top-3.5 right-3.5 sm:top-5 sm:right-6 z-40">
        <button
          onClick={() => setIsReticleActive(!isReticleActive)}
          className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono shadow-lg backdrop-blur-xl transition-all cursor-pointer ${
            isReticleActive
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : 'bg-slate-950/50 hover:bg-slate-900/80 border-white/15 text-slate-400 hover:text-white'
          }`}
          title="Toggle Astrophotography Frame Reticle"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Astro Reticle</span>
        </button>
      </div>

      {/* 5. Scrollable Container: Clean initial screen, then Episode Widget appearing on scroll */}
      <div 
        ref={contentContainerRef}
        onScroll={handleScroll}
        onMouseUp={handleMouseUp}
        className="relative z-10 flex-1 overflow-y-auto h-full px-4 sm:px-8 pb-32"
      >
        {/* INITIAL VIEWPORT: Completely clean celestial view with small back button and blinking bottom scroll arrow */}
        <section className="h-screen w-full flex flex-col justify-end items-center pb-8 sm:pb-12 pointer-events-none">
          <button
            onClick={() => {
              if (contentContainerRef.current) {
                contentContainerRef.current.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
            className="pointer-events-auto flex flex-col items-center gap-1.5 p-3 rounded-full hover:bg-slate-950/30 transition-all cursor-pointer group"
            title="Scroll down to read episode"
            aria-label="Scroll down to read episode"
          >
            <div className="flex flex-col items-center animate-pulse">
              <ChevronDown className="w-8 h-8 text-cyan-400 animate-bounce group-hover:text-cyan-200 transition-transform drop-shadow-[0_0_16px_rgba(34,211,238,0.85)]" />
            </div>
          </button>
        </section>

        {/* ON SCROLLING: The Episode Name Widget appears here */}
        <div className="max-w-4xl mx-auto space-y-8 pt-4">
          
          {/* Episode Name Widget (Glassmorphism Card) */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/35 sm:bg-slate-950/30 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_0_rgba(0,0,0,0.5)] space-y-5 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-cyan-300 tracking-widest uppercase">
              <span className="px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/30 font-semibold text-cyan-300 shadow-sm">
                Episode {currentChapter.episodeNumber} · Celestial Codex
              </span>
              <span className="text-slate-300 font-light">{currentChapter.readTimeMinutes} min read</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight drop-shadow-md">
              {currentChapter.title}
            </h1>

            <p className="text-base sm:text-xl text-cyan-100 font-light leading-relaxed drop-shadow-sm">
              {currentChapter.subtitle}
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-sm sm:text-base text-slate-100 font-light leading-relaxed shadow-inner">
              {currentChapter.summary}
            </div>

            {/* Astrophotography Observational Prompt Inscription */}
            {currentChapter.episodicPrompt && (
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/25 border border-cyan-500/25 space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                  <Quote className="w-3 h-3 text-cyan-400" />
                  <span>Astrophotography Field Directive</span>
                </div>
                <p className="text-xs sm:text-sm text-cyan-100 font-light italic leading-relaxed">
                  "{currentChapter.episodicPrompt}"
                </p>
                {currentChapter.opticalTelemetry && (
                  <div className="pt-2 border-t border-cyan-500/20 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-300">
                    <span className="text-slate-400">Optics: <span className="text-white">{currentChapter.opticalTelemetry.telescope}</span></span>
                    <span className="text-slate-400">Stack: <span className="text-cyan-300">{currentChapter.opticalTelemetry.integrationTime}</span></span>
                    <span className="text-slate-400">Filters: <span className="text-emerald-300">{currentChapter.opticalTelemetry.filters}</span></span>
                    <span className="text-slate-400">Sky: <span className="text-amber-300">{currentChapter.opticalTelemetry.bortleClass}</span></span>
                  </div>
                )}
              </div>
            )}

            {/* Audio Narration Controls & Visualizer Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={isSpeaking && !isPaused ? handlePauseNarration : handlePlayNarration}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-all shadow-md hover:scale-105 cursor-pointer"
                  title={isSpeaking && !isPaused ? 'Pause Voice Narration' : 'Listen to Episode Audio'}
                >
                  {isSpeaking && !isPaused ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? (isPaused ? 'Resume Narration' : 'Pause Narration') : 'Play Audio Narration'}</span>
                </button>

                {isSpeaking && (
                  <button
                    onClick={handleStopNarration}
                    title="Stop Narration"
                    className="p-2 rounded-xl border border-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={handleCycleRate}
                  className="px-2 py-1.5 rounded-xl bg-slate-900/60 border border-white/15 text-[11px] font-mono text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Cycle Narration Speed"
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Cross-Link Shortcuts to 3D Visualizers & AstroLens */}
              {(onOpenAstroLens || (currentChapter.associatedPlanetId && onOpenPlanetStudio) || onOpenStarMap) && (
                <div className="flex flex-wrap items-center gap-2">
                  {onOpenAstroLens && (
                    <button
                      onClick={() => onOpenAstroLens()}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400/40 text-cyan-200 text-xs font-mono backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Observatory</span>
                    </button>
                  )}
                  {currentChapter.associatedPlanetId && onOpenPlanetStudio && (
                    <button
                      onClick={() => onOpenPlanetStudio(currentChapter.associatedPlanetId!)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/15 text-slate-200 text-xs font-mono backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>3D Planet</span>
                    </button>
                  )}
                  {onOpenStarMap && (
                    <button
                      onClick={() => onOpenStarMap({ dsoId: currentChapter.associatedDsoId })}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/15 text-slate-200 text-xs font-mono backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      <span>3D Star Map</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Subsequent Narrative Text Containers directly over the image (Transparent Glassmorphism) */}
          <div className="space-y-6 select-text">
            {currentChapter.paragraphs.map((para, idx) => {
              const isHighlighted = isSpeaking && activeParagraphIndex === idx;
              return (
                <div 
                  key={para.id}
                  className={`p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] transition-all duration-300 ${
                    isHighlighted
                      ? 'bg-cyan-950/45 border-cyan-400/80 ring-1 ring-cyan-400/40 shadow-cyan-500/20'
                      : 'bg-slate-950/30 sm:bg-slate-950/25 border-white/15 hover:border-cyan-400/40 hover:bg-slate-950/35'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300/90 mb-3">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">Part {idx + 1} of {currentChapter.paragraphs.length}</span>
                    {para.annotationTerm && (
                      <button
                        onClick={() => setActiveAnnotation({
                          term: para.annotationTerm!,
                          explanation: para.annotationExplanation || 'Astrophysical phenomenon studied in this episode.',
                          termId: findGlossaryTermId(para.annotationTerm!)
                        })}
                        className="group inline-flex items-center gap-1.5 text-[11px] text-amber-300/90 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-400/30 hover:border-amber-400 transition-all cursor-pointer"
                        title="Click to view definition and jump to glossary"
                      >
                        <span>Topic: {para.annotationTerm}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
                      </button>
                    )}
                  </div>

                  <p className="text-slate-100 leading-relaxed font-light text-base sm:text-lg drop-shadow-sm">
                    {getParagraphSentences(idx).map((sentenceObj, sIdx) => {
                      const isSentenceActive = isHighlighted && activeSentenceIndex === sIdx;
                      return (
                        <span
                          key={sIdx}
                          className={`transition-all duration-200 ${
                            isSentenceActive 
                              ? 'bg-cyan-400/35 text-white font-normal px-1 py-0.5 rounded shadow-sm border-b-2 border-cyan-400' 
                              : ''
                          }`}
                        >
                          {sentenceObj.text}
                        </span>
                      );
                    })}
                  </p>

                  {para.callout && (
                    <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border-l-4 border-cyan-400 border-white/10 text-sm sm:text-base text-cyan-100 font-light italic">
                      "{para.callout}"
                    </div>
                  )}

                  {para.annotationTerm && para.annotationExplanation && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => setActiveAnnotation({
                          term: para.annotationTerm!,
                          explanation: para.annotationExplanation!,
                          termId: findGlossaryTermId(para.annotationTerm!)
                        })}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Define: {para.annotationTerm}</span>
                      </button>
                      <button
                        onClick={() => addHighlight(para.text, 'cyan')}
                        className="text-[11px] font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        <Highlighter className="w-3 h-3" />
                        <span>Highlight</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Terminology Popup Container with Direct to Glossary Transition */}
          {activeAnnotation && (
            <div className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-cyan-400/60 shadow-[0_12px_40px_0_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                    {activeAnnotation.term}
                  </span>
                </div>
                <button 
                  onClick={() => setActiveAnnotation(null)} 
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
                  aria-label="Close glossary popup"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-sm text-slate-200 font-light leading-relaxed">
                {activeAnnotation.explanation}
              </p>

              {onOpenGlossary && (
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    70% Panoramic Cosmic Dossier available
                  </span>
                  <button
                    onClick={() => {
                      const targetTermId = activeAnnotation.termId || findGlossaryTermId(activeAnnotation.term);
                      onOpenGlossary(targetTermId, currentChapter.id);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                    title="Open full phenomenon view in Glossary"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>View in Glossary →</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Final Text Container directly over image */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/30 sm:bg-slate-950/25 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Completed Episode {currentChapter.episodeNumber}
              </div>
              <div className="text-base text-slate-100 font-light mt-0.5">
                {currentChapter.title}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentIndex < chaptersData.length - 1 && (
                <button
                  onClick={handleNextChapter}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-xl border border-white/20 text-slate-200 text-xs font-mono transition-colors"
                >
                  <span>Next: Ep {chaptersData[currentIndex + 1].episodeNumber}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onBackToLibrary}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-all shadow-lg hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Ebook Catalog</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Selection Highlighter Popup */}
      {selectionPopup && (
        <div 
          style={{ position: 'fixed', left: selectionPopup.x, top: selectionPopup.y, transform: 'translate(-50%, -100%)' }}
          className="z-50 bg-[#0d1630] border border-cyan-500/60 rounded-xl shadow-2xl p-2 flex items-center gap-2 animate-in fade-in"
        >
          <span className="text-[11px] font-mono text-cyan-300">Highlight:</span>
          <button
            onClick={() => addHighlight(selectionPopup.text, 'amber')}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Highlighter className="w-3 h-3" />
            <span>Save Highlight</span>
          </button>
        </div>
      )}

      {/* Floating Audio Controller (Only visible when narration is active, so screen stays 100% clean initially) */}
      {isSpeaking && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-3.5 py-2 rounded-full bg-slate-950/85 backdrop-blur-xl border border-cyan-400/40 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={isPaused ? handlePlayNarration : handlePauseNarration}
            className="w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md"
            title={isPaused ? 'Resume Narration' : 'Pause Narration'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-200">
              {isPaused ? 'Paused' : 'Narrating'}
            </span>
            {!isPaused && (
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 h-2 bg-cyan-400 animate-pulse"></span>
                <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-75"></span>
                <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-150"></span>
              </span>
            )}
          </div>
          <button
            onClick={handleStopNarration}
            title="Stop Narration"
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
};
