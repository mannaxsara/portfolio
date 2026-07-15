"use client";

import React, { useState, useRef, useEffect } from "react";
import PixelIcon from "./PixelIcon";

export default function ProfileReveal() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const onMouseUp = () => handleMouseUp();
    const onMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const onTouchMove = (e: TouchEvent) => handleTouchMove(e);

    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onMouseUp);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[200px] h-[300px] select-none mx-auto"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Actual photo underneath */}
      <img
        src="/manna-avatar.jpg"
        alt="Manna Sara Bilu Actual"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ width: "200px", height: "300px", imageRendering: "auto" }}
        draggable={false}
        suppressHydrationWarning
      />

      {/* Pixelated illustrated avatar on top */}
      <img
        src="/manna-avatar-heart.png"
        alt="Manna Sara Bilu Pixelated"
        className="absolute inset-0 w-full h-full object-contain"
        style={{
          width: "200px",
          height: "300px",
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
        }}
        draggable={false}
        suppressHydrationWarning
      />

      {/* Slide Handle Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-border-accent shadow-[1px_0_4px_rgba(219,107,143,0.5)] z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      />

      {/* Slider Knob */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 border-2 border-border-accent bg-cream dark:bg-card-bg shadow-[2px_2px_0_var(--shadow-color)] rounded-none flex items-center justify-center cursor-ew-resize z-30 transition-transform active:scale-95"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={(e) => {
          e.preventDefault();
          isDragging.current = true;
        }}
        onTouchStart={() => {
          isDragging.current = true;
        }}
      >
        <PixelIcon name="heart" solid size={11} className="text-highlight-color animate-heart-beat" />
      </div>
    </div>
  );
}
