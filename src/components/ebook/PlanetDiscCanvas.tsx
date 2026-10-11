import React, { useEffect, useRef } from 'react';

interface PlanetDiscCanvasProps {
  planetId: string;
  size?: number; // size in px
  className?: string;
}

export const PlanetDiscCanvas: React.FC<PlanetDiscCanvasProps> = ({
  planetId,
  size = 140,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.38;

    ctx.clearRect(0, 0, size, size);

    // Save context
    ctx.save();

    if (planetId === 'saturn') {
      // Saturn has back ring, planet sphere, then front ring!
      const ringOuterR = radius * 1.85;
      const ringInnerR = radius * 1.25;
      const ringTilt = -0.32; // angle in radians

      // 1. Back portion of Saturn's rings (drawn behind planet)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(ringTilt);
      ctx.scale(1, 0.32);

      // Clip to upper half (behind planet)
      ctx.beginPath();
      ctx.rect(-ringOuterR - 20, -ringOuterR - 20, (ringOuterR + 20) * 2, ringOuterR + 20);
      ctx.clip();

      drawSaturnRings(ctx, 0, 0, ringInnerR, ringOuterR);
      ctx.restore();

      // 2. Saturn Planet Body
      drawPlanetSphere(ctx, centerX, centerY, radius, planetId);

      // 3. Front portion of Saturn's rings (drawn in front of planet)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(ringTilt);
      ctx.scale(1, 0.32);

      // Clip to lower half (in front of planet)
      ctx.beginPath();
      ctx.rect(-ringOuterR - 20, 0, (ringOuterR + 20) * 2, ringOuterR + 20);
      ctx.clip();

      drawSaturnRings(ctx, 0, 0, ringInnerR, ringOuterR);
      ctx.restore();

    } else if (planetId === 'uranus') {
      // Uranus has very faint thin ring
      drawPlanetSphere(ctx, centerX, centerY, radius, planetId);

      // Delicate thin cyan ring ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.8);
      ctx.scale(1, 0.22);
      ctx.strokeStyle = 'rgba(165, 243, 252, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

    } else {
      // Standard spherical planet body
      drawPlanetSphere(ctx, centerX, centerY, radius, planetId);
    }

    ctx.restore();

  }, [planetId, size]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: size, height: size }}
      className={`select-none pointer-events-none transition-transform duration-500 ease-out group-hover:scale-105 ${className}`}
    />
  );
};

// Helper to draw Saturn rings
function drawSaturnRings(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  innerR: number,
  outerR: number
) {
  const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
  grad.addColorStop(0, 'rgba(217, 180, 110, 0.2)');
  grad.addColorStop(0.2, 'rgba(234, 204, 142, 0.85)');
  grad.addColorStop(0.45, 'rgba(202, 168, 104, 0.9)');
  // Cassini division (dark band)
  grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.25)');
  grad.addColorStop(0.60, 'rgba(217, 180, 110, 0.7)');
  grad.addColorStop(0.9, 'rgba(234, 204, 142, 0.75)');
  grad.addColorStop(1, 'rgba(202, 168, 104, 0.05)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
  ctx.fill();
}

