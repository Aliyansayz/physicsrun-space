import React, { useState } from 'react';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';
import { DetailModalData } from '../common/DetailModal';

interface CosmosExploreGridProps {
  onOpenModal: (data: DetailModalData) => void;
  onNavigateToChapter: (chapterId: string) => void;
  onNavigateToPlanet: (planetId: string) => void;
  onNavigateToStarMap: (target?: { constellationId?: string; starId?: string; dsoId?: string }) => void;
}

type CategoryFilter = 'ALL' | 'GALAXY_CLUSTERS' | 'SUPERNOVAE' | 'GALAXIES_NEBULAE';

export interface ObservatoryTopicItem {
  id: string;
  filterGroup: CategoryFilter;
  category: string;
  badge: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  image: string;
  metrics: string;
  onAction: () => void;
  actionText: string;
  secondaryAction: () => void;
  secondaryText: string;
}

interface ObservatoryParallaxCardProps {
  topic: ObservatoryTopicItem;
  isFirstCard?: boolean;
  onOpenModal: (data: DetailModalData) => void;
}

const ObservatoryParallaxCard: React.FC<ObservatoryParallaxCardProps> = ({
  topic,
  isFirstCard,
  onOpenModal,
}) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -y * 8, // subtle 8 deg max tilt
      ry: x * 8,
      px: Math.round((x + 0.5) * 100),
      py: Math.round((y + 0.5) * 100),
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, px: 50, py: 50, isHovered: false });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(12px) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
        transformStyle: 'preserve-3d',
        transition: tilt.isHovered
          ? 'transform 0.12s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease'
          : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease',
      }}
      className={`group flex flex-col backdrop-blur-xl bg-slate-950/35 hover:bg-slate-900/55 border ${
        isFirstCard ? 'border-cyan-400/35 hover:border-cyan-400/80' : 'border-white/15 hover:border-cyan-400/50'
      } rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.75),0_0_35px_rgba(6,182,212,0.25)] relative overflow-visible cursor-default observatory-card-3d`}
    >
      {/* High-Resolution Image Frame with 3D Parallax Elevation (Child div:nth-of-type(1) of Card) */}
      <div 
        onClick={() => onOpenModal({
          category: topic.category,
          title: topic.title,
          description: topic.shortDesc,
          imageUrl: topic.image,
          actionText: topic.actionText,
          onAction: topic.onAction,
        })}
        style={{
          transform: tilt.isHovered ? 'translateZ(18px) scale(1.025)' : 'translateZ(0px)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease',
        }}
        className="aspect-[16/10] rounded-xl overflow-hidden bg-black/50 relative border border-white/10 group-hover:border-cyan-500/40 transition-colors cursor-pointer"
      >
        <img 
          src={topic.image} 
          alt={topic.title}
          style={{
            transform: tilt.isHovered
              ? `scale(1.08) translate(${tilt.ry * -0.5}px, ${tilt.rx * 0.5}px)`
              : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Child div:nth-of-type(1) of Image Frame: Top Badge Overlay - Frosted Glass */}
        <div 
          style={{
            transform: tilt.isHovered ? 'translateZ(34px)' : 'translateZ(0px)',
            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="absolute top-2.5 left-2.5 flex items-center gap-1.5 backdrop-blur-md bg-slate-950/75 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider text-cyan-300 border border-white/15 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {topic.badge}
        </div>

        {/* Child div:nth-of-type(2) of Image Frame (Matches CSS selector 1): Inspect Overlay Trigger with 3D Parallax Float */}
        <div 
          style={{
            transform: tilt.isHovered ? 'translateZ(26px)' : 'translateZ(0px)',
            transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease',
          }}
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-cyan-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3"
        >
          <span className="text-[11px] font-mono text-cyan-200 flex items-center gap-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> High-Res Inspection
          </span>
          <span className="text-[10px] font-mono text-cyan-300/90 px-1.5 py-0.5 rounded backdrop-blur-md bg-slate-950/60 border border-cyan-400/40">
            3D PARALLAX
          </span>
        </div>
      </div>

      {/* Child div:nth-of-type(2) of Card: Card Body Details with subtle 3D separation */}
      <div 
        style={{
          transform: tilt.isHovered ? 'translateZ(14px)' : 'translateZ(0px)',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="pt-3.5 flex-1 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1">
            <span>{topic.category}</span>
          </div>
          <h4 className="text-base font-medium text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
            {topic.title}
          </h4>
          <p className="text-xs text-slate-300 font-light mt-1 line-clamp-2 leading-relaxed">
            {topic.shortDesc}
          </p>
          
          {/* Scientific Metric Pill - Translucent Glass */}
          <div className="mt-2.5 text-[10px] font-mono text-cyan-300 backdrop-blur-md bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/10 line-clamp-1">
            {topic.metrics}
          </div>
        </div>

        {/* Quick Interactive Actions - Clean Minimalist Style */}
        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              topic.onAction();
            }}
            className="inline-flex items-center text-xs font-light text-cyan-400 hover:text-cyan-300 transition-colors group/btn cursor-pointer"
          >
            <span>Learn More</span>
            <span className="ml-1.5 transition-transform group-hover/btn:translate-x-1">→</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              topic.secondaryAction();
            }}
            title={topic.secondaryText}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Read Chapter
          </button>
        </div>
      </div>
    </div>
  );
};

