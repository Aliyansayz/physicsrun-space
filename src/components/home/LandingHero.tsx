import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RotatingHeroImages } from './RotatingHeroImages';

interface LandingHeroProps {
  onStartExploring: () => void;
  onOpenReader?: (chapterId: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = React.memo(({
  onStartExploring,
  onOpenReader,
}) => {
  const { scrollY } = useScroll();
  
  // Cinematic parallax transforms using Framer Motion
  const backgroundY = useTransform(scrollY, [0, 900], [0, 220]);
  const backgroundScale = useTransform(scrollY, [0, 900], [1, 1.08]);
  const contentY = useTransform(scrollY, [0, 600], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.25]);

  return (
    <section className="relative min-h-[96vh] pt-36 pb-28 flex items-center overflow-hidden bg-[#060913]">

      {/* Parallax Hero Background Layer powered by Framer Motion */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <RotatingHeroImages />
        {/* Cinematic Atmospheric Overlay Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/85 via-[#060913]/40 to-transparent pointer-events-none" />
      </motion.div>

      {/* Main Content Area with Framer Motion Parallax Lift & Fade */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="lg:col-span-8 xl:col-span-7 pointer-events-auto"
        >

          {/* Cinematic Novel Edition Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-950/35 backdrop-blur-md mb-5 text-[11px] font-mono tracking-[0.2em] text-cyan-300 uppercase shadow-lg shadow-cyan-950/30 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Cinematic Novel • Parallax Edition</span>
          </motion.div>

          {/* Heading: The Universe is Calling - Refined Novel Font & Reduced Size */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-medium tracking-wider text-white leading-[1.25] mb-6 select-none uppercase"
          >
            The Universe <br />
            <span className="font-cinzel font-semibold text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-teal-200 inline-block drop-shadow-[0_0_24px_rgba(56,189,248,0.45)] tracking-widest">
              Is Calling
            </span>
          </motion.h1>

          {/* Subtitle Description with keyword highlighting */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed mb-8 select-none"
          >
            An epic journey through <span className="text-cyan-300 font-normal">galaxies</span>, <span className="text-sky-300 font-normal">planets</span>, <span className="text-teal-300 font-normal">stellar nurseries</span>, and the edge of space and time. Experience the narrative with an <span className="text-white font-normal border-b border-cyan-400/40 pb-0.5">immersive dark-mode reader</span>.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onStartExploring}
              className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-full border border-cyan-500/40 hover:border-cyan-300 bg-cyan-950/45 hover:bg-cyan-900/70 backdrop-blur-xl text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 group shadow-2xl shadow-cyan-950/50 cursor-pointer"
            >
              <span>Explore Atlas</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                if (onOpenReader) {
                  onOpenReader('episode-01');
                } else {
                  const el = document.getElementById('cinematic-reader-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full border border-white/15 hover:border-white/35 bg-slate-950/40 hover:bg-slate-900/60 backdrop-blur-xl text-slate-200 hover:text-white text-xs sm:text-sm font-light transition-all duration-200 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Read Chapter 1</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right side spacer */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-5 pointer-events-none" />
      </div>

      {/* Scroll to Explore Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        onClick={() => {
          const el = document.getElementById('cinematic-reader-section') || document.getElementById('explore-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label="Scroll to novel reader section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-lg p-2 group"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300/80 group-hover:text-cyan-300 uppercase select-none transition-colors">
          Scroll to read novel
        </span>
        <div className="w-5 h-8 rounded-full border border-cyan-400/30 group-hover:border-cyan-400/60 flex items-start justify-center p-1.5 backdrop-blur-sm bg-slate-950/40 shadow-[0_0_12px_rgba(34,211,238,0.2)] transition-colors">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 rounded-full bg-cyan-300"
          />
        </div>
      </motion.button>
    </section>
  );
});

LandingHero.displayName = 'LandingHero';
