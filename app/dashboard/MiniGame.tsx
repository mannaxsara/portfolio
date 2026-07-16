"use client";

import { useEffect, useState, useRef } from "react";
import PixelIcon from "../components/PixelIcon";

interface HitParticle {
  id: string;
  x: number; // offset X
  y: number; // offset Y
  life: number;
}

const KEY_MAP: Record<string, number> = {
  KeyQ: 0, KeyW: 1, KeyE: 2,
  KeyA: 3, KeyS: 4, KeyD: 5,
  KeyZ: 6, KeyX: 7, KeyC: 8,
};

const KEY_LABELS = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

export default function MiniGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [isTurbo, setIsTurbo] = useState(false);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<HitParticle[]>([]);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);

  // Keep state refs in sync for keydown closure listeners
  const gameStateRef = useRef(gameState);
  const activeCellRef = useRef(activeCell);

  useEffect(() => {
    gameStateRef.current = gameState;
    activeCellRef.current = activeCell;
  }, [gameState, activeCell]);

  // Load High Score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bug_whack_v2_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Web Audio API Retro Sound Effects Synth
  const playSound = (type: "hit" | "miss" | "spawn" | "gameover" | "turbo") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === "hit") {
        // High chirp slide up
        osc.type = "square";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "turbo") {
        // High double-chirp
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "spawn") {
        // Bubble pop
        osc.type = "sine";
        osc.frequency.setValueAtTime(550, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "miss") {
        // Low frequency buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "gameover") {
        // Sad detuned falling notes
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.setValueAtTime(220, now + 0.15);
        osc.frequency.setValueAtTime(170, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      // Browser audio context blocked/unsupported
    }
  };

  // Keyboard binder listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== "playing") return;
      
      const targetIndex = KEY_MAP[e.code];
      if (targetIndex !== undefined) {
        e.preventDefault();
        handleCellClick(targetIndex);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Bug spawning and escape loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let escapeTimeout: NodeJS.Timeout;

    const gameInterval = setInterval(() => {
      // Pick random grid cell
      const nextCell = Math.floor(Math.random() * 9);
      
      // 15% chance to spawn a Golden Turbo Bug
      const turboChance = Math.random() < 0.15;
      setIsTurbo(turboChance);
      setActiveCell(nextCell);
      playSound("spawn");

      // Golden bug escapes faster (550ms vs 800ms)
      const duration = turboChance ? 550 : 800;

      escapeTimeout = setTimeout(() => {
        setActiveCell((current) => {
          if (current === nextCell) {
            // Bug escaped! Lose combo & life
            setCombo(0);
            playSound("miss");
            setFlash(true);
            setTimeout(() => setFlash(false), 120);

            setLives((l) => {
              const next = Math.max(0, l - 1);
              if (next <= 0) {
                setGameState("gameover");
                playSound("gameover");
              }
              return next;
            });
            return null;
          }
          return current;
        });
      }, duration);

    }, 1250); // Spawns a bug every 1.25 seconds

    return () => {
      clearInterval(gameInterval);
      clearTimeout(escapeTimeout);
    };
  }, [gameState]);

  // Sparkles particle fade
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, life: p.life - 0.18 }))
          .filter((p) => p.life > 0)
      );
    }, 40);
    return () => clearInterval(interval);
  }, [particles]);

  // Update highscore
  useEffect(() => {
    if (gameState === "gameover") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("bug_whack_v2_highscore", score.toString());
      }
    }
  }, [gameState, score, highScore]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setCombo(0);
    setActiveCell(null);
    setParticles([]);
    setGameState("playing");
  };

  // Combo calculation
  const getMultiplier = (currCombo: number) => {
    if (currCombo >= 10) return 3;
    if (currCombo >= 5) return 2;
    return 1;
  };

  const handleCellClick = (index: number) => {
    if (gameState !== "playing") return;

    if (index === activeCellRef.current) {
      // Hit!
      const currentCombo = combo + 1;
      setCombo(currentCombo);
      
      const mult = getMultiplier(currentCombo);
      const points = (isTurbo ? 25 : 10) * mult;
      
      setScore((s) => s + points);

      // Restore life if golden bug caught
      if (isTurbo) {
        playSound("turbo");
        setLives((l) => Math.min(3, l + 1));
      } else {
        playSound("hit");
      }

      setShake(true);
      setTimeout(() => setShake(false), 150);

      spawnHitParticles(isTurbo ? "#ffff00" : "#52ff7d");
      setActiveCell(null);
    } else {
      // Missed / clicked empty terminal cell!
      setCombo(0);
      playSound("miss");
      setFlash(true);
      setTimeout(() => setFlash(false), 120);

      setLives((l) => {
        const next = Math.max(0, l - 1);
        if (next <= 0) {
          setGameState("gameover");
          playSound("gameover");
        }
        return next;
      });
    }
  };

  const spawnHitParticles = (color: string) => {
    const newParticles: HitParticle[] = [];
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x: (Math.random() - 0.5) * 35,
        y: (Math.random() - 0.5) * 35,
        life: 1.0,
      });
    }
    setParticles(newParticles);
  };

  const mult = getMultiplier(combo);

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Dynamic inline styles for screen shake */}
      <style>{`
        @keyframes custom-shake {
          0%, 100% { transform: translate(0, 0); }
          20%, 60% { transform: translate(-3px, 2px); }
          40%, 80% { transform: translate(3px, -2px); }
        }
        .board-shake {
          animation: custom-shake 0.15s ease-in-out;
        }
      `}</style>

      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5 select-none">
          <PixelIcon name="robot" solid size={11} />
          bug_whacker.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      {/* Main Panel */}
      <div className="p-5 flex flex-col items-center justify-center bg-cream/10 dark:bg-bg-alt/10">
        
        {/* Combo HUD / Score Info */}
        <div className="w-full max-w-sm flex items-center justify-between mb-3 px-2 py-1.5 bg-[#ffe8f0]/40 dark:bg-bg-base border-2 border-border-accent/40 font-mono text-xs select-none">
          <div className="font-bold text-text-base">
            SCORE: <span className="text-highlight-color font-black">{score}</span>
            {combo > 2 && (
              <span className="ml-2 text-highlight-color font-black animate-pulse">
                ({combo} Combo!)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-text-muted text-[10px] mr-1 uppercase">ARMOR:</span>
            {[1, 2, 3].map((hIdx) => (
              <PixelIcon
                key={hIdx}
                name="heart"
                solid={hIdx <= lives}
                size={11}
                className={hIdx <= lives ? "text-raspberry animate-heart-beat" : "text-border-accent/30"}
              />
            ))}
          </div>
        </div>

        {/* Arcade Board Viewport */}
        <div 
          className={`w-full max-w-sm border-2 relative flex items-center justify-center transition-all duration-100
            ${flash ? "border-raspberry shadow-[0_0_15px_#db6b8f]" : "border-border-accent"} 
            ${shake ? "board-shake" : ""}`}
          style={{ height: "260px", backgroundColor: "#150b18" }}
        >
          {/* CRT scanline grids */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,10,18,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[length:100%_4px] z-10 opacity-30" />

          {/* Combo Multiplier Alert Overlay */}
          {gameState === "playing" && mult > 1 && (
            <div className="absolute top-2 right-2 bg-highlight-color text-cream font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-[1px_1px_0_var(--shadow-color)] z-30 animate-bounce select-none">
              x{mult} MULTIPLIER
            </div>
          )}

          {gameState === "idle" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <div className="text-highlight-color animate-pixel-float mb-3">
                <PixelIcon name="robot" solid size={42} />
              </div>
              <h3 className="pixel-heading font-jersey text-3xl text-highlight-color uppercase tracking-widest">
                BUG WHACKER PRO
              </h3>
              <p className="text-[9px] text-text-muted mt-2 max-w-xs uppercase font-bold font-mono leading-relaxed">
                [ Click or type key bindings to whack bugs ]
                <br />
                shortcuts: Q W E / A S D / Z X C
                <br />
                <span className="text-highlight-color">gold bug restores armor</span>
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
            <div className="grid grid-cols-3 gap-3.5 p-4 w-full h-full relative z-20">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                const isTarget = index === activeCell;
                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`relative rounded-md border-2 transition-all flex items-center justify-center cursor-pointer select-none
                      ${isTarget 
                        ? isTurbo
                          ? "bg-yellow-400/20 border-yellow-400 shadow-[0_0_12px_#fbbf24]"
                          : "bg-highlight-color/20 border-highlight-color shadow-[0_0_12px_var(--highlight-color)]" 
                        : "bg-cream/5 border-border-accent/30 hover:border-border-accent/70"
                      }`}
                  >
                    {/* Corner Keyboard Binding Label */}
                    <span className="absolute top-1 left-1.5 text-[8px] font-mono font-bold text-border-accent/60">
                      {KEY_LABELS[index]}
                    </span>

                    {/* Bug Creature Sprite */}
                    {isTarget && (
                      <div className={`flex items-center justify-center animate-bounce
                        ${isTurbo ? "text-yellow-400" : "text-highlight-color"}`}>
                        <PixelIcon name={isTurbo ? "star" : "robot"} solid size={28} />
                      </div>
                    )}

                    {/* Hit Sparkles particles inside the cell */}
                    {isTarget && particles.map((p) => (
                      <div
                        key={p.id}
                        className="absolute pointer-events-none w-1.5 h-1.5 rounded-full"
                        style={{
                          transform: `translate(${p.x}px, ${p.y}px)`,
                          opacity: p.life,
                          backgroundColor: isTurbo ? "#ffff00" : "#52ff7d",
                        }}
                      />
                    ))}
                  </button>
                );
              })}
            </div>
          )}

          {gameState === "gameover" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <h3 className="pixel-heading font-jersey text-4xl text-raspberry uppercase tracking-widest animate-pulse">
                WHACKED OUT
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
        </div>

      </div>
    </div>
  );
}
