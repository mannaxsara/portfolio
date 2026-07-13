"use client";

import { useState, useEffect, useRef } from "react";
import { Bubble } from "pixel-retroui";

const SECTION_MESSAGES: Record<string, { video: string; text: string }> = {
  home: {
    video: "/avatar-videos/peacesign.webm",
    text: "Heyyy! Welcome to my cute little corner~ ♡",
  },
  about: {
    video: "/avatar-videos/thinking.webm",
    text: "That's me! Soft girl · sharp data brain ♡",
  },
  projects: {
    video: "/avatar-videos/thinking.webm",
    text: "Come peek at what I've been building!",
  },
  gallery: {
    video: "/avatar-videos/peacesign.webm",
    text: "Certified & verified, bestie~ ✦",
  },
  experience: {
    video: "/avatar-videos/thinking.webm",
    text: "Leveled up IRL — look at her go!",
  },
  contact: {
    video: "/avatar-videos/peacesign.webm",
    text: "Say hi? Don't be shyyy~ ♡",
  },
};

const IDLE_VIDEO = "/avatar-videos/idlemanna.webm";

const VIDEO_CLASS =
  "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 [filter:none] dark:[filter:none] dark:brightness-100 dark:contrast-100 dark:invert-0";

export default function FloatingCompanion() {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [videoSrc, setVideoSrc] = useState(IDLE_VIDEO);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSectionRef = useRef<string | null>(null);

  useEffect(() => {
    const update = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = Object.keys(SECTION_MESSAGES);
    const observerMap = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          observerMap.set(entry.target.id, entry);
        });

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

  useEffect(() => {
    if (!currentSection) return;

    const msg = SECTION_MESSAGES[currentSection];
    if (!msg) return;

    setVideoSrc(msg.video);
    setBubbleText(msg.text);
    setShowBubble(true);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);

    bubbleTimerRef.current = setTimeout(() => {
      setShowBubble(false);
      setTimeout(() => setVideoSrc(IDLE_VIDEO), 300);
    }, 4000);

    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, [currentSection]);

  const bubbleBg = theme === "light" ? "#fffafc" : "#3a2432";
  const bubbleText_ = theme === "light" ? "#5c3a48" : "#ffe8f2";
  const bubbleBorder = theme === "light" ? "#e8a0b8" : "#e8a0bc";

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end pointer-events-auto">
      <div
        className={`transition-all duration-300 font-body max-w-[240px] md:max-w-[280px] mb-1 mr-6 ${
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
          <p className="text-sm md:text-base leading-relaxed">{bubbleText}</p>
        </Bubble>
      </div>

      <div className="relative group">
        <span
          className="absolute -top-1 -left-1 text-blush text-xs animate-heart-beat pointer-events-none z-10"
          aria-hidden="true"
        >
          ♡
        </span>
        <div
          onClick={() => setShowBubble((prev) => !prev)}
          className="companion-puppet w-20 h-20 md:w-24 md:h-24 animate-pixel-float relative overflow-hidden cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Toggle companion message"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowBubble((prev) => !prev);
            }
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            suppressHydrationWarning
            className={`${VIDEO_CLASS} ${
              videoSrc === "/avatar-videos/idlemanna.webm"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <source src="/avatar-videos/idlemanna.webm" type="video/webm" />
          </video>

          <video
            autoPlay
            loop
            muted
            playsInline
            suppressHydrationWarning
            className={`${VIDEO_CLASS} ${
              videoSrc === "/avatar-videos/thinking.webm"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <source src="/avatar-videos/thinking.webm" type="video/webm" />
          </video>

          <video
            autoPlay
            loop
            muted
            playsInline
            suppressHydrationWarning
            className={`${VIDEO_CLASS} ${
              videoSrc === "/avatar-videos/peacesign.webm"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <source src="/avatar-videos/peacesign.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
}
