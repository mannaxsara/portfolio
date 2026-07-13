"use client";

import { useState, useEffect } from "react";

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
    const duration = 3000; // exactly 3 seconds

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
        }, 1000); // Hold at 100% for 1 second
      } else {
        setProgress(computedProgress);
      }
    }, 30); // 33 fps smooth updates

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  const statusMsg =
    progress < 30
      ? "♡ WARMING UP THE PIXEL HEARTS..."
      : progress < 70
      ? "♡ SPRINKLING CHERRY BLOSSOMS..."
      : progress < 100
      ? "♡ ALMOST READY, CUTIE..."
      : "♡ WELCOME IN~";

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#ffe8f0] dark:bg-[#160e14] flex flex-col items-center justify-center p-6 font-body select-none transition-all duration-500 ease-out ${
      isFadingOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
    }`}>
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <span className="absolute top-[20%] left-[18%] text-2xl text-blush animate-pixel-twinkle">♡</span>
        <span className="absolute top-[30%] right-[20%] text-xl text-sparkle animate-soft-bounce">✦</span>
        <span className="absolute bottom-[25%] left-[30%] text-lg text-peach animate-heart-beat">♥</span>
        <span className="absolute bottom-[35%] right-[28%] text-sm text-blush animate-wiggle">❀</span>
      </div>
      
      <div className="w-full max-w-md bg-[#fffafc] dark:bg-[#2c1a24] border-[3px] border-[#e8a0b8] dark:border-[#d489a8] shadow-[8px_8px_0px_#d489a8] dark:shadow-[8px_8px_0px_#8b4a66] p-5 sm:p-8 flex flex-col items-center gap-6 text-center relative transition-all duration-300">
        
        <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#ff9eb8]"></span>
        <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#ff9eb8]"></span>
        <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#ff9eb8]"></span>
        <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#ff9eb8]"></span>

        <div className="w-24 h-24 overflow-hidden mb-2 animate-pixel-float">
          <video
            autoPlay
            loop
            muted
            playsInline
            suppressHydrationWarning
            className="w-full h-full object-contain"
          >
            <source src="/avatar-videos/peacesign.webm" type="video/webm" />
          </video>
        </div>

        <h2 className="pixel-heading font-jersey text-4xl text-[#db6b8f] dark:text-[#f0a8c0] animate-pulse uppercase">
          LOADING CUTE MODE
        </h2>
        
        <div className="w-full mt-2">
          <div className="w-full h-5 border-[3px] border-[#e8a0b8] dark:border-[#d489a8] bg-[#fff5f8] dark:bg-[#160e14] p-0.5 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff9eb8] via-[#db6b8f] to-[#ff9eb8] transition-all duration-100 ease-out" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2 text-xs gap-1 text-[#5c3a48] dark:text-[#c49aad] tracking-wide sm:tracking-widest font-bold">
            <span className="text-center sm:text-left">{statusMsg}</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>

        <span className="text-[10px] text-[#e8a0b8] dark:text-[#c49aad] opacity-70 tracking-wider">
          MANNA SARA BILU © {year} ♡
        </span>

      </div>
    </div>
  );
}
