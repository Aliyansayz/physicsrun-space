import React from 'react';
import { DiscoveryProgress } from '../../types/astrolens';
import { OBSERVATION_BADGES, deleteCapturedSnapshot } from '../../services/astrolensStorage';
import { ASTROLENS_EPISODES } from '../../data/astrolensData';
import {
  X,
  Award,
  Sparkles,
  Camera,
  Layers,
  Compass,
  Zap,
  Download,
  Trash2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ObservatoryLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: DiscoveryProgress;
  onProgressUpdated: (updated: DiscoveryProgress) => void;
}

const BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Layers,
  Compass,
  Zap,
  Camera,
  Award,
};

export const ObservatoryLogbookModal: React.FC<ObservatoryLogbookModalProps> = ({
  isOpen,
  onClose,
  progress,
  onProgressUpdated,
}) => {
  if (!isOpen) return null;

  const totalEpisodes = ASTROLENS_EPISODES.length;
  const mappedCount = progress.viewedEpisodeIds.length;
  const mappedPercent = Math.round((mappedCount / totalEpisodes) * 100);

  // Total wavelengths analyzed
  const totalWavelengthScans = Object.values(progress.analyzedWavelengthsByEpisode).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteCapturedSnapshot(id);
    onProgressUpdated(updated);
  };

  const handleDownloadSnapshot = (dataUrl: string, title: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `AstroLens_${title.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#060a17] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#040711]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Observatory Logbook & Celestial Atlas
              </h2>
              <p className="text-xs text-slate-400">
                Astronomical field journal, discovery achievements, and captured telemetry frames
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Progress Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Mapped Cosmos */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Cosmos Surveyed</div>
              <div className="text-2xl font-mono font-semibold text-cyan-300 mt-1">
                {mappedPercent}%
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${mappedPercent}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1.5">
                {mappedCount} of {totalEpisodes} Deep-Sky Targets
              </div>
            </div>

            {/* Spectral Scans */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Spectral Calibrations</div>
              <div className="text-2xl font-mono font-semibold text-amber-300 mt-1">
                {totalWavelengthScans}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalWavelengthScans / (totalEpisodes * 5)) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1.5">
                Across Optical, IR, X-Ray, Radio & UV
              </div>
            </div>

            {/* Captured Snapshots */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Telescope Snapshots</div>
              <div className="text-2xl font-mono font-semibold text-purple-300 mt-1">
                {progress.capturedSnapshots.length}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, progress.capturedSnapshots.length * 20)}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1.5">
                Saved with Telemetry HUD Stamps
              </div>
            </div>
          </div>

          {/* Observation Badges Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Observational Honors & Milestones</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {OBSERVATION_BADGES.map((badge) => {
                const isUnlocked = badge.isUnlocked(progress);
                const Icon = BADGE_ICONS[badge.iconName] || Award;

                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border flex items-start space-x-3 transition-colors ${
                      isUnlocked
                        ? 'bg-slate-900/80 border-cyan-500/50 text-white'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isUnlocked
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800/50 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Icon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold truncate text-white">
                          {badge.title}
                        </span>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {badge.description}
                      </p>
                      <span className="text-[9px] font-mono text-cyan-400/80 block mt-1">
                        {badge.requirementText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Captured Telemetry Snapshots Gallery */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Logged Telemetry Frames</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {progress.capturedSnapshots.length} Stored
              </span>
            </div>

            {progress.capturedSnapshots.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80">
                <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No snapshots captured yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click the <strong>SNAPSHOT</strong> button inside the observatory viewport to log a telemetry-stamped frame!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {progress.capturedSnapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={snap.imageUrl}
                        alt={snap.episodeTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-cyan-300 uppercase">
                        {snap.wavelength}
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDownloadSnapshot(snap.imageUrl, snap.episodeTitle)}
                          className="p-1 rounded bg-black/80 hover:bg-cyan-600 text-white transition-colors cursor-pointer"
                          title="Download Image"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSnapshot(snap.id, e)}
                          className="p-1 rounded bg-black/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          title="Delete Frame"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white truncate">
                          {snap.episodeTitle}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                          {snap.notes || `Zoom ${snap.zoomLevel.toFixed(1)}x`}
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 mt-2">
                        {new Date(snap.timestamp).toLocaleDateString()} {new Date(snap.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#040711] flex items-center justify-between text-xs text-slate-400">
          <span>Synced locally to your observatory browser storage.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
