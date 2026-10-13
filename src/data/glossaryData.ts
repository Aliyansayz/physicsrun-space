import { GlossaryPhenomenon } from '../types';

export const glossaryPhenomena: GlossaryPhenomenon[] = [
  {
    id: 'gravitational-lensing',
    term: 'Gravitational Lensing',
    pronunciation: '/ˌɡræv.ɪˈteɪ.ʃən.əl ˈlɛn.zɪŋ/',
    category: 'Gravitational Singularities',
    shortDefinition: 'The bending and amplification of light around massive spacetime curvature, acting as a cosmic telescope.',
    mechanismDescription:
      'According to General Relativity, mass curves spacetime. When light from an ultra-distant background quasar or galaxy passes near a massive foreground cluster, photons follow geodesic paths along this curved geometry. This deflects the rays toward the observer, producing magnified, distorted, and multiply imaged arcs (Einstein Rings) that reveal the cluster\'s total mass—including dark matter.',
    physicalLawOrEquation: {
      name: 'Einstein Radius (Angular Deflection)',
      formula: 'θ_E = √( (4GM / c²) · (D_ds / (D_d · D_s)) )',
      explanation: 'Defines the angular radius of the ring formed when the source, lens of mass M, and observer are in collinear alignment across cosmological angular diameter distances.',
    },
    observedExamples: [
      {
        name: 'Pandora\'s Cluster (Abell 2744)',
        coordinates: 'RA 00h 14m 20s | Dec -30° 24′ 04″',
        distance: '3.98 Billion Light Years',
        note: 'Mega-cluster merger magnifying ancient baby galaxies from the cosmic dawn at redshift z > 10.',
      },
      {
        name: 'The Einstein Cross (Q2237+0305)',
        coordinates: 'RA 22h 40m 30s | Dec +03° 21′ 29″',
        distance: '8.0 Billion Light Years',
        note: 'Four distinct mirage images of a single quasar quadruply focused by a foreground spiral galaxy.',
      },
    ],
    imageKey: 'pandoraClusterSharp',
    scaleEstimate: '1.2 Megaparsecs (Cluster Field)',
    associatedChapterId: 'episode-03',
  },
  {
    id: 'supermassive-black-hole',
    term: 'Supermassive Black Hole',
    pronunciation: '/ˌsuː.pɚˈmæs.ɪv blæk hoʊl/',
    category: 'Gravitational Singularities',
    shortDefinition: 'A gravitational singularity with millions to billions of solar masses anchoring galactic nuclei and driving relativistic jets.',
    mechanismDescription:
      'Matter funneled toward the central singularity forms an ultra-hot, friction-heated accretion disk spinning at relativistic velocities. Strong magnetohydrodynamic frame dragging twists magnetic field lines along the rotational axis, ejecting collimated plasma beams across thousands of light-years while gas crossing the Event Horizon is permanently severed from the observable universe.',
    physicalLawOrEquation: {
      name: 'Schwarzschild Event Horizon Radius',
      formula: 'R_s = (2 · G · M) / c²',
      explanation: 'The critical perimeter where the escape velocity strictly equals the speed of light c for a non-rotating mass M.',
    },
    observedExamples: [
      {
        name: 'Sagittarius A*',
        coordinates: 'RA 17h 45m 40s | Dec -29° 00′ 28″',
        distance: '26,670 Light Years',
        note: 'The 4.15-million-solar-mass anchor of our Milky Way, imaged in radio interferometry by EHT.',
      },
      {
        name: 'M87* (Messier 87 Central Engine)',
        coordinates: 'RA 12h 30m 49s | Dec +12° 23′ 28″',
        distance: '53.5 Million Light Years',
        note: '6.5-billion-solar-mass monster with a 5,000-light-year synchrotron relativistic jet.',
      },
    ],
    imageKey: 'supermassiveBlackHole',
    scaleEstimate: '44 Million km (Horizon Core)',
    associatedChapterId: 'episode-03',
    relatedDsoId: 'dso-m87',
  },
  {
    id: 'supernova-shockwave',
    term: 'Core-Collapse Supernova',
    pronunciation: '/ˌsuː.pɚˈnoʊ.və ˈʃɑːk.weɪv/',
    category: 'Stellar Evolution',
    shortDefinition: 'Cataclysmic gravitational collapse and rebound explosion of a massive star synthesizing the periodic table.',
    mechanismDescription:
      'When an evolved star above eight solar masses exhausts silicon fusion in its degenerate iron core, nuclear fusion ceases and thermal pressure plummets. In a fraction of a second, the core collapses into a neutron star, triggering a colossal neutrino burst and shockwave that blasts the stellar mantle outward at over ten thousand kilometers per second, dispersing gold, platinum, and radioactive nickel.',
    physicalLawOrEquation: {
      name: 'Chandrasekhar Mass Limit',
      formula: 'M_Ch ≈ 1.44 M_☉',
      explanation: 'The maximum mass supported against gravitational collapse by electron degeneracy pressure before core implosion.',
    },
    observedExamples: [
      {
        name: 'SN 1987A',
        coordinates: 'RA 05h 35m 28s | Dec -69° 16′ 11″',
        distance: '168,000 Light Years (LMC)',
        note: 'Closest observed modern supernova; verified astrophysical models of neutrino emission and shockwave breakout.',
      },
      {
        name: 'Kepler\'s Supernova (SN 1604)',
        coordinates: 'RA 17h 30m 36s | Dec -21° 29′',
        distance: '20,000 Light Years',
        note: 'Historical naked-eye supernova observed by Johannes Kepler in the constellation Ophiuchus.',
      },
    ],
    imageKey: 'supernovaCosmicExplosion',
    scaleEstimate: '0.8 Light Years (Early Shock)',
    associatedChapterId: 'episode-02',
  },
  {
    id: 'supernova-remnant',
    term: 'Supernova Remnant (SNR)',
    pronunciation: '/ˌsuː.pɚˈnoʊ.və ˈrɛm.nənt/',
    category: 'Stellar Evolution',
    shortDefinition: 'Expanding diffuse emission shell where exploded stellar material collides with the interstellar medium.',
    mechanismDescription:
      'Centuries after a stellar explosion, the hypersonic ejecta slams into ambient interstellar gas and dust. This creates forward and reverse shocks that heat ions to tens of millions of Kelvin, ionizing oxygen, sulfur, and hydrogen to produce glowing optical filaments, intense X-ray halos, and synchrotron radio emission.',
    physicalLawOrEquation: {
      name: 'Sedov-Taylor Blast Wave Radius',
      formula: 'R(t) = C · ( (E_0 / ρ_0) · t² )^(1/5)',
      explanation: 'Self-similar adiabatic expansion rate of a blast wave driven by explosion energy E_0 into ambient gas density ρ_0.',
    },
    observedExamples: [
      {
        name: 'The Veil Nebula (Cygnus Loop)',
        coordinates: 'RA 20h 45m 38s | Dec +30° 42′ 30″',
        distance: '2,400 Light Years',
        note: 'Spectacular web of ionized gas filaments originating from a supernova roughly 20,000 years ago.',
      },
      {
        name: 'Crab Nebula (Messier 1)',
        coordinates: 'RA 05h 34m 32s | Dec +22° 00′ 52″',
        distance: '6,500 Light Years',
        note: 'Pulsar wind nebula driven by a spinning neutron star spinning 30 times every second.',
      },
    ],
    imageKey: 'supernovaRemnantVeil',
    scaleEstimate: '110 Light Years (Filament Field)',
    associatedChapterId: 'episode-02',
    relatedDsoId: 'dso-m1',
  },
  {
    id: 'molecular-cloud',
    term: 'Giant Molecular Cloud',
    pronunciation: '/maɪˈlɛk.jə.lɚ klaʊd/',
    category: 'Stellar Evolution',
    shortDefinition: 'Vast, ultra-cold interstellar reservoir of molecular hydrogen and dust where protostellar accretion takes place.',
    mechanismDescription:
      'Spanning tens to hundreds of light-years with temperatures hovering around ten to twenty Kelvin, these cold clouds shield complex carbon molecules from destructive interstellar ultraviolet radiation. When regional turbulent pressure is overcome by self-gravity, dense clumps collapse to form protostellar accretion disks and brand-new solar systems.',
    physicalLawOrEquation: {
      name: 'Jeans Instability Mass Criterion',
      formula: 'M_J = (5 · k_B · T / (G · μ · m_H))^(3/2) · (3 / (4π · ρ))^(1/2)',
      explanation: 'Minimum mass required for gravitational collapse against thermal gas pressure at temperature T and density ρ.',
    },
    observedExamples: [
      {
        name: 'Orion Molecular Cloud Complex (OMC-1)',
        coordinates: 'RA 05h 35m 17s | Dec -05° 23′ 28″',
        distance: '1,344 Light Years',
        note: 'Nearest major active stellar nursery containing the Great Orion Nebula and the Horsehead Nebula.',
      },
      {
        name: 'Taurus Molecular Cloud',
        coordinates: 'RA 04h 30m 00s | Dec +26° 00′ 00″',
        distance: '430 Light Years',
        note: 'Quiet low-mass star forming region ideal for studying pre-planetary protoplanetary disks.',
      },
    ],
    imageKey: 'cosmicStellarNebula',
    scaleEstimate: '45 Light Years Across',
    associatedChapterId: 'episode-01',
    relatedDsoId: 'dso-m42',
  },
  {
    id: 'galactic-collision',
    term: 'Galactic Cannibalism & Mergers',
    pronunciation: '/ɡəˈlæk.tɪk kəˈlɪʒ.ən/',
    category: 'Intergalactic Dynamics',
    shortDefinition: 'Dynamic collision and coalescence of two galaxies driven by gravitational tidal stripping and friction.',
    mechanismDescription:
      'Because the distance between stars is vast compared to their diameters, individual stars almost never collide physically during a galactic merger. Instead, dynamic tidal forces distort galactic disks into long arcs and tidal tails. Interstellar gas clouds slam together, triggering ferocious starburst events and driving matter into central supermassive black holes.',
    physicalLawOrEquation: {
      name: 'Chandrasekhar Dynamical Friction Force',
      formula: 'F_df = - (4π · G² · M² · ρ · ln(Λ) / v²) · [erf(X) - (2X/√π)e^(-X²)]',
      explanation: 'Deceleration force dragging massive bodies toward the cluster center due to the gravitational wake behind them.',
    },
    observedExamples: [
      {
        name: 'The Antennae Galaxies (NGC 4038 / 4039)',
        coordinates: 'RA 12h 01m 53s | Dec -18° 52′ 10″',
        distance: '45 Million Light Years',
        note: 'Iconic pair of merging spirals with vast tidal tails thrown out by gravitational tidal resonances.',
      },
      {
        name: 'Bullet Cluster (1E 0657-56)',
        coordinates: 'RA 06h 58m 38s | Dec -55° 56′ 00″',
        distance: '3.7 Billion Light Years',
        note: 'Direct empirical proof of dark matter: collision separated visible gas from the gravitational lensing mass centers.',
      },
    ],
    imageKey: 'galaxyClusterCollision',
    scaleEstimate: '350,000 Light Years',
    associatedChapterId: 'episode-03',
  },
  {
    id: 'spiral-density-wave',
    term: 'Spiral Density Wave',
    pronunciation: '/ˈspaɪ.rəl ˈdɛn.sə.ti weɪv/',
    category: 'Intergalactic Dynamics',
    shortDefinition: 'Quasi-stationary rotating gravitational wave pattern responsible for the enduring spiral arms in disk galaxies.',
    mechanismDescription:
      'Spiral arms are not rigid structures of orbiting stars; if they were, differential rotation would wind them tightly into invisibility within a few hundred million years. Instead, spiral arms are moving traffic jams of density. As gas clouds enter the higher-density crest of the wave, they compress, triggering bursts of bright blue OB star formation that trace out the glowing arms.',
    physicalLawOrEquation: {
      name: 'Lin-Shu Dispersion Relation',
      formula: '(ω - m·Ω)² = κ² - 2π·G·σ·|k| + k²·c_s²',
      explanation: 'Governs self-sustaining acoustic-gravitational density perturbations in a rotating stellar disk with epicyclic frequency κ.',
    },
    observedExamples: [
      {
        name: 'The Whirlpool Galaxy (Messier 51a)',
        coordinates: 'RA 13h 29m 52s | Dec +47° 11′ 43″',
        distance: '23 Million Light Years',
        note: 'Grand-design spiral galaxy with textbook prominent density wave arms interacting with companion NGC 5195.',
      },
      {
        name: 'Pinwheel Galaxy (Messier 101)',
        coordinates: 'RA 14h 03m 12s | Dec +54° 20′ 57″',
        distance: '20.9 Million Light Years',
        note: 'Massive face-on spiral showing over three thousand prominent H II starburst regions along its arms.',
      },
    ],
    imageKey: 'spiralGalaxyCore',
    scaleEstimate: '60,000 Light Years (Disk Span)',
    associatedChapterId: 'episode-03',
    relatedDsoId: 'dso-m51',
  },
  {
    id: 'andromeda-merger',
    term: 'Local Group Merger (Milkomeda)',
    pronunciation: '/ænˈdrɒm.ɪ.də ˈmɝː.dʒɚ/',
    category: 'Intergalactic Dynamics',
    shortDefinition: 'The inevitable gravitational coalescence of our Milky Way and the Andromeda Galaxy in four billion years.',
    mechanismDescription:
      'Despite the universal expansion of the cosmos, the Milky Way and the Andromeda Galaxy (Messier 31) are gravitationally bound. Andromeda is falling toward our galactic core at approximately 110 kilometers per second. In approximately four billion years, their first glancing pass will toss our Solar System into a new outer orbit before they fuse into a giant giant elliptical galaxy.',
    physicalLawOrEquation: {
      name: 'Two-Body Orbital Infall Rate',
      formula: 'v_radial = v_0 - ∫ (G · (M_MW + M_M31) / r²) dt',
      explanation: 'Infall velocity calculation accounting for mutual dark matter halo drag and dynamical friction.',
    },
    observedExamples: [
      {
        name: 'Messier 31 (Andromeda Galaxy)',
        coordinates: 'RA 00h 42m 44s | Dec +41° 16′ 09″',
        distance: '2.537 Million Light Years',
        note: 'Our largest spiral neighbor, home to roughly one trillion stars and hundreds of globular clusters.',
      },
    ],
    imageKey: 'andromedaGalaxyM31',
    scaleEstimate: '220,000 Light Years',
    associatedChapterId: 'episode-03',
    relatedDsoId: 'dso-m31',
  },
  {
    id: 'runaway-greenhouse',
    term: 'Runaway Greenhouse Effect',
    pronunciation: '/ˈrʌn.ə.weɪ ˈɡriːn.haʊs/',
    category: 'Plasma & Planetary Magnetism',
    shortDefinition: 'Irreversible thermodynamic atmospheric feedback loop driving complete planetary surface desiccation.',
    mechanismDescription:
      'As planetary solar irradiance exceeds a critical threshold, ocean water vaporizes. Because water vapor is itself a potent greenhouse gas, the atmospheric temperature climbs further, evaporating even more water in a runaway feedback loop. Once oceans boil, water reaches the upper stratosphere where solar ultraviolet radiation photolyzes it into hydrogen and oxygen, letting hydrogen escape into space forever.',
    physicalLawOrEquation: {
      name: 'Komabayashi-Ingersoll Radiation Limit',
      formula: 'F_crit ≈ 280 to 310 W / m²',
      explanation: 'The maximum outgoing thermal infrared flux a saturated moist atmosphere can radiate before runaway boiling occurs.',
    },
    observedExamples: [
      {
        name: 'Planet Venus',
        coordinates: 'Inner Solar System (0.723 AU)',
        distance: '41 Million km to 261 Million km',
        note: '464°C surface temperature under 92 bars of supercritical CO₂ and sulfuric acid cloud decks.',
      },
    ],
    imageKey: 'celestialMoon',
    scaleEstimate: '12,104 km (Planetary Diameter)',
    associatedChapterId: 'episode-01',
    relatedPlanetId: 'venus',
  },
  {
    id: 'metallic-hydrogen',
    term: 'Liquid Metallic Hydrogen Dynamo',
    pronunciation: '/məˈtæl.ɪk ˈhaɪ.drə.dʒən/',
    category: 'Plasma & Planetary Magnetism',
    shortDefinition: 'Degenerate electrical-conducting phase of hydrogen powering planetary megamagnetospheres.',
    mechanismDescription:
      'Deep inside gas giants like Jupiter and Saturn, pressures exceed four million atmospheres. Under these extreme conditions, hydrogen molecules disassociate and their valence electrons become delocalized, behaving like a liquid metal similar to molten copper. Convection currents coupled with rapid planetary rotation drive a colossal hydromagnetic dynamo, generating magnetic moments thousands of times stronger than Earth.',
    physicalLawOrEquation: {
      name: 'Magnetic Induction Dynamo Equation',
      formula: '∂B/∂t = ∇ × (u × B) + η · ∇²B',
      explanation: 'Governs self-sustaining magnetic field amplification B by fluid velocity u in a conducting fluid with magnetic diffusivity η.',
    },
    observedExamples: [
      {
        name: 'Jupiter\'s Magnetosphere',
        coordinates: 'Outer Solar System (5.20 AU)',
        distance: '778 Million km from Sun',
        note: 'Spans over seven million kilometers toward the Sun and extends past the orbit of Saturn.',
      },
    ],
    imageKey: 'celestialMoon',
    scaleEstimate: '142,984 km (Jovian Dynamo)',
    associatedChapterId: 'episode-01',
    relatedPlanetId: 'jupiter',
  },
  {
    id: 'cosmic-web',
    term: 'Cosmic Web Filaments',
    pronunciation: '/ˈkɒz.mɪk wɛb/',
    category: 'Cosmological Structures',
    shortDefinition: 'Universal network of dark matter filaments and galaxy superclusters spanning billions of light-years.',
    mechanismDescription:
      'Primordial quantum fluctuations in the early universe underwent gravitational Jeans collapse, assembling dark matter into sheets and filaments. Baryonic gas followed these gravitational troughs, cooling to birth galaxies along the intersections where nodes formed superclusters, separated by colossal, nearly empty cosmic voids hundreds of millions of light-years across.',
    physicalLawOrEquation: {
      name: 'Cosmological Matter Density Parameter',
      formula: 'Ω_m = ρ_m / ρ_crit = (8π · G · ρ_m) / (3 · H_0²)',
      explanation: 'Ratio of matter density (dark + baryonic) to critical expansion density governing the large-scale gravitational collapse geometry.',
    },
    observedExamples: [
      {
        name: 'Laniakea Supercluster',
        coordinates: 'Local Universe (Centered on Great Attractor)',
        distance: '520 Million Light Years Extent',
        note: 'Gravitational basin encompassing 100,000 galaxies, including our Milky Way and the Virgo Supercluster.',
      },
      {
        name: 'Sloan Great Wall',
        coordinates: 'RA 12h 40m | Dec +00° 00′',
        distance: '1.37 Billion Light Years',
        note: 'One of the largest known filamentary structures in the observable cosmos, spanning 1.38 billion light-years.',
      },
    ],
    imageKey: 'galaxyClusterDeepfield',
    scaleEstimate: '1.4 Billion Light Years',
    associatedChapterId: 'episode-03',
  },
];
