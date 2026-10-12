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
    <section className="relative min-h-[96vh] pt-36 pb-28 flex items-center overflow-hidden bg-[#060913]">



      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none">
        <div className="lg:col-span-8 xl:col-span-7 pointer-events-auto">

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
              className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 backdrop-blur-xl text-white text-sm font-light transition-colors group shadow-2xl shadow-cyan-950/40 cursor-pointer"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Right side spacer */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-5 pointer-events-none"></div>
      </div>

      {/* Scroll to Explore Indicator */}
      <div
        onClick={() => {
          const el = document.getElementById('explore-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300/80 uppercase select-none">
          Scroll to explore
        </span>
        <div className="w-5 h-8 rounded-full border border-cyan-400/30 flex items-start justify-center p-1.5 backdrop-blur-sm bg-slate-950/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
          <div className="w-1 h-2 rounded-full bg-cyan-300" />
        </div>
      </div>
    </section>
  );
};

