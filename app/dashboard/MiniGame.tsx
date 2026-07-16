"use client";

import { useEffect, useState } from "react";
import PixelIcon from "../components/PixelIcon";

interface HitParticle {
  id: string;
  x: number; // offset X
  y: number; // offset Y
  life: number;
}

export default function MiniGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [particles, setParticles] = useState<HitParticle[]>([]);

  // Load High Score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bug_whack_highscore");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Bug spawning and escape loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let escapeTimeout: NodeJS.Timeout;

    const gameInterval = setInterval(() => {
      // Select a random cell (0-8)
      const nextCell = Math.floor(Math.random() * 9);
      setActiveCell(nextCell);

      // If not hit in 750ms, the bug escapes
      escapeTimeout = setTimeout(() => {
        setActiveCell((current) => {
          if (current === nextCell) {
            // Escaped! Deduct a life
            setLives((l) => {
              const next = Math.max(0, l - 1);
              if (next <= 0) {
                setGameState("gameover");
              }
              return next;
            });
            return null;
          }
          return current;
        });
      }, 750);

    }, 1200); // Spawns a bug every 1.2 seconds

    return () => {
      clearInterval(gameInterval);
      clearTimeout(escapeTimeout);
    };
  }, [gameState]);

  // Particle updates
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, life: p.life - 0.15 }))
          .filter((p) => p.life > 0)
      );
    }, 50);
    return () => clearInterval(interval);
  }, [particles]);

  // Save highscore
  useEffect(() => {
    if (gameState === "gameover") {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("bug_whack_highscore", score.toString());
      }
    }
  }, [gameState, score, highScore]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setActiveCell(null);
    setParticles([]);
    setGameState("playing");
  };

  const handleCellClick = (index: number) => {
    if (gameState !== "playing") return;

    if (index === activeCell) {
      // Hit!
      setScore((s) => s + 10);
      setActiveCell(null);
      spawnHitParticles();
    } else {
      // Missed clicked empty cell!
      setLives((l) => {
        const next = Math.max(0, l - 1);
        if (next <= 0) {
          setGameState("gameover");
        }
        return next;
      });
    }
  };

  const spawnHitParticles = () => {
    const newParticles: HitParticle[] = [];
    for (let i = 0; i < 4; i++) {
      newParticles.push({
        id: Math.random().toString(),
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        life: 1.0,
      });
    }
    setParticles(newParticles);
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5 select-none">
          <PixelIcon name="robot" solid size={11} />
          bug_whack.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      {/* Main Container */}
      <div className="p-5 flex flex-col items-center justify-center bg-cream/10 dark:bg-bg-alt/10">
        
        {/* Game Stats & Lives Bar */}
        <div className="w-full max-w-sm flex items-center justify-between mb-4 px-2 py-1.5 bg-[#ffe8f0]/40 dark:bg-bg-base border-2 border-border-accent/40 font-mono text-xs select-none">
          <div className="font-bold text-text-base">
            SCORE: <span className="text-highlight-color font-black">{score}</span>
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

        {/* Board Viewport */}
        <div 
          className="w-full max-w-sm border-2 border-border-accent bg-[#1c121e] relative flex items-center justify-center"
          style={{ height: "260px" }}
        >
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,10,18,0)_50%,rgba(0,0,0,0.18)_50%)] bg-[length:100%_4px] z-10 opacity-30" />

          {gameState === "idle" && (
            <div className="flex flex-col items-center text-center p-6 z-20">
              <div className="text-highlight-color animate-pixel-float mb-3">
                <PixelIcon name="robot" solid size={42} />
              </div>
              <h3 className="pixel-heading font-jersey text-3xl text-highlight-color uppercase tracking-widest">
                BUG WHACKER
              </h3>
              <p className="text-[10px] text-text-muted mt-2 max-w-xs uppercase font-bold font-mono">
                [ Click active cells to clear debug loops ]
                <br />
                misses or escapes cost armor lives
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
            <div className="grid grid-cols-3 gap-3.5 p-4 w-full h-full relative z-20">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                const isTarget = index === activeCell;
                return (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    className={`relative rounded-md border-2 transition-all flex items-center justify-center cursor-pointer select-none
                      ${isTarget 
                        ? "bg-highlight-color/20 border-highlight-color shadow-[0_0_12px_var(--highlight-color)]" 
                        : "bg-cream/5 border-border-accent/40 hover:border-border-accent/80"
                      }`}
                  >
                    {isTarget && (
                      <div className="text-highlight-color animate-bounce flex items-center justify-center">
                        <PixelIcon name="robot" solid size={28} />
                      </div>
                    )}

                    {/* Hit Sparkles particles inside the cell */}
                    {isTarget && particles.map((p) => (
                      <div
                        key={p.id}
                        className="absolute pointer-events-none w-1.5 h-1.5 bg-[#52ff7d] rounded-full"
                        style={{
                          transform: `translate(${p.x}px, ${p.y}px)`,
                          opacity: p.life,
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
