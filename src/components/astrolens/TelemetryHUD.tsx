import React from 'react';
import { AstroTelemetry, SpectralWavelength } from '../../types/astrolens';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  Sliders,
} from 'lucide-react';

interface TelemetryHUDProps {
  telemetry: AstroTelemetry;
  activeWavelength: SpectralWavelength;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  reticleLock: boolean;
  onToggleReticleLock: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onCaptureSnapshot: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  showBlendSlider: boolean;
  onToggleBlendSlider: () => void;
  blendOpacity: number;
  onChangeBlendOpacity: (val: number) => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  telemetry,
  activeWavelength,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  reticleLock,
  onToggleReticleLock,
  isMuted,
  onToggleMute,
  onCaptureSnapshot,
  isFullscreen,
  onToggleFullscreen,
  showBlendSlider,
  onToggleBlendSlider,
  blendOpacity,
  onChangeBlendOpacity,
}) => {
  return (
    <>
      {/* Top Glassmorphic Telemetry HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
        {/* Left Telemetry Group */}
        <div className="flex items-center space-x-2 bg-[#060a17]/90 backdrop-blur-md border border-slate-800/90 rounded-lg px-3 py-2 pointer-events-auto shadow-lg shadow-black/40">
          <div className="flex items-center space-x-2 border-r border-slate-800 pr-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono text-slate-400 leading-none">TARGET DESIGNATION</div>
              <div className="text-xs font-mono font-semibold text-white mt-0.5">{telemetry.designation}</div>
            </div>
          </div>

          <div className="hidden sm:block border-r border-slate-800 pr-3">
            <div className="text-[9px] font-mono text-slate-400 leading-none">EQUATORIAL COORDS</div>
            <div className="text-[11px] font-mono text-cyan-300 mt-0.5">
              RA {telemetry.rightAscension} / DEC {telemetry.declination}
            </div>
          </div>

          <div className="hidden md:block border-r border-slate-800 pr-3">
            <div className="text-[9px] font-mono text-slate-400 leading-none">DISTANCE & REDSHIFT</div>
            <div className="text-[11px] font-mono text-white mt-0.5">
              {telemetry.distanceLightYears} <span className="text-amber-400 font-semibold">(z = {telemetry.redshiftZ})</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="text-[9px] font-mono text-slate-400 leading-none">CONSTELLATION</div>
            <div className="text-[11px] font-mono text-slate-200 mt-0.5">{telemetry.constellation}</div>
          </div>
        </div>

        {/* Right Viewport Controls Toolbar */}
        <div className="flex items-center space-x-1.5 bg-[#060a17]/90 backdrop-blur-md border border-slate-800/90 rounded-lg p-1.5 pointer-events-auto shadow-lg shadow-black/40">
          <button
            onClick={onToggleBlendSlider}
            title="Toggle Visible vs Spectral Blend Slider"
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              showBlendSlider ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleReticleLock}
            title={reticleLock ? 'Unlock Crosshair' : 'Lock Crosshair to Center'}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              reticleLock ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {reticleLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Enable Cosmic Sonification Audio' : 'Mute Cosmic Audio'}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          <button
            onClick={onZoomOut}
            title="Zoom Out (-)"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono text-cyan-300 px-1 select-none">
            {zoomLevel.toFixed(1)}x
          </span>

          <button
            onClick={onZoomIn}
            title="Zoom In (+)"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetZoom}
            title="Reset View (1.0x)"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          {/* Capture Telemetry Snapshot */}
          <button
            onClick={onCaptureSnapshot}
            title="Capture Telemetry-Stamped Snapshot"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 transition-colors cursor-pointer text-xs font-medium"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono hidden sm:inline">SNAPSHOT</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Observatory'}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Blend Slider Overlay (If enabled) */}
      {showBlendSlider && activeWavelength !== 'optical' && (
        <div className="absolute top-16 right-3 bg-[#060a17]/95 backdrop-blur-md border border-cyan-500/40 rounded-lg p-2.5 z-20 pointer-events-auto flex items-center space-x-3 shadow-xl">
          <span className="text-[10px] font-mono text-slate-300">OPTICAL</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={blendOpacity}
            onChange={(e) => onChangeBlendOpacity(parseFloat(e.target.value))}
            className="w-28 accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-cyan-300 uppercase">{activeWavelength}</span>
          <span className="text-[9px] font-mono text-slate-400">({Math.round(blendOpacity * 100)}%)</span>
        </div>
      )}

      {/* Bottom Telemetry Status Strip */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono pointer-events-none z-20">
        {/* Sensor & Cryo Diagnostics */}
        <div className="flex items-center space-x-3 bg-[#060a17]/90 backdrop-blur-md border border-slate-800/90 rounded-lg px-3 py-1.5 pointer-events-auto shadow-md">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">CRYO SENSOR:</span>
            <span className="text-cyan-300 font-semibold">{telemetry.sensorCryoTempK.toFixed(1)} K</span>
            <span className="text-slate-500">(-{(273.15 - telemetry.sensorCryoTempK).toFixed(1)}°C)</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">SNR:</span>
            <span className="text-emerald-400 font-semibold">{telemetry.signalToNoiseRatio} dB</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5">
            <div className="h-3 w-[1px] bg-slate-800" />
            <span className="text-slate-400">EXP:</span>
            <span className="text-white">{telemetry.exposureTimeHours}h</span>
          </div>
          <div className="hidden md:flex items-center space-x-1.5">
            <div className="h-3 w-[1px] bg-slate-800" />
            <span className="text-slate-400">RES:</span>
            <span className="text-slate-300">{telemetry.angularScaleArcsecPerPixel}″/px</span>
          </div>
        </div>

        {/* Status indicator badge */}
        <div className="bg-[#060a17]/90 backdrop-blur-md border border-slate-800/90 rounded-lg px-2.5 py-1.5 pointer-events-auto shadow-md flex items-center space-x-1.5 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] uppercase font-mono tracking-wider">
            FILTER: {activeWavelength}
          </span>
        </div>
      </div>
    </>
  );
};
