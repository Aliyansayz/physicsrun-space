import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AstroLensEpisode, SpectralWavelength, TargetHotspot } from '../../types/astrolens';
import { SPECTRAL_BANDS } from '../../data/astrolensData';
import { TelemetryHUD } from './TelemetryHUD';
import { ObservationReticle } from './ObservationReticle';
import { astroSonification } from '../../services/astroSonification';
import { addCapturedSnapshot, recordWavelengthInspection, recordHotspotInspection } from '../../services/astrolensStorage';

interface AstroLensViewportProps {
  episode: AstroLensEpisode;
  activeWavelength: SpectralWavelength;
  onChangeWavelength: (wavelength: SpectralWavelength) => void;
  onOpenLogbook: () => void;
}

export const AstroLensViewport: React.FC<AstroLensViewportProps> = ({
  episode,
  activeWavelength,
  onChangeWavelength,
  onOpenLogbook,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [reticleLock, setReticleLock] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<TargetHotspot | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showBlendSlider, setShowBlendSlider] = useState<boolean>(false);
  const [blendOpacity, setBlendOpacity] = useState<number>(1.0); // 1 = 100% active wavelength, 0 = 100% optical
  const [cursorCoords, setCursorCoords] = useState<{ ra: string; dec: string } | null>(null);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Record wavelength exploration into discovery storage
  useEffect(() => {
    recordWavelengthInspection(episode.id, activeWavelength);
  }, [episode.id, activeWavelength]);

  // Handle Hotspot Selection
  const handleSelectHotspot = (hotspot: TargetHotspot | null) => {
    setSelectedHotspot(hotspot);
    if (hotspot) {
      recordHotspotInspection(hotspot.id);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1') onChangeWavelength('optical');
      if (e.key === '2') onChangeWavelength('infrared');
      if (e.key === '3') onChangeWavelength('xray');
      if (e.key === '4') onChangeWavelength('radio');
      if (e.key === '5') onChangeWavelength('ultraviolet');
      if (e.key === '6') onChangeWavelength('composite');

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoomLevel((prev) => Math.min(6.0, prev + 0.3));
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoomLevel((prev) => Math.max(0.6, prev - 0.3));
      }
      if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChangeWavelength]);

  // Zoom helpers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(6.0, Number((prev + 0.3).toFixed(2))));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.6, Number((prev - 0.3).toFixed(2))));
  const handleResetZoom = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setSelectedHotspot(null);
  };

  // Drag Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Show actual target coordinates from episode telemetry
    if (containerRef.current && !cursorCoords) {
      setCursorCoords({
        ra: episode.telemetry.rightAscension,
        dec: episode.telemetry.declination,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomLevel((prev) => {
      const next = prev + zoomDelta;
      return Math.min(6.0, Math.max(0.6, Number(next.toFixed(2))));
    });
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Sync fullscreen state with ESC key exit
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Capture Telemetry-Stamped Snapshot
  const handleCaptureSnapshot = useCallback(() => {
    astroSonification.playShutterSound();
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = episode.imageUrl;

    img.onload = () => {
      // Draw background space darkness
      ctx.fillStyle = '#03050b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply CSS filter simulation to canvas
      const currentBand = SPECTRAL_BANDS[activeWavelength];
      if (currentBand && currentBand.filterCss !== 'none') {
        ctx.filter = currentBand.filterCss;
      }

      // Draw celestial image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      // Draw faint HUD Grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Draw Reticle Center
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 70, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Watermark & Telemetry Block at bottom
      ctx.fillStyle = 'rgba(6, 10, 23, 0.88)';
      ctx.fillRect(40, canvas.height - 110, canvas.width - 80, 80);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.strokeRect(40, canvas.height - 110, canvas.width - 80, 80);

      // Text Telemetry Stamp
      ctx.font = 'bold 15px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`ASTROLENS OBSERVATORY // ${episode.telemetry.designation.toUpperCase()}`, 60, canvas.height - 75);

      ctx.font = '12px monospace';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(
        `WAVELENGTH: ${currentBand.label.toUpperCase()} (${currentBand.telescope}) | RA: ${episode.telemetry.rightAscension} | DEC: ${episode.telemetry.declination} | MAG: ${episode.telemetry.apparentMagnitude}`,
        60,
        canvas.height - 50
      );

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(
        `TIMESTAMP: ${new Date().toISOString()} | FOV ZOOM: ${zoomLevel.toFixed(1)}x | CRYO SENSOR: ${episode.telemetry.sensorCryoTempK}K`,
        60,
        canvas.height - 30
      );

      // Capture snapshot - wrap only the toDataURL/save in try/catch
      let dataUrl: string | null = null;
      try {
        dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      } catch (err) {
        console.error('Snapshot capture failed:', err);
        setSnapshotToast('Snapshot unavailable — CORS policy prevented capture');
        setTimeout(() => setSnapshotToast(null), 3000);
        return;
      }

      // Save to local discovery storage
      const snapshot = {
        id: `snap_${Date.now()}`,
        episodeId: episode.id,
        episodeTitle: episode.title,
        wavelength: activeWavelength,
        timestamp: Date.now(),
        imageUrl: dataUrl,
        reticleCoords: { x: 50, y: 50 },
        zoomLevel,
        notes: `Captured in ${currentBand.label} via ${currentBand.telescope}`,
      };

      addCapturedSnapshot(snapshot);

      setSnapshotToast('Snapshot logged into Observatory Logbook!');
      setTimeout(() => setSnapshotToast(null), 3500);
    };

    // Handle image load errors (e.g., CORS)
    img.onerror = () => {
      console.error('Failed to load episode image for snapshot');
      setSnapshotToast('Snapshot unavailable — failed to load image');
      setTimeout(() => setSnapshotToast(null), 3000);
    };
  }, [episode, activeWavelength, zoomLevel]);

  const activeBand = SPECTRAL_BANDS[activeWavelength];

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-[520px] sm:h-[620px] lg:h-[700px] bg-[#030611] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none cursor-${
        isDragging ? 'grabbing' : 'grab'
      }`}
    >
      {/* Dynamic Starfield Backdrop Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#030611] to-[#010309] pointer-events-none" />

      {/* Primary Zoomable / Pannable Image Layer */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Base Optical Image Layer (Always present for blend comparison) */}
        <img
          src={episode.imageUrl}
          alt={episode.title}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover max-w-none select-none pointer-events-none transition-opacity duration-300"
          style={{
            opacity: activeWavelength === 'optical' ? 1 : 1 - blendOpacity,
          }}
        />

        {/* Filtered Active Spectral Band Image Layer */}
        {activeWavelength !== 'optical' && (
          <img
            src={episode.imageUrl}
            alt={`${episode.title} in ${activeBand.label}`}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover max-w-none select-none pointer-events-none transition-opacity duration-300"
            style={{
              filter: activeBand.filterCss,
              opacity: blendOpacity,
            }}
          />
        )}

        {/* Interactive Observation Reticle & Hotspots Overlay (Scaled with image) */}
        <ObservationReticle
          hotspots={episode.hotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={handleSelectHotspot}
          activeWavelength={activeWavelength}
          zoomLevel={zoomLevel}
          reticleLock={reticleLock}
          cursorCoords={cursorCoords}
        />
      </div>

      {/* Telemetry Heads-Up Display (Fixed in place above zoom/pan layer) */}
      <TelemetryHUD
        telemetry={episode.telemetry}
        activeWavelength={activeWavelength}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        reticleLock={reticleLock}
        onToggleReticleLock={() => setReticleLock(!reticleLock)}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = !isMuted;
          setIsMuted(next);
          astroSonification.setMuted(next);
        }}
        onCaptureSnapshot={handleCaptureSnapshot}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        showBlendSlider={showBlendSlider}
        onToggleBlendSlider={() => setShowBlendSlider(!showBlendSlider)}
        blendOpacity={blendOpacity}
        onChangeBlendOpacity={setBlendOpacity}
      />

      {/* Toast Notification on Snapshot Capture */}
      {snapshotToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-emerald-950/90 border border-emerald-500/70 text-emerald-200 px-4 py-2 rounded-lg text-xs font-mono shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200 z-40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{snapshotToast}</span>
          <button
            onClick={onOpenLogbook}
            className="underline ml-2 text-white font-semibold cursor-pointer"
          >
            View Logbook
          </button>
        </div>
      )}
    </div>
  );
};