export const CosmosExploreGrid: React.FC<CosmosExploreGridProps> = ({
  onOpenModal,
  onNavigateToChapter,
  onNavigateToPlanet,
  onNavigateToStarMap,
}) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('ALL');

  const topics: ObservatoryTopicItem[] = [
    {
      id: 'pandora-cluster',
      filterGroup: 'GALAXY_CLUSTERS',
      category: 'GALAXY CLUSTER',
      badge: 'WEBB DEEP FIELD',
      title: "Pandora's Cluster (Abell 2744)",
      subtitle: 'Trillion-Solar-Mass Gravitational Lens',
      shortDesc: "A colossal cosmic megastructure forged from the collision of four galaxy clusters. Its monumental gravity bends space into luminous Einstein arcs, magnifying the earliest infant galaxies from cosmic dawn.",
      image: '/src/assets/images/galaxy_cluster_deepfield_1791711670367.jpg',
      metrics: '3.98 Billion Ly • 10¹⁵ M☉ • Redshift z=0.308',
      onAction: () => onNavigateToChapter('episode-08'),
      actionText: 'Read Episode 08: Galaxy Clusters & Gravitational Lenses',
      secondaryAction: () => onNavigateToStarMap({ dsoId: 'abell_2744' }),
      secondaryText: 'Locate on Star Map',
    },
    {
      id: 'supernova-crucible',
      filterGroup: 'SUPERNOVAE',
      category: 'SUPERNOVA',
      badge: 'THERMONUCLEAR EXPLOSION',
      title: 'The Supernova Crucible',
      subtitle: 'Core-Collapse & Stellar Nucleosynthesis',
      shortDesc: "The catastrophic detonation of an iron-exhausted massive star. Blasting outward at 30,000 km/s, its relativistic shockwave forges and distributes the universe's gold, platinum, and iodine across space.",
      image: '/src/assets/images/supernova_cosmic_explosion_1791711683777.jpg',
      metrics: '10⁴⁴ Joules • 100B Kelvin • 30,000 km/s Blast',
      onAction: () => onNavigateToChapter('episode-07'),
      actionText: 'Read Episode 07: The Supernova Crucible',
      secondaryAction: () => onNavigateToStarMap({ dsoId: 'sn_1987a' }),
      secondaryText: 'Locate SN 1987A',
    },
    {
      id: 'bullet-cluster',
      filterGroup: 'GALAXY_CLUSTERS',
      category: 'GALAXY CLUSTER',
      badge: 'MACH-3 COLLISION',
      title: 'The Bullet Cluster (1E 0657-56)',
      subtitle: 'Direct Empirical Proof of Dark Matter',
      shortDesc: "Two massive clusters smashed through each other at 4,500 km/s. Supersonic shock fronts dragged ordinary gas behind, while collisionless dark matter ghosted straight through without friction.",
      image: '/src/assets/images/galaxy_cluster_collision_1791711722403.jpg',
      metrics: '3.7 Billion Ly • Mach 3 Bow Shock • Dark Matter Core',
      onAction: () => onNavigateToChapter('episode-09'),
      actionText: 'Read Episode 09: Cosmic Collisions & Bullet Cluster',
      secondaryAction: () => onNavigateToStarMap({ dsoId: 'bullet_cluster' }),
      secondaryText: 'View on Star Map',
    },
    {
      id: 'crab-pulsar-remnant',
      filterGroup: 'SUPERNOVAE',
      category: 'SUPERNOVA REMNANT',
      badge: 'PULSAR WIND NEBULA',
      title: 'Crab Nebula & Pulsar (M1)',
      subtitle: 'Relic of the 1054 CE Guest Star',
      shortDesc: "Intricate gossamer filigree of ionized oxygen and hydrogen expanding from a core collapse. At the heart spins a dense neutron star rotating 30.2 times a second, whipping synchrotron magnetic rings into space.",
      image: '/src/assets/images/supernova_remnant_veil_1791711709434.jpg',
      metrics: '6,500 Ly • 30.2 Hz Spin • 10 Light-Year Shroud',
      onAction: () => onNavigateToStarMap({ dsoId: 'm1' }),
      actionText: 'Inspect in 3D Star Map',
      secondaryAction: () => onNavigateToChapter('episode-07'),
      secondaryText: 'Read Supernova Chapter',
    },
    {
      id: 'milky-way-spiral',
      filterGroup: 'GALAXIES_NEBULAE',
      category: 'GALAXIES',
      badge: 'BARRED SPIRAL',
      title: 'The Milky Way',
      subtitle: 'Barred Spiral & Density Wave Crests',
      shortDesc: "Our home galaxy spanning 100,000 light-years, harboring over 100 billion stars. Dynamic density waves compress star-forming clouds along the Perseus and Sagittarius arms around Sagittarius A*.",
      image: '/src/assets/images/spiral_galaxy_core_1791661096182.jpg',
      metrics: '100,000 Ly Across • 400B Stars • 230 km/s Orbit',
      onAction: () => onNavigateToChapter('episode-03'),
      actionText: 'Read Episode 03: The Barred Spiral',
      secondaryAction: () => onNavigateToStarMap({ dsoId: 'm31' }),
      secondaryText: 'Compare with Andromeda',
    },
    {
      id: 'black-hole-singularity',
      filterGroup: 'GALAXIES_NEBULAE',
      category: 'BLACK HOLES',
      badge: 'RELATIVISTIC ACCRETION',
      title: 'Gravitational Singularities',
      subtitle: 'Sagittarius A* & The Horizon Threshold',
      shortDesc: "Where spacetime curvature becomes extreme and escape velocity exceeds light speed. Superheated accretion plasma whirls at relativistic speeds, gravitationally warped into luminous photon rings.",
      image: '/src/assets/images/supermassive_black_hole_1791661107412.jpg',
      metrics: '4.15M Solar Masses • 12M km Horizon • Relativistic Jet',
      onAction: () => onNavigateToChapter('episode-04'),
      actionText: 'Read Episode 04: Singularities',
      secondaryAction: () => onNavigateToStarMap({ dsoId: 'sagittarius_a_star' }),
      secondaryText: 'Target Galactic Core',
    },
    {
      id: 'stellar-nurseries',
      filterGroup: 'GALAXIES_NEBULAE',
      category: 'NEBULAE',
      badge: 'STARBIRTH PILLAR',
      title: 'Stellar Nurseries (M42)',
      subtitle: 'Great Orion Nebula & Protostellar Disks',
      shortDesc: "A vast interstellar cauldron where gravitational Jeans collapse compresses cold molecular clouds into protostellar cores, triggering first thermonuclear light.",
      image: '/src/assets/images/cosmic_stellar_nebula_1791661085694.jpg',
      metrics: '1,344 Ly • 10M Kelvin Core • Circumstellar Disks',
      onAction: () => onNavigateToChapter('episode-02'),
      actionText: 'Read Episode 02: Stellar Nurseries',
      secondaryAction: () => onNavigateToStarMap({ dsoId: 'm42' }),
      secondaryText: 'Locate in Orion',
    },
    {
      id: 'lunar-sanctuary',
      filterGroup: 'GALAXIES_NEBULAE',
      category: 'THE MOON',
      badge: 'CELESTIAL STABILIZER',
      title: "Earth's Closest Neighbor",
      subtitle: 'Tidal Rhythm & Ancient Regolith',
      shortDesc: "Our celestial companion preserving Earth's axial tilt and generating life-giving ocean tides. An impact-sculpted archive preserving four billion years of solar system history.",
      image: '/src/assets/images/celestial_moon_surface_1791661072908.jpg',
      metrics: '384,400 km • 1.62 m/s² Gravity • 27.3 Day Orbit',
      onAction: () => onNavigateToPlanet('moon'),
      actionText: 'Launch 3D Moon Model',
      secondaryAction: () => onNavigateToChapter('episode-01'),
      secondaryText: 'Read Sol Frontier',
    },
  ];

  const filteredTopics = activeFilter === 'ALL'
    ? topics
    : topics.filter(t => t.filterGroup === activeFilter);

  return (
    <section id="featured-section" className="py-24 px-6 sm:px-8 bg-transparent relative overflow-hidden">
      {/* Space Galactic Supernova Image Background behind Glass Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/src/assets/images/supernova_cosmic_explosion_1791711683777.jpg"
          alt="Supernova Cosmic Explosion Background"
          className="w-full h-full object-cover object-center opacity-40 filter brightness-[0.75] contrast-[1.15]"
          loading="lazy"
        />
        {/* Soft depth gradient overlays allowing galactic visual to shine behind glass */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#05070e]/45 to-[#05070e]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070e] via-transparent to-[#05070e]" />
      </div>

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-cyan-950/20 via-indigo-950/20 to-purple-950/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] backdrop-blur-xl bg-slate-950/50 text-cyan-300 border border-white/15 uppercase shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                HIGH RESOLUTION ASTROPHOTOGRAPHY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight">
              Galaxies, Clusters & Supernovae
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl font-light leading-relaxed">
              Explore deep cosmos phenomenons rendered in razor-sharp scientific fidelity—from massive gravitational lensing galaxy clusters and supersonic cluster collisions to violent supernova crucible detonations.
            </p>
          </div>

          <button 
            onClick={() => onNavigateToStarMap()}
            className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-slate-300 hover:text-cyan-300 transition-colors group self-start md:self-end pb-1 border-b border-transparent hover:border-cyan-500/50"
          >
            <span>EXPLORE FULL STAR MAP</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Filter Tabs - Translucent Glass Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'backdrop-blur-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-sm shadow-cyan-900/40'
                : 'backdrop-blur-md bg-slate-950/35 text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10'
            }`}
          >
            ALL PHENOMENA ({topics.length})
          </button>
          <button
            onClick={() => setActiveFilter('GALAXY_CLUSTERS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeFilter === 'GALAXY_CLUSTERS'
                ? 'backdrop-blur-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-sm shadow-cyan-900/40'
                : 'backdrop-blur-md bg-slate-950/35 text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10'
            }`}
          >
            GALAXY CLUSTERS
          </button>
          <button
            onClick={() => setActiveFilter('SUPERNOVAE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeFilter === 'SUPERNOVAE'
                ? 'backdrop-blur-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-sm shadow-cyan-900/40'
                : 'backdrop-blur-md bg-slate-950/35 text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10'
            }`}
          >
            SUPERNOVAE & REMNANTS
          </button>
          <button
            onClick={() => setActiveFilter('GALAXIES_NEBULAE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeFilter === 'GALAXIES_NEBULAE'
                ? 'backdrop-blur-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-sm shadow-cyan-900/40'
                : 'backdrop-blur-md bg-slate-950/35 text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10'
            }`}
          >
            GALAXIES, NEBULAE & DEEP SKY
          </button>
        </div>

        {/* Dynamic Cards Grid - Translucent Glass Cards with 3D Space Immersion Parallax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 observatory-perspective">
          {filteredTopics.map((topic, index) => (
            <ObservatoryParallaxCard
              key={topic.id}
              topic={topic}
              isFirstCard={index === 0}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>

        {/* Bottom Tagline */}
        <div className="mt-20 pt-8 flex items-center space-x-4 text-xs font-mono tracking-[0.25em] text-slate-400 uppercase">
          <span className="w-8 h-[1px] bg-slate-600 block"></span>
          <span>COSMIC ARCHITECTURE • GRAVITATIONAL DYNAMICS • DEEP TIME</span>
        </div>

      </div>
    </section>
  );
};
