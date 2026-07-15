"use client";

import { useState, useEffect } from "react";
import PixelIcon from "./PixelIcon";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [year, setYear] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);

      // If page was reloaded, clear sessionStorage so preloader shows up
      try {
        const navs = performance.getEntriesByType("navigation");
        if (navs.length > 0) {
          const navType = (navs[0] as PerformanceNavigationTiming).type;
          if (navType === "reload") {
            sessionStorage.removeItem("portfolio-loaded");
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    const hasLoadedBefore = sessionStorage.getItem("portfolio-loaded");
    if (hasLoadedBefore) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setYear(String(new Date().getFullYear()));

    const startTime = Date.now();
    const duration = 2500; // exactly 2.5 seconds for snappy feel

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const computedProgress = Math.floor((elapsed / duration) * 100);

      if (computedProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("portfolio-loaded", "true");
          }, 600); // match transition duration
        }, 800); // Hold at 100%
      } else {
        setProgress(computedProgress);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  const statusMsg =
    progress < 30
      ? "♡ BOOTING THE NEKO FILES..."
      : progress < 70
      ? "♡ SPRINKLING CHERRY BLOSSOMS..."
      : progress < 100
      ? "♡ HEARTS OVERFLOWING..."
      : "♡ WELCOME IN~";

  // Segmented block bar parameters (16 retro blocks)
  const totalBlocks = 16;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#ffe8f0] dark:bg-[#160e14] flex flex-col items-center justify-center p-6 font-body select-none transition-all duration-500 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blush/5 to-transparent bg-[length:100%_4px] animate-crt-flicker z-10" />

      {/* Floating Sparkles Background Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0" aria-hidden="true">
        <span className="absolute top-[15%] left-[12%] text-2xl text-highlight-color animate-pixel-float">
          <PixelIcon name="heart" solid size={16} />
        </span>
        <span className="absolute top-[25%] right-[15%] text-xl text-sparkle animate-pixel-twinkle" style={{ animationDelay: "0.4s" }}>
          <PixelIcon name="sparkles" size={14} />
        </span>
        <span className="absolute bottom-[20%] left-[22%] text-lg text-peach animate-pixel-twinkle" style={{ animationDelay: "0.8s" }}>
          <PixelIcon name="star" solid size={14} />
        </span>
        <span className="absolute bottom-[30%] right-[20%] text-sm text-highlight-color animate-pixel-float" style={{ animationDelay: "1.2s" }}>
          <PixelIcon name="heart" solid size={12} />
        </span>
      </div>
      
      {/* Cute Panel Container */}
      <div className="w-full max-w-sm bg-[#fffafc] dark:bg-[#2c1a24] border-[3px] border-[#e8a0b8] dark:border-[#d489a8] shadow-[6px_6px_0px_#d489a8] dark:shadow-[6px_6px_0px_#8b4a66] p-6 flex flex-col items-center gap-5 text-center relative z-20 transition-all duration-300">
        
        <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#ff9eb8]"></span>
        <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#ff9eb8]"></span>
        <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#ff9eb8]"></span>
        <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#ff9eb8]"></span>

        {/* Neko loader GIF */}
        <div className="w-32 h-32 overflow-hidden mb-1 flex items-center justify-center animate-pixel-float relative">
          <img
            src="/cat.gif"
            alt="Cute Cat Preloader"
            className="w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
            suppressHydrationWarning
          />
        </div>

        <h2 className="pixel-heading font-jersey text-3xl sm:text-4xl text-[#db6b8f] dark:text-[#f0a8c0] animate-pulse uppercase tracking-wider">
          LOADING CUTE MODE
        </h2>
        
        {/* Improved Retro Blocky Progress Bar */}
        <div className="w-full mt-1">
          <div className="w-full h-7 border-[3px] border-[#e8a0b8] dark:border-[#d489a8] bg-[#fff5f8] dark:bg-[#160e14] p-1 flex gap-0.5 overflow-hidden">
            {Array.from({ length: totalBlocks }).map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 border border-transparent transition-all duration-100 ease-out ${
                  idx < filledBlocks
                    ? "bg-highlight-color shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.15)]"
                    : "bg-cream/20 dark:bg-cream/5"
                }`}
              />
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2.5 text-xs gap-1.5 text-[#5c3a48] dark:text-[#c49aad] tracking-wide sm:tracking-widest font-bold">
            <span className="text-center sm:text-left text-[10px] tracking-wider font-mono">
              {statusMsg}
            </span>
            <span className="font-mono">{Math.min(progress, 100)}%</span>
          </div>
        </div>

        <span className="text-[10px] text-[#e8a0b8] dark:text-[#c49aad] opacity-70 tracking-wider mt-1 uppercase font-semibold">
          MANNA SARA BILU © {year}
        </span>

      </div>
    </div>
  );
}
