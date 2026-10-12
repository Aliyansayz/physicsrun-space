import React, { useState, useEffect } from 'react';
import { cosmicImages } from '../../assets/images';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const HERO_IMAGES = [
  { src: cosmicImages.celestialMoon.url, alt: 'Earth & Moon Horizon — Episode 01: The Sol Frontier' },
  { src: cosmicImages.cosmicStellarNebula.url, alt: 'Cosmic Stellar Nebula — Episode 02: Stellar Nurseries' },
  { src: cosmicImages.spiralGalaxyCore.url, alt: 'Spiral Galaxy Core — Episode 03: The Barred Spiral' },
  { src: cosmicImages.supermassiveBlackHole.url, alt: 'Supermassive Black Hole — Episode 04: Gravitational Singularities' },
  { src: cosmicImages.supernovaCosmicExplosion.url, alt: 'Cosmic Supernova Explosion — Episode 07: The Supernova Crucible' },
];

const ROTATE_INTERVAL_MS = 5000;

export const RotatingHeroImages: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
        setIsTransitioning(false);
      }, 600);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark base background */}
      <div className="absolute inset-0 bg-[#060913]" />

      {/* Current image with crossfade */}
      <img
        src={HERO_IMAGES[currentIdx].src}
        alt={HERO_IMAGES[currentIdx].alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        loading="eager"
      />

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060913]/60 via-[#060913]/20 to-[#060913]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/70 via-[#060913]/20 to-transparent pointer-events-none" />

      {/* Subtle bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060913] to-transparent pointer-events-none" />

      {/* Image indicator dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIdx(idx);
                setIsTransitioning(false);
              }, 300);
            }}
            aria-label={`Show image ${idx + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIdx
                ? 'bg-cyan-400 w-6'
                : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
