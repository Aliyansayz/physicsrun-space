import React from 'react';
import { Orbit, Sparkles, Compass, Telescope } from 'lucide-react';

interface FeatureCardsSectionProps {
  onSelectPlanets: () => void;
  onSelectStarMap: () => void;
  onSelectGalaxies: () => void;
  onSelectDeepSpace: () => void;
}

export const FeatureCardsSection: React.FC<FeatureCardsSectionProps> = ({
  onSelectPlanets,
  onSelectStarMap,
  onSelectGalaxies,
  onSelectDeepSpace,
}) => {
  return (
    <section id="explore-section" className="relative py-16 px-6 sm:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Item 1: Planets */}
        <div 
          onClick={onSelectPlanets}
          className="group cursor-pointer select-none backdrop-blur-xl bg-slate-950/35 hover:bg-slate-900/50 border border-white/15 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.2)] hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 flex items-center justify-start text-white/90 group-hover:text-cyan-400 transition-colors mb-4">
              <Orbit className="w-7 h-7 stroke-[1.4] transition-transform duration-300 group-hover:scale-105" />
            </div>
            <h3 className="text-lg font-normal text-white mb-2 group-hover:text-cyan-300 transition-colors">
              Planets
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              From rocky worlds to gas giants, discover the diverse planets of our solar system.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
            <span>Explore Planets →</span>
          </div>
        </div>

        {/* Item 2: Stars */}
        <div 
          onClick={onSelectStarMap}
          className="group cursor-pointer select-none backdrop-blur-xl bg-slate-950/35 hover:bg-slate-900/50 border border-white/15 hover:border-amber-400/50 rounded-2xl p-6 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(251,191,36,0.2)] hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 flex items-center justify-start text-white/90 group-hover:text-amber-400 transition-colors mb-4">
              <Sparkles className="w-7 h-7 stroke-[1.4] transition-transform duration-300 group-hover:scale-105" />
            </div>
            <h3 className="text-lg font-normal text-white mb-2 group-hover:text-amber-300 transition-colors">
              Stars & Constellations
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Learn about the life cycle of stars and the energy that lights up the universe.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-mono text-amber-400 group-hover:text-amber-300">
            <span>Launch Star Map →</span>
          </div>
        </div>

        {/* Item 3: Galaxies */}
        <div 
          onClick={onSelectGalaxies}
          className="group cursor-pointer select-none backdrop-blur-xl bg-slate-950/35 hover:bg-slate-900/50 border border-white/15 hover:border-purple-400/50 rounded-2xl p-6 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(192,132,252,0.2)] hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 flex items-center justify-start text-white/90 group-hover:text-purple-400 transition-colors mb-4">
              <Compass className="w-7 h-7 stroke-[1.4] transition-transform duration-300 group-hover:scale-105" />
            </div>
            <h3 className="text-lg font-normal text-white mb-2 group-hover:text-purple-300 transition-colors">
              Galaxies
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Explore vast galaxies, from the Milky Way to distant cosmic structures.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-mono text-purple-400 group-hover:text-purple-300">
            <span>View Galaxies →</span>
          </div>
        </div>

        {/* Item 4: Deep Space */}
        <div 
          onClick={onSelectDeepSpace}
          className="group cursor-pointer select-none backdrop-blur-xl bg-slate-950/35 hover:bg-slate-900/50 border border-white/15 hover:border-sky-400/50 rounded-2xl p-6 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(56,189,248,0.2)] hover:-translate-y-1 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 flex items-center justify-start text-white/90 group-hover:text-sky-400 transition-colors mb-4">
              <Telescope className="w-7 h-7 stroke-[1.4] transition-transform duration-300 group-hover:scale-105" />
            </div>
            <h3 className="text-lg font-normal text-white mb-2 group-hover:text-sky-300 transition-colors">
              Deep Space
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Dive into black holes, nebulae, and the most distant objects in existence.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-mono text-sky-400 group-hover:text-sky-300">
            <span>AstroLens Lens →</span>
          </div>
        </div>

      </div>
    </section>
  );
};
