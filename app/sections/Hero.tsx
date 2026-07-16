"use client";

import { useState, useRef } from "react";
import Github from "../components/icons/Github";
import Linkedin from "../components/icons/Linkedin";
import Insta from "../components/icons/Insta";
import Email from "../components/icons/Email";
import PixelIcon from "../components/PixelIcon";

const Hero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!headingRef.current) return;
    const rect = headingRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    headingRef.current.style.backgroundImage = `radial-gradient(circle 120px at ${x}% ${y}%, var(--blush) 0%, var(--highlight-color) 45%, var(--text-base) 90%)`;
  };

  const handleMouseEnter = () => {
    if (!headingRef.current) return;
    headingRef.current.style.setProperty("animation", "none");
    headingRef.current.style.setProperty("background-position", "center");
    headingRef.current.style.setProperty("-webkit-background-clip", "text");
    headingRef.current.style.setProperty("-webkit-text-fill-color", "transparent");
    headingRef.current.style.setProperty("background-clip", "text");
  };

  const handleMouseLeave = () => {
    if (!headingRef.current) return;
    headingRef.current.style.removeProperty("background-image");
    headingRef.current.style.removeProperty("animation");
    headingRef.current.style.removeProperty("background-position");
    headingRef.current.style.removeProperty("-webkit-background-clip");
    headingRef.current.style.removeProperty("-webkit-text-fill-color");
    headingRef.current.style.removeProperty("background-clip");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-3 sm:px-4 py-20 relative bg-transparent overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute top-[18%] left-[8%] text-blush/60 animate-soft-bounce">
          <PixelIcon name="heart" solid size={28} />
        </span>
        <span className="absolute top-[28%] right-[10%] text-sparkle/70 animate-pixel-twinkle" style={{ animationDelay: "0.6s" }}>
          <PixelIcon name="sparkles" size={24} />
        </span>
        <span className="absolute bottom-[22%] left-[14%] text-peach animate-wiggle">
          <PixelIcon name="star" solid size={22} />
        </span>
        <span className="absolute bottom-[30%] right-[16%] text-blush/50 animate-heart-beat">
          <PixelIcon name="heart" solid size={26} />
        </span>
        <span className="absolute top-[42%] left-[4%] text-border-accent/50 animate-pixel-twinkle" style={{ animationDelay: "1.2s" }}>
          <PixelIcon name="star" size={14} />
        </span>
        <span className="absolute top-[55%] right-[5%] text-border-accent/50 animate-pixel-twinkle" style={{ animationDelay: "1.8s" }}>
          <PixelIcon name="sparkles" size={14} />
        </span>
      </div>
 
      <div className="w-full max-w-4xl font-body hero-panel p-5 sm:p-10 md:p-16 text-center relative z-10 overflow-hidden">
        <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t-[3px] border-l-[3px] border-blush" aria-hidden="true" />
        <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t-[3px] border-r-[3px] border-blush" aria-hidden="true" />
        <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-[3px] border-l-[3px] border-blush" aria-hidden="true" />
        <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-[3px] border-r-[3px] border-blush" aria-hidden="true" />
 
        <div className="flex items-center gap-3 mb-6">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />
          <div className="flex gap-2 text-highlight-color items-center">
            <PixelIcon name="heart" solid size={14} className="animate-pixel-twinkle" />
            <PixelIcon name="heart" solid size={16} className="animate-heart-beat" />
            <PixelIcon name="heart" solid size={14} className="animate-pixel-twinkle" style={{ animationDelay: "0.8s" }} />
          </div>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />
        </div>
 
        <p className="text-sm sm:text-base text-text-base font-semibold tracking-[0.25em] mb-3 uppercase opacity-90">
          hello, i&apos;m
        </p>
 
        <h1
          ref={headingRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="pixel-heading font-jersey leading-none mb-3 text-shimmer whitespace-nowrap select-none cursor-pointer"
          style={{
            fontSize: "clamp(26px, 7.2vw, 110px)",
            fontWeight: 700,
          }}
        >
          Manna&nbsp;Sara&nbsp;Bilu
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-2.5 my-6">
          {["cs student", "data nerd", "event tech head", "nagpur, india"].map((label) => (
            <span
              key={label}
              className="text-xs sm:text-sm px-4 py-1.5 rounded-full border border-border-accent/40 bg-highlight-color/10 dark:bg-highlight-color/5 text-highlight-color font-semibold tracking-wide hover:bg-highlight-color/20 dark:hover:bg-highlight-color/10 transition-all duration-300 backdrop-blur-sm shadow-sm"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />
          <div className="flex gap-4 items-center justify-center">
            <Linkedin />
            <Github />
            <Insta />
            <Email />
          </div>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
