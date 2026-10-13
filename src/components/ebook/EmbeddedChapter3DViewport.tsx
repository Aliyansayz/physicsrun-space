import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Layers, 
  Eye, 
  Maximize2 
} from 'lucide-react';

interface EmbeddedChapter3DViewportProps {
  episodeNumber: number;
  chapterTitle: string;
}

export const EmbeddedChapter3DViewport: React.FC<EmbeddedChapter3DViewportProps> = ({
  episodeNumber,
  chapterTitle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [showWireframe, setShowWireframe] = useState(false);
  const [activeModelName, setActiveModelName] = useState('');

  // Three.js internal scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const isPlayingRef = useRef<boolean>(true);
  const speedRef = useRef<number>(1);

  // Sync refs
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 360;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Append canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 5. Build Dynamic 3D Scene based on Episode
    const dynamicGroup = new THREE.Group();
    dynamicGroupRef.current = dynamicGroup;
    scene.add(dynamicGroup);

    // Background cosmic star particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 50;
      starPos[i + 1] = (Math.random() - 0.5) * 50;
      starPos[i + 2] = (Math.random() - 0.5) * 50;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.65,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Episode Specific 3D Models
    if (episodeNumber === 1) {
      // Episode 1: Solar Orrery (Sun, Earth, Moon, Jupiter & Orbits)
      setActiveModelName('Solar Orrery & Planetary Dynamics');

      // The Sun
      const sunGeo = new THREE.SphereGeometry(1.4, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      dynamicGroup.add(sun);

      // Sun Corona Glow
      const coronaGeo = new THREE.SphereGeometry(1.6, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.25,
      });
      const corona = new THREE.Mesh(coronaGeo, coronaMat);
      dynamicGroup.add(corona);

      // Orbit 1: Earth
      const earthOrbitRadius = 4.2;
      const earthOrbitGeo = new THREE.RingGeometry(earthOrbitRadius - 0.02, earthOrbitRadius + 0.02, 64);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
      const earthOrbitLine = new THREE.Mesh(earthOrbitGeo, orbitMat);
      earthOrbitLine.rotation.x = Math.PI / 2;
      dynamicGroup.add(earthOrbitLine);

      // Earth & Moon Pivot
      const earthPivot = new THREE.Group();
      dynamicGroup.add(earthPivot);

      const earthGeo = new THREE.SphereGeometry(0.45, 24, 24);
      const earthMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      earth.position.set(earthOrbitRadius, 0, 0);
      earthPivot.add(earth);

      // Moon
      const moonGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const moonMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.8 });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.position.set(earthOrbitRadius + 0.85, 0.2, 0);
      earthPivot.add(moon);

      // Orbit 2: Jupiter
      const jupiterRadius = 7.2;
      const jupiterOrbitGeo = new THREE.RingGeometry(jupiterRadius - 0.03, jupiterRadius + 0.03, 64);
      const jupiterOrbitLine = new THREE.Mesh(jupiterOrbitGeo, orbitMat);
      jupiterOrbitLine.rotation.x = Math.PI / 2;
      dynamicGroup.add(jupiterOrbitLine);

      const jupiterPivot = new THREE.Group();
      dynamicGroup.add(jupiterPivot);

      const jupiterGeo = new THREE.SphereGeometry(0.9, 32, 32);
      const jupiterMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
      const jupiter = new THREE.Mesh(jupiterGeo, jupiterMat);
      jupiter.position.set(jupiterRadius, 0, 0);
      jupiterPivot.add(jupiter);

      // Store animation updater
      (dynamicGroup as any).update = (delta: number) => {
        sun.rotation.y += delta * 0.2;
        earthPivot.rotation.y += delta * 0.75 * speedRef.current;
        earth.rotation.y += delta * 2;
        jupiterPivot.rotation.y += delta * 0.3 * speedRef.current;
        jupiter.rotation.y += delta * 1.2;
      };

    } else if (episodeNumber === 2) {
      // Episode 2: Stellar Nursery Protostellar Ignition & Gas Disks
      setActiveModelName('Protostellar Accretion & Fusion Ignition');

      // Glowing Protostar Core
      const coreGeo = new THREE.SphereGeometry(1.1, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
      const core = new THREE.Mesh(coreGeo, coreMat);
      dynamicGroup.add(core);

      // Accretion disk particles
      const diskCount = 700;
      const diskGeo = new THREE.BufferGeometry();
      const diskPos = new Float32Array(diskCount * 3);
      const diskColors = new Float32Array(diskCount * 3);

      for (let i = 0; i < diskCount; i++) {
        const radius = 1.6 + Math.random() * 4.5;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * (0.8 - (radius / 5) * 0.4);

        diskPos[i * 3] = x;
        diskPos[i * 3 + 1] = y;
        diskPos[i * 3 + 2] = z;

        // Gradient from orange-yellow near core to deep violet outside
        const t = (radius - 1.6) / 4.5;
        diskColors[i * 3] = 1.0 - t * 0.5;
        diskColors[i * 3 + 1] = 0.5 - t * 0.3;
        diskColors[i * 3 + 2] = 0.2 + t * 0.8;
      }

      diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3));
      diskGeo.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));

      const diskMat = new THREE.PointsMaterial({
        size: 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      });
      const disk = new THREE.Points(diskGeo, diskMat);
      dynamicGroup.add(disk);

      // Bipolar outflow gas jets (representing young stellar jets)
      const jetGeo = new THREE.CylinderGeometry(0.08, 0.4, 6, 16);
      const jetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
      const topJet = new THREE.Mesh(jetGeo, jetMat);
      topJet.position.y = 3.2;
      dynamicGroup.add(topJet);

      const bottomJet = new THREE.Mesh(jetGeo, jetMat);
      bottomJet.position.y = -3.2;
      bottomJet.rotation.z = Math.PI;
      dynamicGroup.add(bottomJet);

      (dynamicGroup as any).update = (delta: number) => {
        core.rotation.y += delta * 0.5;
        disk.rotation.y += delta * 0.6 * speedRef.current;
      };

    } else if (episodeNumber === 3) {
      // Episode 3: Milky Way & Andromeda Collision Simulation
      setActiveModelName('Spiral Galaxy Density Waves & Collision');

      const createSpiralDisk = (color: number, offset: THREE.Vector3, tilt: number) => {
        const spiralGroup = new THREE.Group();
        const pCount = 600;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(pCount * 3);

        for (let i = 0; i < pCount; i++) {
          const arm = i % 2;
          const dist = 0.5 + Math.random() * 3.5;
          const theta = dist * 2.2 + arm * Math.PI + (Math.random() - 0.5) * 0.4;
          pos[i * 3] = Math.cos(theta) * dist;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
          pos[i * 3 + 2] = Math.sin(theta) * dist;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ size: 0.11, color, transparent: true, opacity: 0.8 });
        const points = new THREE.Points(geo, mat);
        spiralGroup.add(points);

        // Core
        const coreG = new THREE.SphereGeometry(0.45, 16, 16);
        const coreM = new THREE.MeshBasicMaterial({ color: 0xffffff });
        spiralGroup.add(new THREE.Mesh(coreG, coreM));

        spiralGroup.position.copy(offset);
        spiralGroup.rotation.x = tilt;
        return { group: spiralGroup, points };
      };

      const g1 = createSpiralDisk(0x38bdf8, new THREE.Vector3(-2.8, 0.5, 0), 0.4);
      const g2 = createSpiralDisk(0xf472b6, new THREE.Vector3(2.8, -0.5, 0), -0.5);

      dynamicGroup.add(g1.group);
      dynamicGroup.add(g2.group);

      (dynamicGroup as any).update = (delta: number) => {
        g1.points.rotation.y += delta * 0.8 * speedRef.current;
        g2.points.rotation.y -= delta * 0.7 * speedRef.current;
        dynamicGroup.rotation.y += delta * 0.15;
      };

    } else {
      // Episode 4 & Others: Kerr Rotating Black Hole with Relativistic Accretion Ring
      setActiveModelName('Kerr Black Hole & Gravitational Lensing');

      // Event Horizon
      const eventHorizonGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const eventHorizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const eventHorizon = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
      dynamicGroup.add(eventHorizon);

      // Photon Sphere Ring
      const photonRingGeo = new THREE.RingGeometry(1.4, 1.48, 64);
      const photonRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
      photonRing.rotation.x = Math.PI / 2;
      dynamicGroup.add(photonRing);

      // Tilted Accretion Disk Ring
      const accretionGeo = new THREE.RingGeometry(1.6, 4.2, 64);
      const accretionMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
      });
      const accretion = new THREE.Mesh(accretionGeo, accretionMat);
      accretion.rotation.x = Math.PI / 2.3;
      dynamicGroup.add(accretion);

      // Relativistic Lensing Vertical Halo Ring (Simulating curved light path over top and bottom)
      const lensingGeo = new THREE.RingGeometry(1.7, 3.6, 64);
      const lensingMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const lensing = new THREE.Mesh(lensingGeo, lensingMat);
      dynamicGroup.add(lensing);

      (dynamicGroup as any).update = (delta: number) => {
        accretion.rotation.z += delta * 0.9 * speedRef.current;
        lensing.rotation.z -= delta * 0.3 * speedRef.current;
      };
    }

    // 6. Interactive Drag Controls (Manual Orbit without heavy OrbitControls bundle)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dynamicGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      dynamicGroupRef.current.rotation.y += deltaX * 0.01;
      dynamicGroupRef.current.rotation.x += deltaY * 0.01;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    let prevTouchX = 0;
    let prevTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1 || !dynamicGroupRef.current) return;
      const deltaX = e.touches[0].clientX - prevTouchX;
      const deltaY = e.touches[0].clientY - prevTouchY;
      prevTouchX = e.touches[0].clientX;
      prevTouchY = e.touches[0].clientY;
      dynamicGroupRef.current.rotation.y += deltaX * 0.01;
      dynamicGroupRef.current.rotation.x += deltaY * 0.01;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };
    canvasEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 7. Render Loop with Performance Observer
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return; // Pause rendering when scrolled out of view

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingRef.current && (dynamicGroup as any).update) {
        (dynamicGroup as any).update(delta);
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 8. Intersection Observer to pause rendering when off-screen (Battery & Performance win)
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      observer.disconnect();
      resizeObserver.disconnect();
      canvasEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      container.innerHTML = '';
    };
  }, [episodeNumber]);

  // Handle Zoom
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z * factor, 4), 22);
  };

  // Reset View
  const handleReset = () => {
    if (cameraRef.current && dynamicGroupRef.current) {
      cameraRef.current.position.set(0, 5, 12);
      cameraRef.current.lookAt(0, 0, 0);
      dynamicGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative my-8 rounded-3xl overflow-hidden border border-cyan-400/30 bg-slate-950/70 shadow-2xl backdrop-blur-xl">
      {/* HUD Header */}
      <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 z-20 relative">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-cyan-300 uppercase">
            3D Interactive Sandbox: {activeModelName}
          </span>
        </div>

        {/* Action Controls HUD */}
        <div className="flex items-center space-x-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1))}
            className="px-2 py-1 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-[10px] font-mono text-cyan-300 transition-colors cursor-pointer"
            title="Toggle Simulation Speed"
          >
            {speedMultiplier}x Speed
          </button>

          {/* Zoom In / Out */}
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Perspective"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Mounting Container */}
      <div 
        ref={mountRef} 
        className="w-full h-[320px] sm:h-[400px] cursor-grab active:cursor-grabbing relative select-none"
        title="Click and drag to rotate the 3D model"
      />

      {/* Touch / Interaction Hint Overlay at Bottom */}
      <div className="px-5 py-2.5 bg-slate-950/70 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Touch or drag to orbit in 3D • Scroll wheel to zoom</span>
        <span className="text-cyan-400/90 hidden sm:inline">WebGL Three.js Physics Engine</span>
      </div>
    </div>
  );
};
