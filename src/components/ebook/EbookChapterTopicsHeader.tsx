import React, { useRef, useState } from 'react';
import { chaptersData } from '../../data/chaptersData';
import { ChapterData } from '../../types';
import { 
  BookOpen, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Layers, 
  LayoutGrid, 
  ListFilter 
} from 'lucide-react';

interface EbookChapterTopicsHeaderProps {
  onSelectChapter: (chapterId: string) => void;
}

export const EbookChapterTopicsHeader: React.FC<EbookChapterTopicsHeaderProps> = ({
  onSelectChapter,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filterTags = [
    { id: 'all', label: 'All Chapters (9)' },
    { id: 'solar', label: 'Solar & Terrestrial' },
    { id: 'deep-space', label: 'Galaxies & Deep Sky' },
    { id: 'relativity', label: 'Black Holes & Relativity' },
  ];

  const filteredChapters = chaptersData.filter((chap) => {
    if (selectedTag === 'solar') {
      return chap.episodeNumber === 1 || chap.episodeNumber === 5;
    }
    if (selectedTag === 'deep-space') {
      return chap.episodeNumber === 2 || chap.episodeNumber === 3 || chap.episodeNumber === 6 || chap.episodeNumber === 8;
    }
    if (selectedTag === 'relativity') {
      return chap.episodeNumber === 4 || chap.episodeNumber === 7 || chap.episodeNumber === 9;
    }
    return true;
  });

  return (
    <section className="space-y-6 pt-2 pb-6 border-b border-slate-800/60 animate-in fade-in duration-500">
      
      {/* Top Header Row with Badge, Title, and Action Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-semibold tracking-wider uppercase">
              Existing Ebook Chapter Topics
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">9 Rich Visual Episodic Volumes</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white flex items-center gap-2">
            <span>Celestial Codex Chapters & Topics</span>
          </h2>

          <p className="text-sm font-light text-slate-400 max-w-2xl leading-relaxed">
            Select any chapter below to launch the continuous interactive cinematic reader with synced audio narration, astrophysics metrics, and high-resolution space photography.
          </p>
        </div>

        {/* View Toggle and Carousel Arrows */}
        <div className="flex items-center space-x-3 self-start md:self-end">
          {/* Tag Filter Pills */}
          <div className="hidden sm:flex items-center bg-slate-900/80 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'carousel' 
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Carousel Mode"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Carousel</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Mode"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All 9 Grid</span>
            </button>
          </div>

          {/* Navigation Arrows for Carousel */}
          {viewMode === 'carousel' && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
                aria-label="Scroll left"
                title="Previous chapters"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors cursor-pointer shadow-sm"
                aria-label="Scroll right"
                title="Next chapters"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        {filterTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tag.id)}
            className={`px-3 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
              selectedTag === tag.id
                ? 'bg-cyan-500/15 border-cyan-400/80 text-cyan-300 font-medium'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Chapter Cards Display (Carousel Track or Full Grid) */}
      {viewMode === 'carousel' ? (
        <div
          ref={scrollRef}
          className="flex space-x-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        >
          {filteredChapters.map((chapter) => (
            <ChapterTopicCard
              key={chapter.id}
              chapter={chapter}
              onSelectChapter={onSelectChapter}
              className="w-[300px] sm:w-[340px] flex-shrink-0 snap-start"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
          {filteredChapters.map((chapter) => (
            <ChapterTopicCard
              key={chapter.id}
              chapter={chapter}
              onSelectChapter={onSelectChapter}
            />
          ))}
        </div>
      )}
    </section>
  );
};

interface ChapterTopicCardProps {
  chapter: ChapterData;
  onSelectChapter: (chapterId: string) => void;
  className?: string;
}

const ChapterTopicCard: React.FC<ChapterTopicCardProps> = ({
  chapter,
  onSelectChapter,
  className = '',
}) => {
  return (
    <div
      onClick={() => onSelectChapter(chapter.id)}
      className={`group backdrop-blur-xl bg-slate-950/35 hover:bg-slate-900/50 border border-white/15 hover:border-cyan-400/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.25)] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Chapter Image with Aspect Ratio and Gradient Overlay */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950/50">
          <img
            src={chapter.heroImage}
            alt={chapter.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle Top & Bottom Gradient Shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/50" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-cyan-800/70 text-[10px] font-mono font-semibold text-cyan-300 tracking-wider">
              EPISODE 0{chapter.episodeNumber}
            </span>

            <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{chapter.readTimeMinutes} min</span>
            </span>
          </div>

          {/* Episode Topic Tag Pill in Image Bottom */}
          <div className="absolute bottom-2 left-3 right-3">
            <span className="text-[11px] font-mono text-cyan-300 font-light truncate block drop-shadow-md">
              {chapter.subtitle}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-light tracking-tight text-white group-hover:text-cyan-200 transition-colors">
            {chapter.title}
          </h3>

          <p className="text-xs font-light text-slate-300 leading-relaxed line-clamp-2">
            {chapter.summary}
          </p>

          {/* Key Metric Snapshot - Translucent Glass */}
          {chapter.keyMetrics && chapter.keyMetrics.length > 0 && (
            <div className="py-2 px-3 rounded-lg backdrop-blur-md bg-white/[0.04] border border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 truncate">{chapter.keyMetrics[0].label}:</span>
              <span className="text-cyan-300 font-medium ml-2 shrink-0">
                {chapter.keyMetrics[0].value} {chapter.keyMetrics[0].unit}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Button */}
      <div className="px-5 pb-5 pt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectChapter(chapter.id);
          }}
          className="w-full py-2.5 px-4 rounded-xl backdrop-blur-md bg-cyan-950/50 hover:bg-cyan-900/70 group-hover:bg-cyan-500 group-hover:text-slate-950 border border-cyan-500/40 group-hover:border-cyan-300 text-xs font-mono text-cyan-200 transition-all flex items-center justify-center space-x-2 shadow-sm font-medium cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Chapter {chapter.episodeNumber}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
