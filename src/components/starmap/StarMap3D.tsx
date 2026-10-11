import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ConstellationData, DeepSkyObject, StarData, SpectralClass } from '../../types';
import { constellationsData, starsData, deepSkyObjectsData } from '../../data/starMapData';
import { narrationAudio } from '../../services/narrationAudio';
import { StellarThermometer } from './StellarThermometer';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Layers, 
  Eye, 
  RotateCw,
  BookOpen,
  Compass
} from 'lucide-react';

interface StarMap3DProps {
  onSelectChapter?: (chapterId: string) => void;
  initialConstellationId?: string;
  initialStarId?: string;
  initialDsoId?: string;
}

export const StarMap3D: React.FC<StarMap3DProps> = ({ 
  onSelectChapter,
  initialConstellationId,
  initialStarId,
  initialDsoId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationData>(() => {
    if (initialConstellationId) {
      const found = constellationsData.find(c => c.id === initialConstellationId);
      if (found) return found;
    }
    return constellationsData[0];
  });
  const [selectedDSO, setSelectedDSO] = useState<DeepSkyObject | null>(() => {
    if (initialDsoId) {
      return deepSkyObjectsData.find(d => d.id === initialDsoId) || null;
    }
    return null;
  });
  const [selectedStar, setSelectedStar] = useState<StarData | null>(() => {
    if (initialStarId) {
      return starsData.find(s => s.id === initialStarId) || null;
    }
    return null;
  });

  // Map Filter Toggles
  const [showConstellationLines, setShowConstellationLines] = useState(true);
  const [showSpectralColors, setShowSpectralColors] = useState(true);
  const [showDSOs, setShowDSOs] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [autoRotateSky, setAutoRotateSky] = useState(false);
  const [observerMode, setObserverMode] = useState<'backyard' | 'orbital'>('backyard');
  const [selectedSpectralFilter, setSelectedSpectralFilter] = useState<SpectralClass | 'ALL'>('ALL');

  // Audio Narration State
  const [isNarrating, setIsNarrating] = useState(false);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const celestialSphereRef = useRef<THREE.Group | null>(null);

  // Drag controls
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const dragDistanceRef = useRef(0);

  // Sync initial selection props
  useEffect(() => {
    if (initialConstellationId) {
      const c = constellationsData.find(item => item.id === initialConstellationId);
      if (c) setSelectedConstellation(c);
    }
  }, [initialConstellationId]);

  useEffect(() => {
    if (initialStarId) {
      const s = starsData.find(item => item.id === initialStarId);
      if (s) setSelectedStar(s);
    }
  }, [initialStarId]);

  useEffect(() => {
    if (initialDsoId) {
      const dso = deepSkyObjectsData.find(item => item.id === initialDsoId);
      if (dso) setSelectedDSO(dso);
    }
  }, [initialDsoId]);

  // Listen to narration updates
  useEffect(() => {
    const unsubscribe = narrationAudio.subscribe(state => {
      setIsNarrating(state.isSpeaking && !state.isPaused);
    });
    return () => unsubscribe();
  }, []);

  // Global mouseup/touchend to prevent sticky dragging
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, []);

  const coordsToVector3 = (raHours: number, decDegrees: number, radius = 50): THREE.Vector3 => {
    const phi = ((90 - decDegrees) * Math.PI) / 180;
    const theta = ((raHours * 15) * Math.PI) / 180;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  const getSpectralColor = (spectral: string): number => {
    switch (spectral) {
      case 'O': return 0x93c5fd;
      case 'B': return 0xbae6fd;
      case 'A': return 0xffffff;
      case 'F': return 0xfef08a;
      case 'G': return 0xfde047;
      case 'K': return 0xfb923c;
      case 'M': return 0xf87171;
      default: return 0xffffff;
    }
  };

  // Initialize Three.js Celestial Sphere
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    if (observerMode === 'backyard') {
      camera.position.set(0, 0, 0.1); // Looking outward from center of dome
    } else {
      camera.position.set(0, 20, 85); // Looking inward from outer space
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    const celestialSphere = new THREE.Group();
    scene.add(celestialSphere);
    celestialSphereRef.current = celestialSphere;

    // 1. Generate 1,500 background stars
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 48 + Math.random() * 4;

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const rnd = Math.random();
      if (rnd > 0.85) {
        starColors[i * 3] = 0.6;
        starColors[i * 3 + 1] = 0.8;
        starColors[i * 3 + 2] = 1.0;
      } else if (rnd > 0.7) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.8;
        starColors[i * 3 + 2] = 0.6;
      } else {
        const whiteBrightness = 0.4 + Math.random() * 0.6;
        starColors[i * 3] = whiteBrightness;
        starColors[i * 3 + 1] = whiteBrightness;
        starColors[i * 3 + 2] = whiteBrightness;
      }
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const backgroundStars = new THREE.Points(starGeom, starMat);
    celestialSphere.add(backgroundStars);

    // 2. Add Named Catalog Stars with interactive meshes
    starsData.forEach(star => {
      const isFilteredOut = selectedSpectralFilter !== 'ALL' && star.spectralClass !== selectedSpectralFilter;
      const pos = coordsToVector3(star.coordinates.raHours, star.coordinates.decDegrees, 48);
      const colorVal = showSpectralColors ? getSpectralColor(star.spectralClass) : 0xffffff;

      const starSphereGeom = new THREE.SphereGeometry(isFilteredOut ? 0.15 : 0.4, 12, 12);
      const starSphereMat = new THREE.MeshBasicMaterial({ 
        color: colorVal,
        transparent: true,
        opacity: isFilteredOut ? 0.2 : 1.0 
      });
      const mesh = new THREE.Mesh(starSphereGeom, starSphereMat);
      mesh.position.copy(pos);
      mesh.userData = { starData: star };
      celestialSphere.add(mesh);

      if (!isFilteredOut) {
        const haloGeom = new THREE.RingGeometry(0.45, 0.8, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: colorVal,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.28,
        });
        const haloMesh = new THREE.Mesh(haloGeom, haloMat);
        haloMesh.position.copy(pos);
        haloMesh.lookAt(0, 0, 0);
        celestialSphere.add(haloMesh);
      }
    });

    // 3. Add Constellation Wireframe Lines
    if (showConstellationLines) {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
      });

      const activeLineMaterial = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.9,
      });

      constellationsData.forEach(constellation => {
        const isCurrent = constellation.id === selectedConstellation.id;
        const mat = isCurrent ? activeLineMaterial : lineMaterial;

        constellation.connections.forEach(([i1, i2]) => {
          const star1Name = constellation.mainStars[i1];
          const star2Name = constellation.mainStars[i2];
          const s1 = starsData.find(s => s.name === star1Name);
          const s2 = starsData.find(s => s.name === star2Name);

          if (s1 && s2) {
            const p1 = coordsToVector3(s1.coordinates.raHours, s1.coordinates.decDegrees, 47.9);
            const p2 = coordsToVector3(s2.coordinates.raHours, s2.coordinates.decDegrees, 47.9);
            const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
            const line = new THREE.Line(lineGeom, mat);
            celestialSphere.add(line);
          }
        });
      });
    }

    // 4. Add Deep Sky Object Markers
    if (showDSOs) {
      deepSkyObjectsData.forEach(dso => {
        const pos = coordsToVector3(dso.coordinates.raHours, dso.coordinates.decDegrees, 47.5);
        const dsoGeom = new THREE.RingGeometry(0.5, 0.9, 16);
        const dsoColor = dso.type === 'Black Hole' ? 0xf59e0b : (dso.type === 'Nebula' ? 0xec4899 : 0x06b6d4);
        const dsoMat = new THREE.MeshBasicMaterial({
          color: dsoColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const dsoMesh = new THREE.Mesh(dsoGeom, dsoMat);
        dsoMesh.position.copy(pos);
        dsoMesh.lookAt(0, 0, 0);
        dsoMesh.userData = { dsoData: dso };
        celestialSphere.add(dsoMesh);
      });
    }

    // 5. Add Celestial Coordinate Grid rings
    if (showGrid) {
      const equatorGeom = new THREE.RingGeometry(47.8, 47.9, 64);
      const equatorMat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const equator = new THREE.Mesh(equatorGeom, equatorMat);
      equator.rotation.x = Math.PI / 2;
      celestialSphere.add(equator);

      const eclipticGeom = new THREE.RingGeometry(47.7, 47.8, 64);
      const eclipticMat = new THREE.MeshBasicMaterial({
        color: 0xca8a04,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const ecliptic = new THREE.Mesh(eclipticGeom, eclipticMat);
      ecliptic.rotation.x = Math.PI / 2;
      ecliptic.rotation.z = (23.44 * Math.PI) / 180;
      celestialSphere.add(ecliptic);
    }

    // 6. Camera Look Orientation
    const targetStarName = selectedConstellation.mainStars[0];
    const targetStar = starsData.find(s => s.name === targetStarName);
    if (targetStar) {
      const lookPos = coordsToVector3(targetStar.coordinates.raHours, targetStar.coordinates.decDegrees, 48);
      camera.lookAt(lookPos);
    } else {
      camera.lookAt(0, 0, 50);
    }

    // 7. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotateSky && celestialSphereRef.current) {
        celestialSphereRef.current.rotation.y += 0.0008;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch {}
      }
    };
  }, [selectedConstellation, showConstellationLines, showSpectralColors, showDSOs, showGrid, autoRotateSky, observerMode, selectedSpectralFilter]);

  // Click handler on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragDistanceRef.current > 6) return;
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    if (celestialSphereRef.current) {
      const intersects = raycaster.intersectObjects(celestialSphereRef.current.children, true);
      for (const hit of intersects) {
        if (hit.object.userData?.starData) {
          setSelectedStar(hit.object.userData.starData);
          setSelectedDSO(null);
          return;
        }
        if (hit.object.userData?.dsoData) {
          setSelectedDSO(hit.object.userData.dsoData);
          setSelectedStar(null);
          return;
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    dragDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !cameraRef.current) return;
    const dx = e.clientX - prevMousePosRef.current.x;
    const dy = e.clientY - prevMousePosRef.current.y;
    dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);

    const rotSpeed = 0.003;
    cameraRef.current.rotation.y += dx * rotSpeed;
    cameraRef.current.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, cameraRef.current.rotation.x + dy * rotSpeed));

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragDistanceRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !cameraRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - prevMousePosRef.current.x;
    const dy = e.touches[0].clientY - prevMousePosRef.current.y;
    dragDistanceRef.current += Math.abs(dx) + Math.abs(dy);

    const rotSpeed = 0.003;
    cameraRef.current.rotation.y += dx * rotSpeed;
    cameraRef.current.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, cameraRef.current.rotation.x + dy * rotSpeed));

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.fov = Math.max(25, Math.min(85, cameraRef.current.fov + e.deltaY * 0.05));
    cameraRef.current.updateProjectionMatrix();
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      narrationAudio.stop();
    } else {
      narrationAudio.speak(selectedConstellation.audioNarrationScript);
    }
  };

  return (
    <div className="relative flex flex-col bg-[#050814] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl min-h-[760px]">
      
      {/* Top Star Map Controls Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#080d1d]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Celestial Star Map & Atlas
              <span className="text-xs font-mono font-normal text-cyan-400">Sphere Coordinates J2000.0</span>
            </h2>
            <p className="text-xs text-slate-400 font-light">Interactive 3D dome of 88 IAU constellations and deep space objects</p>
          </div>
        </div>

        {/* Perspective & Filters */}
        <div className="flex items-center gap-2">
          {/* Observer Perspective Mode */}
          <button
            onClick={() => setObserverMode(observerMode === 'backyard' ? 'orbital' : 'backyard')}
            title="Toggle Perspective: Backyard Observer vs Orbital Globe"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-cyan-800/80 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{observerMode === 'backyard' ? 'Backyard View' : 'Orbital Globe'}</span>
          </button>

          <button
            onClick={() => setShowConstellationLines(!showConstellationLines)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showConstellationLines ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Constellation Lines
          </button>

          <button
            onClick={() => setShowSpectralColors(!showSpectralColors)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showSpectralColors ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Spectral Colors
          </button>

          <button
            onClick={() => setShowDSOs(!showDSOs)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showDSOs ? 'bg-cyan-950/70 border-cyan-800 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400'
            }`}
          >
            Deep Sky Objects
          </button>

          <button
            onClick={() => setAutoRotateSky(!autoRotateSky)}
            title="Auto-Rotate Celestial Dome"
            className={`p-2 rounded-lg border text-xs transition-colors ${
              autoRotateSky ? 'border-cyan-800 text-cyan-400 bg-cyan-950/50' : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        className="relative flex-1 w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing select-none"
      >
        {/* Helper instructions */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none text-[11px] font-mono text-slate-400/80 flex items-center gap-2 bg-[#080d1e]/70 px-3 py-1.5 rounded-md border border-slate-800/60 backdrop-blur-sm">
          <span>DRAG SKY TO LOOK AROUND</span>
          <span aria-hidden="true">·</span>
          <span>CLICK STARS & CLUSTERS TO INSPECT</span>
        </div>

        {/* Selected Constellation Dossier floating card */}
        <div className="absolute top-4 right-4 z-10 max-w-sm bg-[#080d1e]/90 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                {selectedConstellation.hemisphere} Hemisphere · {selectedConstellation.season} Sky
              </span>
              <h3 className="text-xl font-light text-slate-100 tracking-tight">
                {selectedConstellation.name}
              </h3>
              <p className="text-xs text-slate-400 font-light">
                {selectedConstellation.latinName} — "{selectedConstellation.englishMeaning}"
              </p>
            </div>

            {/* Audio Narration Button */}
            <button
              onClick={handleToggleNarration}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                isNarrating
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isNarrating ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isNarrating ? 'STOP' : 'NARRATE'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 font-light leading-relaxed mb-4 line-clamp-4">
            {selectedConstellation.lore}
          </p>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Astrophysics Observation
            </span>
            <p className="text-xs text-cyan-200/90 font-light leading-relaxed">
              {selectedConstellation.astrophysicsNote}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
            <span className="font-mono text-slate-400 text-[11px]">
              Principal Stars: {selectedConstellation.mainStars.join(', ')}
            </span>
          </div>
        </div>

        {/* Selected Star Details Card */}
        {selectedStar && (
          <div className="absolute bottom-6 left-6 z-10 max-w-sm bg-[#0a1024]/95 border border-cyan-800/80 rounded-xl p-4 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                Spectral Class {selectedStar.spectralClass} · {selectedStar.bayerDesignation}
              </span>
              <button
                onClick={() => setSelectedStar(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
            <h4 className="text-lg font-medium text-slate-100">{selectedStar.name}</h4>
            <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Distance</span>
                <span className="text-slate-100">{selectedStar.distanceLightYears} LY</span>
              </div>
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Surface Temp</span>
                <span className="text-slate-100">{selectedStar.temperatureKelvin.toLocaleString()} K</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {selectedStar.description}
            </p>
          </div>
        )}

        {/* Selected Deep Sky Object Card */}
        {selectedDSO && (
          <div className="absolute bottom-6 left-6 z-10 max-w-sm bg-[#0a1024]/95 border border-cyan-800/80 rounded-xl p-4 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                Deep Sky Object · {selectedDSO.type.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedDSO(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
            <h4 className="text-lg font-medium text-slate-100">{selectedDSO.name}</h4>
            
            {/* High-Resolution DSO Image Preview */}
            {selectedDSO.imageUrl && (
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden my-2.5 border border-slate-800 bg-black/60 relative">
                <img
                  src={selectedDSO.imageUrl}
                  alt={selectedDSO.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                  ASTROPHOTOGRAPHY
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 my-2.5 text-xs font-mono">
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Distance</span>
                <span className="text-slate-100">{selectedDSO.distanceLightYears.toLocaleString()} LY</span>
              </div>
              <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Constellation</span>
                <span className="text-slate-100">{selectedDSO.constellation}</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-3">
              {selectedDSO.description}
            </p>
            {onSelectChapter && (
              <button
                onClick={() => {
                  let targetCh = 'episode-02';
                  if (['sn_1987a', 'm1', 'veil_nebula'].includes(selectedDSO.id)) targetCh = 'episode-07';
                  else if (selectedDSO.id === 'abell_2744') targetCh = 'episode-08';
                  else if (selectedDSO.id === 'bullet_cluster') targetCh = 'episode-09';
                  else if (selectedDSO.id === 'm31') targetCh = 'episode-03';
                  else if (selectedDSO.id === 'sagittarius_a_star') targetCh = 'episode-04';
                  onSelectChapter(targetCh);
                }}
                className="w-full py-2 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-200 text-xs rounded-lg font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Read Episode Chapter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Constellation Selector Bar */}
      <div className="z-20 px-4 py-3 bg-[#080d1d] border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-2">
          Constellations:
        </span>
        {constellationsData.map(c => {
          const isActive = c.id === selectedConstellation.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedConstellation(c);
                setSelectedStar(null);
                setSelectedDSO(null);
                if (isNarrating) narrationAudio.stop();
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* APPROACHABLE REALISM: Stellar Thermometer Module */}
      <div className="p-4 bg-[#050814] border-t border-slate-900">
        <StellarThermometer
          selectedClass={selectedSpectralFilter}
          onSelectClass={setSelectedSpectralFilter}
        />
      </div>

      {/* Deep Sky Objects Strip */}
      <div className="z-20 px-4 py-2.5 bg-[#070b19] border-t border-slate-900 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-2">
          Featured Deep Space:
        </span>
        {deepSkyObjectsData.map(dso => (
          <button
            key={dso.id}
            onClick={() => {
              setSelectedDSO(dso);
              setSelectedStar(null);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/50 hover:bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white border border-slate-800 transition-colors whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>{dso.messierCode || dso.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
