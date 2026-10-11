export type SpectralWavelength = 'optical' | 'infrared' | 'xray' | 'radio' | 'ultraviolet' | 'composite';

export type EpisodeCategory = 
  | 'All'
  | 'Galaxy Clusters' 
  | 'Supernovae' 
  | 'Deep Galaxies' 
  | 'Nebulae & Nurseries' 
  | 'Black Holes';

export interface SpectralBandInfo {
  id: SpectralWavelength;
  label: string;
  telescope: string;
  wavelengthRange: string;
  frequencyRange: string;
  photonEnergy: string;
  accentColor: string;
  description: string;
  reveals: string;
  primaryEmissions: string[];
  filterCss: string; // CSS filters representing this wavelength simulation
  svgFilterId?: string;
  contrastBoost?: number;
}

export interface TargetHotspot {
  id: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  label: string;
  type: 'core' | 'jet' | 'shockwave' | 'lensed_arc' | 'dust_filament' | 'pulsar' | 'starburst';
  description: string;
  spectralPeak: SpectralWavelength;
  energyFlux: string;
  radialVelocityKmS?: number;
}

export interface AstroTelemetry {
  designation: string;
  rightAscension: string;   // e.g. "07h 23m 19.5s"
  declination: string;      // e.g. "-73° 27′ 15″"
  galacticCoords: string;   // e.g. "l=284.97° b=-23.72°"
  distanceLightYears: string; // e.g. "4.6 Billion ly"
  redshiftZ: number;        // e.g. 0.39
  apparentMagnitude: string;
  constellation: string;
  sensorCryoTempK: number;  // e.g. 37 (Kelvin)
  signalToNoiseRatio: number; // e.g. 48.2 dB
  exposureTimeHours: number;
  angularScaleArcsecPerPixel: number;
  massSolarMasses?: string;
  estimatedAgeYears?: string;
}

export interface AstroLensEpisode {
  id: string;
  episodeNumber: number;
  code: string; // e.g. "EP-01"
  title: string;
  subtitle: string;
  category: 'Galaxy Clusters' | 'Supernovae' | 'Deep Galaxies' | 'Nebulae & Nurseries' | 'Black Holes';
  associatedChapterId?: string;
  associatedDsoId?: string;
  associatedConstellationId?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  telemetry: AstroTelemetry;
  hotspots: TargetHotspot[];
  overview: string;
  scientificSignificance: string;
  spectralObservations: Record<SpectralWavelength, {
    summary: string;
    keyFeatures: string[];
    sonificationToneHz: number; // Base frequency for cosmic audio sonification
    colorTintHex: string;
  }>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Cosmological';
  tags: string[];
}

export interface CapturedSnapshot {
  id: string;
  episodeId: string;
  episodeTitle: string;
  wavelength: SpectralWavelength;
  timestamp: number;
  imageUrl: string;
  reticleCoords: { x: number; y: number };
  zoomLevel: number;
  notes?: string;
}

export interface DiscoveryProgress {
  viewedEpisodeIds: string[];
  analyzedWavelengthsByEpisode: Record<string, SpectralWavelength[]>;
  inspectedHotspotIds: string[];
  capturedSnapshots: CapturedSnapshot[];
  unlockedBadgeIds: string[];
}

export interface ObservationBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requirementText: string;
  isUnlocked: (progress: DiscoveryProgress) => boolean;
}
