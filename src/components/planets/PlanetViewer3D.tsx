import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PlanetData } from '../../types';
import { planetsData } from '../../data/planetsData';
import { HumanScaleAnchors } from './HumanScaleAnchors';
import { 
  RotateCw, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Sun, 
  ChevronRight, 
  ChevronLeft, 
  Info,
  Scale,
  Compass,
  BookOpen,
  ArrowDownCircle,
  Moon as MoonIcon
} from 'lucide-react';

interface PlanetViewer3DProps {
  initialPlanetId?: string;
  onSelectChapter?: (chapterId: string) => void;
  compact?: boolean;
}

type DropObject = 'tennis-ball' | 'rover' | 'feather' | 'astronaut';

export const PlanetViewer3D: React.FC<PlanetViewer3DProps> = ({
  initialPlanetId = 'earth',
  onSelectChapter,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(() => {
    return planetsData.find(p => p.id === initialPlanetId) || planetsData[2];
  });
  const [viewMode, setViewMode] = useState<'surface' | 'cross-section' | 'scale'>('surface');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showMoons, setShowMoons] = useState(true);
  const [activeLayerIndex, setActiveLayerIndex] = useState<number | null>(null);
  const [sunIntensity, setSunIntensity] = useState(1.8);
  const [sunAngle, setSunAngle] = useState(45); // degrees
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Gravity Drop Sandbox State
  const [isDropping, setIsDropping] = useState(false);
  const [dropHeight, setDropHeight] = useState(0); // 0 (top) to 100 (ground)
  const [dropObject, setDropObject] = useState<DropObject>('tennis-ball');
  const dropTimerRef = useRef<number | null>(null);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetMeshRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const comparisonGroupRef = useRef<THREE.Group | null>(null);
  const moonsGroupRef = useRef<THREE.Group | null>(null);

  // Mouse drag control state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.003 });

  // Update selected planet if initialPlanetId changes
  useEffect(() => {
    const p = planetsData.find(item => item.id === initialPlanetId);
    if (p) {
      setSelectedPlanet(p);
    }
  }, [initialPlanetId]);

  // Window-level mouseup/touchend to prevent sticky dragging
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

  // Gravity Drop Test Simulator with real physics
  const handleTriggerGravityDrop = () => {
    if (isDropping) return;
    setIsDropping(true);
    setDropHeight(0);

    const gravityMatch = selectedPlanet.surfaceGravity.match(/[\d.]+/);
    const gNum = gravityMatch ? parseFloat(gravityMatch[0]) : 9.81;
    // Real fall time for 10 meters: t = sqrt(2 * 10 / g)
    // Feathers in vacuum fall at the exact same rate as rovers (Galileo / Apollo 15 hammer-feather proof)!
    const fallDurationMs = Math.max(250, Math.sqrt((2 * 10) / gNum) * 1000);
    const startTime = performance.now();

    const animateDrop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / fallDurationMs);
      const fallPercent = Math.min(100, progress * progress * 100);
      setDropHeight(fallPercent);

      if (progress < 1) {
        dropTimerRef.current = requestAnimationFrame(animateDrop);
      } else {
        setTimeout(() => {
          setIsDropping(false);
          setDropHeight(0);
        }, 1200);
      }
    };

    dropTimerRef.current = requestAnimationFrame(animateDrop);
  };

  useEffect(() => {
    return () => {
      if (dropTimerRef.current) cancelAnimationFrame(dropTimerRef.current);
    };
  }, []);

  // Generate procedural textures for planet surface
  const createPlanetTexture = (planet: PlanetData): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    if (planet.id === 'earth') {
      ctx.fillStyle = '#0f2952';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22543d';
      for (let i = 0; i < 35; i++) {
        const x = ((i * 137) % canvas.width);
        const y = 80 + ((i * 89) % (canvas.height - 160));
        const r = 40 + (i % 5) * 20;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.6, (i * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#b45309';
      for (let i = 0; i < 15; i++) {
        const x = ((i * 199) % canvas.width);
        const y = 140 + ((i * 73) % 200);
        ctx.beginPath();
        ctx.ellipse(x, y, 30, 20, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, 35);
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    } else if (planet.id === 'mars') {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#7c2d12');
      grad.addColorStop(0.5, '#c2410c');
      grad.addColorStop(1, '#9a3412');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#431407';
      for (let i = 0; i < 40; i++) {
        const x = (i * 97) % canvas.width;
        const y = 60 + ((i * 61) % (canvas.height - 120));
        ctx.beginPath();
        ctx.ellipse(x, y, 35 + (i % 4) * 15, 20, i * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, canvas.width, 24);
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    } else if (planet.id === 'jupiter') {
      const bands = 24;
      const bandHeight = canvas.height / bands;
      for (let i = 0; i < bands; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#b45309' : (i % 3 === 0 ? '#d97706' : '#fef3c7');
        ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);

        ctx.fillStyle = i % 2 === 0 ? 'rgba(254, 243, 199, 0.15)' : 'rgba(180, 83, 9, 0.2)';
        for (let j = 0; j < 10; j++) {
          ctx.beginPath();
          ctx.ellipse((j * 120) % canvas.width, i * bandHeight + bandHeight / 2, 60, bandHeight * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(650, 320, 75, 45, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(650, 320, 50, 30, 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else if (planet.id === 'saturn') {
      const bands = 20;
      const bandH = canvas.height / bands;
      for (let i = 0; i < bands; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#ca8a04' : (i % 3 === 0 ? '#eab308' : '#fef08a');
        ctx.fillRect(0, i * bandH, canvas.width, bandH);
      }
    } else if (planet.id === 'neptune') {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#0369a1');
      grad.addColorStop(0.5, '#0284c7');
      grad.addColorStop(1, '#075985');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 15; i++) {
        ctx.fillRect(0, 100 + i * 22, canvas.width, 2 + (i % 3));
      }
      ctx.fillStyle = '#0c4a6e';
      ctx.beginPath();
      ctx.ellipse(400, 260, 50, 30, 0.05, 0, Math.PI * 2);
      ctx.fill();
    } else if (planet.id === 'moon') {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#475569';
      for (let i = 0; i < 20; i++) {
        const x = (i * 123) % canvas.width;
        const y = 80 + ((i * 71) % (canvas.height - 160));
        ctx.beginPath();
        ctx.ellipse(x, y, 40 + (i % 4) * 20, 30 + (i % 3) * 15, i * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#cbd5e1';
      for (let i = 0; i < 80; i++) {
        const cx = (i * 37) % canvas.width;
        const cy = (i * 29) % canvas.height;
        ctx.beginPath();
        ctx.arc(cx, cy, 3 + (i % 6), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (planet.id === 'venus') {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
      for (let i = 0; i < 30; i++) {
        ctx.fillRect(0, i * 16, canvas.width, 8);
      }
    } else {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 50; i++) {
        const x = (i * 83) % canvas.width;
        const y = (i * 59) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 5 + (i % 12), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  };

  const createEarthCloudsTexture = (): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 113) % canvas.width;
      const y = 60 + ((i * 79) % (canvas.height - 120));
      ctx.beginPath();
      ctx.ellipse(x, y, 50 + (i % 6) * 15, 18, i * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  };

  const createRingTexture = (): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, 'rgba(212, 177, 106, 0.1)');
    grad.addColorStop(0.2, 'rgba(234, 179, 8, 0.85)');
    grad.addColorStop(0.55, 'rgba(161, 98, 7, 0.9)');
    grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.05)'); // Cassini Division
    grad.addColorStop(0.72, 'rgba(202, 138, 4, 0.7)');
    grad.addColorStop(0.95, 'rgba(161, 98, 7, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Re-build 3D scene whenever selected planet or viewMode changes
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x222a38, 0.9);
    scene.add(ambientLight);

    // Directional Sunlight with adjustable angle
    const sunRad = (sunAngle * Math.PI) / 180;
    const sunLight = new THREE.DirectionalLight(0xfffaed, sunIntensity);
    sunLight.position.set(6 * Math.cos(sunRad), 2, 6 * Math.sin(sunRad));
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(selectedPlanet.atmosphereGlowHex), 0.7);
    rimLight.position.set(-5, 0, -3);
    scene.add(rimLight);

    // Planet Root Position Group
    const outerPositionGroup = new THREE.Group();
    scene.add(outerPositionGroup);

    const planetGroup = new THREE.Group();
    outerPositionGroup.add(planetGroup);
    planetMeshRef.current = planetGroup;

    planetGroup.rotation.z = (selectedPlanet.axialTiltDegrees * Math.PI) / 180;

    // Moons group
    const moonsGroup = new THREE.Group();
    scene.add(moonsGroup);
    moonsGroupRef.current = moonsGroup;

    if (viewMode === 'surface') {
      const geometry = new THREE.SphereGeometry(1.2, 64, 64);
      const texture = createPlanetTexture(selectedPlanet);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.75,
        metalness: 0.1,
      });
      const planetMesh = new THREE.Mesh(geometry, material);
      planetGroup.add(planetMesh);

      if (selectedPlanet.id === 'earth') {
        const cloudsGeom = new THREE.SphereGeometry(1.22, 64, 64);
        const cloudsMat = new THREE.MeshStandardMaterial({
          map: createEarthCloudsTexture(),
          transparent: true,
          opacity: 0.6,
          blending: THREE.NormalBlending,
        });
        const cloudsMesh = new THREE.Mesh(cloudsGeom, cloudsMat);
        planetGroup.add(cloudsMesh);
        cloudsMeshRef.current = cloudsMesh;
      }

      if (selectedPlanet.hasRings) {
        const ringGeom = new THREE.RingGeometry(1.5, 2.7, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          map: createRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + 0.15;
        planetGroup.add(ringMesh);
      }

      const glowGeom = new THREE.SphereGeometry(1.26, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(selectedPlanet.atmosphereGlowHex),
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(glowGeom, glowMat);
      planetGroup.add(glowMesh);

      // Add Live Orbiting Moons for Earth, Mars, Jupiter, Saturn
      if (showMoons) {
        if (selectedPlanet.id === 'earth') {
          // The Moon
          const moonGeom = new THREE.SphereGeometry(0.12, 16, 16);
          const moonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
          const moonMesh = new THREE.Mesh(moonGeom, moonMat);
          moonMesh.userData = { orbitRadius: 2.2, speed: 0.008, angle: 0 };
          moonsGroup.add(moonMesh);

          // Orbit circle line
          const orbitCurve = new THREE.EllipseCurve(0, 0, 2.2, 2.2, 0, 2 * Math.PI, false, 0);
          const orbitPoints = orbitCurve.getPoints(64);
          const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y)));
          const orbitMat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.3 });
          const orbitLine = new THREE.Line(orbitGeom, orbitMat);
          orbitLine.rotation.x = Math.PI / 2;
          moonsGroup.add(orbitLine);
        } else if (selectedPlanet.id === 'jupiter') {
          // 4 Galilean Moons: Io, Europa, Ganymede, Callisto
          const galilean = [
            { name: 'Io', r: 1.8, size: 0.05, color: 0xfef08a, speed: 0.02 },
            { name: 'Europa', r: 2.2, size: 0.045, color: 0xe0f2fe, speed: 0.014 },
            { name: 'Ganymede', r: 2.6, size: 0.07, color: 0x94a3b8, speed: 0.009 },
            { name: 'Callisto', r: 3.1, size: 0.06, color: 0x64748b, speed: 0.006 },
          ];
          galilean.forEach(m => {
            const mGeom = new THREE.SphereGeometry(m.size, 16, 16);
            const mMat = new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.7 });
            const mMesh = new THREE.Mesh(mGeom, mMat);
            mMesh.userData = { orbitRadius: m.r, speed: m.speed, angle: Math.random() * Math.PI * 2 };
            moonsGroup.add(mMesh);

            const orbitCurve = new THREE.EllipseCurve(0, 0, m.r, m.r, 0, 2 * Math.PI, false, 0);
            const orbitPoints = orbitCurve.getPoints(64);
            const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y)));
            const orbitMat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.25 });
            const orbitLine = new THREE.Line(orbitGeom, orbitMat);
            orbitLine.rotation.x = Math.PI / 2;
            moonsGroup.add(orbitLine);
          });
        }
      }

    } else if (viewMode === 'cross-section') {
      const outerGeom = new THREE.SphereGeometry(1.2, 48, 48, 0, Math.PI * 1.5);
      const outerMat = new THREE.MeshStandardMaterial({
        map: createPlanetTexture(selectedPlanet),
        side: THREE.DoubleSide,
        roughness: 0.7,
      });
      const outerMesh = new THREE.Mesh(outerGeom, outerMat);
      planetGroup.add(outerMesh);

      selectedPlanet.layers.forEach((layer, index) => {
        const layerRadius = 1.15 - index * 0.32;
        if (layerRadius > 0.1) {
          const layerGeom = new THREE.SphereGeometry(layerRadius, 32, 32, 0, Math.PI * 1.5);
          const isSelected = activeLayerIndex === index;
          const layerMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(layer.colorHex),
            emissive: isSelected ? new THREE.Color(layer.colorHex) : new THREE.Color(0x000000),
            emissiveIntensity: isSelected ? 0.4 : 0,
            side: THREE.DoubleSide,
            roughness: 0.4,
          });
          const layerMesh = new THREE.Mesh(layerGeom, layerMat);
          planetGroup.add(layerMesh);
        }
      });

    } else if (viewMode === 'scale') {
      outerPositionGroup.position.x = 0.8;
      const earthRadius = 0.6;
      const ratio = Math.max(0.18, Math.min(2.4, (selectedPlanet.diameterKm / 12742) * earthRadius));

      const planetGeom = new THREE.SphereGeometry(ratio, 48, 48);
      const planetMat = new THREE.MeshStandardMaterial({
        map: createPlanetTexture(selectedPlanet),
        roughness: 0.7,
      });
      const planetMesh = new THREE.Mesh(planetGeom, planetMat);
      planetGroup.add(planetMesh);

      const compGroup = new THREE.Group();
      compGroup.position.set(-1.2, 0, 0);
      scene.add(compGroup);
      comparisonGroupRef.current = compGroup;

      const earthData = planetsData.find(p => p.id === 'earth')!;
      const earthGeom = new THREE.SphereGeometry(earthRadius, 48, 48);
      const earthMat = new THREE.MeshStandardMaterial({
        map: createPlanetTexture(earthData),
        roughness: 0.7,
      });
      const earthMesh = new THREE.Mesh(earthGeom, earthMat);
      compGroup.add(earthMesh);
    }

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current) {
        if (planetMeshRef.current) {
          planetMeshRef.current.rotation.y += rotationVelocityRef.current.y;
        }
        if (cloudsMeshRef.current) {
          cloudsMeshRef.current.rotation.y += rotationVelocityRef.current.y * 1.3;
        }
        if (comparisonGroupRef.current) {
          comparisonGroupRef.current.rotation.y += 0.003;
        }
      }

      // Animate orbiting moons
      if (moonsGroupRef.current) {
        moonsGroupRef.current.children.forEach(child => {
          if (child.userData?.orbitRadius) {
            child.userData.angle += child.userData.speed;
            const r = child.userData.orbitRadius;
            child.position.x = r * Math.cos(child.userData.angle);
            child.position.z = r * Math.sin(child.userData.angle);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch {}
      }
    };
  }, [selectedPlanet, viewMode, activeLayerIndex, sunIntensity, sunAngle, showMoons]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !planetMeshRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    planetMeshRef.current.rotation.y += deltaX * 0.007;
    planetMeshRef.current.rotation.x += deltaY * 0.007;

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !planetMeshRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

    planetMeshRef.current.rotation.y += deltaX * 0.007;
    planetMeshRef.current.rotation.x += deltaY * 0.007;

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.002;
    cameraRef.current.position.z = Math.max(2.5, Math.min(8.0, cameraRef.current.position.z + zoomDelta));
  };

  const currentIndex = planetsData.findIndex(p => p.id === selectedPlanet.id);
  const handlePrevPlanet = () => {
    const nextIdx = (currentIndex - 1 + planetsData.length) % planetsData.length;
    setSelectedPlanet(planetsData[nextIdx]);
  };
  const handleNextPlanet = () => {
    const nextIdx = (currentIndex + 1) % planetsData.length;
    setSelectedPlanet(planetsData[nextIdx]);
  };

  return (
    <div className={`relative flex flex-col bg-[#070a14] border border-slate-800/80 shadow-2xl transition-all ${
      isFullscreen 
        ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
        : compact 
          ? 'rounded-2xl h-[440px]' 
          : 'rounded-2xl min-h-[720px]'
    }`}>
      
      {/* Top 3D Studio Navigation Ribbon */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#0b0f1d]/90 backdrop-blur-md border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            {selectedPlanet.name}
            <span className="text-xs font-mono font-normal text-cyan-400/90">{selectedPlanet.classification}</span>
          </h2>
          <p className="text-xs text-slate-400 font-light truncate max-w-xs">{selectedPlanet.tagline}</p>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#101626] border border-slate-800 rounded-lg">
          <button
            onClick={() => setViewMode('surface')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'surface' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Surface View
          </button>
          <button
            onClick={() => setViewMode('cross-section')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'cross-section' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Core Layers
          </button>
          <button
            onClick={() => setViewMode('scale')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'scale' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Scale vs Earth
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Gravity Drop Sandbox Trigger */}
          <button
            onClick={handleTriggerGravityDrop}
            disabled={isDropping}
            title="Simulate 10m Drop under this World's Surface Gravity"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/60 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 text-xs font-mono transition-colors"
          >
            <ArrowDownCircle className={`w-3.5 h-3.5 ${isDropping ? 'animate-bounce text-amber-400' : ''}`} />
            <span>{isDropping ? 'Falling...' : 'Drop Test'}</span>
          </button>

          {/* Moons Toggle */}
          {selectedPlanet.moonsCount > 0 && (
            <button
              onClick={() => setShowMoons(!showMoons)}
              title="Toggle Orbiting Moons"
              className={`p-2 rounded-lg border text-xs transition-colors ${
                showMoons ? 'border-sky-800 text-sky-400 bg-sky-950/40' : 'border-slate-800 text-slate-400'
              }`}
            >
              <MoonIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto Rotation"
            className={`p-2 rounded-lg border text-xs transition-colors ${
              autoRotate ? 'border-cyan-800/70 text-cyan-400 bg-cyan-950/40' : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSunIntensity(sunIntensity === 1.8 ? 2.8 : 1.8)}
            title="Toggle Solar Illumination"
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Toggle Fullscreen View"
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        className="relative flex-1 w-full h-full min-h-[380px] cursor-grab active:cursor-grabbing select-none overflow-hidden"
      >
        {/* Interactive Helper Overlay */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none text-[11px] font-mono text-slate-400/80 flex items-center gap-2 bg-[#090d1a]/70 px-3 py-1.5 rounded-md border border-slate-800/60 backdrop-blur-sm">
          <span>DRAG TO ROTATE</span>
          <span aria-hidden="true">·</span>
          <span>SCROLL TO ZOOM</span>
        </div>

        {/* Solar Terminator Slider (Top-Right HUD) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#090d1a]/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-sm text-xs font-mono text-slate-300">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] uppercase text-slate-400">Sun Terminator:</span>
          <input
            type="range"
            min="0"
            max="360"
            value={sunAngle}
            onChange={(e) => setSunAngle(Number(e.target.value))}
            className="w-20 accent-amber-400"
          />
        </div>

        {/* Gravity Drop Sandbox Chamber */}
        {isDropping && (
          <div className="absolute top-16 left-6 z-20 w-56 p-3 rounded-xl bg-[#090e22]/95 border border-amber-500/70 backdrop-blur-md shadow-2xl animate-in fade-in">
            <div className="text-[10px] font-mono uppercase text-amber-400 tracking-wider mb-2 flex items-center justify-between">
              <span>Gravity Drop (10m)</span>
              <span>{selectedPlanet.surfaceGravity}</span>
            </div>
            {/* Visual drop chamber */}
            <div className="relative h-32 w-full bg-slate-900/90 rounded-lg border border-slate-800 overflow-hidden flex justify-center">
              <div 
                className="absolute w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 flex items-center justify-center text-[8px] font-bold text-slate-950 font-mono"
                style={{ top: `${dropHeight}%`, transform: 'translateY(-50%)' }}
              >
                ●
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-700"></div>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-300 text-center">
              Fall Time: {Math.sqrt((2 * 10) / parseFloat(selectedPlanet.surfaceGravity)).toFixed(2)}s
            </div>
          </div>
        )}

        {/* Previous / Next Planet Navigation Arrows */}
        <button
          onClick={handlePrevPlanet}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0b0f1e]/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-cyan-300 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextPlanet}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0b0f1e]/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-cyan-300 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Cross-section interactive layer selector HUD */}
        {viewMode === 'cross-section' && (
          <div className="absolute bottom-6 left-6 z-10 max-w-sm bg-[#090e1c]/90 border border-slate-800/90 rounded-xl p-4 backdrop-blur-md shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
              Internal Geological Architecture
            </div>
            <div className="space-y-2">
              {selectedPlanet.layers.map((layer, idx) => (
                <div
                  key={layer.name}
                  onClick={() => setActiveLayerIndex(activeLayerIndex === idx ? null : idx)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    activeLayerIndex === idx
                      ? 'bg-cyan-950/60 border-cyan-500/80 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-200">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.colorHex }}></span>
                      {layer.name}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{layer.thickness}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">
                    {layer.composition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scale comparison labels */}
        {viewMode === 'scale' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-12 bg-[#090e1c]/80 border border-slate-800/80 px-6 py-2.5 rounded-full backdrop-blur-md text-xs font-mono">
            <span className="text-slate-300">EARTH: 12,742 km</span>
            <span className="text-cyan-400">{selectedPlanet.name.toUpperCase()}: {selectedPlanet.diameterKm.toLocaleString()} km</span>
          </div>
        )}
      </div>

      {/* Planet Selection Strip Carousel */}
      <div className="z-20 px-4 py-3 bg-[#090d1c] border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {planetsData.map(planet => {
          const isActive = planet.id === selectedPlanet.id;
          return (
            <button
              key={planet.id}
              onClick={() => setSelectedPlanet(planet)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div 
                className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" 
                style={{ backgroundColor: planet.colorHex }}
              />
              <span className="font-medium">{planet.name}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Telemetry HUD */}
      {!compact && (
        <div className="z-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-5 bg-[#060913] border-t border-slate-800/80">
          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/60">
            <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1">Equatorial Diameter</span>
            <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
              {selectedPlanet.diameterKm.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1">km</span>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/60">
            <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1">Surface Gravity</span>
            <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
              {selectedPlanet.surfaceGravity}
            </span>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/60">
            <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1">Distance Sun</span>
            <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
              {selectedPlanet.distanceFromSunAU}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1">AU</span>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/60">
            <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1">Orbital Period</span>
            <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
              {selectedPlanet.orbitalPeriodDays}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1">days</span>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/60">
            <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1">Mean Temp</span>
            <span className="text-lg font-mono font-semibold text-slate-100 tabular-nums">
              {selectedPlanet.meanTemperatureC > 0 ? `+${selectedPlanet.meanTemperatureC}` : selectedPlanet.meanTemperatureC}
            </span>
            <span className="text-xs text-slate-400 font-mono ml-1">°C</span>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/60 flex flex-col justify-between">
            <span className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1">Natural Moons</span>
            <span className="text-lg font-mono font-semibold text-cyan-400 tabular-nums">
              {selectedPlanet.moonsCount}
            </span>
            {onSelectChapter && (
              <button
                onClick={() => onSelectChapter('episode-01')}
                className="mt-1 flex items-center text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Read in Ebook
              </button>
            )}
          </div>
        </div>
      )}

      {/* APPROACHABLE REALISM: Human Scale Intuition & Sensory Grounding Module */}
      {!compact && (
        <div className="p-5 bg-[#05070e] border-t border-slate-900">
          <HumanScaleAnchors planet={selectedPlanet} />
        </div>
      )}

      {/* Fun Fact Callout footer */}
      {!compact && (
        <div className="px-5 py-3 bg-[#0a0e1c] border-t border-slate-900 text-xs text-slate-400 font-light">
          <span>
            <strong className="font-medium text-slate-200 mr-1.5">Astrophysical Insight:</strong>
            {selectedPlanet.funFact}
          </span>
        </div>
      )}
    </div>
  );
};
