"use client";

import { useState } from "react";
import PixelIcon from "../components/PixelIcon";

export default function MiniGame() {
  const [gameState, setGameState] = useState("idle"); // idle, booting

  const bootGame = () => {
    setGameState("booting");
    setTimeout(() => {
      setGameState("idle");
      alert("♡ Mini-Game console operational! Standing by for gameplay script injection in Phase 4. ♡");
    }, 1200);
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5 select-none">
          <PixelIcon name="code" solid size={11} />
          minigame.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 items-center text-center relative overflow-hidden bg-cream/20 dark:bg-bg-alt/20 min-h-[250px] justify-center border-2 border-dashed border-border-accent/40 m-2">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blush/5 to-transparent bg-[length:100%_4px] animate-crt-flicker" />

        {gameState === "idle" ? (
          <>
            <div className="text-highlight-color animate-pixel-float mb-2">
              <PixelIcon name="robot" solid size={48} />
            </div>
            
            <h3 className="pixel-heading font-jersey text-2xl text-highlight-color uppercase tracking-widest">
              CONSOLE STANDBY
            </h3>
            
            <p className="text-xs text-text-muted max-w-sm leading-relaxed mt-1">
              Virtual memory blocks reserved. The codebase is structured and primed to inject your interactive game logic (clicker, snake, catch-the-hearts) here in the future!
            </p>

            <button
              onClick={bootGame}
              className="mt-4 px-4 py-2 bg-highlight-color text-cream font-jersey text-base uppercase tracking-widest border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] active:translate-y-0 active:shadow-[1px_1px_0_var(--shadow-color)] transition-all cursor-pointer"
            >
              ♡ BOOT CONSOLE
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-dashed border-highlight-color animate-spin rounded-none" />
            <p className="font-mono text-xs text-highlight-color tracking-widest uppercase animate-pulse">
              injecting gameplay scripts...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
