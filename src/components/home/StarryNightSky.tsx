import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export const StarryNightSky: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const MAX_STARS = 1500;
      const starCount = Math.min(Math.floor((canvas.width * canvas.height) / 2800), MAX_STARS);
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.4 + 0.3,
        opacity: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const drawSkyGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#02040a');
      gradient.addColorStop(0.35, '#070d1f');
      gradient.addColorStop(0.65, '#0a1128');
      gradient.addColorStop(1, '#060913');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula glow accents
      const nebula1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.45
      );
      nebula1.addColorStop(0, 'rgba(30, 58, 138, 0.07)');
      nebula1.addColorStop(1, 'rgba(30, 58, 138, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.6, 0,
        canvas.width * 0.8, canvas.height * 0.6, canvas.width * 0.35
      );
      nebula2.addColorStop(0, 'rgba(88, 28, 135, 0.05)');
      nebula2.addColorStop(1, 'rgba(88, 28, 135, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula3 = ctx.createRadialGradient(
        canvas.width * 0.55, canvas.height * 0.15, 0,
        canvas.width * 0.55, canvas.height * 0.15, canvas.width * 0.3
      );
      nebula3.addColorStop(0, 'rgba(6, 182, 212, 0.04)');
      nebula3.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = nebula3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = (time: number) => {
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.65;
        const currentOpacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        // Brighter stars get a subtle glow
        if (star.radius > 1.0) {
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 4
          );
          glow.addColorStop(0, `rgba(200, 220, 255, ${currentOpacity * 0.25})`);
          glow.addColorStop(1, 'rgba(200, 220, 255, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(
            star.x - star.radius * 4,
            star.y - star.radius * 4,
            star.radius * 8,
            star.radius * 8
          );
        }
      });
    };

    const drawShootingStars = () => {
      shootingStars = shootingStars.filter((s) => s.life < s.maxLife);

      shootingStars.forEach((s) => {
        const progress = s.life / s.maxLife;
        const currentOpacity = progress < 0.2
          ? progress / 0.2
          : progress > 0.7
            ? (1 - progress) / 0.3
            : 1;

        const tailX = s.x - Math.cos(s.angle) * s.length * progress;
        const tailY = s.y - Math.sin(s.angle) * s.length * progress;

        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.9})`);
        gradient.addColorStop(0.3, `rgba(180, 210, 255, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(180, 210, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      });
    };

    const maybeSpawnShootingStar = (time: number) => {
      if (time - lastShootingStarTime > 3000 + Math.random() * 5000) {
        lastShootingStarTime = time;
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
          y: Math.random() * canvas.height * 0.3,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 14 + 10,
          angle: Math.PI * 0.7 + Math.random() * 0.3,
          opacity: 1,
          life: 0,
          maxLife: 60 + Math.random() * 30,
        });
      }
    };

    const updateShootingStars = () => {
      shootingStars.forEach((s) => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life++;
      });
    };

    const animate = (time: number) => {
      drawSkyGradient();
      drawStars(time);
      maybeSpawnShootingStar(time);
      updateShootingStars();
      drawShootingStars();
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);

    if (prefersReducedMotion) {
      // Render a single static frame for reduced motion users
      drawSkyGradient();
      drawStars(0);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
