"use client";

import { useEffect, useRef, useState } from "react";
import PixelIcon from "../components/PixelIcon";

interface Obstacle {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function MiniGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const telemetryRef = useRef<HTMLDivElement | null>(null);
  const loopRef = useRef<number | null>(null);
  
  // Game states inside mutable refs for the canvas requestAnimationFrame loop
  const birdY = useRef(150);
  const birdVelocity = useRef(0);
  const obstacles = useRef<Obstacle[]>([]);
  const particles = useRef<Particle[]>([]);
  const frameCount = useRef(0);
  const currentScore = useRef(0);
  const localGameState = useRef<"idle" | "playing" | "gameover">("idle");
  const hasFlapped = useRef(false);
  
  // Keep local ref in sync with state for access inside loop
  useEffect(() => {
    localGameState.current = gameState;
  }, [gameState]);

  // Load High Score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("flappy_neko_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Set up event listeners for keyboard jumps (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (localGameState.current === "playing") {
          e.preventDefault();
          triggerJump();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Automatically start loop when state changes to playing
  useEffect(() => {
    if (gameState === "playing") {
      if (loopRef.current !== null) {
        cancelAnimationFrame(loopRef.current);
      }
      loopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (loopRef.current !== null) {
        cancelAnimationFrame(loopRef.current);
        loopRef.current = null;
      }
    };
  }, [gameState]);

