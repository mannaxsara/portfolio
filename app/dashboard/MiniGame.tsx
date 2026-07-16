"use client";

import { useEffect, useRef, useState } from "react";
import PixelIcon from "../components/PixelIcon";

interface Pipe {
  id: string;
  x: number; // percentage [0, 100]
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

interface JumpParticle {
  id: string;
  x: number; // percentage
  y: number; // pixels
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function MiniGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const [nekoY, setNekoY] = useState(110);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [particles, setParticles] = useState<JumpParticle[]>([]);

  const nekoYRef = useRef(110);
  const nekoVelocity = useRef(0);
  const tickCount = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);

  // Sync ref for tick intervals
  useEffect(() => {
    nekoYRef.current = nekoY;
  }, [nekoY]);

  // Load High Score from sessionStorage on mount (Session-based)
  useEffect(() => {
    const saved = sessionStorage.getItem("neko_flap_cyber_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Web Audio API Retro Sound Effects Synth
  const playSound = (type: "jump" | "point" | "crash" | "gameover") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === "jump") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "point") {
        osc.type = "square";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.07); // A5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === "crash") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(20, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "gameover") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(293.66, now); // D4
        osc.frequency.setValueAtTime(220, now + 0.12); // A3
        osc.frequency.setValueAtTime(146.83, now + 0.24); // D3
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Audio context blocked
    }
  };

  // Keyboard Space/Jump listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.repeat) return; // Prevent key hold repeat flying
      if (e.key === "Space" || e.key === " " || e.key === "ArrowUp" || e.key === "KeyW" || e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Main game tick loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameInterval = setInterval(() => {
      tickCount.current++;
      let scoreGained = 0;
      let crashed = false;

      // 1. UPDATE PHYSICS
      nekoVelocity.current += 0.50; // Gravity
      const nextY = nekoYRef.current + nekoVelocity.current;

      // Ground Check (Floor limit is 256px minus 32px height = 224px)
      if (nextY >= 224) {
        crashed = true;
        setNekoY(224);
      } else if (nextY <= 0) {
        setNekoY(0);
        nekoVelocity.current = 0.5;
      } else {
        setNekoY(nextY);
      }

      // 2. PIPES PHYSICS (Read & Mutate ref directly to avoid stale react closures)
      const nextPipes = pipesRef.current.map((pipe) => ({
        ...pipe,
        x: pipe.x - 0.8, // Scroll speed percentage (slower for better control)
      }));

      const remaining: Pipe[] = [];

      nextPipes.forEach((pipe) => {
        // Check Score passing point (Neko is at left: 25%)
        if (!pipe.passed && pipe.x < 25) {
          pipe.passed = true;
          scoreGained++;
        }

        // Strict percentage-based horizontal box overlap check
        // Neko occupies range: [25%, 32%] (7% width)
        // Pipe occupies range: [pipe.x, pipe.x + 13.5%] (13.5% width)
        const xOverlap = pipe.x < 32 && pipe.x + 13.5 > 25;
        if (xOverlap) {
          const hitTop = nekoYRef.current < pipe.topHeight;
          const hitBottom = nekoYRef.current + 30 > 256 - pipe.bottomHeight;
          if (hitTop || hitBottom) {
            crashed = true;
          }
        }

        if (pipe.x > -20) {
          remaining.push(pipe);
        }
      });

      pipesRef.current = remaining;
      setPipes(remaining); // Sync to react state for rendering

      // Spawn pipes every 80 ticks
      if (tickCount.current % 80 === 0) {
        spawnPipe();
      }

      // 3. COLLISION RESPONSE
      if (crashed) {
        playSound("crash");
        spawnExplosion(28, nekoYRef.current + 16, "#ff548f"); // 28% left
        setGameState("gameover");
        playSound("gameover");
      }

      if (scoreGained > 0) {
        playSound("point");
        setScore((s) => s + scoreGained);
      }

      // 4. PARTICLES PHYSICS
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.08,
          }))
          .filter((p) => p.life > 0)
      );

    }, 30);

    return () => clearInterval(gameInterval);
  }, [gameState]);

  // Save score on Game Over (Session-based)
  useEffect(() => {
    if (gameState === "gameover") {
      if (score > highScore) {
        setHighScore(score);
        sessionStorage.setItem("neko_flap_cyber_highscore", score.toString());
      }
    }
  }, [gameState, score, highScore]);

  const jump = () => {
    nekoVelocity.current = -6.2; // Tighter jump height
    playSound("jump");
    spawnJumpParticles(25, nekoYRef.current + 16); // 25% left
  };

  const spawnPipe = () => {
    const gapSize = 95;
    const minHeight = 40;
    const maxHeight = 256 - gapSize - minHeight;
    
    const topHeight = minHeight + Math.floor(Math.random() * (maxHeight - minHeight));
    const bottomHeight = 280 - 24 - gapSize - topHeight;

    const newPipe: Pipe = {
      id: Math.random().toString(),
      x: 100, // Starts at the far right edge (100%)
      topHeight,
      bottomHeight,
      passed: false,
    };

    pipesRef.current.push(newPipe);
    setPipes([...pipesRef.current]);
  };

  const spawnJumpParticles = (x: number, y: number) => {
    const newParticles: JumpParticle[] = [];
    for (let i = 0; i < 3; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: -0.5 - Math.random() * 0.5,
        vy: -0.5 + Math.random() * 1.0,
        life: 0.8,
        color: "rgba(255, 125, 167, 0.7)",
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const spawnExplosion = (x: number, y: number, color: string) => {
    const newParticles: JumpParticle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 4 - 1,
        life: 1.0,
        color,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const startGame = () => {
    setScore(0);
    setNekoY(110);
    nekoYRef.current = 110; // Synchronize ref to prevent immediate collision tick on restart
    nekoVelocity.current = -2; // Softer launch velocity
    pipesRef.current = []; // Clear game ref synchronously!
    setPipes([]);
    setParticles([]);
    tickCount.current = 0;
    setGameState("playing");
  };

  // Draw properly pixelated, NES-style arcade pipes in SVG
  const drawRetroPipe = (height: number, isTop: boolean) => {
    const lipHeight = 22;
    const shaftHeight = Math.max(0, height - lipHeight);
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 52 ${height}`} preserveAspectRatio="none" style={{ shapeRendering: "crispEdges", overflow: "visible" }}>
        {/* Shaft outline & textures */}
        {isTop ? (
          <>
            {/* Shaft Base fill */}
            <rect x="4" y="0" width="44" height={shaftHeight} fill="#3ca35d" />
            {/* Light Green highlight stripe */}
            <rect x="8" y="0" width="6" height={shaftHeight} fill="#72d67a" />
            {/* Dark green shadow stripe */}
            <rect x="36" y="0" width="8" height={shaftHeight} fill="#1c6b32" />
            {/* Black borders */}
            <rect x="4" y="0" width="4" height={shaftHeight} fill="#120716" />
            <rect x="44" y="0" width="4" height={shaftHeight} fill="#120716" />
          </>
        ) : (
          <>
            {/* Shaft Base fill */}
            <rect x="4" y={lipHeight} width="44" height={shaftHeight} fill="#3ca35d" />
            {/* Light Green highlight stripe */}
            <rect x="8" y={lipHeight} width="6" height={shaftHeight} fill="#72d67a" />
            {/* Dark green shadow stripe */}
            <rect x="36" y={lipHeight} width="8" height={shaftHeight} fill="#1c6b32" />
            {/* Black borders */}
            <rect x="4" y={lipHeight} width="4" height={shaftHeight} fill="#120716" />
            <rect x="44" y={lipHeight} width="4" height={shaftHeight} fill="#120716" />
          </>
        )}

        {/* Flange Lip */}
        {isTop ? (
          <g transform={`translate(0, ${shaftHeight})`}>
            {/* Lip Base fill */}
            <rect x="0" y="0" width="52" height={lipHeight} fill="#3ca35d" />
            {/* Light Green highlight */}
            <rect x="4" y="0" width="6" height={lipHeight} fill="#72d67a" />
            {/* Dark green shadow */}
            <rect x="40" y="0" width="8" height={lipHeight} fill="#1c6b32" />
            {/* Black borders */}
            <rect x="0" y="0" width="52" height="4" fill="#120716" />
            <rect x="0" y={lipHeight - 4} width="52" height="4" fill="#120716" />
            <rect x="0" y="0" width="4" height={lipHeight} fill="#120716" />
            <rect x="48" y="0" width="4" height={lipHeight} fill="#120716" />
          </g>
        ) : (
          <g transform="translate(0, 0)">
            {/* Lip Base fill */}
            <rect x="0" y="0" width="52" height={lipHeight} fill="#3ca35d" />
            {/* Light Green highlight */}
            <rect x="4" y="0" width="6" height={lipHeight} fill="#72d67a" />
            {/* Dark green shadow */}
            <rect x="40" y="0" width="8" height={lipHeight} fill="#1c6b32" />
            {/* Black borders */}
            <rect x="0" y="0" width="52" height="4" fill="#120716" />
            <rect x="0" y={lipHeight - 4} width="52" height="4" fill="#120716" />
            <rect x="0" y="0" width="4" height={lipHeight} fill="#120716" />
            <rect x="48" y="0" width="4" height={lipHeight} fill="#120716" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* CSS Scrolling Checker Floor */}
      <style>{`
        @keyframes scroll-floor {
          0% { background-position-x: 0px; }
          100% { background-position-x: -24px; }
        }
        .scrolling-floor {
          background-image: repeating-linear-gradient(45deg, var(--border-accent) 0px, var(--border-accent) 4px, transparent 4px, transparent 8px);
          animation: scroll-floor 0.4s linear infinite;
        }
      `}</style>

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

      {/* Redesigned Compact UI (Stretched full width container) */}
      <div className="p-4 flex flex-col items-center justify-center gap-4">
        
        {/* Core Game CRT Screen Viewport (Stretched to fill the entire card width) */}
        <div 
          className="w-full relative overflow-hidden bg-[#120716] border-2 border-border-accent flex items-center justify-center rounded-md select-none animate-fade-in"
          style={{ height: "280px" }}
        >
          {/* CRT Glare Overlays */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,10,18,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[length:100%_4px] z-30 opacity-20" />

          {/* Static Star Floaters */}
          <div className="absolute top-8 left-[15%] w-1 h-1 bg-cream/15 rounded-full" />
          <div className="absolute top-20 right-[25%] w-1 h-1 bg-cream/15 rounded-full" />
          <div className="absolute top-28 left-[45%] w-1 h-1 bg-cream/15 rounded-full" />
          <div className="absolute top-12 right-[10%] w-1 h-1 bg-cream/15 rounded-full" />

          {gameState === "idle" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <div className="text-highlight-color animate-pixel-float mb-3">
                <PixelIcon name="bolt" solid size={36} />
              </div>
              
              <h3 className="pixel-heading font-jersey text-3xl text-highlight-color uppercase tracking-widest leading-none">
                FLAPPY NEKO
              </h3>
              
              <p className="text-[9px] text-text-muted mt-2 max-w-xs leading-relaxed uppercase font-bold font-mono">
                [ Tap screen or Spacebar to flap wings ]
                <br />
                HIGH SCORE: <span className="text-highlight-color">{highScore} PTS</span>
              </p>

              <button
                onClick={startGame}
                className="mt-5 px-5 py-2.5 bg-highlight-color text-cream font-jersey text-base uppercase tracking-widest border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-0 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer"
              >
                Launch Game
              </button>
            </div>
          )}

          {gameState === "playing" && (
            <div 
              className="absolute inset-0 w-full h-full cursor-pointer select-none touch-none"
              onPointerDown={(e) => {
                e.preventDefault();
                jump();
              }}
            >
              {/* Retro Green Pixel Pipes (Positioned via percentage widths & lefts) */}
              {pipes.map((pipe) => (
                <div 
                  key={pipe.id} 
                  className="absolute inset-y-0 pointer-events-none" 
                  style={{ left: `${pipe.x}%`, width: "13.5%" }}
                >
                  
                  {/* Top Pipe */}
                  <div className="absolute top-0 w-full" style={{ height: `${pipe.topHeight}px` }}>
                    {drawRetroPipe(pipe.topHeight, true)}
                  </div>

                  {/* Bottom Pipe */}
                  <div className="absolute bottom-[24px] w-full" style={{ height: `${pipe.bottomHeight}px` }}>
                    {drawRetroPipe(pipe.bottomHeight, false)}
                  </div>

                </div>
              ))}

              {/* Sparks Particles */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute pointer-events-none rounded-full z-20 animate-pulse"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}px`,
                    width: "4px",
                    height: "4px",
                    backgroundColor: p.color,
                    opacity: p.life,
                  }}
                />
              ))}

              {/* Player Neko (Pixel Art Flying Cat SVG) */}
              <div 
                className="absolute w-8 h-8 z-25 transition-transform duration-75"
                style={{ 
                  left: "25%", 
                  top: `${nekoY}px`,
                  transform: `rotate(${Math.min(45, Math.max(-25, nekoVelocity.current * 4.5))}deg)`,
                }}
              >
                <svg viewBox="0 0 16 16" width="32" height="32" style={{ shapeRendering: "crispEdges" }}>
                  {/* Outer border outline */}
                  <rect x="2" y="3" width="12" height="11" fill="#150b18" />
                  <rect x="3" y="1" width="3" height="4" fill="#150b18" />
                  <rect x="10" y="1" width="3" height="4" fill="#150b18" />
                  
                  {/* Ears */}
                  <rect x="4" y="2" width="1" height="2" fill="#ff548f" />
                  <rect x="11" y="2" width="1" height="2" fill="#ff548f" />
                  
                  {/* Pink body */}
                  <rect x="3" y="4" width="10" height="9" fill="#ff548f" />
                  
                  {/* Ear blush */}
                  <rect x="4" y="3" width="1" height="1" fill="#ff7da7" />
                  <rect x="11" y="3" width="1" height="1" fill="#ff7da7" />

                  {/* Cheeks */}
                  <rect x="4" y="9" width="1.5" height="1.5" fill="#ff7da7" />
                  <rect x="10.5" y="9" width="1.5" height="1.5" fill="#ff7da7" />

                  {/* Eyes */}
                  <rect x="5" y="6" width="2" height="2" fill="#150b18" />
                  <rect x="9" y="6" width="2" height="2" fill="#150b18" />
                  <rect x="6" y="6" width="1" height="1" fill="#ffffff" />
                  <rect x="10" y="6" width="1" height="1" fill="#ffffff" />

                  {/* Muzzle */}
                  <rect x="7" y="8" width="2" height="1" fill="#150b18" />

                  {/* Glowing angel wing (Bounce flaps wing) */}
                  <g className="animate-bounce" style={{ transformOrigin: "4px 8px" }}>
                    <rect x="0" y="5" width="3" height="3" fill="#150b18" />
                    <rect x="0" y="6" width="2" height="2" fill="#ffff80" />
                    <rect x="1" y="6" width="1" height="1" fill="#ffffff" />
                  </g>
                </svg>
              </div>

              {/* Retro Checkered floor border line */}
              <div 
                className="absolute bottom-0 inset-x-0 h-6 border-t-2 border-border-accent z-20 scrolling-floor"
              />
            </div>
          )}

          {gameState === "gameover" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <h3 className="pixel-heading font-jersey text-3.5xl text-raspberry dark:text-highlight-color uppercase tracking-widest leading-none animate-pulse">
                GAME OVER
              </h3>
              
              <div className="flex gap-4 mt-4 font-mono font-bold text-xs text-text-base uppercase bg-cream dark:bg-bg-base border-2 border-border-accent p-3.5 shadow-[2px_2px_0_var(--shadow-color)]">
                <div>
                  Score: <span className="text-highlight-color font-black">{score}</span>
                </div>
                <div className="w-px bg-border-accent/30 self-stretch" />
                <div>
                  High: <span className="text-highlight-color font-black">{highScore}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-highlight-color text-cream font-jersey text-sm uppercase tracking-widest border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-0 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer"
                >
                  Play Again
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

          {/* Score counter overlay */}
          {gameState === "playing" && (
            <div className="absolute top-3 left-3 bg-cream/90 dark:bg-bg-base/90 border-2 border-border-accent px-2.5 py-1 font-mono text-xs font-bold text-highlight-color tracking-wide z-20 pointer-events-none select-none">
              SCORE: {score}
            </div>
          )}
        </div>

        {/* Sleek Action Deck (JUMP! Trigger only) */}
        {gameState === "playing" && (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              jump();
            }}
            className="w-full py-3.5 bg-highlight-color text-cream font-jersey text-base uppercase tracking-widest border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
          >
            <PixelIcon name="star" solid size={12} />
            JUMP! [SPACE]
          </button>
        )}

      </div>
    </div>
  );
}
