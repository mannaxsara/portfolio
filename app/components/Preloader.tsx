"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "pixel-retroui";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false); // start false so server renders nothing
  const [year, setYear] = useState("");

  useEffect(() => {
    // Only show preloader on client — avoids all hydration mismatches
    setLoading(true);
    setYear(String(new Date().getFullYear()));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
          }, 800); // brief hold at 100% for a clean reveal transition
          return 100;
        }
        return prev + Math.floor(Math.random() * 3) + 1; // slower loading step
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#EEC8CF] flex flex-col items-center justify-center p-6 font-pixelify select-none">
      {/* Retro CRT monitor flicker */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#8b5c6e]/5 to-transparent bg-[length:100%_4px] animate-crt-flicker"></div>
      
      <div className="w-full max-w-md bg-light-pink border-4 border-rosewood shadow-[6px_6px_0px_#412722] p-8 flex flex-col items-center gap-6 text-center relative">
        <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-raspberry"></span>
        <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-raspberry"></span>
        <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-raspberry"></span>
        <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-raspberry"></span>

        <h2 className="font-jersey text-4xl text-raspberry animate-pulse">BOOTING PORTFOLIO.EXE</h2>
        
        <div className="w-full mt-4 flex flex-col gap-2">
          <div className="flex justify-between items-center font-jersey text-lg text-raspberry tracking-wider">
            <span>LOADING...</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <ProgressBar
            size="md"
            color="pink"
            borderColor="black"
            className="w-full"
            progress={Math.min(progress, 100)}
          />
        </div>

        <p className="text-[10px] text-mauve-brown tracking-widest mt-2 h-4">
          {progress < 30 && "✦ INITIALIZING FILE SYSTEM..."}
          {progress >= 30 && progress < 70 && "✦ MOUNTING CERTIFICATES & ASSETS..."}
          {progress >= 70 && progress < 100 && "✦ STARTING GRAPHICAL SYSTEM..."}
          {progress >= 100 && "✦ READY! LOADING PORTFOLIO..."}
        </p>

        <span className="text-[8px] text-rosewood mt-4 opacity-70">
          MANNA SARA BILU © {year}
        </span>
      </div>
    </div>
  );
}

