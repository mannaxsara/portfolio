"use client";

import React, { useState, useEffect } from "react";
import MusicPlayer from "./MusicPlayer";
import BookBoard from "./BookBoard";
import MovieBoard from "./MovieBoard";
import Recommend from "./Recommend";
import MiniGame from "./MiniGame";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import SectionHeading from "../components/SectionHeading";
import PixelIcon, { type PixelIconName } from "../components/PixelIcon";

const INTERESTS: { icon: PixelIconName; label: string }[] = [
  { icon: "chart-line", label: "dashboard design" },
  { icon: "robot", label: "machine learning" },
  { icon: "wifi", label: "iot systems" },
  { icon: "code", label: "data pipelines" },
  { icon: "calendar-alt", label: "technical operations" },
  { icon: "paint-brush", label: "frontend engineering" },
];

const Dashboard = () => {
  const [totalViews, setTotalViews] = useState(1337);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      // Fetch local storage counts first to support local real increments
      let localHits = Number(localStorage.getItem("local-visit-count") || "0");
      if (localHits === 0) {
        localHits = 104; // start baseline hit count
      }
      localHits += 1;
      localStorage.setItem("local-visit-count", String(localHits));
      setTotalViews(localHits);

      const isPlaceholder =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");
      if (isPlaceholder) return;

      try {
        const { count, error } = await supabase
          .schema("SyePhasuk")
          .from("VisitorAnalytics")
          .select("*", { count: "exact", head: true });

        if (count !== null && !error) {
          setTotalViews(count);
        }
      } catch (err) {
        console.error("Failed to load visitor counter:", err);
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 flex flex-col items-center pb-20 pt-28">
      <SectionHeading subtitle="my digital personality card — books, beats, analytics, and the little things that make me me">
        Dashboard
      </SectionHeading>

      <div className="w-full font-body cute-card overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
          <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5">
            <PixelIcon name="heart" solid size={11} />
            profile.exe
          </span>
          <div className="flex gap-1.5">
            <span className="w-3 h-3 bg-cream border border-white/30" />
            <span className="w-3 h-3 bg-blush border border-white/30" />
            <span className="w-3 h-3 bg-raspberry border border-white/30" />
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 mx-auto md:mx-0 border-[3px] border-border-accent shadow-[4px_4px_0_var(--shadow-color)] relative py-5 px-6 overflow-hidden bg-cream/80 dark:bg-card-bg">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blush/10 to-transparent bg-[length:100%_4px] animate-crt-flicker z-10" />
              <span className="absolute top-2 right-2 z-20 text-blush animate-heart-beat" aria-hidden="true">
                <PixelIcon name="heart" solid size={14} />
              </span>
              <Image
                src="/manna-avatar-heart.png"
                alt="Manna Sara Bilu"
                width={200}
                height={300}
                priority
                loading="eager"
                className="block object-contain h-[300px] w-[200px] mx-auto relative z-0 animate-pixel-float"
              />
            </div>

            <div className="flex-1 min-w-[200px] pt-1 flex flex-col gap-4">
              <div>
                <h2
                  className="pixel-heading font-jersey text-highlight-color mb-4 break-words"
                  style={{ fontSize: "clamp(40px, 8vw, 72px)" }}
                >
                  MANNA | <span className="text-[0.65em] inline-block align-middle">मन्ना</span>
                </h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {["Nagpur, India", "B.Tech CS Student", "Data Analyst"].map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1 rounded-full border border-border-accent/40 bg-peach/25 dark:bg-peach/10 text-highlight-color font-semibold tracking-wide backdrop-blur-sm shadow-sm inline-flex items-center gap-1.5"
                    >
                      <PixelIcon name="sparkles" size={10} />
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5 items-center mb-1">
                  {/* Real-time Hit Counter */}
                  <div className="inline-flex items-center gap-2 bg-highlight-color border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] px-3 py-1">
                    <PixelIcon name="heart" solid size={11} className="text-cream animate-heart-beat" />
                    <span className="text-cream text-xs tracking-widest font-bold font-mono">
                      visitor: {totalViews.toString().padStart(6, "0")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(({ icon, label }) => (
                  <span
                    key={label}
                    className="text-xs px-3 py-1.5 rounded-full border border-border-accent/40 bg-highlight-color/10 dark:bg-highlight-color/5 text-highlight-color font-semibold tracking-wide hover:bg-highlight-color/20 transition-all duration-300 backdrop-blur-sm shadow-sm inline-flex items-center gap-1.5"
                  >
                    <PixelIcon name={icon} solid size={12} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-1">
                {/* Shortened Likes */}
                <div className="flex-1 bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
                  <p className="text-highlight-color tracking-widest mb-3 flex items-center gap-2 text-sm font-semibold">
                    <PixelIcon name="thumbsup" solid size={14} />
                    likes
                    <span className="flex-1 h-px bg-border-accent opacity-40" />
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Time-series data pipelines",
                      "Responsive dashboard layouts",
                      "IoT cloud integrations",
                      "Collaborative study circles",
                      "Actionable data patterns",
                    ].map((item) => (
                      <li key={item} className="text-xs text-text-base flex gap-2 items-start">
                        <PixelIcon name="star" solid size={12} className="text-highlight-color mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Shortened Dislikes */}
                <div className="flex-1 bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
                  <p className="text-highlight-color tracking-widest mb-3 flex items-center gap-2 text-sm font-semibold">
                    <PixelIcon name="thumbsdown" solid size={14} />
                    dislikes
                    <span className="flex-1 h-px bg-border-accent opacity-40" />
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Undocumented datasets",
                      "System network timeouts",
                      "Debugging without logs",
                      "Conflicting project specs",
                    ].map((item) => (
                      <li key={item} className="text-xs text-text-base flex gap-2 items-start">
                        <PixelIcon name="times" size={12} className="text-text-muted mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 w-full mt-10">
        <BookBoard />
        <MovieBoard />
        <MusicPlayer />
        <Recommend />
        <MiniGame />
      </div>
    </div>
  );
};

export default Dashboard;
