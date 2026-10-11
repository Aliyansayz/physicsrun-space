import { DiscoveryProgress, SpectralWavelength, CapturedSnapshot, ObservationBadge } from '../types/astrolens';

const STORAGE_KEY = 'astrolens_discovery_progress_v1';

const DEFAULT_PROGRESS: DiscoveryProgress = {
  viewedEpisodeIds: [],
  analyzedWavelengthsByEpisode: {},
  inspectedHotspotIds: [],
  capturedSnapshots: [],
  unlockedBadgeIds: [],
};

export const OBSERVATION_BADGES: ObservationBadge[] = [
  {
    id: 'first_light',
    title: 'First Light',
    description: 'Began observation in the AstroLens deep space observatory.',
    iconName: 'Sparkles',
    requirementText: 'Inspect any celestial episode in AstroLens',
    isUnlocked: (p) => p.viewedEpisodeIds.length >= 1,
  },
  {
    id: 'multi_spectral_pioneer',
    title: 'Multi-Spectral Pioneer',
    description: 'Switched through all 5 primary electromagnetic spectral bands.',
    iconName: 'Layers',
    requirementText: 'Analyze a target in Optical, Infrared, X-Ray, Radio, and UV',
    isUnlocked: (p) => {
      const allWavelengths: SpectralWavelength[] = ['optical', 'infrared', 'xray', 'radio', 'ultraviolet'];
      return Object.values(p.analyzedWavelengthsByEpisode).some((bands) =>
        allWavelengths.every((w) => bands.includes(w))
      );
    },
  },
  {
    id: 'deep_sky_cartographer',
    title: 'Cosmic Cartographer',
    description: 'Mapped half of all curated deep-space episodes.',
    iconName: 'Compass',
    requirementText: 'Observe at least 4 different cosmic targets',
    isUnlocked: (p) => p.viewedEpisodeIds.length >= 4,
  },
  {
    id: 'high_energy_hunter',
    title: 'High-Energy Astrophysicist',
    description: 'Investigated extreme high-energy Chandra X-Ray emissions across multiple targets.',
    iconName: 'Zap',
    requirementText: 'Inspect X-Ray bands on 3 separate deep sky targets',
    isUnlocked: (p) => {
      return Object.values(p.analyzedWavelengthsByEpisode).filter((bands) => bands.includes('xray')).length >= 3;
    },
  },
  {
    id: 'celestial_photographer',
    title: 'Observatory Astrophotographer',
    description: 'Captured and logged telemetry-stamped deep space snapshots.',
    iconName: 'Camera',
    requirementText: 'Capture at least 2 telescope snapshots with telemetry HUD',
    isUnlocked: (p) => p.capturedSnapshots.length >= 2,
  },
  {
    id: 'master_observer',
    title: 'Master Cosmologist',
    description: 'Explored all 8 cosmic episodes across multi-spectral wavelengths.',
    iconName: 'Award',
    requirementText: 'Observe all 8 cosmic deep space targets',
    isUnlocked: (p) => p.viewedEpisodeIds.length >= 8,
  },
];

export const getDiscoveryProgress = (): DiscoveryProgress => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to read AstroLens progress:', err);
    return DEFAULT_PROGRESS;
  }
};

export const saveDiscoveryProgress = (progress: DiscoveryProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save AstroLens progress:', err);
  }
};

export const recordEpisodeView = (episodeId: string): DiscoveryProgress => {
  const current = getDiscoveryProgress();
  const viewed = current.viewedEpisodeIds.includes(episodeId)
    ? current.viewedEpisodeIds
    : [...current.viewedEpisodeIds, episodeId];

  const updated: DiscoveryProgress = {
    ...current,
    viewedEpisodeIds: viewed,
  };

  // Re-evaluate unlocked badges
  updated.unlockedBadgeIds = OBSERVATION_BADGES.filter((b) => b.isUnlocked(updated)).map((b) => b.id);
  saveDiscoveryProgress(updated);
  return updated;
};

export const recordWavelengthInspection = (
  episodeId: string,
  wavelength: SpectralWavelength
): DiscoveryProgress => {
  const current = getDiscoveryProgress();
  const existingForEpisode = current.analyzedWavelengthsByEpisode[episodeId] || [];
  const updatedBands = existingForEpisode.includes(wavelength)
    ? existingForEpisode
    : [...existingForEpisode, wavelength];

  const updated: DiscoveryProgress = {
    ...current,
    analyzedWavelengthsByEpisode: {
      ...current.analyzedWavelengthsByEpisode,
      [episodeId]: updatedBands,
    },
  };

  updated.unlockedBadgeIds = OBSERVATION_BADGES.filter((b) => b.isUnlocked(updated)).map((b) => b.id);
  saveDiscoveryProgress(updated);
  return updated;
};

export const recordHotspotInspection = (hotspotId: string): DiscoveryProgress => {
  const current = getDiscoveryProgress();
  if (current.inspectedHotspotIds.includes(hotspotId)) return current;

  const updated: DiscoveryProgress = {
    ...current,
    inspectedHotspotIds: [...current.inspectedHotspotIds, hotspotId],
  };

  updated.unlockedBadgeIds = OBSERVATION_BADGES.filter((b) => b.isUnlocked(updated)).map((b) => b.id);
  saveDiscoveryProgress(updated);
  return updated;
};

export const addCapturedSnapshot = (snapshot: CapturedSnapshot): DiscoveryProgress => {
  const current = getDiscoveryProgress();
  const updated: DiscoveryProgress = {
    ...current,
    capturedSnapshots: [snapshot, ...current.capturedSnapshots],
  };

  updated.unlockedBadgeIds = OBSERVATION_BADGES.filter((b) => b.isUnlocked(updated)).map((b) => b.id);
  saveDiscoveryProgress(updated);
  return updated;
};

export const deleteCapturedSnapshot = (snapshotId: string): DiscoveryProgress => {
  const current = getDiscoveryProgress();
  const updated: DiscoveryProgress = {
    ...current,
    capturedSnapshots: current.capturedSnapshots.filter((s) => s.id !== snapshotId),
  };
  saveDiscoveryProgress(updated);
  return updated;
};
