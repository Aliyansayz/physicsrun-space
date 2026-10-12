import React, { useState } from 'react';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';
import { DetailModalData } from '../common/DetailModal';
import { cosmicImages } from '../../assets/images';
import { ResponsiveImage, type PictureData } from '../common/ResponsiveImage';

const clusterCollision = cosmicImages.galaxyClusterCollision.picture;
const clusterDeepField = cosmicImages.galaxyClusterDeepfield.picture;
const supernovaCosmic = cosmicImages.supernovaCosmicExplosion.picture;
const supernovaVeil = cosmicImages.supernovaRemnantVeil.picture;
const supermassiveBlackHole = cosmicImages.supermassiveBlackHole.picture;
const spiralGalaxyCore = cosmicImages.spiralGalaxyCore.picture;
const cosmicStellarNebula = cosmicImages.cosmicStellarNebula.picture;
const celestialMoon = cosmicImages.celestialMoon.picture;

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
  image: PictureData;
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
  return (
    <div
      className={`group flex flex-col backdrop-blur-xl bg-slate-950/35 border ${
        isFirstCard ? 'border-cyan-400/35' : 'border-white/15'
      } rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] relative overflow-visible cursor-default`}
    >
      {/* High-Resolution Image Frame */}
      <div
        onClick={() => onOpenModal({
          category: topic.category,
          title: topic.title,
          description: topic.shortDesc,
          imageUrl: topic.image.img.src,
          actionText: topic.actionText,
          onAction: topic.onAction,
        })}
        className="aspect-[16/10] rounded-xl overflow-hidden bg-black/50 relative border border-white/10 transition-colors cursor-pointer"
      >
        <ResponsiveImage
          picture={topic.image}
          alt={topic.title}
          className="w-full h-full object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          referrerPolicy="no-referrer"
        />

        {/* Top Badge Overlay - Frosted Glass */}
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1.5 backdrop-blur-md bg-slate-950/75 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider text-cyan-300 border border-white/15 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          {topic.badge}
        </div>

        {/* Inspect Overlay Trigger */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-cyan-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3"
        >
          <span className="text-[11px] font-mono text-cyan-200 flex items-center gap-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> High-Res Inspection
          </span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="pt-3.5 flex-1 flex flex-col justify-between">
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
      image: clusterDeepField,
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
      image: supernovaCosmic,
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
      image: clusterCollision,
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
      image: supernovaVeil,
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
      image: spiralGalaxyCore,
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
      image: supermassiveBlackHole,
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
      image: cosmicStellarNebula,
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
      image: celestialMoon,
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


      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-cyan-950/20 via-indigo-950/20 to-purple-950/15 pointer-events-none rounded-full opacity-60" />

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

        {/* Dynamic Cards Grid - Translucent Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
