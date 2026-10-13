import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  ChevronRight, 
  Bookmark, 
  Sliders,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { chaptersData } from '../../data/chaptersData';
import { ResponsiveImage } from '../common/ResponsiveImage';
import { cosmicImages } from '../../assets/images';

interface CinematicNovelReaderSectionProps {
  onOpenReader: (chapterId: string) => void;
  onNavigateToPlanet?: (planetId: string) => void;
  onNavigateToStarMap?: () => void;
}

export const CinematicNovelReaderSection: React.FC<CinematicNovelReaderSectionProps> = ({
  onOpenReader,
  onNavigateToPlanet,
  onNavigateToStarMap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [readerTheme, setReaderTheme] = useState<'obsidian' | 'cyan-glow' | 'starlight'>('obsidian');
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);

  // Parallax motion derived from scrolling container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const floatingCardY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const quoteCardY = useTransform(scrollYProgress, [0, 1], [-20, 30]);

  const currentChapter = chaptersData[selectedEpisodeIndex] || chaptersData[0];

  return (
    <section 
      id="cinematic-reader-section"
      ref={containerRef}
      className="relative py-24 sm:py-32 px-6 sm:px-8 overflow-hidden bg-[#05070e] select-none"
    >
      {/* Background Parallax Celestial Mesh */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none opacity-20 will-change-transform"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-cyan-600/30 via-indigo-600/20 to-teal-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-sky-500/15 blur-[120px] rounded-full" />
      </motion.div>

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header with Framer Motion inView animation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-950/40 backdrop-blur-md mb-3.5 text-[11px] font-mono tracking-[0.2em] text-cyan-300 uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Sci-Fi Chronicle</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase leading-tight mb-3">
              Immersive Dark Mode <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-300">
                Reader Interface
              </span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              Experience episodic cosmic science fiction written with astrophysical precision. Read excerpts with custom typography, ambient narration, and interactive footnotes.
            </p>
          </motion.div>

          {/* Quick Reader Controls HUD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap items-center gap-2.5 backdrop-blur-xl bg-slate-950/50 border border-white/10 rounded-2xl p-2 shadow-2xl"
          >
            {/* Font Style Toggle */}
            <div className="flex items-center bg-slate-900/60 rounded-xl p-1 border border-white/5">
              <button
                onClick={() => setFontStyle('serif')}
                className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors cursor-pointer ${
                  fontStyle === 'serif' ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
                title="Cinzel / Serif Novel Typeface"
              >
                Serif
              </button>
              <button
                onClick={() => setFontStyle('sans')}
                className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                  fontStyle === 'sans' ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
                title="Modern Sans-Serif Typeface"
              >
                Modern
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center bg-slate-900/60 rounded-xl p-1 border border-white/5 text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'sm' ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
                title="Compact text size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('md')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'md' ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
                title="Medium text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  fontSize === 'lg' ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
                title="Large text size"
              >
                A+
              </button>
            </div>

            {/* Theme Glow Selector */}
            <div className="flex items-center bg-slate-900/60 rounded-xl p-1 border border-white/5 text-xs">
              <button
                onClick={() => setReaderTheme('obsidian')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  readerTheme === 'obsidian' ? 'border border-cyan-400 bg-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-slate-900 opacity-60'
                }`}
                title="Pure Obsidian Dark Mode"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              </button>
              <button
                onClick={() => setReaderTheme('cyan-glow')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ml-1 ${
                  readerTheme === 'cyan-glow' ? 'border border-cyan-400 bg-cyan-950 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-900 opacity-60'
                }`}
                title="Cyan Luminescence Dark Mode"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              </button>
              <button
                onClick={() => setReaderTheme('starlight')}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ml-1 ${
                  readerTheme === 'starlight' ? 'border border-amber-400 bg-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-slate-900 opacity-60'
                }`}
                title="Amber Star Starlight Mode"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              </button>
            </div>

            {/* Fullscreen Reader Launcher */}
            <button
              onClick={() => onOpenReader(currentChapter.id)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-light transition-all cursor-pointer shadow-lg shadow-cyan-950/40"
              title="Launch Fullscreen Reader"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          </motion.div>
        </div>

        {/* Chapter Tabs Carousel */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {chaptersData.slice(0, 4).map((chapter, index) => {
            const isSelected = selectedEpisodeIndex === index;
            return (
              <button
                key={chapter.id}
                onClick={() => {
                  setSelectedEpisodeIndex(index);
                  setActiveAnnotation(null);
                }}
                className={`relative px-4 py-2.5 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'border-cyan-400/50 bg-slate-900/90 text-white shadow-xl shadow-cyan-950/40'
                    : 'border-white/10 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeChapterTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900/80 -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className={`text-[10px] font-mono tracking-wider uppercase ${isSelected ? 'text-cyan-300 font-medium' : 'text-slate-400'}`}>
                    EPISODE 0{chapter.episodeNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">• {chapter.readTimeMinutes} min read</span>
                </div>
                <div className="text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap">
                  {chapter.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Reader Stage (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (8 Cols): Dark Mode Reader Viewport */}
          <motion.div
            style={{ y: floatingCardY }}
            className={`lg:col-span-8 rounded-3xl border backdrop-blur-2xl transition-colors duration-500 overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.6)] ${
              readerTheme === 'obsidian'
                ? 'bg-slate-950/75 border-white/15'
                : readerTheme === 'cyan-glow'
                ? 'bg-[#040d1a]/80 border-cyan-400/35 shadow-[0_0_50px_rgba(6,182,212,0.15)]'
                : 'bg-[#0f0c08]/80 border-amber-400/30 shadow-[0_0_50px_rgba(251,191,36,0.1)]'
            }`}
          >
            {/* Reader Header Bar */}
            <div className="px-6 sm:px-8 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-slate-950/40">
              <div className="flex items-center space-x-3">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs text-slate-300 tracking-wider uppercase">
                  Chapter {currentChapter.episodeNumber}: {currentChapter.title}
                </span>
              </div>

              {/* Audio Narration Equalizer & Toggle */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsNarrating(!isNarrating)}
                  className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                    isNarrating
                      ? 'border-cyan-400/50 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'border-white/10 bg-slate-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {isNarrating ? <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isNarrating ? 'Audio Playing' : 'Play Narration'}</span>

                  {/* Animated Soundwave bars with Framer Motion */}
                  {isNarrating && (
                    <div className="flex items-center space-x-0.5 ml-1 h-3">
                      {[0.4, 0.8, 0.5, 0.9, 0.3].map((height, i) => (
                        <motion.span
                          key={i}
                          animate={{ scaleY: [height, 1, 0.2, height] }}
                          transition={{ duration: 0.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-0.5 h-3 bg-cyan-300 origin-bottom rounded-full inline-block"
                        />
                      ))}
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Reader Body Content */}
            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChapter.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  {/* Chapter Subtitle & Metadata */}
                  <div className="border-b border-white/10 pb-5">
                    <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-400 uppercase">
                      Episode 0{currentChapter.episodeNumber} • Deep Space Chronicle
                    </span>
                    <h3 className={`mt-2 font-medium tracking-tight text-white ${
                      fontStyle === 'serif' ? 'font-cinzel text-2xl sm:text-3xl' : 'font-sans text-xl sm:text-2xl'
                    }`}>
                      {currentChapter.subtitle}
                    </h3>
                  </div>

                  {/* Narrated Paragraphs with Footnote Annotations */}
                  <div className={`space-y-6 text-slate-200 font-light leading-relaxed ${
                    fontStyle === 'serif' ? 'font-serif' : 'font-sans'
                  } ${
                    fontSize === 'sm' ? 'text-sm sm:text-base leading-7' : fontSize === 'lg' ? 'text-lg sm:text-xl leading-9' : 'text-base sm:text-lg leading-8'
                  }`}>
                    {currentChapter.paragraphs.slice(0, 3).map((para, idx) => (
                      <div key={para.id} className="relative group">
                        <p className="text-slate-300">
                          {idx === 0 && (
                            <span className="float-left text-4xl sm:text-5xl font-cinzel text-cyan-300 mr-3 mt-1 leading-none font-bold select-none drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                              {para.text.charAt(0)}
                            </span>
                          )}
                          {idx === 0 ? para.text.slice(1) : para.text}

                          {/* Interactive Term Annotation Link */}
                          {para.annotationTerm && (
                            <span className="ml-2 inline-block">
                              <button
                                onClick={() => setActiveAnnotation(activeAnnotation === para.annotationTerm ? null : para.annotationTerm || null)}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <span>{para.annotationTerm}</span>
                              </button>
                            </span>
                          )}
                        </p>

                        {/* Annotation Lore Popup */}
                        {para.annotationTerm && activeAnnotation === para.annotationTerm && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-3 p-4 rounded-xl border border-cyan-400/40 bg-slate-950/90 backdrop-blur-xl text-xs text-slate-300 shadow-2xl"
                          >
                            <div className="flex items-center justify-between font-mono text-[11px] text-cyan-300 mb-1">
                              <span>ASTROPHYSICS DOSSIER: {para.annotationTerm}</span>
                              <button 
                                onClick={() => setActiveAnnotation(null)}
                                className="text-slate-400 hover:text-white cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="font-sans leading-relaxed text-slate-300">
                              {para.annotationExplanation}
                            </p>
                          </motion.div>
                        )}

                        {/* Special Callout Quote if present */}
                        {para.callout && (
                          <div className="my-5 pl-4 border-l-2 border-cyan-400/70 italic text-cyan-200/90 text-sm sm:text-base font-serif bg-cyan-950/20 py-2.5 rounded-r-xl">
                            "{para.callout}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Audio Transcript snippet if audio playing */}
                  {isNarrating && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-xs font-mono text-cyan-200 flex items-start space-x-3"
                    >
                      <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-cyan-400 block mb-1">Live Narration Transcript:</span>
                        <p className="italic leading-relaxed">"{currentChapter.audioTranscript}"</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                      <span>PROGRESS: 3 / {currentChapter.paragraphs.length} PARAGRAPHS</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onOpenReader(currentChapter.id)}
                        className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full border border-cyan-400/50 hover:border-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 text-white text-xs font-medium tracking-wide transition-all shadow-xl shadow-cyan-950/50 group cursor-pointer"
                      >
                        <span>Continue In Fullscreen Reader</span>
                        <ChevronRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column (4 Cols): Parallax Novel Artwork & Key Dossier */}
          <div className="lg:col-span-4 space-y-6">

            {/* Chapter Hero Visual Card with Parallax Depth */}
            <motion.div
              style={{ y: quoteCardY }}
              className="rounded-3xl border border-white/15 backdrop-blur-xl bg-slate-950/50 p-6 shadow-2xl relative overflow-hidden group"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 border border-white/10">
                <img
                  src={currentChapter.heroImage}
                  alt={currentChapter.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10">
                    MAPPING SECTOR
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {currentChapter.readTimeMinutes} min narrative
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                Astrophysical Metrics
              </div>
              <h4 className="text-lg font-light text-white mb-4">
                {currentChapter.title}
              </h4>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {currentChapter.keyMetrics.map((metric, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      {metric.label}
                    </div>
                    <div className="text-sm font-semibold text-white tracking-tight mt-0.5">
                      {metric.value}
                    </div>
                    <div className="text-[9px] text-cyan-300/80 truncate">
                      {metric.unit}
                    </div>
                  </div>
                ))}
              </div>

              {/* Deep Link to 3D celestial object if available */}
              {currentChapter.associatedPlanetId && onNavigateToPlanet && (
                <button
                  onClick={() => onNavigateToPlanet(currentChapter.associatedPlanetId || 'earth')}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-slate-900/60 hover:bg-slate-900 text-xs text-slate-200 hover:text-white transition-all cursor-pointer mb-2"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect in 3D Planet Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}

              {currentChapter.associatedDsoId && onNavigateToStarMap && (
                <button
                  onClick={() => onNavigateToStarMap()}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 bg-slate-900/60 hover:bg-slate-900 text-xs text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Locate in 3D Star Map</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </motion.div>

            {/* Deep Thought / Reflection Card */}
            {currentChapter.deepQuestions && currentChapter.deepQuestions[0] && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-white/10 backdrop-blur-xl bg-slate-950/40 p-6 text-xs shadow-xl"
              >
                <div className="flex items-center space-x-2 text-[10px] font-mono tracking-wider text-cyan-400 uppercase mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Cosmic Inquiry</span>
                </div>
                <div className="font-serif text-sm text-white italic mb-2 leading-snug">
                  "{currentChapter.deepQuestions[0].question}"
                </div>
                <p className="text-slate-300 font-light leading-relaxed line-clamp-3">
                  {currentChapter.deepQuestions[0].answer}
                </p>
                <div className="mt-3 text-right">
                  <button
                    onClick={() => onOpenReader(currentChapter.id)}
                    className="text-cyan-400 hover:text-cyan-300 text-[11px] font-mono cursor-pointer"
                  >
                    Read full answer in reader →
                  </button>
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
