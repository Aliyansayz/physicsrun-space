export type SpectralClass = 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';

export interface PlanetData {
  id: string;
  name: string;
  classification: string;
  tagline: string;
  diameterKm: number;
  massKg: string;
  surfaceGravity: string;
  orbitalPeriodDays: number;
  distanceFromSunAU: number;
  meanTemperatureC: number;
  atmosphereComposition: string[];
  moonsCount: number;
  dayLengthHours: number;
  axialTiltDegrees: number;
  description: string;
  funFact: string;
  colorHex: string;
  atmosphereGlowHex: string;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColorHex?: string;
  layers: {
    name: string;
    thickness: string;
    composition: string;
    temperature: string;
    colorHex: string;
  }[];
}

export interface StarData {
  id: string;
  name: string;
  bayerDesignation?: string;
  constellationId: string;
  spectralClass: SpectralClass;
  apparentMagnitude: number;
  distanceLightYears: number;
  temperatureKelvin: number;
  massSolarMasses: number;
  coordinates: {
    raHours: number;
    decDegrees: number;
  };
  description: string;
}

export interface ConstellationData {
  id: string;
  name: string;
  latinName: string;
  englishMeaning: string;
  hemisphere: 'Northern' | 'Southern' | 'Equatorial';
  season: 'Winter' | 'Spring' | 'Summer' | 'Autumn';
  mainStars: string[];
  connections: [number, number][]; // indices into mainStars
  lore: string;
  astrophysicsNote: string;
  audioNarrationScript: string;
}

export interface DeepSkyObject {
  id: string;
  messierCode?: string;
  ngcCode?: string;
  name: string;
  type: 'Nebula' | 'Spiral Galaxy' | 'Elliptical Galaxy' | 'Open Cluster' | 'Globular Cluster' | 'Black Hole' | 'Supernova' | 'Supernova Remnant' | 'Galaxy Cluster';
  distanceLightYears: number;
  constellation: string;
  coordinates: {
    raHours: number;
    decDegrees: number;
  };
  description: string;
  imageUrl?: string;
}

export interface ChapterParagraph {
  id: string;
  text: string;
  callout?: string;
  annotationTerm?: string;
  annotationExplanation?: string;
  analogy?: {
    concept: string;
    simpleExplanation: string;
    realWorldAnalogy: string;
  };
}

export interface BookmarkItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  paragraphId: string;
  excerpt: string;
  timestamp: number;
}

export interface ChapterData {
  id: string;
  episodeNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  readTimeMinutes: number;
  heroImage: string;
  associatedPlanetId?: string;
  associatedDsoId?: string;
  episodicPrompt?: string;
  opticalTelemetry?: {
    telescope: string;
    filters: string;
    integrationTime: string;
    bortleClass: string;
    focalLength: string;
    fieldOfView: string;
    sensorTemp?: string;
    snrDb?: number;
  };
  paragraphs: ChapterParagraph[];
  audioTranscript: string;
  keyMetrics: {
    label: string;
    value: string;
    unit?: string;
  }[];
  deepQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface GlossaryPhenomenon {
  id: string;
  term: string;
  pronunciation?: string;
  category: 'Gravitational Singularities' | 'Stellar Evolution' | 'Intergalactic Dynamics' | 'Plasma & Planetary Magnetism' | 'Cosmological Structures';
  episodicPrompt: string;
  episodeReference?: string;
  shortDefinition: string;
  mechanismDescription: string;
  physicalLawOrEquation: {
    name: string;
    formula: string;
    explanation: string;
  };
  observedExamples: {
    name: string;
    coordinates?: string;
    distance?: string;
    note: string;
  }[];
  imageKey: import('../assets/images').CosmicImageKey;
  scaleEstimate: string;
  associatedChapterId?: string;
  relatedDsoId?: string;
  relatedPlanetId?: string;
  astrophotographyMeta?: {
    telescope: string;
    focalLength: string;
    fRatio: string;
    filters: string;
    exposureStack: string;
    sensorTemp: string;
    bortleScale: string;
    guidingRms: string;
  };
  astrophotographyDirectives?: string;
}

export type ActiveView = 'landing' | 'ebook' | 'planets' | 'starmap' | 'astrolens' | 'glossary';
