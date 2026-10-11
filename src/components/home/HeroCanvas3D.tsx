import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let animationFrameId: number;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);



    // 3. Create Procedural Texture for Planet
    const createPlanetTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Deep oceanic midnight base
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#040915');
      grad.addColorStop(0.5, '#071026');
      grad.addColorStop(1, '#02050e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle atmospheric swirls / terrain silhouettes
      ctx.fillStyle = '#0f2244';
      for (let i = 0; i < 40; i++) {
        const x = (i * 187) % canvas.width;
        const y = 150 + ((i * 123) % (canvas.height - 300));
        const rx = 60 + (i % 6) * 30;
        const ry = 30 + (i % 4) * 15;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Faint cloud filaments
      ctx.fillStyle = 'rgba(186, 230, 253, 0.08)';
      for (let i = 0; i < 25; i++) {
        const y = 100 + i * 35;
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, y, canvas.width * 0.6, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(canvas);
    };

    const planetTexture = createPlanetTexture();

    // 4. Planet Sphere positioned to form the massive horizon curve on the right
    const planetRadius = 7.6;
    const planetGroup = new THREE.Group();
    // Position to curve from upper right across to bottom right
    planetGroup.position.set(5.8, -1.2, -1.0);
    scene.add(planetGroup);

    const planetGeo = new THREE.SphereGeometry(planetRadius, 96, 96);
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.85,
      metalness: 0.05,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planetMesh);

    // 5. Atmosphere Rim / Fresnel Shader for vivid illuminated limb
    const atmosphereGeo = new THREE.SphereGeometry(planetRadius * 1.018, 96, 96);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          // Fresnel effect: intense at silhouette edges
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          float intensity = pow(rim, 3.8);

          // Deep sapphire to bright cyan atmosphere transition
          vec3 atmosphereColor = mix(vec3(0.05, 0.45, 0.85), vec3(0.55, 0.85, 1.0), rim * 0.7);
          
          gl_FragColor = vec4(atmosphereColor, intensity * 0.95);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    planetGroup.add(atmosphereMesh);

    // 6. External Atmosphere Outer Glow Shell
    const outerAtmosphereGeo = new THREE.SphereGeometry(planetRadius * 1.045, 64, 64);
    const outerAtmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.2, 0.65, 0.95, intensity * 0.4);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const outerAtmosphereMesh = new THREE.Mesh(outerAtmosphereGeo, outerAtmosphereMat);
    planetGroup.add(outerAtmosphereMesh);

    // 7. Lighting - Key sunlight coming from behind the horizon edge
    // Sun position on the horizon curve
    const sunWorldPos = new THREE.Vector3(2.4, 2.0, -1.8);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 4.5);
    sunLight.position.copy(sunWorldPos).add(new THREE.Vector3(1, 1, 3));
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x060c18, 0.4);
    scene.add(ambientLight);

    // 8. Rising Sun Glare & Lens Flare System
    const flareGroup = new THREE.Group();
    flareGroup.position.copy(sunWorldPos);
    scene.add(flareGroup);

    // Helper to generate soft radial glow texture
    const createFlareTexture = (innerColor: string, outerColor: string) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, innerColor);
      g.addColorStop(0.3, outerColor);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    };

    // Central brilliant sun core sprite
    const coreTex = createFlareTexture('rgba(255,255,255,1)', 'rgba(254,240,138,0.7)');
    const coreSpriteMat = new THREE.SpriteMaterial({
      map: coreTex,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(1.4, 1.4, 1);
    flareGroup.add(coreSprite);

    // Broad warm corona flare
    const coronaTex = createFlareTexture('rgba(254,215,170,0.6)', 'rgba(56,189,248,0.2)');
    const coronaSpriteMat = new THREE.SpriteMaterial({
      map: coronaTex,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const coronaSprite = new THREE.Sprite(coronaSpriteMat);
    coronaSprite.scale.set(4.5, 4.5, 1);
    flareGroup.add(coronaSprite);

    // Horizontal anamorphic lens flare streak
    const createStreakTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 32;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 16, 512, 16);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.3, 'rgba(224,242,254,0.4)');
      g.addColorStop(0.5, 'rgba(255,255,255,0.95)');
      g.addColorStop(0.7, 'rgba(224,242,254,0.4)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 14, 512, 4);
      return new THREE.CanvasTexture(c);
    };

    const streakGeo = new THREE.PlaneGeometry(8.5, 0.12);
    const streakMat = new THREE.MeshBasicMaterial({
      map: createStreakTexture(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      opacity: 0.9,
    });
    const streakMesh = new THREE.Mesh(streakGeo, streakMat);
    flareGroup.add(streakMesh);

    // Diagonal subtle diffraction streak
    const diagStreakMesh = streakMesh.clone();
    diagStreakMesh.rotation.z = Math.PI / 4;
    diagStreakMesh.scale.set(0.45, 0.8, 1);
    (diagStreakMesh.material as THREE.MeshBasicMaterial).opacity = 0.5;
    flareGroup.add(diagStreakMesh);

    // 9. Interactive Parallax & Mouse Movement
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCameraX = mouseX * 0.45;
      targetCameraY = -mouseY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 10. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Subtle slow axial rotation of the planet
      planetMesh.rotation.y += 0.0006;

      // Subtle breathing pulse for the rising sun corona
      const pulse = 1.0 + Math.sin(elapsedTime * 2.0) * 0.04;
      coronaSprite.scale.set(4.5 * pulse, 4.5 * pulse, 1);
      coreSprite.scale.set(1.4 * pulse, 1.4 * pulse, 1);

      // Smooth camera parallax following mouse
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      outerAtmosphereGeo.dispose();
      outerAtmosphereMat.dispose();
      coreSpriteMat.dispose();
      coronaSpriteMat.dispose();
      streakGeo.dispose();
      streakMat.dispose();
      if (container && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement);
        } catch {}
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
    />
  );
};
