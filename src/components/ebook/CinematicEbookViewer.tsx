import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChapterData } from '../../types';
import { chaptersData } from '../../data/chaptersData';
import { narrationAudio } from '../../services/narrationAudio';
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
  ArrowLeft
} from 'lucide-react';

interface CinematicEbookViewerProps {
  initialChapterId?: string;
  onBackToLibrary?: () => void;
  onOpenPlanetStudio?: (planetId: string) => void;
  onOpenStarMap?: (target?: { constellationId?: string; starId?: string; dsoId?: string }) => void;
  onOpenAstroLens?: (episodeId?: string) => void;
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

  // Active Term Annotation Card
  const [activeAnnotation, setActiveAnnotation] = useState<{ term: string; explanation: string } | null>(null);

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

  const getParagraphSentences = (text: string) => {
    const regex = /[^.!?]+[.!?]+(\s|$)/g;
    let match;
    const sentences: { text: string; start: number; end: number }[] = [];
    let lastIdx = 0;
    
    while ((match = regex.exec(text)) !== null) {
      const sText = match[0];
      const start = match.index;
      const end = start + sText.length;
      sentences.push({ text: sText, start, end });
      lastIdx = end;
    }
    
    if (lastIdx < text.length) {
      sentences.push({ text: text.substring(lastIdx), start: lastIdx, end: text.length });
    }
    
    return sentences.length > 0 ? sentences : [{ text, start: 0, end: text.length }];
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
          const sentences = getParagraphSentences(p.text);
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
      </div>

      {/* 2. Top Edge Reading Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-950/40 z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 3. ONE BUTTON ONLY: Back to Ebook Catalog (Glassmorphic) */}
      <div className="fixed top-5 left-5 sm:top-6 sm:left-8 z-40">
        <button
          onClick={onBackToLibrary}
          className="group inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-slate-950/35 hover:bg-slate-900/60 border border-white/20 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs sm:text-sm font-medium tracking-wide shadow-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
          title="Back to Ebook Catalog"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Ebook Catalog</span>
        </button>
      </div>

      {/* 4. Scrollable Container: Hero Section First (Image Only), then Text Containers Appearing on Scroll */}
      <div 
        ref={contentContainerRef}
        onScroll={handleScroll}
        onMouseUp={handleMouseUp}
        className="relative z-10 flex-1 overflow-y-auto h-full px-4 sm:px-8 pb-32"
      >
        {/* HERO SECTION: Visible when topic is opened - showcases the image only with a subtle cue */}
        <section className="min-h-screen w-full flex flex-col justify-end items-center pb-20 pt-24 px-4">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-3 p-5 sm:p-7 rounded-3xl bg-slate-950/25 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-cyan-950/40 border border-cyan-400/30 text-cyan-300">
              Episode {currentChapter.episodeNumber} · Celestial Codex
            </span>
            <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight drop-shadow-md">
              {currentChapter.title}
            </h1>
            <p className="text-sm sm:text-base text-cyan-200/90 font-light drop-shadow">
              {currentChapter.subtitle}
            </p>
          </div>

          {/* Animated Scroll Indicator Cue to reveal text containers */}
          <button
            onClick={() => {
              if (contentContainerRef.current) {
                contentContainerRef.current.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
              }
            }}
            className="mt-6 flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-950/30 hover:bg-slate-900/60 backdrop-blur-xl border border-white/20 text-cyan-300 hover:text-white text-xs font-mono transition-all cursor-pointer group shadow-2xl hover:scale-105 active:scale-95"
          >
            <span className="tracking-wide">Scroll down to read topic</span>
            <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce group-hover:translate-y-0.5 transition-transform" />
          </button>
        </section>

        {/* ON SCROLLING: Transparent Glassmorphism Translucent Text Containers */}
        <div className="max-w-4xl mx-auto space-y-8 pt-4">
          
          {/* Episode Header & Overview Text Container (Transparent Glassmorphism) */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/30 sm:bg-slate-950/25 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] space-y-5 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-cyan-300 tracking-widest uppercase">
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/20">Episode {currentChapter.episodeNumber} · Celestial Codex</span>
              <span className="text-slate-300 font-light">{currentChapter.readTimeMinutes} min read</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-light text-white tracking-tight leading-tight drop-shadow">
              {currentChapter.title}
            </h2>

            <p className="text-base sm:text-xl text-cyan-100 font-light leading-relaxed drop-shadow-sm">
              {currentChapter.subtitle}
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 text-sm sm:text-base text-slate-100 font-light leading-relaxed shadow-inner">
              {currentChapter.summary}
            </div>

            {/* Cross-Link Shortcuts to 3D Visualizers & AstroLens */}
            {(onOpenAstroLens || (currentChapter.associatedPlanetId && onOpenPlanetStudio) || onOpenStarMap) && (
              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/10">
                {onOpenAstroLens && (
                  <button
                    onClick={() => onOpenAstroLens()}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400/40 text-cyan-200 text-xs font-mono backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect in AstroLens Observatory</span>
                  </button>
                )}
                {currentChapter.associatedPlanetId && onOpenPlanetStudio && (
                  <button
                    onClick={() => onOpenPlanetStudio(currentChapter.associatedPlanetId!)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/15 text-slate-200 text-xs font-mono backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3D Planet Studio</span>
                  </button>
                )}
                {onOpenStarMap && (
                  <button
                    onClick={() => onOpenStarMap({ dsoId: currentChapter.associatedDsoId })}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/15 text-slate-200 text-xs font-mono backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>3D Star Map</span>
                  </button>
                )}
              </div>
            )}
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
                      <span className="text-[11px] text-amber-300/90 bg-amber-950/30 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                        Topic: {para.annotationTerm}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-100 leading-relaxed font-light text-base sm:text-lg drop-shadow-sm">
                    {getParagraphSentences(para.text).map((sentenceObj, sIdx) => {
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
                          explanation: para.annotationExplanation!
                        })}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
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

          {/* Terminology Popup Container */}
          {activeAnnotation && (
            <div className="p-5 rounded-3xl bg-slate-950/40 backdrop-blur-2xl border border-cyan-400/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                  {activeAnnotation.term}
                </span>
                <button onClick={() => setActiveAnnotation(null)} className="text-xs text-slate-400 hover:text-white px-2 py-1">✕</button>
              </div>
              <p className="text-sm text-slate-200 font-light leading-relaxed">
                {activeAnnotation.explanation}
              </p>
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

      {/* Discreet Audio Narration Bar at the very bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-4 px-6 py-2.5 bg-[#05070e]/85 backdrop-blur-md border-t border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={isSpeaking && !isPaused ? handlePauseNarration : handlePlayNarration}
            className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 shadow-md"
            title={isSpeaking && !isPaused ? 'Pause Voice Narration' : 'Play Voice Narration'}
          >
            {isSpeaking && !isPaused ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {isSpeaking && (
            <button
              onClick={handleStopNarration}
              title="Stop Narration"
              className="p-1.5 rounded-full border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}

          <div>
            <div className="text-xs font-medium text-slate-200 flex items-center gap-2">
              <span>{isSpeaking ? (isPaused ? 'Narration Paused' : 'Narrating Episode') : 'Audio Narration'}</span>
              {isSpeaking && !isPaused && (
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-pulse"></span>
                  <span className="w-0.5 h-3 bg-cyan-400 animate-pulse delay-75"></span>
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse delay-150"></span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCycleRate}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 hover:bg-slate-800 transition-colors"
          >
            {playbackRate}x
          </button>
        </div>
      </div>

    </div>
  );
};