// Helper to draw a shaded planet sphere
function drawPlanetSphere(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  planetId: string
) {
  ctx.save();

  // Create clipping circle for sphere
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (planetId === 'mercury') {
    // 1. Mercury - Grey cratered rocky world
    const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    grad.addColorStop(0, '#d1d5db');
    grad.addColorStop(0.4, '#9ca3af');
    grad.addColorStop(0.75, '#4b5563');
    grad.addColorStop(1, '#111827');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Craters and regolith texture
    ctx.fillStyle = 'rgba(55, 65, 81, 0.55)';
    const craters = [
      [-0.2, -0.3, 0.18], [0.15, -0.1, 0.12], [-0.3, 0.2, 0.14],
      [0.2, 0.25, 0.2], [-0.05, 0.05, 0.1], [0.3, -0.25, 0.15],
      [-0.15, -0.4, 0.08], [0.1, 0.4, 0.11]
    ];
    craters.forEach(([dx, dy, cr]) => {
      ctx.beginPath();
      ctx.arc(cx + dx * r, cy + dy * r, cr * r, 0, Math.PI * 2);
      ctx.fill();
    });

  } else if (planetId === 'venus') {
    // 2. Venus - Creamy golden dense atmosphere
    const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.3, '#fde047');
    grad.addColorStop(0.65, '#ca8a04');
    grad.addColorStop(0.9, '#854d0e');
    grad.addColorStop(1, '#291804');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Marbled atmospheric swirls
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy + i * r * 0.25, r * 0.95, r * 0.12, 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (planetId === 'earth') {
    // 3. Earth - Deep blue oceans, green continents, white cloud swirls
    const oceanGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    oceanGrad.addColorStop(0, '#38bdf8');
    oceanGrad.addColorStop(0.3, '#0284c7');
    oceanGrad.addColorStop(0.7, '#0369a1');
    oceanGrad.addColorStop(0.95, '#082f49');
    oceanGrad.addColorStop(1, '#020617');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Continents
    ctx.fillStyle = '#15803d';
    // Africa / Europe patch
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.05, cy - r * 0.1, r * 0.35, r * 0.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Asia patch
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.3, cy - r * 0.25, r * 0.4, r * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Americas patch
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.45, cy + r * 0.15, r * 0.25, r * 0.45, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Swirling clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, cy - r * 0.2, r * 0.8, r * 0.15, 0.1, 0, Math.PI * 2);
    ctx.ellipse(cx - r * 0.2, cy + r * 0.25, r * 0.6, r * 0.12, -0.2, 0, Math.PI * 2);
    ctx.ellipse(cx + r * 0.2, cy + r * 0.45, r * 0.5, r * 0.1, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Polar caps
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.9, r * 0.3, 0, Math.PI * 2);
    ctx.fill();

  } else if (planetId === 'mars') {
    // 4. Mars - Rusty iron red with basalt dark spots and ice cap
    const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(0.35, '#ea580c');
    grad.addColorStop(0.7, '#c2410c');
    grad.addColorStop(0.9, '#7c2d12');
    grad.addColorStop(1, '#2a0a03');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Dark volcanic basalt patches
    ctx.fillStyle = 'rgba(67, 20, 7, 0.6)';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.1, cy + r * 0.05, r * 0.5, r * 0.22, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.2, cy - r * 0.2, r * 0.35, r * 0.18, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // North polar ice cap
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx - r * 0.1, cy - r * 0.88, r * 0.22, 0, Math.PI * 2);
    ctx.fill();

  } else if (planetId === 'jupiter') {
    // 5. Jupiter - Warm alternating bands with Great Red Spot
    const bands = [
      '#fef3c7', '#d97706', '#b45309', '#fef3c7', '#92400e',
      '#d97706', '#fef3c7', '#b45309', '#d97706', '#fef3c7'
    ];
    const bandH = (r * 2) / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(cx - r, cy - r + i * bandH, r * 2, bandH + 1);
    });

    // Great Red Spot
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.32, cy + r * 0.22, r * 0.24, r * 0.14, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.32, cy + r * 0.22, r * 0.16, r * 0.09, -0.05, 0, Math.PI * 2);
    ctx.fill();

  } else if (planetId === 'saturn') {
    // 6. Saturn - Warm butterscotch golden banded body
    const bands = [
      '#fef08a', '#eab308', '#ca8a04', '#fef08a', '#a16207',
      '#eab308', '#fef08a', '#ca8a04', '#eab308'
    ];
    const bandH = (r * 2) / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(cx - r, cy - r + i * bandH, r * 2, bandH + 1);
    });

  } else if (planetId === 'uranus') {
    // 7. Uranus - Smooth aquamarine / cyan atmosphere
    const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    grad.addColorStop(0, '#a5f3fc');
    grad.addColorStop(0.35, '#22d3ee');
    grad.addColorStop(0.7, '#06b6d4');
    grad.addColorStop(0.9, '#0891b2');
    grad.addColorStop(1, '#0e3a47');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Subtle faint band
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(cx - r, cy - r * 0.1, r * 2, r * 0.2);

  } else if (planetId === 'neptune') {
    // 8. Neptune - Intense royal cobalt azure blue with white cirrus
    const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    grad.addColorStop(0, '#60a5fa');
    grad.addColorStop(0.3, '#2563eb');
    grad.addColorStop(0.7, '#1d4ed8');
    grad.addColorStop(0.9, '#1e3a8a');
    grad.addColorStop(1, '#0b1636');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // White cirrus streak
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.1, cy + r * 0.15, r * 0.65, r * 0.05, 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Dark spot
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.25, cy - r * 0.2, r * 0.22, r * 0.12, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Common Spherical Shading Overlay for 3D realism
  const shadowGrad = ctx.createRadialGradient(
    cx - r * 0.45, cy - r * 0.45, r * 0.2,
    cx, cy, r
  );
  shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.6)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  // Rim atmosphere glow on illuminated crescent edge
  const rimGrad = ctx.createRadialGradient(
    cx - r * 0.5, cy - r * 0.5, r * 0.7,
    cx - r * 0.5, cy - r * 0.5, r * 1.1
  );
  rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  rimGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.35)');
  rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rimGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

  ctx.restore();
}
