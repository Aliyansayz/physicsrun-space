import React from 'react';
import { Zap, Atom, Star, Circle, Globe, Flame, Wind, Layers, ArrowUpRight, Scale } from 'lucide-react';

interface ShockingFact {
  id: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  magnitude: string;
  color: string;
}

const SHOCKING_FACTS: ShockingFact[] = [
  {
    id: 'supernova-energy',
    category: 'STELLAR DEATH',
    icon: Zap,
    title: 'A single supernova releases more energy in 10 seconds than our Sun will emit in its entire 10-billion-year lifetime.',
    magnitude: '~10⁴⁴ Joules = 100× Sun\'s total lifetime output',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'black-hole-density',
    category: 'SPACETIME EXTREME',
    icon: Circle,
    title: 'A teaspoon of neutron star material weighs ~6 billion tons — roughly the mass of Mount Everest compressed into a sugar cube.',
    magnitude: 'Density: 3×10¹⁷ kg/m³',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'gamma-ray-burst',
    category: 'COSMIC SNIPER',
    icon: Flame,
    title: 'A gamma-ray burst beams more energy in seconds than the Sun produces in 10 billion years — and if one pointed at Earth from 1,000 ly away, it would strip our ozone layer.',
    magnitude: '~10⁴⁷ J in < 30 seconds',
    color: 'from-red-500 to-pink-600',
  },
  {
    id: 'vacuum-energy',
    category: 'QUANTUM VOID',
    icon: Atom,
    title: 'Empty space isn\'t empty — the quantum vacuum has enough energy in 1 cubic centimeter to boil all Earth\'s oceans, but we can\'t access it due to vacuum catastrophe (120 orders of magnitude discrepancy).',
    magnitude: '~10¹¹³ J/m³ theoretical vs 10⁻⁹ J/m³ observed',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'dark-energy',
    category: 'UNIVERSE EXPANSION',
    icon: ArrowUpRight,
    title: '68% of the universe is dark energy — a mysterious force pushing galaxies apart. Its density stays constant as space expands, meaning new dark energy appears from nothing.',
    magnitude: '~10⁻⁹ J/m³ driving cosmic acceleration',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'core-earth',
    category: 'PLANETARY HEART',
    icon: Globe,
    title: 'Earth\'s inner core is a solid iron ball at 5,400°C — as hot as the Sun\'s surface — spinning independently inside the liquid outer core, generating our magnetic shield.',
    magnitude: '1,220 km radius • 5,400°C',
    color: 'from-amber-500 to-red-600',
  },
  {
    id: 'solar-wind',
    category: 'STELLAR BREATH',
    icon: Wind,
    title: 'The Sun loses 4 million tons of mass every second as solar wind — over its lifetime it has shed ~100 Earth masses, yet still holds 99.86% of the solar system\'s total mass.',
    magnitude: '4×10⁹ kg/s mass loss',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'cosmic-web',
    category: 'LARGEST STRUCTURE',
    icon: Layers,
    title: 'The universe\'s largest structure — the Hercules-Corona Borealis Great Wall — spans 10 billion light-years. Light takes 10% of the universe\'s age just to cross it.',
    magnitude: '~3 Gpc / 10 billion ly',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'energy-mass',
    category: 'E=MC² REALITY',
    icon: Scale,
    title: 'The energy in a single paper clip (1 gram) if fully converted = 90 terajoules = the Hiroshima bomb. Your body (~70 kg) holds ~6.3×10¹⁸ J — enough to power humanity for ~100 years.',
    magnitude: 'c² = 8.99×10¹⁶ m²/s²',
    color: 'from-emerald-500 to-teal-600',
  },
];

export const CosmicShockers: React.FC = () => {
  const displayFacts = SHOCKING_FACTS.slice(0, 4);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="cosmic-shockers-heading">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-xl bg-slate-950/50 border border-cyan-400/30 text-xs font-mono tracking-[0.2em] uppercase mb-4 text-cyan-300">
            <Zap className="w-3 h-3 animate-pulse" />
            COSMIC SHOCKERS — ENERGY & SCALE
          </div>
          <h2 id="cosmic-shockers-heading" className="text-3xl sm:text-4xl font-light text-white tracking-tight mb-4">
            The Universe <span className="font-handwriting text-cyan-300"> Defies Intuition</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto font-light leading-relaxed">
            These aren\'t theories — they\'re measured realities that break human intuition about energy, scale, and existence itself.
          </p>
        </div>

        {/* Shocking Fact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayFacts.map((fact) => (
            <article
              key={fact.id}
              className="group relative flex flex-col backdrop-blur-xl bg-slate-950/30 hover:bg-slate-900/45 border border-white/15 hover:border-cyan-400/50 rounded-2xl p-5 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.2)] hover:-translate-y-1.5 cursor-default select-none"
            >
              {/* Color Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" style={{ background: fact.color }} />
              
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm`} style={{ background: fact.color }}>
                  <fact.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-medium">{fact.category}</span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-medium text-white leading-tight mb-3 line-clamp-2">
                {fact.title}
              </h3>

              {/* Magnitude Metric */}
              <div className="mt-auto pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Magnitude</span>
                  <span className="text-[10px] font-mono text-cyan-300 font-medium">{fact.magnitude}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Teaser for more */}
        <div className="text-center mt-10">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            {SHOCKING_FACTS.length - 4} more cosmic shockers await in the chapters →
          </p>
        </div>
      </div>
    </section>
  );
};