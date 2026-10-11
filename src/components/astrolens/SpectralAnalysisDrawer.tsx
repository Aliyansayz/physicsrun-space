import React, { useState } from 'react';
import { AstroLensEpisode, SpectralWavelength } from '../../types/astrolens';
import { SPECTRAL_BANDS } from '../../data/astrolensData';
import { astroSonification } from '../../services/astroSonification';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Compass,
  Radio,
  Sparkles,
  Info,
  Activity,
  Layers,
} from 'lucide-react';

interface SpectralAnalysisDrawerProps {
  episode: AstroLensEpisode;
  activeWavelength: SpectralWavelength;
  onNavigateToChapter?: (chapterId: string) => void;
  onNavigateToStarMap?: () => void;
}

export const SpectralAnalysisDrawer: React.FC<SpectralAnalysisDrawerProps> = ({
  episode,
  activeWavelength,
  onNavigateToChapter,
  onNavigateToStarMap,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const band = SPECTRAL_BANDS[activeWavelength];
  const observation = episode.spectralObservations[activeWavelength];

  const handleTestSonificationTone = () => {
    astroSonification.playWavelengthShiftTone(activeWavelength, observation.sonificationToneHz);
  };

  return (
    <div className="w-full bg-[#060a17]/95 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/40 text-left transition-all">
      {/* Header bar with toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${band.accentColor}20`, color: band.accentColor }}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white">Astrophysical Analysis & Spectral Diagnostics</span>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase"
                style={{
                  borderColor: `${band.accentColor}60`,
                  backgroundColor: `${band.accentColor}15`,
                  color: band.accentColor,
                }}
              >
                {band.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instrument: {band.telescope} • Bandwidth: {band.wavelengthRange} ({band.photonEnergy})
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse Analysis' : 'Expand Analysis'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="mt-4 space-y-5 animate-in fade-in duration-200">
          {/* Electromagnetic Spectrum Visualizer Scale */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
              <span>ELECTROMAGNETIC SPECTRUM SCALE</span>
              <span className="text-cyan-300">ACTIVE: {band.id.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-6 gap-1 h-3 rounded-md overflow-hidden bg-slate-900">
              <div
                className={`transition-all rounded-sm ${
                  activeWavelength === 'radio' ? 'bg-amber-400 shadow-md shadow-amber-400/50' : 'bg-amber-900/40'
                }`}
                title="Radio / Sub-mm"
              />
              <div
                className={`transition-all rounded-sm ${
                  activeWavelength === 'infrared' ? 'bg-orange-400 shadow-md shadow-orange-400/50' : 'bg-orange-900/40'
                }`}
                title="Infrared"
              />
              <div
                className={`transition-all rounded-sm ${
                  activeWavelength === 'optical' ? 'bg-cyan-400 shadow-md shadow-cyan-400/50' : 'bg-cyan-900/40'
                }`}
                title="Optical / Visible"
              />
              <div
                className={`transition-all rounded-sm ${
                  activeWavelength === 'ultraviolet' ? 'bg-sky-400 shadow-md shadow-sky-400/50' : 'bg-sky-900/40'
                }`}
                title="Ultraviolet"
              />
              <div
                className={`transition-all rounded-sm ${
                  activeWavelength === 'xray' ? 'bg-purple-500 shadow-md shadow-purple-500/50' : 'bg-purple-900/40'
                }`}
                title="X-Ray"
              />
              <div
                className={`transition-all rounded-sm ${
                  activeWavelength === 'composite' ? 'bg-pink-500 shadow-md shadow-pink-500/50' : 'bg-pink-900/40'
                }`}
                title="Multi-Mission Composite"
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1.5 px-0.5">
              <span>Radio (Long $\lambda$)</span>
              <span>Infrared</span>
              <span>Visible</span>
              <span>UV</span>
              <span>X-Ray (High Energy)</span>
              <span>Composite</span>
            </div>
          </div>

          {/* 2-Column Physical Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: What this wavelength reveals */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Observational Revelations</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {observation.summary}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                  Distinctive Spectral Features Resolved:
                </span>
                <ul className="space-y-1">
                  {observation.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Physics Emissions & Acoustic Sonification */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Primary Emission Lines & Astrophysics</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {band.reveals}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    Diagnostic Spectral Markers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {band.primaryEmissions.map((line, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cosmic Acoustic Sonification Synthesizer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <div>
                    <span className="text-xs font-medium text-white block">Cosmic Radio Sonification</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Frequency: {observation.sonificationToneHz} Hz Harmonic
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleTestSonificationTone}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
                >
                  Synthesize Tone
                </button>
              </div>
            </div>
          </div>

          {/* Cross-linking Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Scientific Significance: {episode.scientificSignificance}</span>
            </div>

            <div className="flex items-center space-x-2">
              {episode.associatedChapterId && onNavigateToChapter && (
                <button
                  onClick={() => onNavigateToChapter(episode.associatedChapterId!)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Chapter in Ebook</span>
                </button>
              )}

              {onNavigateToStarMap && (
                <button
                  onClick={onNavigateToStarMap}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Locate in 3D Star Map</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
