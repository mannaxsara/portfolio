"use client";

import { useState, useEffect, useRef } from "react";
import { Bubble } from "pixel-retroui";

const SECTION_MESSAGES: Record<string, { video: string; text: string }> = {
  home: {
    video: "/avatar-videos/peacesign.webm",
    text: "Hey! Welcome to my portfolio~ ✦",
  },
  about: {
    video: "/avatar-videos/thinking.webm",
    text: "That's me! A CS student who loves data & code ✦",
  },
  projects: {
    video: "/avatar-videos/thinking.webm",
    text: "Check out what I've been building! 🛠",
  },
  gallery: {
    video: "/avatar-videos/peacesign.webm",
    text: "Certified & verified~ 📜✨",
  },
  experience: {
    video: "/avatar-videos/thinking.webm",
    text: "Here's where I leveled up IRL ⚡",
  },
  contact: {
    video: "/avatar-videos/peacesign.webm",
    text: "Let's connect! Don't be shy~ 💌",
  },
};

const IDLE_VIDEO = "/avatar-videos/idlemanna.webm";

export default function FloatingCompanion() {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [videoSrc, setVideoSrc] = useState(IDLE_VIDEO);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMinimized, setIsMinimized] = useState(false);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSectionRef = useRef<string | null>(null);

  // Track theme changes
  useEffect(() => {
    const update = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Detect which section is in view
  useEffect(() => {
    const sectionIds = Object.keys(SECTION_MESSAGES);
    const observerMap = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          observerMap.set(entry.target.id, entry);
        });

        // Find the most visible section
        let bestId: string | null = null;
        let bestRatio = 0;
        observerMap.forEach((entry, id) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestId = id;
          }
        });

        if (bestId && bestId !== lastSectionRef.current) {
          lastSectionRef.current = bestId;
          setCurrentSection(bestId);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // React to section changes
  useEffect(() => {
    if (!currentSection || isMinimized) return;

    const msg = SECTION_MESSAGES[currentSection];
    if (!msg) return;

    setVideoSrc(msg.video);
    setBubbleText(msg.text);
    setShowBubble(true);

    // Clear existing timer
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);

    // Auto-hide bubble after 4 seconds
    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
      // Return to idle after bubble hides
      setTimeout(() => setVideoSrc(IDLE_VIDEO), 300);
    }, 4000);

    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, [currentSection, isMinimized]);

  const bubbleBg = theme === "light" ? "#f4e2ea" : "#121626";
  const bubbleText_ = theme === "light" ? "#634A45" : "#e4ecf5";
  const bubbleBorder = theme === "light" ? "#773957" : "#af7491";

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-[100] w-12 h-12 rounded-full bg-bg-alt border-2 border-border-accent shadow-[3px_3px_0px_var(--shadow-color)] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        aria-label="Show companion"
      >
        <span className="text-lg">✦</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end pointer-events-auto">
      {/* Speech bubble — floats above the avatar */}
      <div
        className={`transition-all duration-300 font-pixelify max-w-[200px] md:max-w-[240px] mb-1 mr-6 ${
          showBubble
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        }`}
      >
        <Bubble
          direction="right"
          bg={bubbleBg}
          textColor={bubbleText_}
          borderColor={bubbleBorder}
        >
          <p className="text-xs md:text-sm leading-relaxed">{bubbleText}</p>
        </Bubble>
      </div>

      {/* Avatar container */}
      <div className="relative group">
        {/* Minimize button */}
        <button
          onClick={() => {
            setIsMinimized(true);
            setShowBubble(false);
          }}
          className="absolute -top-2 -left-2 w-5 h-5 bg-border-accent text-bg-base text-[8px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 border border-border-accent"
          aria-label="Minimize companion"
        >
          ✕
        </button>

        {/* Video avatar with cross-fade opacity */}
        <div className="w-20 h-20 md:w-24 md:h-24 animate-pixel-float relative overflow-hidden">
          {/* Idle video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              videoSrc === "/avatar-videos/idlemanna.webm" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <source src="/avatar-videos/idlemanna.webm" type="video/webm" />
          </video>

          {/* Thinking video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              videoSrc === "/avatar-videos/thinking.webm" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <source src="/avatar-videos/thinking.webm" type="video/webm" />
          </video>

          {/* Peace Sign video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              videoSrc === "/avatar-videos/peacesign.webm" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <source src="/avatar-videos/peacesign.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
}
