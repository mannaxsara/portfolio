"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: "heart" | "star" | "bubble";
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("custom-cursor-active");

    // Track mouse coordinates directly on the DOM ref (bypasses React re-renders)
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    // Track hover states on interactive controls directly via CSS class addition
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !cursorRef.current) return;
      
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.tagName === "INPUT" || 
        target.tagName === "SELECT" || 
        target.tagName === "TEXTAREA" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest(".cursor-pointer") ||
        target.classList.contains("cursor-pointer");
        
      if (isInteractive) {
        cursorRef.current.classList.add("hovered");
      } else {
        cursorRef.current.classList.remove("hovered");
      }
    };

    // Animation loop runs ONLY when active click particles exist (sleeping otherwise)
    const startParticleLoop = () => {
      if (animFrameIdRef.current !== null) return; // already spinning

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        c.save();
        c.translate(x, y);
        c.rotate(rotation);
        c.beginPath();
        c.moveTo(0, size / 4);
        c.quadraticCurveTo(0, -size / 2, -size / 2, -size / 2);
        c.quadraticCurveTo(-size, -size / 2, -size, size / 4);
        c.quadraticCurveTo(-size, size * 0.8, 0, size * 1.3);
        c.quadraticCurveTo(size, size * 0.8, size, size / 4);
        c.quadraticCurveTo(size, -size / 2, size / 2, -size / 2);
        c.quadraticCurveTo(0, -size / 2, 0, size / 4);
        c.closePath();
        c.fill();
        c.restore();
      };

      const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        c.save();
        c.translate(x, y);
        c.rotate(rotation);
        c.beginPath();
        const spikes = 4;
        const outerRadius = size;
        const innerRadius = size / 2.5;
        let rot = (Math.PI / 2) * 3;
        let cx = 0;
        let cy = -outerRadius;
        c.moveTo(cx, cy);
        for (let i = 0; i < spikes; i++) {
          cx = Math.cos(rot) * outerRadius;
          cy = Math.sin(rot) * outerRadius;
          c.lineTo(cx, cy);
          rot += Math.PI / spikes;

          cx = Math.cos(rot) * innerRadius;
          cy = Math.sin(rot) * innerRadius;
          c.lineTo(cx, cy);
          rot += Math.PI / spikes;
        }
        c.closePath();
        c.fill();
        c.restore();
      };

      const updateParticles = () => {
        const particles = particlesRef.current;
        if (particles.length === 0) {
          // No particles left: clear canvas and sleep loop
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          animFrameIdRef.current = null;
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.vy += 0.15; // gravity
          p.vx *= 0.98; // friction
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.life -= 1 / p.maxLife;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;

          if (p.type === "heart") {
            drawHeart(ctx, p.x, p.y, p.size, p.rotation);
          } else if (p.type === "star") {
            drawStar(ctx, p.x, p.y, p.size, p.rotation);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1.0;
        animFrameIdRef.current = requestAnimationFrame(updateParticles);
      };

      animFrameIdRef.current = requestAnimationFrame(updateParticles);
    };

    const spawnParticles = (e: MouseEvent) => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 120);

      const colors = ["#ff9eb8", "#db6b8f", "#ffc4d6", "#fff0f6", "#ffd0e0"];
      const particleTypes: ("heart" | "star" | "bubble")[] = ["heart", "star", "bubble"];
      
      const count = 10 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 4 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
          life: 1.0,
          maxLife: 30 + Math.floor(Math.random() * 20),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
        });
      }

      startParticleLoop();
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", spawnParticles);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", spawnParticles);
      document.documentElement.classList.remove("custom-cursor-active");
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Initialize Canvas resize listeners
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[999999]"
      />
      
      {/* 
        Custom hardware-accelerated cursor element.
        Positioned directly on translation composites rather than React render cycles.
      */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[999998] hidden md:block select-none"
        style={{
          width: "28px",
          height: "28px",
          marginTop: "-14px",
          marginLeft: "-14px",
          willChange: "transform",
        }}
      >
        <div 
          className="cursor-visual transition-transform duration-200 ease-out"
          style={{
            transform: isClicked ? "scale(0.85)" : "scale(1)",
          }}
        >
          {/* Default arrow visual */}
          <div className="arrow-visual flex relative">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              className="drop-shadow-[2px_2px_1px_rgba(212,137,168,0.3)]"
            >
              <path
                d="M0 0l4 18 4.5-5.5 5.5 5.5 2-2-5.5-5.5 6.5-1.5z"
                fill="#fff5f8"
                stroke="#db6b8f"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 text-highlight-color animate-heart-beat">
              <svg width="10" height="10" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#db6b8f"
                />
              </svg>
            </div>
          </div>

          {/* Hover visual */}
          <div className="hover-visual hidden">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              className="drop-shadow-[2px_2px_2px_rgba(212,137,168,0.4)]"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#ff9eb8"
                stroke="#db6b8f"
                strokeWidth="1.8"
              />
            </svg>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Interactive morph display states */
        .custom-cursor-active * {
          cursor: none !important;
        }
        .hovered .arrow-visual {
          display: none !important;
        }
        .hovered .hover-visual {
          display: block !important;
        }
        .hovered {
          transform-origin: center center;
        }
      `}} />
    </>
  );
}
