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
      ? "✦ INITIALIZING FILE SYSTEM..."
      : progress < 70
      ? "✦ MOUNTING CERTIFICATES & ASSETS..."
      : progress < 100
      ? "✦ STARTING GRAPHICAL SYSTEM..."
      : "✦ READY! LOADING PORTFOLIO...";

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#EEC8CF] dark:bg-[#150e11] flex flex-col items-center justify-center p-6 font-pixelify select-none transition-all duration-500 ease-out ${
      isFadingOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
    }`}>
      {/* Retro CRT monitor flicker */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#8b5c6e]/5 to-transparent bg-[length:100%_4px] animate-crt-flicker"></div>
      
      {/* Clean Centered Loader Container */}
      <div className="w-full max-w-md bg-light-pink dark:bg-[#201518] border-4 border-rosewood dark:border-[#8b5c6e] shadow-[8px_8px_0px_#412722] dark:shadow-[8px_8px_0px_#020204] p-5 sm:p-8 flex flex-col items-center gap-6 text-center relative transition-all duration-300">
        
        {/* Frame Accent Corners */}
        <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-rosewood dark:border-[#8b5c6e]"></span>
        <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-rosewood dark:border-[#8b5c6e]"></span>
        <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-rosewood dark:border-[#8b5c6e]"></span>
        <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-rosewood dark:border-[#8b5c6e]"></span>

        {/* Waving Avatar Video */}
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

        {/* Boot Header */}
        <h2 className="font-jersey text-4xl text-raspberry dark:text-[#af7491] animate-pulse leading-none">
          BOOTING PORTFOLIO.EXE
        </h2>
        
        {/* Progress Bar */}
        <div className="w-full mt-2">
          <div className="w-full h-5 border-4 border-rosewood dark:border-[#8b5c6e] bg-[#fdf0f4] dark:bg-[#120a0d] p-0.5 relative overflow-hidden">
            <div 
              className="h-full bg-raspberry dark:bg-[#af7491] transition-all duration-100 ease-out" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2 text-[9px] gap-1 text-mauve-brown dark:text-[#c49db0] tracking-wide sm:tracking-widest font-bold">
            <span className="text-center sm:text-left">{statusMsg}</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>

        {/* Copyright info */}
        <span className="text-[8px] text-rosewood dark:text-[#c49db0] opacity-70 tracking-wider">
          MANNA SARA BILU © {year}
        </span>

      </div>
    </div>
  );
}
