"use client";

import { useEffect, useRef, useState } from "react";
import PixelIcon, { type PixelIconName } from "../components/PixelIcon";

interface TrafficCar {
  id: string;
  x: number; // percentage [15, 85]
  y: number; // pixels [-60, 300]
  speed: number;
  color: string;
}

interface GoldCoin {
  id: string;
  x: number; // percentage
  y: number; // pixels
}

interface GameParticle {
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
  const [lives, setLives] = useState(3);
  const [playerX, setPlayerX] = useState(50); // percentage [18, 82]
  const [traffic, setTraffic] = useState<TrafficCar[]>([]);
  const [coins, setCoins] = useState<GoldCoin[]>([]);
  const [particles, setParticles] = useState<GameParticle[]>([]);
  
  const playerXRef = useRef(50);
  const tickCount = useRef(0);
  const hasSteered = useRef(false);
  const telemetryRef = useRef<HTMLDivElement | null>(null);

  // Sync ref with player position for collision checking
  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  // Load High Score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("neko_rider_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Keyboard driving controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "KeyA" || e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault();
        steerLeft();
      } else if (e.key === "ArrowRight" || e.key === "KeyD" || e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault();
        steerRight();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Main game loop (Timer-based DOM rendering)
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameInterval = setInterval(() => {
      let scoreGained = 0;
      let livesLost = 0;
      let crashX: number | null = null;
      let coinCatchX: number | null = null;

      // Increase distance score slowly while active
      if (hasSteered.current) {
        scoreGained += 1;
      }

      // Update traffic cars
      setTraffic((prevTraffic) => {
        const nextTraffic = prevTraffic.map((car) => ({
          ...car,
          y: hasSteered.current ? car.y + car.speed : car.y,
        }));
        
        const remaining: TrafficCar[] = [];

        nextTraffic.forEach((car) => {
          // Check collision with player car (Player is at y = 215, height 50px)
          if (car.y >= 170 && car.y <= 245) {
            const distance = Math.abs(car.x - playerXRef.current);
            if (distance < 11) {
              // Crash!
              livesLost++;
              crashX = car.x;
              return; // remove crashed car
            }
          }

          if (car.y < 320) {
            remaining.push(car);
          }
        });

        return remaining;
      });

      // Update gold coins
      setCoins((prevCoins) => {
        const nextCoins = prevCoins.map((coin) => ({
          ...coin,
          y: hasSteered.current ? coin.y + 4.5 : coin.y,
        }));
        
        const remaining: GoldCoin[] = [];

        nextCoins.forEach((coin) => {
          // Check collision
          if (coin.y >= 185 && coin.y <= 245) {
            const distance = Math.abs(coin.x - playerXRef.current);
            if (distance < 9) {
              // Collected!
              scoreGained += 100;
              coinCatchX = coin.x;
              return; // remove collected coin
            }
          }

          if (coin.y < 320) {
            remaining.push(coin);
          }
        });

        return remaining;
      });

      // Spawn traffic and coins (only after steer trigger)
      if (hasSteered.current) {
        tickCount.current++;
        
        // Spawn traffic every 45 frames
        if (tickCount.current % 45 === 0) {
          spawnTraffic();
        }

        // Spawn coins every 75 frames
        if (tickCount.current % 75 === 0) {
          spawnCoin();
        }
      }

      // Trigger particle bursts
      if (crashX !== null) {
        spawnExplosion(crashX, 220, "#ff548f");
        setLives((l) => {
          const next = Math.max(0, l - livesLost);
          if (next <= 0) {
            setGameState("gameover");
          }
          return next;
        });
      }

      if (coinCatchX !== null) {
        spawnExplosion(coinCatchX, 220, "#ffff00");
      }

      // Apply score updates
      if (scoreGained > 0) {
        setScore((s) => s + scoreGained);
      }

      // Update particle physics
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

      // Mutate telemetry output directly to keep rendering frame budget optimal
      if (telemetryRef.current && tickCount.current % 3 === 0) {
        const roadSpeed = hasSteered.current ? "180 km/h" : "0 km/h";
        const gameStatus = hasSteered.current ? "ACTIVE" : "READY (STEER TO GO)";
        telemetryRef.current.innerHTML = `
          <div>// TELEMETRY:</div>
          <div>CAR_X: <span class="text-highlight-color font-bold">${Math.round(playerXRef.current)} %</span></div>
          <div>ROAD_SPEED: <span class="font-bold">${roadSpeed}</span></div>
          <div>TRAFFIC_DENSITY: <span class="font-bold">${traffic.length} units</span></div>
          <div>STATUS: <span class="text-highlight-color font-bold">${gameStatus}</span></div>
        `;
      }

    }, 30);

    return () => clearInterval(gameInterval);
  }, [gameState, traffic.length, coins.length]);

  // Handle score saving on game over
  useEffect(() => {
    if (gameState === "gameover") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("neko_rider_highscore", score.toString());
      }
    }
  }, [gameState, score, highScore]);

  const steerLeft = () => {
    if (!hasSteered.current) hasSteered.current = true;
    setPlayerX((x) => Math.max(22, x - 7));
  };

  const steerRight = () => {
    if (!hasSteered.current) hasSteered.current = true;
    setPlayerX((x) => Math.min(78, x + 7));
  };

  const spawnTraffic = () => {
    // Avoid spawning in the exact same lane
    const lanes = [28, 50, 72];
    const targetLane = lanes[Math.floor(Math.random() * lanes.length)];
    const colors = ["#ffff50", "#5080ff", "#a050ff"];
    const speed = 4.5 + Math.random() * 2.5;

    const newCar: TrafficCar = {
      id: Math.random().toString(),
      x: targetLane,
      y: -60,
      speed,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setTraffic((prev) => [...prev, newCar]);
  };

  const spawnCoin = () => {
    const lanes = [28, 50, 72];
    // Pick lane different from existing traffic if possible
    const targetLane = lanes[Math.floor(Math.random() * lanes.length)];

    const newCoin: GoldCoin = {
      id: Math.random().toString(),
      x: targetLane,
      y: -20,
    };

    setCoins((prev) => [...prev, newCoin]);
  };

  const spawnExplosion = (x: number, y: number, color: string) => {
    const newParticles: GameParticle[] = [];
    for (let i = 0; i < 7; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 1,
        life: 1.0,
        color,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setPlayerX(50);
    playerXRef.current = 50;
    setTraffic([]);
    setCoins([]);
    setParticles([]);
    tickCount.current = 0;
    hasSteered.current = false;
    setGameState("playing");
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5 select-none">
          <PixelIcon name="laptop-code" solid size={11} />
          neko_rider.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      {/* Split-Screen Layout */}
      <div className="p-4 flex flex-col lg:flex-row gap-4 items-stretch">
        
        {/* Left Column: Highway CRT Screen */}
        <div 
          className="w-full lg:flex-1 relative overflow-hidden bg-[#1c121e] border-2 border-border-accent flex items-center justify-center min-w-0"
          style={{ height: "300px" }}
        >
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,10,18,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[length:100%_4px] z-10 opacity-30" />

          {gameState === "idle" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <div className="text-highlight-color animate-pixel-float mb-3 flex gap-2">
                <PixelIcon name="bolt" solid size={40} />
              </div>
              
              <h3 className="pixel-heading font-jersey text-3xl text-highlight-color uppercase tracking-widest leading-none">
                NEKO RIDER
              </h3>
              
              <p className="text-[10px] text-text-muted mt-2 max-w-xs leading-relaxed uppercase font-bold font-mono">
                [ Dodge traffic cars. Collect Gold Coins ]
                <br />
                Steer: A/D keys, Arrows, or UI buttons
              </p>

              <button
                onClick={startGame}
                className="mt-5 px-5 py-2.5 bg-highlight-color text-cream font-jersey text-base uppercase tracking-widest border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-0 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer"
              >
                Launch Drive
              </button>
            </div>
          )}

          {gameState === "playing" && (
            <div className="absolute inset-0 w-full h-full">
              
              {/* Highway markings & shoulder boundaries */}
              <div className="absolute inset-y-0 left-12 border-l-4 border-double border-border-accent/40 pointer-events-none" />
              <div className="absolute inset-y-0 right-12 border-r-4 border-double border-border-accent/40 pointer-events-none" />

              {/* Lane lines scrolling effect (Dashed lines) */}
              <div 
                className="absolute inset-y-0 left-[39%] w-1.5 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to bottom, var(--border-accent) 50%, transparent 50%)",
                  backgroundSize: "6px 36px",
                  backgroundPosition: `0px ${tickCount.current * 4}px`,
                  opacity: 0.25,
                }}
              />
              <div 
                className="absolute inset-y-0 right-[39%] w-1.5 pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(to bottom, var(--border-accent) 50%, transparent 50%)",
                  backgroundSize: "6px 36px",
                  backgroundPosition: `0px ${tickCount.current * 4}px`,
                  opacity: 0.25,
                }}
              />

              {/* Gold Coins */}
              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className="absolute pointer-events-none w-5 h-5 bg-yellow-400/90 border border-border-accent rounded-full flex items-center justify-center text-[10px] font-mono font-black text-[#5c3a48] select-none z-10 animate-pulse"
                  style={{
                    left: `${coin.x}%`,
                    top: `${coin.y}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  $
                </div>
              ))}

              {/* Traffic Cars */}
              {traffic.map((car) => (
                <div
                  key={car.id}
                  className="absolute pointer-events-none w-7 h-12 border-2 border-border-accent rounded-sm shadow-[2px_2px_0_var(--shadow-color)] flex flex-col justify-between p-1 z-15"
                  style={{
                    left: `${car.x}%`,
                    top: `${car.y}px`,
                    backgroundColor: car.color,
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* Windshield */}
                  <div className="w-full h-2.5 bg-cream/40 border border-border-accent/25 rounded-sm" />
                  {/* Headlights */}
                  <div className="flex justify-between w-full px-0.5 mb-auto">
                    <span className="w-1.5 h-1 bg-yellow-100 rounded-full" />
                    <span className="w-1.5 h-1 bg-yellow-100 rounded-full" />
                  </div>
                </div>
              ))}

              {/* Particle Sparks */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute pointer-events-none w-1 h-1 rounded-full z-20"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}px`,
                    backgroundColor: p.color,
                    opacity: p.life,
                    transform: "scale(1.8) translateX(-50%)",
                  }}
                />
              ))}

              {/* Player Sports Car (Retro Pink Racer) */}
              <div 
                className="absolute bottom-8 w-8 h-13 bg-highlight-color border-2 border-border-accent rounded-sm shadow-[2px_2px_0_var(--shadow-color)] flex flex-col justify-between p-1 z-20"
                style={{ 
                  left: `${playerX}%`, 
                  marginLeft: '-16px',
                  transition: 'left 70ms ease-out'
                }}
              >
                {/* Windshield */}
                <div className="w-full h-3 bg-bg-base/70 border border-border-accent/40 rounded-sm" />
                {/* Taillights */}
                <div className="flex justify-between w-full px-0.5 mt-auto">
                  <span className="w-1.5 h-1 bg-[#ff2d55] rounded-full animate-pulse shadow-[0_0_3px_#ff2d55]" />
                  <span className="w-1.5 h-1 bg-[#ff2d55] rounded-full animate-pulse shadow-[0_0_3px_#ff2d55]" />
                </div>
              </div>

              {/* Screen tap steer zones for touch/mouse */}
              <div 
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer z-30 opacity-0"
                onClick={steerLeft}
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer z-30 opacity-0"
                onClick={steerRight}
              />
            </div>
          )}

          {gameState === "gameover" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <h3 className="pixel-heading font-jersey text-4xl text-raspberry dark:text-highlight-color uppercase tracking-widest leading-none animate-pulse">
                CRASH OUT
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

        {/* Right Column: Control Panel & Status Deck */}
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
              v2.1.0-drive
            </span>
          </div>

          {/* Lives Indicator & Stats */}
          <div className="bg-cream dark:bg-bg-base border border-border-accent p-2.5 font-mono flex flex-col gap-1.5 shadow-inner">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-text-muted uppercase">ARMOR:</span>
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

          {/* D-Pad Buttons for steering */}
          <div className="flex flex-col gap-2">
            {gameState === "playing" ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={steerLeft}
                  className="flex-1 py-3 bg-cream dark:bg-bg-base text-text-base border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer font-bold text-xs uppercase select-none"
                >
                  ◀ Steer Left
                </button>
                <button
                  type="button"
                  onClick={steerRight}
                  className="flex-1 py-3 bg-cream dark:bg-bg-base text-text-base border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer font-bold text-xs uppercase select-none"
                >
                  Steer Right ▶
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

          {/* Telemetry diagnostics panel */}
          <div 
            ref={telemetryRef}
            className="border border-border-accent/30 bg-cream/40 dark:bg-bg-alt/30 p-2.5 rounded-sm text-[9px] font-mono text-text-muted leading-normal flex flex-col gap-0.5 select-none"
          >
            <div>// TELEMETRY:</div>
            <div>CAR_X: <span className="text-highlight-color font-bold">50 %</span></div>
            <div>ROAD_SPEED: <span className="font-bold">0 km/h</span></div>
            <div>TRAFFIC_DENSITY: <span className="font-bold">0 units</span></div>
            <div>STATUS: <span className="text-highlight-color font-bold">{gameState.toUpperCase()}</span></div>
          </div>

        </div>
      </div>
    </div>
  );
}