  const triggerJump = () => {
    if (!hasFlapped.current) {
      hasFlapped.current = true;
    }
    birdVelocity.current = -4.5;
    
    // Spawn glitter particles on jump
    const colors = ["#ff7da7", "#ff548f", "#ff9eba", "#ffffff"];
    for (let i = 0; i < 6; i++) {
      particles.current.push({
        x: 80,
        y: birdY.current,
        vx: -1.5 - Math.random() * 2,
        vy: (Math.random() - 0.5) * 3,
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  const startGame = () => {
    setScore(0);
    currentScore.current = 0;
    birdY.current = 120;
    birdVelocity.current = 0;
    obstacles.current = [
      {
        x: 480,
        topHeight: 70,
        bottomY: 185,
        width: 45,
        passed: false,
      }
    ];
    particles.current = [];
    frameCount.current = 0;
    hasFlapped.current = false;
    setGameState("playing");
  };

  const gameOver = () => {
    setGameState("gameover");
    if (loopRef.current !== null) {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
    }
    
    // Save High Score
    if (currentScore.current > highScore) {
      setHighScore(currentScore.current);
      localStorage.setItem("flappy_neko_highscore", currentScore.current.toString());
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      // If canvas is not rendered yet, retry on the next frame
      loopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. UPDATE PHYSICS
    frameCount.current++;
    
    if (hasFlapped.current) {
      // Bird gravity
      birdVelocity.current += 0.24; // gravity force
      birdY.current += birdVelocity.current;
    } else {
      // Gentle hover floating animation before the first jump
      birdY.current = 120 + Math.sin(frameCount.current * 0.1) * 4;
      birdVelocity.current = 0;
    }
    
    // Direct DOM mutation for diagnostic telemetry (bypasses React state overhead)
    if (telemetryRef.current && frameCount.current % 3 === 0) {
      const statusText = hasFlapped.current ? "PLAYING" : "READY (TAP JUMP)";
      telemetryRef.current.innerHTML = `
        <div>// TELEMETRY:</div>
        <div>NEKO_Y: <span class="text-highlight-color font-bold">${Math.round(birdY.current)} px</span></div>
        <div>SPEED: <span class="font-bold">${hasFlapped.current ? "1.8 px/f" : "0.0 px/f"}</span></div>
        <div>GAP_WIDTH: <span class="font-bold">115 px</span></div>
        <div>STATUS: <span class="text-highlight-color font-bold">${statusText}</span></div>
      `;
    }

    // Ceiling & Floor collisions
    if (birdY.current < 10) {
      birdY.current = 10;
      birdVelocity.current = 0;
    }
    if (birdY.current > height - 12) {
      gameOver();
      return;
    }

    // Spawn obstacles every 125 frames (only after first jump)
    if (hasFlapped.current && frameCount.current % 125 === 0) {
      const gap = 115;
      const minHeight = 40;
      const maxHeight = height - gap - minHeight;
      const topHeight = minHeight + Math.floor(Math.random() * (maxHeight - minHeight));
      
      obstacles.current.push({
        x: width,
        topHeight,
        bottomY: topHeight + gap,
        width: 45,
        passed: false,
      });
    }

    // Move and filter obstacles
    for (let i = obstacles.current.length - 1; i >= 0; i--) {
      const obs = obstacles.current[i];
      if (hasFlapped.current) {
        obs.x -= 1.8; // scroll speed (slowed down from 2.2 for better reaction time)
      }

      // Collision detection
      const birdBox = {
        left: 80 - 14,
        right: 80 + 14,
        top: birdY.current - 10,
        bottom: birdY.current + 10,
      };

      const obsTopBox = {
        left: obs.x,
        right: obs.x + obs.width,
        top: 0,
        bottom: obs.topHeight,
      };

      const obsBottomBox = {
        left: obs.x,
        right: obs.x + obs.width,
        top: obs.bottomY,
        bottom: height,
      };

      const checkCollision = (box1: typeof birdBox, box2: typeof obsTopBox) => {
        return (
          box1.left < box2.right &&
          box1.right > box2.left &&
          box1.top < box2.bottom &&
          box1.bottom > box2.top
        );
      };

      if (checkCollision(birdBox, obsTopBox) || checkCollision(birdBox, obsBottomBox)) {
        gameOver();
        return;
      }

      // Point tracking
      if (!obs.passed && obs.x + obs.width < 80) {
        obs.passed = true;
        currentScore.current++;
        setScore(currentScore.current);
        
        // Spawn success particles
        const colors = ["#ffff00", "#52ff7d", "#ffffff"];
        for (let k = 0; k < 8; k++) {
          particles.current.push({
            x: obs.x + obs.width / 2,
            y: height / 2,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }

      // Remove offscreen obstacles
      if (obs.x + obs.width < -10) {
        obstacles.current.splice(i, 1);
      }
    }

    // Move particles
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) {
        particles.current.splice(i, 1);
      }
    }

    // 2. RENDERING GAME SCENE
    ctx.clearRect(0, 0, width, height);

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#ffe8f0");
    bgGrad.addColorStop(1, "#fffafc");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) {
      const darkBg = ctx.createLinearGradient(0, 0, 0, height);
      darkBg.addColorStop(0, "#1a081c");
      darkBg.addColorStop(1, "#0b050d");
      ctx.fillStyle = darkBg;
      ctx.fillRect(0, 0, width, height);
    }

    // Background stars
    ctx.fillStyle = isDarkMode ? "rgba(255, 125, 167, 0.15)" : "rgba(219, 107, 143, 0.08)";
    for (let sIdx = 0; sIdx < 5; sIdx++) {
      const starX = ((frameCount.current * 0.4 + sIdx * 90) % (width + 40)) - 20;
      const starY = (sIdx * 65) % (height - 30) + 15;
      ctx.fillRect(starX, starY - 3, 2, 8);
      ctx.fillRect(starX - 3, starY, 8, 2);
    }

    // Obstacles
    obstacles.current.forEach((obs) => {
      ctx.fillStyle = isDarkMode ? "#221025" : "#ffe8f0";
      ctx.strokeStyle = isDarkMode ? "#ff7da7" : "#db6b8f";
      ctx.lineWidth = 2.5;

      ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
      ctx.strokeRect(obs.x, -2, obs.width, obs.topHeight + 2);
      
      ctx.fillRect(obs.x, obs.bottomY, obs.width, height - obs.bottomY);
      ctx.strokeRect(obs.x, obs.bottomY, obs.width, height - obs.bottomY + 2);

      ctx.fillStyle = isDarkMode ? "#5e3046" : "#e8a0b8";
      ctx.fillRect(obs.x - 3, obs.topHeight - 12, obs.width + 6, 12);
      ctx.strokeRect(obs.x - 3, obs.topHeight - 12, obs.width + 6, 12);
      
      ctx.fillRect(obs.x - 3, obs.bottomY, obs.width + 6, 12);
      ctx.strokeRect(obs.x - 3, obs.bottomY, obs.width + 6, 12);
    });

    // Particles
    particles.current.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1.0;

    // Bird (Neko)
    ctx.save();
    ctx.translate(80, birdY.current);
    
    const rotation = Math.max(-0.4, Math.min(0.6, birdVelocity.current * 0.08));
    ctx.rotate(rotation);
    
    ctx.fillStyle = isDarkMode ? "#ff7da7" : "#db6b8f";
    ctx.fillRect(-12, -8, 24, 16);
    
    ctx.beginPath();
    ctx.moveTo(-6, -8);
    ctx.lineTo(-4, -13);
    ctx.lineTo(-2, -8);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(2, -8);
    ctx.lineTo(4, -13);
    ctx.lineTo(6, -8);
    ctx.fill();
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(4, -4, 3, 3);
    ctx.fillStyle = isDarkMode ? "#1a081c" : "#5c3a48";
    ctx.fillRect(5, -3, 1.5, 1.5);
    
    ctx.fillStyle = "#ff548f";
    ctx.fillRect(1, 0, 2, 1.5);

    ctx.fillStyle = isDarkMode ? "#ff7da7" : "#db6b8f";
    ctx.fillRect(-18, -2, 6, 4);
    ctx.fillRect(-18, -6, 3, 4);

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = isDarkMode ? "#ff7da7" : "#db6b8f";
    ctx.lineWidth = 1;
    
    const isFlappingUp = birdVelocity.current < 0;
    ctx.save();
    ctx.translate(-2, -2);
    if (isFlappingUp) {
      ctx.rotate(-0.3);
    } else {
      ctx.rotate(0.3);
    }
    ctx.fillRect(-4, -7, 8, 7);
    ctx.strokeRect(-4, -7, 8, 7);
    ctx.restore();

    ctx.restore();

    // Loop Frame
    if (localGameState.current === "playing") {
      loopRef.current = requestAnimationFrame(gameLoop);
    }
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5 select-none">
          <PixelIcon name="laptop-code" solid size={11} />
          neko_flap.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      {/* Split-Screen Dashboard Layout */}
      <div className="p-4 flex flex-col lg:flex-row gap-4 items-stretch">
        
        {/* Left Column: The CRT Arcade Screen (Responsive Full-Width Viewer) */}
        <div 
          className="w-full lg:flex-1 relative overflow-hidden bg-cream/20 dark:bg-bg-alt/10 border-2 border-border-accent flex items-center justify-center min-w-0"
          style={{ height: "300px" }}
        >
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,10,18,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] z-10 opacity-40" />

          {gameState === "idle" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <div className="text-highlight-color animate-pixel-float mb-3 flex gap-2">
                <PixelIcon name="robot" solid size={40} />
              </div>
              
              <h3 className="pixel-heading font-jersey text-3xl text-highlight-color uppercase tracking-widest leading-none">
                FLAPPY NEKO
              </h3>
              
              <p className="text-[10px] text-text-muted mt-2 max-w-xs leading-relaxed uppercase font-bold font-mono">
                [ Click Jump button or Tap screen to start ]
                <br />
                dodge server pillars to score
              </p>

              <button
                onClick={startGame}
                className="mt-5 px-5 py-2.5 bg-highlight-color text-cream font-jersey text-base uppercase tracking-widest border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-0 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer"
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === "playing" && (
            <canvas
              ref={canvasRef}
              width={500}
              height={300}
              onClick={triggerJump}
              className="block cursor-pointer"
              style={{ width: "100%", height: "100%" }}
            />
          )}

          {gameState === "gameover" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <h3 className="pixel-heading font-jersey text-4xl text-raspberry dark:text-highlight-color uppercase tracking-widest leading-none animate-pulse">
                GAME OVER
              </h3>
              
              <div className="flex gap-4 mt-4 font-mono font-bold text-xs text-text-base uppercase bg-cream dark:bg-bg-base border-2 border-border-accent p-3.5 shadow-[2px_2px_0_var(--shadow-color)]">
                <div>
                  Score: <span className="text-highlight-color font-black">{score}</span>
                </div>
                <div className="w-px bg-border-accent/30 self-stretch" />
                <div>
                  High Score: <span className="text-highlight-color font-black">{highScore}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-highlight-color text-cream font-jersey text-sm uppercase tracking-widest border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-0 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer"
                >
                  Restart
                </button>
                <button
                  onClick={() => setGameState("idle")}
                  className="px-4 py-2 bg-cream dark:bg-bg-base text-text-muted font-jersey text-sm uppercase tracking-widest border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-0 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer"
                >
                  Menu
                </button>
              </div>
            </div>
          )}

          {/* Running Score HUD */}
          {gameState === "playing" && (
            <div className="absolute top-3 left-3 bg-cream/90 dark:bg-bg-base/90 border-2 border-border-accent px-2.5 py-1 font-mono text-xs font-bold text-highlight-color tracking-wide z-20 pointer-events-none select-none">
              SCORE: {score}
            </div>
          )}
        </div>

        {/* Right Column: Retro Diagnostic Control Deck (Space Optimizer) */}
        <div className="w-full lg:w-72 flex flex-col gap-3 bg-peach/15 dark:bg-card-bg border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] p-4 relative justify-between">
          <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-blush" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-blush" />
          <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-blush" />
          <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-blush" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-accent/30 pb-2">
            <span className="text-[10px] font-mono font-bold text-highlight-color uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#52ff7d] rounded-full animate-pulse shadow-[0_0_6px_#52ff7d]" />
              [ diagnostic_deck ]
            </span>
            <span className="text-[9px] font-mono text-text-muted">
              v1.2.0-easy
            </span>
          </div>

          {/* Stats readouts */}
          <div className="bg-cream dark:bg-bg-base border border-border-accent p-2.5 font-mono flex flex-col gap-1.5 shadow-inner">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-text-muted uppercase">Score:</span>
              <span className="text-highlight-color font-black">{score}</span>
            </div>
            <div className="flex justify-between text-xs font-bold border-t border-border-accent/15 pt-1.5 mt-1.5">
              <span className="text-text-muted uppercase">High Score:</span>
              <span className="text-highlight-color font-black">{highScore} pts</span>
            </div>
          </div>

          {/* Large Interactive System Control Button */}
          <div className="flex flex-col gap-2">
            {gameState === "playing" ? (
              <button
                type="button"
                onClick={triggerJump}
                className="w-full py-3.5 bg-highlight-color text-cream font-jersey text-lg uppercase tracking-widest border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <PixelIcon name="bolt" solid size={14} />
                JUMP!
              </button>
            ) : (
              <button
                type="button"
                onClick={startGame}
                className="w-full py-3.5 bg-highlight-color text-cream font-jersey text-lg uppercase tracking-widest border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] hover:shadow-[3px_3px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <PixelIcon name="star" solid size={14} />
                {gameState === "gameover" ? "REPLAY" : "LAUNCH"}
              </button>
            )}
          </div>

          {/* Diagnostics Telemetry Logs (Bypasses React renders) */}
          <div 
            ref={telemetryRef}
            className="border border-border-accent/30 bg-cream/40 dark:bg-bg-alt/30 p-2.5 rounded-sm text-[9px] font-mono text-text-muted leading-normal flex flex-col gap-0.5 select-none"
          >
            <div>// TELEMETRY:</div>
            <div>NEKO_Y: <span className="text-highlight-color font-bold">150 px</span></div>
            <div>SPEED: <span className="font-bold">1.8 px/f</span></div>
            <div>GAP_WIDTH: <span className="font-bold">115 px</span></div>
            <div>STATUS: <span className="text-highlight-color font-bold">{gameState.toUpperCase()}</span></div>
          </div>

        </div>
      </div>
    </div>
  );
}
