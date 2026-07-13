"use client";

import React from "react";
import MusicPlayer from "./MusicPlayer";
import BookBoard from "./BookBoard";
import Recommend from "./Recommend";
// import AnimeCard from "./AnimeCard"; // TODO: re-enable anime watch list later
import Image from "next/image";
import SectionHeading from "../components/SectionHeading";
import PixelIcon, { type PixelIconName } from "../components/PixelIcon";

const INTERESTS: { icon: PixelIconName; label: string }[] = [
  { icon: "chart-line", label: "clean dashboards" },
  { icon: "robot", label: "training ML models" },
  { icon: "wifi", label: "wiring up IoT things" },
  { icon: "moon", label: "late-night coding" },
  { icon: "calendar-alt", label: "organizing tech events" },
  { icon: "paint-brush", label: "pretty UIs" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 flex flex-col items-center pb-20 pt-28">
      <SectionHeading subtitle="my digital personality card — books, beats, anime, and the little things that make me me">
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
                  {["India", "Nagpur", "Student", "Data Analyst"].map((s) => (
                    <span
                      key={s}
                      className="text-text-base text-xs px-3 py-1 tracking-wide bg-cream/80 dark:bg-bg-base border-2 border-border-accent shadow-[1px_1px_0_var(--shadow-color)] inline-flex items-center gap-1.5"
                    >
                      <PixelIcon name="sparkles" size={10} className="text-highlight-color" />
                      {s}
                    </span>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 bg-highlight-color border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] px-3 py-1.5">
                  <span className="w-2 h-2 bg-green-300 border border-white/40 animate-pulse" />
                  <span className="text-cream text-xs tracking-widest">online</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(({ icon, label }) => (
                  <span
                    key={label}
                    className="text-xs text-text-base bg-peach/40 dark:bg-card-bg border-2 border-border-accent/70 px-3 py-1.5 tracking-wide inline-flex items-center gap-1.5"
                  >
                    <PixelIcon name={icon} solid size={14} className="text-highlight-color" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
                  <p className="text-highlight-color tracking-widest mb-3 flex items-center gap-2 text-sm font-semibold">
                    <PixelIcon name="thumbsup" solid size={14} />
                    likes
                    <span className="flex-1 h-px bg-border-accent opacity-40" />
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Clean, well-documented code",
                      "Python notebooks that just work",
                      "When the IoT sensor connects first try",
                      "Good mentors & study groups",
                      "That feeling when the forecast model converges",
                    ].map((item) => (
                      <li key={item} className="text-sm text-text-base flex gap-2 items-start">
                        <PixelIcon name="star" solid size={12} className="text-highlight-color mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
                  <p className="text-highlight-color tracking-widest mb-3 flex items-center gap-2 text-sm font-semibold">
                    <PixelIcon name="thumbsdown" solid size={14} />
                    dislikes
                    <span className="flex-1 h-px bg-border-accent opacity-40" />
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "Debugging at 3am with no stack trace",
                      "Messy datasets with no documentation",
                      "WiFi dropping during a live demo",
                      "When the event portal crashes on registration day",
                    ].map((item) => (
                      <li key={item} className="text-sm text-text-base flex gap-2 items-start">
                        <PixelIcon name="times" size={12} className="text-text-muted mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-peach/30 dark:bg-card-bg border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] p-5 relative">
            <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blush" />
            <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blush" />
            <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blush" />
            <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blush" />

            <p className="pixel-heading font-jersey text-highlight-color tracking-widest mb-4 flex items-center gap-2 text-2xl uppercase">
              <PixelIcon name="bolt" solid size={16} />
              current goals
              <span className="flex-1 h-px bg-border-accent opacity-40" />
            </p>

            <div className="flex flex-col gap-4">
              {[
                { label: "B.Tech in Computer Science — almost there!", pct: 90 },
                { label: "Level up Prophet & advanced forecasting", pct: 65 },
                { label: "Build a full-stack IoT dashboard from scratch", pct: 40 },
                { label: "Contribute to an open-source data project", pct: 25 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1.5 gap-3">
                    <p className="text-sm text-text-base inline-flex items-center gap-2">
                      <PixelIcon name="check" solid size={12} className="text-highlight-color shrink-0" />
                      {label}
                    </p>
                    <p className="text-xs text-highlight-color font-semibold shrink-0">{pct}%</p>
                  </div>
                  <div className="h-2.5 border-2 border-border-accent bg-cream/60 dark:bg-bg-base overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${pct}%`,
                        background:
                          "repeating-linear-gradient(90deg, var(--highlight-color) 0px, var(--highlight-color) 4px, var(--blush) 4px, var(--blush) 8px)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 w-full mt-10">
        <BookBoard />
        <MusicPlayer />
        {/* TODO: re-enable anime watch list later
        <AnimeCard />
        */}
        <Recommend />
      </div>
    </div>
  );
};

export default Dashboard;
