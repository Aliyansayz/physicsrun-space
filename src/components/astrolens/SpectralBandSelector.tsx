import React from 'react';
import { SpectralWavelength, SpectralBandInfo } from '../../types/astrolens';
import { SPECTRAL_BANDS } from '../../data/astrolensData';
import { astroSonification } from '../../services/astroSonification';
import { Eye, Flame, Zap, Radio, Sparkles, Layers } from 'lucide-react';

interface SpectralBandSelectorProps {
  currentWavelength: SpectralWavelength;
  onSelectWavelength: (wavelength: SpectralWavelength) => void;
  analyzedWavelengths?: SpectralWavelength[];
  baseToneHz?: number;
}

const BAND_ICONS: Record<SpectralWavelength, React.ComponentType<{ className?: string }>> = {
  optical: Eye,
  infrared: Flame,
  xray: Zap,
  radio: Radio,
  ultraviolet: Sparkles,
  composite: Layers,
};

export const SpectralBandSelector: React.FC<SpectralBandSelectorProps> = ({
  currentWavelength,
  onSelectWavelength,
  analyzedWavelengths = [],
  baseToneHz = 220,
}) => {
  const bands = Object.values(SPECTRAL_BANDS) as SpectralBandInfo[];

  const handleSelect = (bandId: SpectralWavelength) => {
    astroSonification.playWavelengthShiftTone(bandId, baseToneHz);
    onSelectWavelength(bandId);
  };

  return (
    <div className="w-full bg-[#070b16]/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-2 sm:p-2.5 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800/50 mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-300">
            Multi-Spectral Electromagnetic Filter Matrix
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          Hotkeys [ 1 – 6 ]
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
        {bands.map((band, idx) => {
          const isSelected = currentWavelength === band.id;
          const isAnalyzed = analyzedWavelengths.includes(band.id);
          const Icon = BAND_ICONS[band.id];

          return (
            <button
              key={band.id}
              onClick={() => handleSelect(band.id)}
              className={`relative flex flex-col items-start p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-400/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                  : 'bg-slate-950/50 border-slate-800/60 hover:bg-slate-900/50 hover:border-slate-700/80 text-slate-300'
              }`}
            >
              {/* Top Row: Icon + Index + Analyzed Indicator */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className="p-1 rounded flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isSelected ? `${band.accentColor}20` : 'rgba(30, 41, 59, 0.5)',
                    color: band.accentColor,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center space-x-1">
                  {isAnalyzed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Analyzed in logbook" />
                  )}
                  <span className="text-[10px] font-mono text-slate-400">
                    {idx + 1}
                  </span>
                </div>
              </div>

              {/* Title & Telescope */}
              <div className="w-full">
                <div className="text-xs font-medium tracking-tight text-white group-hover:text-cyan-200 truncate">
                  {band.label}
                </div>
                <div className="text-[10px] font-mono text-cyan-400/90 truncate mt-0.5">
                  {band.telescope}
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-1 truncate">
                  {band.wavelengthRange}
                </div>
              </div>

              {/* Active bottom accent bar */}
              {isSelected && (
                <div
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ backgroundColor: band.accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
