"use client";

import { useEffect, useRef, useState } from "react";

interface Petal {
  x: number;
  y: number;
  z: number;
  swaySpeed: number;
  swayRange: number;
  swayAngle: number;
  rotation: number;
  rotationSpeed: number;
  xSpeedVariation: number;
  ySpeed: number;
  sprite: { sx: number; sy: number; sw: number; sh: number };
}

const SPRITES = [
  { sx: 31, sy: 0, sw: 45, sh: 20 },
  { sx: 0, sy: 23, sw: 42, sh: 22 },
  { sx: 0, sy: 50, sw: 37, sh: 24 },
  { sx: 49, sy: 35, sw: 26, sh: 34 }
];

export default function CherryBlossoms() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Initialize mounting state
  useEffect(() => {
    setMounted(true);
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Set up canvas and start falling loop once component is mounted
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resizeCanvas = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);

    // Initial wind dynamics
    let windMagnitude = 0.15;
    let windDuration = 150;
    let windTimer = 0;
    let windMaxSpeed = 2.5;

    const resetPetal = (p: Petal, isInitial = false) => {
      p.x = Math.random() * width;
      p.y = isInitial ? Math.random() * height : -40 - Math.random() * 80;
      p.z = Math.random() * 200;
      p.swaySpeed = Math.random() * 0.03 + 0.015;
      p.swayRange = Math.random() * 30 + 15;
      p.swayAngle = Math.random() * Math.PI * 2;
      p.rotation = Math.random() * 360;
      p.rotationSpeed = Math.random() * 1.5 + 0.5;
      p.xSpeedVariation = Math.random() * 0.4 - 0.2;
      p.ySpeed = Math.random() * 0.8 + 0.6; // gravity base speed
      p.sprite = SPRITES[Math.floor(Math.random() * SPRITES.length)];
    };

    // Initialize 45 petals distributed throughout screen height
    const petals: Petal[] = [];
    for (let i = 0; i < 45; i++) {
      const p: Petal = {
        x: 0, y: 0, z: 0, swaySpeed: 0, swayRange: 0, swayAngle: 0,
        rotation: 0, rotationSpeed: 0, xSpeedVariation: 0, ySpeed: 0,
        sprite: SPRITES[0]
      };
      resetPetal(p, true);
      petals.push(p);
    }
    petalsRef.current = petals;

    // Load sprite sheet image
    const spriteImage = new Image();
    spriteImage.src = "/backgrounds/cherry-blossom.png";
    spriteImage.onload = () => {
      imageRef.current = spriteImage;
      startLoop();
    };

    const calculateWindSpeed = (t: number, y: number) => {
      const a = (windMagnitude / 2) * (height - (2 * y) / 3) / height;
      return a * Math.sin((2 * Math.PI / windDuration) * t + (3 * Math.PI / 2)) + a;
    };

    const updateWind = () => {
      windMagnitude = Math.random() * windMaxSpeed;
      windDuration = Math.floor(windMagnitude * 75 + (Math.random() * 30 - 15));
      if (windDuration <= 0) windDuration = 150;
    };

    const startLoop = () => {
      const updateFrame = () => {
        if (!canvas || !ctx || !imageRef.current) return;

        // Clear full screen
        ctx.clearRect(0, 0, width, height);

        // Wind ticks
        if (windTimer >= windDuration) {
          updateWind();
          windTimer = 0;
        }

        const isDarkMode = document.documentElement.classList.contains("dark");
        const isPaused = document.documentElement.classList.contains("sakura-paused");
        const list = petalsRef.current;

        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          
          if (!isPaused) {
            p.swayAngle += p.swaySpeed;
            const currentWind = calculateWindSpeed(windTimer, p.y);
            
            // Move coords
            p.x += currentWind + p.xSpeedVariation + Math.cos(p.swayAngle) * 0.4;
            p.y += p.ySpeed + Math.sin(p.swayAngle) * 0.15;
            p.rotation += p.rotationSpeed;
          }

          // Depth mapping z (0..200) to visual sizes
          const depthPercent = p.z / 200;
          const scale = 0.35 + depthPercent * 0.65;
          
          let opacity = 0.28 + depthPercent * 0.52;
          if (isDarkMode) {
            opacity = Math.min(0.95, opacity + 0.18);
          }

          // Composite render
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(scale, scale);
          ctx.globalAlpha = opacity;

          ctx.drawImage(
            imageRef.current,
            p.sprite.sx,
            p.sprite.sy,
            p.sprite.sw,
            p.sprite.sh,
            -p.sprite.sw / 2,
            -p.sprite.sh / 2,
            p.sprite.sw,
            p.sprite.sh
          );

          ctx.restore();

          // Reset if flows off bounds (only update if not paused to avoid shifting resets)
          if (!isPaused && (p.y > height + 40 || p.x < -60 || p.x > width + 60)) {
            resetPetal(p, false);
            p.y = -30;
          }
        }

        if (!isPaused) {
          windTimer++;
        }
        animFrameIdRef.current = requestAnimationFrame(updateFrame);
      };

      animFrameIdRef.current = requestAnimationFrame(updateFrame);
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ mixBlendMode: "normal", zIndex: -1 }}
    />
  );
}
