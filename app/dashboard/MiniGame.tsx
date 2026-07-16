"use client";

import { useEffect, useRef, useState } from "react";
import PixelIcon, { type PixelIconName } from "../components/PixelIcon";

interface FallingItem {
  id: string;
  x: number; // percentage [10, 90]
  y: number; // pixels [0, 300]
  type: string;
  icon: "heart" | "code" | "star" | "times";
  points: number;
  color: string;
}

interface GameParticle {
  id: string;
  x: number; // percentage
  y: number; // pixels
  vx: number;
  vy: number;
  life: number; // opacity [0, 1]
  color: string;
}

export default function MiniGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [basketX, setBasketX] = useState(50); // percentage [10, 90]
  const [items, setItems] = useState<FallingItem[]>([]);
  const [particles, setParticles] = useState<GameParticle[]>([]);
  
  const basketXRef = useRef(50);
  const tickCount = useRef(0);
  const telemetryRef = useRef<HTMLDivElement | null>(null);

  // Sync ref with state
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  // Load High Score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("neko_catch_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "KeyA" || e.code === "ArrowLeft") {
        e.preventDefault();
        moveLeft();
      } else if (e.key === "ArrowRight" || e.key === "KeyD" || e.code === "ArrowRight") {
        e.preventDefault();
        moveRight();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Main game loop (Timer-based DOM updates)
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameInterval = setInterval(() => {
      let scoreGained = 0;
      let livesLost = 0;
      let caughtX: number | null = null;
      let caughtColor = "";

      // Move items and check collisions
      setItems((prevItems) => {
        const nextItems = prevItems.map((item) => ({ ...item, y: item.y + 4.5 }));
        const remaining: FallingItem[] = [];

        nextItems.forEach((item) => {
          // Check collision at the basket row (y between 245 and 270)
          if (item.y >= 240 && item.y <= 265) {
            const distance = Math.abs(item.x - basketXRef.current);
            if (distance < 12) {
              // Caught item!
              if (item.type === "bug") {
                livesLost++;
                caughtX = item.x;
                caughtColor = "#db6b8f";
              } else {
                scoreGained += item.points;
                caughtX = item.x;
                caughtColor = "#52ff7d";
              }
              return; // Filter out from falling items
            }
          }

          // Retain if still on screen
          if (item.y < 300) {
            remaining.push(item);
          }
        });

        return remaining;
      });

      // Apply Score gains
      if (scoreGained > 0) {
        setScore((s) => s + scoreGained);
        if (caughtX !== null) {
          spawnParticles(caughtX, 250, caughtColor);
        }
      }

      // Apply Life losses
      if (livesLost > 0) {
        setLives((l) => {
          const next = Math.max(0, l - livesLost);
          if (next <= 0) {
            setGameState("gameover");
          }
          return next;
        });
        if (caughtX !== null) {
          spawnParticles(caughtX, 250, caughtColor);
        }
      }

      // Spawn falling items
      tickCount.current++;
      if (tickCount.current % 22 === 0) {
        spawnItem();
      }

      // Update particle lifespans
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

      // Mutate telemetry panel directly to preserve React layout render speed
      if (telemetryRef.current && tickCount.current % 3 === 0) {
        telemetryRef.current.innerHTML = `
          <div>// TELEMETRY:</div>
          <div>NEKO_X: <span class="text-highlight-color font-bold">${Math.round(basketXRef.current)} %</span></div>
          <div>SPEED: <span class="font-bold">4.5 px/f</span></div>
          <div>ITEMS_ON_SCREEN: <span class="font-bold">${items.length}</span></div>
          <div>STATUS: <span class="text-highlight-color font-bold">ACTIVE</span></div>
        `;
      }

    }, 30); // ~33 FPS fluid updates

    return () => clearInterval(gameInterval);
  }, [gameState, items.length]);

  // Handle game-over saves
  useEffect(() => {
    if (gameState === "gameover") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("neko_catch_highscore", score.toString());
      }
    }
  }, [gameState, score, highScore]);

  const moveLeft = () => {
    setBasketX((x) => Math.max(10, x - 8));
  };

  const moveRight = () => {
    setBasketX((x) => Math.min(90, x + 8));
  };

  const spawnItem = () => {
    const types = [
      { type: "heart", icon: "heart", points: 10, color: "text-raspberry dark:text-highlight-color" },
      { type: "code", icon: "code", points: 15, color: "text-purple-400" },
      { type: "star", icon: "star", points: 20, color: "text-yellow-400" },
      { type: "bug", icon: "times", points: 0, color: "text-raspberry font-bold" },
    ] as const;

    // 25% chance to spawn a bug, 75% to spawn collectibles
    const isBug = Math.random() < 0.25;
    const config = isBug ? types[3] : types[Math.floor(Math.random() * 3)];

    const newItem: FallingItem = {
      id: Math.random().toString(),
      x: 15 + Math.floor(Math.random() * 70), // [15%, 85%] horizontal range
      y: 0,
      type: config.type,
      icon: config.icon,
      points: config.points,
      color: config.color,
    };

    setItems((prev) => [...prev, newItem]);
  };

  const spawnParticles = (x: number, y: number, color: string) => {
    const newParticles: GameParticle[] = [];
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1.5 - Math.random() * 1.5,
        life: 1.0,
        color,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setBasketX(50);
    basketXRef.current = 50;
    setItems([]);
    setParticles([]);
    tickCount.current = 0;
    setGameState("playing");
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5 select-none">
          <PixelIcon name="laptop-code" solid size={11} />
          neko_catch.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      {/* Split-Screen Arcade Layout */}
      <div className="p-4 flex flex-col lg:flex-row gap-4 items-stretch">
        
        {/* Left Column: Responsive CRT Game Viewport */}
        <div 
          className="w-full lg:flex-1 relative overflow-hidden bg-cream/20 dark:bg-bg-alt/10 border-2 border-border-accent flex items-center justify-center min-w-0"
          style={{ height: "300px" }}
        >
          {/* CRT screen lines overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,10,18,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] z-10 opacity-30" />

          {gameState === "idle" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <div className="text-highlight-color animate-pixel-float mb-3 flex gap-2">
                <PixelIcon name="sparkles" solid size={40} />
              </div>
              
              <h3 className="pixel-heading font-jersey text-3xl text-highlight-color uppercase tracking-widest leading-none">
                NEKO CATCH
              </h3>
              
              <p className="text-[10px] text-text-muted mt-2 max-w-xs leading-relaxed uppercase font-bold font-mono">
                [ Catch falling items. Avoid the bugs! ]
                <br />
                Controls: A/D keys, Arrows, or UI buttons
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
            <div className="absolute inset-0 w-full h-full">
              
              {/* Star sparkles drift */}
              <div className="absolute inset-0 bg-transparent opacity-30 select-none pointer-events-none">
                <div className="absolute top-10 left-10 text-highlight-color animate-pixel-twinkle"><PixelIcon name="star" size={8} /></div>
                <div className="absolute top-24 right-16 text-highlight-color animate-pixel-twinkle" style={{ animationDelay: "1s" }}><PixelIcon name="star" size={8} /></div>
                <div className="absolute bottom-20 left-1/3 text-highlight-color animate-pixel-twinkle" style={{ animationDelay: "0.5s" }}><PixelIcon name="star" size={8} /></div>
              </div>

              {/* Catch ground divider */}
              <div className="absolute bottom-6 left-0 right-0 border-b border-dashed border-border-accent/40 pointer-events-none" />

              {/* Falling Items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="absolute pointer-events-none transition-all duration-75"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <PixelIcon name={item.icon} solid={item.type !== "bug"} size={16} className={`${item.color}`} />
                </div>
              ))}

              {/* Sparks Particles */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute pointer-events-none w-1 h-1 rounded-full z-10"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}px`,
                    backgroundColor: p.color,
                    opacity: p.life,
                    transform: "scale(1.5)",
                  }}
                />
              ))}

              {/* Cute Cat Basket */}
              <div 
                className="absolute bottom-6 h-8 bg-highlight-color border-[3px] border-border-accent rounded-md shadow-[2px_2px_0_var(--shadow-color)] flex items-center justify-center font-bold text-cream text-[10px] select-none z-20"
                style={{ 
                  left: `${basketX}%`, 
                  width: '64px', 
                  marginLeft: '-32px',
                  transition: 'left 80ms ease-out'
                }}
              >
                {/* Cat Ears */}
                <span className="absolute -top-2 left-1.5 w-2 h-2 bg-highlight-color border-t-[3px] border-l-[3px] border-border-accent rotate-45" />
                <span className="absolute -top-2 right-1.5 w-2 h-2 bg-highlight-color border-t-[3px] border-r-[3px] border-border-accent rotate-45" />
                {/* Cat face */}
                [=^.^=]
              </div>

              {/* Left/Right overlay controller zones for mobile touch tap controls */}
              <div 
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-30 opacity-0"
                onClick={moveLeft}
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-30 opacity-0"
                onClick={moveRight}
              />
            </div>
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

          {/* Score overlay */}
          {gameState === "playing" && (
            <div className="absolute top-3 left-3 bg-cream/90 dark:bg-bg-base/90 border-2 border-border-accent px-2.5 py-1 font-mono text-xs font-bold text-highlight-color tracking-wide z-20 pointer-events-none select-none">
              SCORE: {score}
            </div>
          )}
        </div>

        {/* Right Column: Arcade Controller & Diagnostics deck */}
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
              v1.5.0-dom
            </span>
          </div>

          {/* Lives Indicator & Stats */}
          <div className="bg-cream dark:bg-bg-base border border-border-accent p-2.5 font-mono flex flex-col gap-1.5 shadow-inner">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-text-muted uppercase">LIVES:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((heartIndex) => (
                  <PixelIcon 
                    key={heartIndex} 
                    name="heart" 
                    solid={heartIndex <= lives} 
                    size={11} 
                    className={heartIndex <= lives ? "text-raspberry animate-heart-beat" : "text-border-accent/30"} 
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs font-bold border-t border-border-accent/15 pt-1.5 mt-1.5">
              <span className="text-text-muted uppercase">High Score:</span>
              <span className="text-highlight-color font-black">{highScore} pts</span>
            </div>
          </div>

          {/* Interactive D-Pad controls for mouse users */}
          <div className="flex flex-col gap-2">
            {gameState === "playing" ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={moveLeft}
                  className="flex-1 py-3 bg-cream dark:bg-bg-base text-text-base border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer font-bold text-xs uppercase select-none"
                >
                  ◀ Left (A)
                </button>
                <button
                  type="button"
                  onClick={moveRight}
                  className="flex-1 py-3 bg-cream dark:bg-bg-base text-text-base border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer font-bold text-xs uppercase select-none"
                >
                  Right (D) ▶
                </button>
              </div>
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

          {/* Diagnostics logs */}
          <div 
            ref={telemetryRef}
            className="border border-border-accent/30 bg-cream/40 dark:bg-bg-alt/30 p-2.5 rounded-sm text-[9px] font-mono text-text-muted leading-normal flex flex-col gap-0.5 select-none"
          >
            <div>// TELEMETRY:</div>
            <div>NEKO_X: <span className="text-highlight-color font-bold">50 %</span></div>
            <div>SPEED: <span className="font-bold">0.0 px/f</span></div>
            <div>ITEMS_ON_SCREEN: <span className="font-bold">0</span></div>
            <div>STATUS: <span className="text-highlight-color font-bold">{gameState.toUpperCase()}</span></div>
          </div>

        </div>
      </div>
    </div>
  );
}
