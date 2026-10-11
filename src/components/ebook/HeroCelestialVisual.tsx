import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

const EBOOK_PICTURES = [
  {
    id: 'moon-horizon',
    title: 'Earth & Moon Horizon',
    caption: 'Atmospheric limb with lunar companion',
    src: '/assets/images/celestial_moon_surface_1791661072908.jpg',
  },
  {
    id: 'spiral-galaxy',
    title: 'Spiral Galaxy Core',
    caption: 'Stellar nursery & galactic bar',
    src: '/assets/images/spiral_galaxy_core_1791661096182.jpg',
  },
  {
    id: 'supernova-veil',
    title: 'Supernova Veil Remnant',
    caption: 'Ionized blast wave expanding across 110 ly',
    src: '/assets/images/supernova_remnant_veil_1791711709434.jpg',
  },
  {
    id: 'stellar-nebula',
    title: 'Cosmic Stellar Nebula',
    caption: 'Protostellar gas pillar & Herbig-Haro jet',
    src: '/assets/images/cosmic_stellar_nebula_1791661085694.jpg',
  },
  {
    id: 'deepfield-cluster',
    title: 'Galaxy Cluster Deepfield',
    caption: 'Gravitational lensing across 4.6 billion ly',
    src: '/assets/images/galaxy_cluster_deepfield_1791711670367.jpg',
  },
  {
    id: 'black-hole',
    title: 'Supermassive Black Hole',
    caption: 'Relativistic Doppler beaming & photon ring',
    src: '/assets/images/supermassive_black_hole_1791661107412.jpg',
  },
  {
    id: 'cosmic-explosion',
    title: 'Cosmic Supernova Explosion',
    caption: 'Thermal runaway & heavy element synthesis',
    src: '/assets/images/supernova_cosmic_explosion_1791711683777.jpg',
  },
  {
    id: 'cluster-collision',
    title: 'Galaxy Cluster Collision',
    caption: 'Dark matter dissociation shock front',
    src: '/assets/images/galaxy_cluster_collision_1791711722403.jpg',
  },
];

export const HeroCelestialVisual: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(() => 
    Math.floor(Math.random() * EBOOK_PICTURES.length)
  );

  // Auto-randomize image every 16 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => {
        let next = Math.floor(Math.random() * EBOOK_PICTURES.length);
        if (next === prev) next = (prev + 1) % EBOOK_PICTURES.length;
        return next;
      });
    }, 16000);
    return () => clearInterval(timer);
  }, []);

  const handleShuffle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let next = Math.floor(Math.random() * EBOOK_PICTURES.length);
    while (next === currentIdx && EBOOK_PICTURES.length > 1) {
      next = Math.floor(Math.random() * EBOOK_PICTURES.length);
    }
    setCurrentIdx(next);
  };

  const activePicture = EBOOK_PICTURES[currentIdx];

  return (
    <div className="relative w-full aspect-[16/10] max-w-[620px] mx-auto select-none group">
      {/* Outer ambient glow & nebula backscatter */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-600/20 via-sky-500/15 to-indigo-600/10 rounded-3xl blur-[60px] pointer-events-none opacity-80 animate-pulse duration-10000" />

      {/* Main Translucent Glass Card Frame without sphere visual */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-xl bg-slate-950/40 border border-white/15 shadow-[0_12px_40px_0_rgba(0,0,0,0.45)] group-hover:border-cyan-400/40 transition-all duration-500">
        
        {/* Full Image Display */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src={activePicture.src} 
            alt={activePicture.title}
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.15] transform group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-slate-950/60" />
        </div>

        {/* Content & Shuffle Action at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 shadow-lg flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <div className="text-xs font-medium text-white truncate max-w-[200px] sm:max-w-[280px]">
                {activePicture.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-[280px] font-light">
                {activePicture.caption}
              </div>
            </div>
          </div>

          <button
            onClick={handleShuffle}
            title="Randomize celestial visual"
            className="p-3 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shadow-lg active:scale-95 group/btn cursor-pointer flex items-center space-x-1.5"
            aria-label="Randomize picture"
          >
            <Shuffle className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
            <span className="text-xs font-mono hidden sm:inline">Shuffle</span>
          </button>
        </div>

      </div>
    </div>
  );
};
