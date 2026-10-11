import React from 'react';
import { chaptersData } from '../../data/chaptersData';
import { ArrowRight, BookOpen, Clock, Compass } from 'lucide-react';

interface EpisodicPreviewSectionProps {
  onSelectChapter: (chapterId: string) => void;
  onOpenPlanetStudio: (planetId: string) => void;
}

export const EpisodicPreviewSection: React.FC<EpisodicPreviewSectionProps> = ({
  onSelectChapter,
  onOpenPlanetStudio,
}) => {
  return (
    <section className="py-24 px-6 bg-[#070a16] border-t border-slate-900/60">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase block mb-3">
            CINEMATIC EBOOK ANTHOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-slate-100 tracking-tight">
            Episodic Space Odyssey
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-xl font-light">
            Six comprehensive chapters crafted with astrophysical rigor, narrated audio commentary, and synchronized 3D planetary models.
          </p>
        </div>

        {/* 6 Episodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chaptersData.map((chap) => (
            <div
              key={chap.id}
              className="bg-[#0b0f20]/60 border border-slate-900 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header row with episode number and read time */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
                  <span className="text-cyan-400 font-medium">EPISODE 0{chap.episodeNumber}</span>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{chap.readTimeMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-xl font-medium text-slate-100 mb-2 group-hover:text-cyan-200 transition-colors">
                  {chap.title}
                </h3>
                
                <h4 className="text-xs font-mono text-slate-400 mb-4 line-clamp-1">
                  {chap.subtitle}
                </h4>

                <p className="text-xs text-slate-400 font-light leading-relaxed mb-6 line-clamp-3">
                  {chap.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectChapter(chap.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Chapter</span>
                </button>

                {chap.associatedPlanetId && (
                  <button
                    onClick={() => onOpenPlanetStudio(chap.associatedPlanetId!)}
                    title={`Inspect 3D ${chap.associatedPlanetId}`}
                    className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
