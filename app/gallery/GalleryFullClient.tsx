"use client";

import { useState } from "react";
import GalleryCard from "../components/GalleryCard";
import SectionHeading from "../components/SectionHeading";
import PixelIcon from "../components/PixelIcon";

interface Artwork {
  src: string;
  caption: string;
  titlebar?: string;
  tags?: string[];
}

export default function GalleryFullClient({ artworks }: { artworks: Artwork[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredArtworks = activeFilter === "All"
    ? artworks
    : artworks.filter(art => art.tags && art.tags.includes(activeFilter));

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 flex flex-col items-center pb-24 pt-16">
      <div className="max-w-2xl pb-8 text-center">
        <SectionHeading subtitle="Here are all the credentials I've picked up on my journey so far — each one represents a rabbit hole I fell into and (eventually) climbed out of, a little wiser and a lot more caffeinated">
          Certifications
        </SectionHeading>
      </div>

      {/* Interactive Credentials Filter Bar */}
      <div className="cute-panel p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-3xl select-none">
        {[
          { icon: "star" as const, label: "All" },
          { icon: "wifi" as const, label: "IoT" },
          { icon: "chart-line" as const, label: "Analytics" },
          { icon: "laptop-code" as const, label: "Competitions" },
          { icon: "calendar-alt" as const, label: "Training" },
        ].map(({ icon, label }) => {
          const isActive = activeFilter === label;
          return (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`inline-flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-1.5 border-2 transition-all cursor-pointer outline-none ${
                isActive
                  ? "bg-peach/60 dark:bg-highlight-color/25 border-border-accent text-highlight-color font-semibold shadow-[1px_1px_0_var(--shadow-color)] translate-y-0.5"
                  : "bg-cream/80 dark:bg-card-bg border-border-accent/80 hover:border-border-accent shadow-[2px_2px_0_var(--shadow-color)] text-text-base hover:bg-cream/40"
              }`}
            >
              <PixelIcon name={icon} solid size={13} className={isActive ? "text-highlight-color animate-pulse" : "text-text-muted"} />
              {label}
            </button>
          );
        })}
      </div>

      {filteredArtworks.length === 0 ? (
        <div className="bg-cream/40 dark:bg-bg-base/30 border-2 border-border-accent p-8 text-center mt-6 w-full max-w-3xl">
          <p className="text-xs text-text-muted tracking-widest font-bold uppercase select-none">
            ♡ no certifications found for category &ldquo;{activeFilter}&rdquo; ♡
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center mt-2">
          {filteredArtworks.map((art, idx) => (
            <div key={`${art.src}-${idx}`} className="w-full max-w-72">
              <GalleryCard 
                image={art.src} 
                caption={art.caption} 
                titlebar={art.titlebar}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
