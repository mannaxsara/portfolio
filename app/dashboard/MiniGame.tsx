"use client";

import { useEffect, useRef, useState } from "react";
import PixelIcon from "../components/PixelIcon";

interface TrafficCar {
  x: number; // coordinate [80, 220]
  y: number; // pixels [-60, 300]
  speed: number;
  color: string;
}

interface GoldCoin {
  x: number;
  y: number;
  spinFrame: number;
}

interface GameParticle {
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
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const telemetryRef = useRef<HTMLDivElement | null>(null);
  const loopRef = useRef<number | null>(null);

  // Game coordinates inside mutable refs for the 60fps canvas loop
  const playerX = useRef(150); // range [75, 225]
  const roadOffset = useRef(0);
  const traffic = useRef<TrafficCar[]>([]);
  const coins = useRef<GoldCoin[]>([]);
  const particles = useRef<GameParticle[]>([]);
  const frameCount = useRef(0);
  const currentScore = useRef(0);
  const hasSteered = useRef(false);
  const localGameState = useRef<"idle" | "playing" | "gameover">("idle");

  // Keep ref synced with react state
  useEffect(() => {
    localGameState.current = gameState;
  }, [gameState]);

  // Load High Score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("neko_rider_canvas_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Web Audio API Synth Sounds
  const playSound = (type: "hit" | "miss" | "spawn" | "gameover" | "coin") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === "coin") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "spawn") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "hit") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "gameover") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.15);
        osc.frequency.setValueAtTime(130, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {
      // Audio context blocked
    }
  };

  // Keyboard driving controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (localGameState.current !== "playing") return;
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
  }, []);

  // Mount canvas game loop when state is playing
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

  const steerLeft = () => {
    if (!hasSteered.current) hasSteered.current = true;
    playerX.current = Math.max(78, playerX.current - 12);
  };

  const steerRight = () => {
    if (!hasSteered.current) hasSteered.current = true;
    playerX.current = Math.min(222, playerX.current + 12);
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setCombo(0);
    currentScore.current = 0;
    playerX.current = 150;
    roadOffset.current = 0;
    traffic.current = [];
    coins.current = [];
    particles.current = [];
    frameCount.current = 0;
    hasSteered.current = false;
    setGameState("playing");
  };

  const gameOver = () => {
    setGameState("gameover");
    playSound("gameover");
    if (loopRef.current !== null) {
      cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
    }
    // Save high score
    if (currentScore.current > highScore) {
      setHighScore(currentScore.current);
      localStorage.setItem("neko_rider_canvas_highscore", currentScore.current.toString());
    }
  };

  const spawnTraffic = () => {
    const lanes = [95, 150, 205];
    const targetLane = lanes[Math.floor(Math.random() * lanes.length)];
    const colors = ["#ff548f", "#a050ff", "#00ffff", "#ffff50"];
    
    traffic.current.push({
      x: targetLane,
      y: -60,
      speed: 3.5 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  };

  const spawnCoin = () => {
    const lanes = [95, 150, 205];
    coins.current.push({
      x: lanes[Math.floor(Math.random() * lanes.length)],
      y: -20,
      spinFrame: 0,
    });
  };

  const spawnExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 1.5,
        life: 1.0,
        color,
      });
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      loopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. UPDATE GAME PHYSICS
    frameCount.current++;

    if (hasSteered.current) {
      // Increment base driving score
      currentScore.current += 1;
      if (frameCount.current % 15 === 0) {
        setScore(currentScore.current);
      }

      // Scroll Road
      roadOffset.current += 5.5;

      // Spawn traffic and coins
      if (frameCount.current % 50 === 0) {
        spawnTraffic();
      }
      if (frameCount.current % 80 === 0) {
        spawnCoin();
      }
    }

    // Move traffic
    for (let i = traffic.current.length - 1; i >= 0; i--) {
      const car = traffic.current[i];
      if (hasSteered.current) {
        car.y += car.speed;
      }

      // Collision checks with Player Car (Player is at x=playerX, y=220, w=24, h=45)
      const pLeft = playerX.current - 12;
      const pRight = playerX.current + 12;
      const pTop = 220;
      const pBottom = 265;

      const cLeft = car.x - 12;
      const cRight = car.x + 12;
      const cTop = car.y - 20;
      const cBottom = car.y + 20;

      const collided = (
        pLeft < cRight &&
        pRight > cLeft &&
        pTop < cBottom &&
        pBottom > cTop
      );

      if (collided) {
        playSound("hit");
        spawnExplosion(car.x, car.y, "#ff548f");
        traffic.current.splice(i, 1);

        setLives((l) => {
          const next = Math.max(0, l - 1);
          if (next <= 0) {
            gameOver();
          }
          return next;
        });
        continue;
      }

      if (car.y > height + 40) {
        traffic.current.splice(i, 1);
      }
    }

    // Move coins
    for (let i = coins.current.length - 1; i >= 0; i--) {
      const coin = coins.current[i];
      if (hasSteered.current) {
        coin.y += 4.5;
        coin.spinFrame += 0.25;
      }

      // Collision checks
      const dist = Math.sqrt(Math.pow(coin.x - playerX.current, 2) + Math.pow(coin.y - 235, 2));
      if (dist < 18) {
        playSound("coin");
        currentScore.current += 150;
        setScore(currentScore.current);
        spawnExplosion(coin.x, coin.y, "#ffff00");
        coins.current.splice(i, 1);
        continue;
      }

      if (coin.y > height + 20) {
        coins.current.splice(i, 1);
      }
    }

    // Move particles
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.06;
      if (p.life <= 0) {
        particles.current.splice(i, 1);
      }
    }

    // Update telemetry output directly in DOM
    if (telemetryRef.current && frameCount.current % 4 === 0) {
      const roadSpeed = hasSteered.current ? "180 km/h" : "0 km/h";
      const statusText = hasSteered.current ? "ACTIVE" : "READY (STEER TO GO)";
      telemetryRef.current.innerHTML = `
        <div>// TELEMETRY:</div>
        <div>CAR_X: <span class="text-highlight-color font-bold">${Math.round(playerX.current)} px</span></div>
        <div>ROAD_SPEED: <span class="font-bold">${roadSpeed}</span></div>
        <div>TRAFFIC_COUNT: <span class="font-bold">${traffic.current.length} units</span></div>
        <div>STATUS: <span class="text-highlight-color font-bold">${statusText}</span></div>
      `;
    }

    // 2. RENDER THE GAME SCENE
    ctx.clearRect(0, 0, width, height);

    // Draw grass shoulder base
    ctx.fillStyle = "#110b15";
    ctx.fillRect(0, 0, width, height);

    // Draw road asphalt (centered, 180px width: from x = 60 to x = 240)
    ctx.fillStyle = "#1e1322";
    ctx.fillRect(60, 0, 180, height);

    // Draw road shoulder markings
    ctx.strokeStyle = "#5e3046";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(60, height);
    ctx.moveTo(240, 0);
    ctx.lineTo(240, height);
    ctx.stroke();

    // Draw dashed lane markings (two columns: at x = 120 and x = 180)
    ctx.strokeStyle = "rgba(255, 125, 167, 0.25)";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 22]);
    ctx.lineDashOffset = -roadOffset.current;

    ctx.beginPath();
    ctx.moveTo(120, 0);
    ctx.lineTo(120, height);
    ctx.moveTo(180, 0);
    ctx.lineTo(180, height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw coins
    coins.current.forEach((coin) => {
      ctx.save();
      ctx.translate(coin.x, coin.y);
      const scaleX = Math.abs(Math.sin(coin.spinFrame));
      ctx.scale(scaleX, 1);

      ctx.fillStyle = "#e2b13c";
      ctx.strokeStyle = "#ff7da7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, 0);
      ctx.restore();
    });

    // Draw traffic cars
    traffic.current.forEach((car) => {
      ctx.fillStyle = car.color;
      ctx.strokeStyle = "#5e3046";
      ctx.lineWidth = 2;
      
      // Car chassis body
      ctx.fillRect(car.x - 11, car.y - 18, 22, 36);
      ctx.strokeRect(car.x - 11, car.y - 18, 22, 36);

      // Windshield glass
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(car.x - 8, car.y - 8, 16, 6);

      // Headlights (Facing down)
      ctx.fillStyle = "#ffffaa";
      ctx.fillRect(car.x - 9, car.y + 15, 3, 2);
      ctx.fillRect(car.x + 6, car.y + 15, 3, 2);
    });

    // Draw explosion sparks
    particles.current.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    });
    ctx.globalAlpha = 1.0;

    // Draw Player Sports Car (Neko Pink Rider)
    ctx.save();
    ctx.translate(playerX.current, 240);

    ctx.fillStyle = "#ff548f";
    ctx.strokeStyle = "#5e3046";
    ctx.lineWidth = 2.5;

    // Sports car body
    ctx.fillRect(-11, -18, 22, 36);
    ctx.strokeRect(-11, -18, 22, 36);

    // Spoiler wing
    ctx.fillStyle = "#ff7da7";
    ctx.fillRect(-13, 14, 26, 4);

    // Front windshield
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-8, -10, 16, 7);

    // Back taillights (Crimson red glow)
    ctx.fillStyle = "#ff2d55";
    ctx.fillRect(-9, 17, 3, 1.5);
    ctx.fillRect(6, 17, 3, 1.5);

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
          neko_rider.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      {/* Split-Screen Arcade Layout */}
      <div className="p-4 flex flex-col lg:flex-row gap-4 items-stretch">
        
        {/* Left Column: Responsive Canvas Screen */}
        <div 
          className="w-full lg:flex-1 relative overflow-hidden bg-[#110b15] border-2 border-border-accent flex items-center justify-center min-w-0"
          style={{ height: "300px" }}
        >
          {/* CRT scanlines overlay */}
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
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onClick={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                const clickX = e.clientX - rect.left;
                if (clickX < rect.width / 2) {
                  steerLeft();
                } else {
                  steerRight();
                }
              }}
              className="block cursor-pointer"
              style={{ width: "100%", height: "100%" }}
            />
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
              v2.5.0-canvas
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

          {/* D-Pad Steering Controls */}
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

          {/* Diagnostics logs */}
          <div 
            ref={telemetryRef}
            className="border border-border-accent/30 bg-cream/40 dark:bg-bg-alt/30 p-2.5 rounded-sm text-[9px] font-mono text-text-muted leading-normal flex flex-col gap-0.5 select-none"
          >
            <div>// TELEMETRY:</div>
            <div>CAR_X: <span className="text-highlight-color font-bold">150 px</span></div>
            <div>ROAD_SPEED: <span className="font-bold">0 km/h</span></div>
            <div>TRAFFIC_DENSITY: <span className="font-bold">0 units</span></div>
            <div>STATUS: <span className="text-highlight-color font-bold">{gameState.toUpperCase()}</span></div>
          </div>

        </div>
      </div>
    </div>
  );
}
