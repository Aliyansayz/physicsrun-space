import React, { useState, useEffect } from 'react';
import { planetsData } from '../../data/planetsData';
import { constellationsData, starsData, deepSkyObjectsData } from '../../data/starMapData';
import { chaptersData } from '../../data/chaptersData';
import { Search, X, BookOpen, Compass, Sparkles, ArrowRight } from 'lucide-react';

import { ASTROLENS_EPISODES } from '../../data/astrolensData';

interface SearchResult {
  id: string;
  title: string;
  category: 'planet' | 'constellation' | 'star' | 'dso' | 'chapter' | 'astrolens';
  subtitle: string;
  targetId: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPlanet: (planetId: string) => void;
  onNavigateToChapter: (chapterId: string) => void;
  onNavigateToStarMap: (target?: { constellationId?: string; starId?: string; dsoId?: string }) => void;
  onNavigateToAstroLens?: (episodeId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPlanet,
  onNavigateToChapter,
  onNavigateToStarMap,
  onNavigateToAstroLens,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  // Build searchable index
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Chapters
    chaptersData.forEach(ch => {
      if (ch.title.toLowerCase().includes(q) || ch.subtitle.toLowerCase().includes(q) || ch.summary.toLowerCase().includes(q)) {
        matches.push({
          id: ch.id,
          title: `Episode ${ch.episodeNumber < 10 ? '0' : ''}${ch.episodeNumber}: ${ch.title}`,
          category: 'chapter',
          subtitle: ch.subtitle,
          targetId: ch.id,
        });
      }
    });

    // Planets
    planetsData.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.classification.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)) {
        matches.push({
          id: p.id,
          title: p.name,
          category: 'planet',
          subtitle: `${p.classification} · ${p.tagline}`,
          targetId: p.id,
        });
      }
    });

    // Constellations
    constellationsData.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.latinName.toLowerCase().includes(q) || c.englishMeaning.toLowerCase().includes(q)) {
        matches.push({
          id: c.id,
          title: `${c.name} (${c.englishMeaning})`,
          category: 'constellation',
          subtitle: `${c.hemisphere} Sky · ${c.season}`,
          targetId: c.id,
        });
      }
    });

    // Stars
    starsData.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        matches.push({
          id: s.id,
          title: s.name,
          category: 'star',
          subtitle: `Spectral Class ${s.spectralClass} · ${s.distanceLightYears} LY away`,
          targetId: s.id,
        });
      }
    });

    // Deep Sky Objects
    deepSkyObjectsData.forEach(dso => {
      if (
        dso.name.toLowerCase().includes(q) ||
        dso.type.toLowerCase().includes(q) ||
        (dso.messierCode && dso.messierCode.toLowerCase().includes(q)) ||
        (dso.ngcCode && dso.ngcCode.toLowerCase().includes(q)) ||
        dso.description.toLowerCase().includes(q)
      ) {
        matches.push({
          id: dso.id,
          title: dso.name,
          category: 'dso',
          subtitle: `${dso.type} in ${dso.constellation} · ${dso.distanceLightYears.toLocaleString()} LY`,
          targetId: dso.id,
        });
      }
    });

    // AstroLens Deep Space Episodes
    ASTROLENS_EPISODES.forEach(ep => {
      if (
        ep.title.toLowerCase().includes(q) ||
        ep.subtitle.toLowerCase().includes(q) ||
        ep.telemetry.designation.toLowerCase().includes(q) ||
        ep.category.toLowerCase().includes(q) ||
        ep.overview.toLowerCase().includes(q) ||
        ep.tags.some(t => t.toLowerCase().includes(q))
      ) {
        matches.push({
          id: ep.id,
          title: `AstroLens: ${ep.title}`,
          category: 'astrolens',
          subtitle: `${ep.code} · ${ep.category} · ${ep.telemetry.distanceLightYears}`,
          targetId: ep.id,
        });
      }
    });

    setResults(matches);
  }, [query]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectResult = (item: SearchResult) => {
    onClose();
    if (item.category === 'astrolens' && onNavigateToAstroLens) {
      onNavigateToAstroLens(item.targetId);
    } else if (item.category === 'chapter') {
      onNavigateToChapter(item.targetId);
    } else if (item.category === 'planet') {
      onNavigateToPlanet(item.targetId);
    } else if (item.category === 'constellation') {
      onNavigateToStarMap({ constellationId: item.targetId });
    } else if (item.category === 'star') {
      onNavigateToStarMap({ starId: item.targetId });
    } else if (item.category === 'dso') {
      onNavigateToStarMap({ dsoId: item.targetId });
    } else {
      onNavigateToStarMap();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#05070e]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d1f] border border-slate-800 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search planets, galaxies, stars, constellations, or episodes..."
            autoFocus
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-light"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions when empty */}
        {results.length === 0 && !query && (
          <div className="pt-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
              Suggested Explorations
            </span>
            <div className="space-y-1.5">
              {[
                { label: 'Jupiter Great Red Spot & Galilean Orbits', query: 'Jupiter' },
                { label: 'Supermassive Black Hole Sagittarius A*', query: 'Black Hole' },
                { label: 'Great Orion Nebula (Messier 42)', query: 'Orion' },
                { label: 'Episode 01: The Sol Frontier', query: 'Sol Frontier' },
              ].map(s => (
                <div
                  key={s.label}
                  onClick={() => setQuery(s.query)}
                  className="p-2.5 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs text-slate-300 font-light flex items-center justify-between transition-colors"
                >
                  <span>{s.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        {results.length > 0 && (
          <div className="pt-4 max-h-96 overflow-y-auto space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-2">
              Found {results.length} Matches
            </span>
            {results.map(item => (
              <div
                key={`${item.category}-${item.id}`}
                onClick={() => handleSelectResult(item)}
                className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    {item.category === 'chapter' ? (
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    ) : item.category === 'planet' ? (
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-100">{item.title}</h5>
                    <p className="text-xs text-slate-400 font-light truncate max-w-sm">{item.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="pt-8 pb-4 text-center">
            <p className="text-sm text-slate-400 font-light">
              No astronomical records matched "{query}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
