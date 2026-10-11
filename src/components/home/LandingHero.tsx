import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onStartExploring: () => void;
  onOpenPlanets?: () => void;
  onOpenStarMap?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartExploring,
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute smooth parallax offset (clamped to prevent excessive displacement)
  const bgTranslate = Math.min(scrollY * 0.25, 200);
  const contentTranslate = Math.min(scrollY * 0.1, 100);
  const contentOpacity = Math.max(0, 1 - scrollY / 600);

  return (
    <section className="relative min-h-[96vh] pt-36 pb-28 flex items-center overflow-hidden bg-[#060913]">
      
      {/* Pandora's Cluster Cosmic Deep Field Visual - High-Resolution with Smooth Scroll Parallax */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
        style={{
          transform: `translate3d(0, ${bgTranslate}px, 0)`,
          willChange: 'transform',
        }}
      >
        <img
          src="/assets/images/pandora_cluster_sharp_1791737058239.jpg"
          alt="Pandora Cluster (Abell 2744) Deep Field - Crystal Sharp JWST View"
          className="w-full h-full object-cover object-center scale-105"
          loading="eager"
        />
        {/* Atmospheric gradient masks for smooth cosmic transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060913]/30 via-transparent to-[#060913]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/70 via-[#060913]/15 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Area with Smooth Parallax Easing */}
      <div 
        className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none"
        style={{
          transform: `translate3d(0, -${contentTranslate}px, 0)`,
          opacity: contentOpacity,
          willChange: 'transform, opacity',
        }}
      >
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

      {/* Elegant Scroll to Explore Indicator */}
      <div 
        onClick={() => {
          const el = document.getElementById('explore-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer transition-all duration-500 z-20 ${
          scrollY > 60 ? 'opacity-0 pointer-events-none translate-y-3' : 'opacity-80 hover:opacity-100 translate-y-0'
        }`}
      >
        <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300/80 uppercase select-none">
          Scroll to explore
        </span>
        <div className="w-5 h-8 rounded-full border border-cyan-400/30 flex items-start justify-center p-1.5 backdrop-blur-sm bg-slate-950/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
          <div className="w-1 h-2 rounded-full bg-cyan-300 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
