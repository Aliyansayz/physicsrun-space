import React, { useState, useRef } from 'react';
import { TargetHotspot, SpectralWavelength } from '../../types/astrolens';
import { astroSonification } from '../../services/astroSonification';
import { Crosshair, Radio, Zap, Sparkles, Orbit, Compass, Activity } from 'lucide-react';

interface ObservationReticleProps {
  hotspots: TargetHotspot[];
  selectedHotspot: TargetHotspot | null;
  onSelectHotspot: (hotspot: TargetHotspot | null) => void;
  activeWavelength: SpectralWavelength;
  zoomLevel: number;
  reticleLock: boolean;
  cursorCoords: { ra: string; dec: string } | null;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  core: Orbit,
  jet: Zap,
  shockwave: Activity,
  lensed_arc: Compass,
  dust_filament: Sparkles,
  pulsar: Radio,
  starburst: Sparkles,
};

export const ObservationReticle: React.FC<ObservationReticleProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  activeWavelength,
  zoomLevel,
  reticleLock,
  cursorCoords,
}) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<TargetHotspot | null>(null);
  const lastPingRef = useRef(0);

  const activeFocus = selectedHotspot || hoveredHotspot;

  const handleHotspotClick = (hotspot: TargetHotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    astroSonification.playHotspotPing(hotspot.type);
    if (selectedHotspot?.id === hotspot.id) {
      onSelectHotspot(null);
    } else {
      onSelectHotspot(hotspot);
    }
  };

  const handleHotspotMouseEnter = (hotspot: TargetHotspot) => {
    setHoveredHotspot(hotspot);
    const now = Date.now();
    if (now - lastPingRef.current > 2000) {
      lastPingRef.current = now;
      astroSonification.playHotspotPing(hotspot.type);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Reticle Central HUD Overlay (Visual Crosshair) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48 border border-cyan-500/20 rounded-full flex items-center justify-center pointer-events-none">
          {/* Inner rings */}
          <div className="w-24 h-24 border border-cyan-400/25 rounded-full" />
          <div className="w-8 h-8 border border-cyan-300/40 rounded-full" />
          
          {/* Cross lines */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />

          {/* Corner brackets */}
          <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60" />
          <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60" />
          <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60" />
          <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60" />

          {/* Reticle status text */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#05070f]/90 border border-cyan-500/30 rounded text-[9px] font-mono text-cyan-300 whitespace-nowrap">
            {reticleLock ? 'FOV LOCKED // CALIBRATED' : `ZOOM ${zoomLevel.toFixed(1)}x // RETICLE FREE`}
          </div>

          {/* Degree ticks */}
          <span className="absolute top-1 text-[8px] font-mono text-cyan-400/60">000°</span>
          <span className="absolute bottom-1 text-[8px] font-mono text-cyan-400/60">180°</span>
          <span className="absolute left-1 text-[8px] font-mono text-cyan-400/60">270°</span>
          <span className="absolute right-1 text-[8px] font-mono text-cyan-400/60">090°</span>
        </div>
      </div>

      {/* Interactive Celestial Hotspots */}
      {hotspots.map((hotspot) => {
        const isSelected = selectedHotspot?.id === hotspot.id;
        const isHovered = hoveredHotspot?.id === hotspot.id;
        const isMatchedBand = hotspot.spectralPeak === activeWavelength;
        const Icon = TYPE_ICONS[hotspot.type] || Crosshair;

        return (
          <div
            key={hotspot.id}
            style={{ left: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
          >
            {/* Hotspot Target Marker */}
            <button
              onClick={(e) => handleHotspotClick(hotspot, e)}
              onMouseEnter={() => handleHotspotMouseEnter(hotspot)}
              onMouseLeave={() => setHoveredHotspot(null)}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? 'bg-cyan-500/40 border-2 border-cyan-300 ring-4 ring-cyan-400/30 scale-125'
                  : isMatchedBand
                  ? 'bg-amber-500/20 border border-amber-400/90 hover:scale-115'
                  : 'bg-slate-900/60 border border-slate-400/50 hover:border-cyan-400 hover:scale-110'
              }`}
              title={hotspot.label}
              aria-label={hotspot.label}
            >
              {/* Radar pulse ping on active band */}
              {isMatchedBand && (
                <span className="absolute inset-0 rounded-full border border-amber-400/80 animate-ping opacity-75 pointer-events-none" />
              )}

              <Icon
                className={`w-3.5 h-3.5 transition-colors ${
                  isSelected
                    ? 'text-white'
                    : isMatchedBand
                    ? 'text-amber-300'
                    : 'text-slate-200 group-hover:text-cyan-300'
                }`}
              />
            </button>

            {/* Hotspot Callout Tooltip / Telemetry Bubble */}
            {(isSelected || isHovered) && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-10 w-64 sm:w-72 bg-[#060a17]/95 backdrop-blur-xl border border-cyan-400/60 rounded-lg p-3 shadow-2xl shadow-cyan-950/60 z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 text-left"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                      {hotspot.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    Peak: {hotspot.spectralPeak}
                  </span>
                </div>

                <div className="text-xs font-semibold text-white mt-1.5">
                  {hotspot.label}
                </div>

                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  {hotspot.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[9px]">ENERGY FLUX</span>
                    <span className="text-cyan-300 font-medium">{hotspot.energyFlux}</span>
                  </div>
                  {hotspot.radialVelocityKmS && (
                    <div>
                      <span className="text-slate-400 block text-[9px]">RADIAL VELOCITY</span>
                      <span className="text-amber-300 font-medium">{hotspot.radialVelocityKmS} km/s</span>
                    </div>
                  )}
                </div>

                {/* Micro pointer tip */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#060a17] border-r border-b border-cyan-400/60 rotate-45" />
              </div>
            )}
          </div>
        );
      })}

      {/* Real-time Dynamic Cursor Tracking Telemetry */}
      {cursorCoords && !activeFocus && (
        <div className="absolute bottom-4 right-4 bg-[#05070e]/85 backdrop-blur-md border border-slate-800/80 rounded px-2.5 py-1 text-[10px] font-mono text-slate-300 flex items-center space-x-3 pointer-events-none">
          <div><span className="text-slate-400">RA:</span> {cursorCoords.ra}</div>
          <div><span className="text-slate-400">DEC:</span> {cursorCoords.dec}</div>
        </div>
      )}
    </div>
  );
};
