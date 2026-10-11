import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onStartExploring: () => void;
  onOpenPlanets?: () => void;
  onOpenStarMap?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartExploring,
}) => {
  return (
    <section className="relative min-h-[95vh] pt-36 pb-24 flex items-center overflow-hidden bg-[#060913]">
      
      {/* Pandora's Cluster (Abell 2744) Cosmic Deep Field Background Visual - Vivid and Un-blued */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/src/assets/images/galaxy_cluster_deepfield_1791711670367.jpg"
          alt="Pandora Cluster (Abell 2744) Deep Field"
          className="w-full h-full object-cover object-center scale-105 animate-cosmic-drift"
        />
        {/* Soft atmospheric gradient masks for readability without bluing/dimming the background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060913]/45 via-transparent to-[#060913]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/75 via-[#060913]/20 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none">
        <div className="lg:col-span-8 xl:col-span-7 pointer-events-auto">
          
          {/* Category Tag: LOOK UP • EXPLORE • DISCOVER */}
          <div className="flex items-center space-x-2 text-xs font-light tracking-[0.22em] text-slate-300 uppercase mb-3 select-none">
            <span>LOOK UP</span>
            <span className="text-cyan-400 font-bold">•</span>
            <span>EXPLORE</span>
            <span className="text-cyan-400 font-bold">•</span>
            <span>DISCOVER</span>
          </div>

          {/* Celestial Kicker */}
          <div className="inline-flex items-center space-x-2 mb-3 select-none">
            <span className="font-serif text-lg sm:text-xl text-cyan-300 tracking-[0.2em] uppercase drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
              ✦ An Explorer's Journey Into The Infinite ✦
            </span>
          </div>
          
          {/* Heading: The Universe is Calling */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[1.1] mb-7 select-none">
            The Universe <br />
            <span className="font-serif font-normal text-5xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 inline-block drop-shadow-[0_0_28px_rgba(56,189,248,0.5)]">
              Is Calling
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-slate-300 text-base sm:text-lg max-w-xl font-light leading-relaxed mb-9 select-none">
            Explore galaxies, planets, stars and the mysteries beyond. A journey through space, time and the wonders of the cosmos.
          </p>

          {/* Start Exploring Button */}
          <div>
            <button 
              onClick={onStartExploring}
              className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 backdrop-blur-xl text-white text-sm font-light transition-all group shadow-2xl shadow-cyan-950/40 cursor-pointer"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Right side spacer */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-5 pointer-events-none"></div>
      </div>
    </section>
  );
};
