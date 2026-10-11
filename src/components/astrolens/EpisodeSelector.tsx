import React, { useState } from 'react';
import { AstroLensEpisode, EpisodeCategory, SpectralWavelength } from '../../types/astrolens';
import { ASTROLENS_EPISODES } from '../../data/astrolensData';
import { Search, Compass, Eye, Sparkles, Filter } from 'lucide-react';

interface EpisodeSelectorProps {
  currentEpisodeId: string;
  onSelectEpisode: (episode: AstroLensEpisode) => void;
  analyzedWavelengthsByEpisode?: Record<string, SpectralWavelength[]>;
}

const CATEGORIES: EpisodeCategory[] = [
  'All',
  'Galaxy Clusters',
  'Supernovae',
  'Deep Galaxies',
  'Nebulae & Nurseries',
  'Black Holes',
];

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  currentEpisodeId,
  onSelectEpisode,
  analyzedWavelengthsByEpisode = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EpisodeCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEpisodes = ASTROLENS_EPISODES.filter((ep) => {
    const matchesCategory = selectedCategory === 'All' || ep.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      query === '' ||
      ep.title.toLowerCase().includes(query) ||
      ep.subtitle.toLowerCase().includes(query) ||
      ep.telemetry.designation.toLowerCase().includes(query) ||
      ep.telemetry.constellation.toLowerCase().includes(query) ||
      ep.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#060a17]/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-3 shadow-lg">
        {/* Category Pills/Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Quick Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search targets or coords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white font-mono"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Episode Cards Grid / Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredEpisodes.map((ep) => {
          const isSelected = ep.id === currentEpisodeId;
          const analyzedBands = analyzedWavelengthsByEpisode[ep.id] || [];
          const analyzedCount = analyzedBands.length;

          return (
            <div
              key={ep.id}
              onClick={() => onSelectEpisode(ep)}
              className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-400/90 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                  : 'bg-[#060a17]/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 shadow-lg'
              }`}
            >
              {/* Thumbnail Image with Tag Overlays */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={ep.imageUrl}
                  alt={ep.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a17] via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-cyan-300 font-semibold">
                    {ep.code}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-slate-300">
                    {ep.category}
                  </span>
                </div>

                {/* Telemetry quick coordinates badge */}
                <div className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-slate-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
                  {ep.telemetry.distanceLightYears}
                </div>

                {/* Active episode glow ring */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 bg-cyan-950/90 border border-cyan-400 text-cyan-200 px-2 py-0.5 rounded text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>OBSERVING</span>
                  </div>
                )}
              </div>

              {/* Episode Info Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
                    {ep.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {ep.subtitle}
                  </p>

                  <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center justify-between">
                    <span>{ep.telemetry.designation}</span>
                    <span className="text-amber-400">z = {ep.telemetry.redshiftZ}</span>
                  </div>
                </div>

                {/* Footer: Multi-Spectral Progress & Action */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] font-mono text-slate-400 mr-1">SPECTRAL:</span>
                    <span className="text-[10px] font-mono text-cyan-300">
                      {analyzedCount}/6
                    </span>
                    <div className="flex space-x-0.5 ml-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className={`w-1 h-2 rounded-xs ${
                            i <= analyzedCount ? 'bg-cyan-400' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-cyan-400 group-hover:underline flex items-center space-x-1">
                    <span>Inspect</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEpisodes.length === 0 && (
        <div className="text-center py-12 bg-[#060a17]/50 rounded-xl border border-slate-800">
          <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No cosmic episodes match your filter.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-2 text-xs text-cyan-400 hover:underline font-mono"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
