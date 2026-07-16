"use client";

import { useState } from "react";
import Image from "next/image";
import PixelIcon from "../components/PixelIcon";
import filmsData from "../data/films.json";

interface FilmType {
  id: number;
  title: string;
  genre: string;
  cover: string;
  rating: number;
}

const films: FilmType[] = filmsData;
const allGenres = ["all", ...Array.from(new Set(films.map((f) => f.genre))).sort()];

const StarRating = ({ value }: { value: number }) => {
  return (
    <div className="flex gap-1 justify-center animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <PixelIcon
          key={i}
          name="star"
          solid={i < value}
          size={12}
          className={i < value ? "text-highlight-color" : "text-border-accent/30"}
        />
      ))}
    </div>
  );
};

const FilmCover = ({ film }: { film: FilmType }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !film.cover) {
    return (
      <div className="w-full h-full bg-peach/20 dark:bg-card-bg/95 text-highlight-color flex flex-col justify-center items-center p-3 text-center select-none border border-border-accent/10">
        <PixelIcon name="camera" solid size={22} className="mb-2 opacity-60" />
        <p className="font-jersey text-xs uppercase leading-tight line-clamp-4 px-1">
          {film.title}
        </p>
      </div>
    );
  }

  return (
    <Image
      src={film.cover}
      alt={film.title}
      width={150}
      height={210}
      className="block object-cover w-full h-full"
      onError={() => setHasError(true)}
      sizes="150px"
    />
  );
};

const MovieBoard = () => {
  const [activeGenre, setActiveGenre] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered =
    activeGenre === "all"
      ? films
      : films.filter((f) => f.genre === activeGenre);

  // Reset index when filter changes
  const handleGenre = (genre: string) => {
    setActiveGenre(genre);
    setActiveIndex(0);
  };

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));

  const getStyle = (i: number): React.CSSProperties => {
    const offset = i - activeIndex;
    const absOffset = Math.abs(offset);

    // Only render up to 2 neighbours each side
    if (absOffset > 2) return { display: "none" };

    const rotateY = offset * -40;
    const translateX = offset * 65;
    const translateZ = absOffset === 0 ? 1 : absOffset === 1 ? -80 : -160;
    const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.6;
    const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.75 : 0.45;
    const zIndex = 10 - absOffset;

    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `
        translateX(-50%) translateY(-50%)
        translateX(${translateX}%)
        translateZ(${translateZ}px)
        rotateY(${rotateY}deg)
        scale(${scale})
      `,
      opacity,
      zIndex,
      transition: "all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      cursor: offset !== 0 ? "pointer" : "default",
    };
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5 select-none">
          <PixelIcon name="camera" solid size={11} />
          movies.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Section Label */}
        <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-2xl uppercase select-none">
          <PixelIcon name="camera" solid size={16} />
          recommended movies
          <span className="flex-1 h-px bg-border-accent opacity-40" />
        </p>

        {/* Genre Filters (OS Panel Style) */}
        <div className="border-2 border-border-accent bg-[#ffe8f0]/20 dark:bg-[#1a081c]/40 p-3.5 rounded-md flex flex-col gap-2 relative select-none">
          <div className="flex items-center justify-between border-b-2 border-border-accent/30 pb-2 mb-1 font-mono">
            <span className="text-[10px] font-bold text-highlight-color flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-highlight-color rounded-full animate-ping" />
              category selector:
            </span>
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
              active: {activeGenre}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => {
              const isActive = genre === activeGenre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenre(genre)}
                  className={`text-[10px] px-3.5 py-1.5 border-2 rounded-md transition-all duration-150 focus:outline-none active:scale-95 flex items-center gap-2 font-bold uppercase cursor-pointer
                    ${isActive
                      ? "bg-highlight-color border-border-accent text-cream shadow-[2px_2px_0_var(--shadow-color)]"
                      : "bg-cream dark:bg-card-bg border-border-accent/50 text-text-muted hover:bg-peach/15 hover:text-highlight-color hover:border-border-accent"
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full border transition-all duration-300
                      ${isActive
                        ? "bg-cream border-cream scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        : "bg-border-accent/20 border-border-accent/40"
                      }`}
                  />
                  <span>{genre}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-cream/40 dark:bg-bg-base/30 border-2 border-border-accent p-4 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-20 retro-scanline"
              style={{
                background: "repeating-linear-gradient(90deg, var(--border-accent) 0px, var(--border-accent) 4px, transparent 4px, transparent 8px)",
              }}
            />
            <p className="text-[10px] text-text-muted text-center tracking-widest uppercase font-bold select-none">
              ♡ no films in this genre yet ♡
            </p>
          </div>
        ) : (
          <>
            {/* Coverflow Stage Container */}
            <div className="relative overflow-hidden bg-cream/20 dark:bg-bg-base/10 border-2 border-border-accent p-2" style={{ perspective: "600px", height: 260 }}>
              
              {/* Left Arrow (High zIndex to overlay) */}
              <button
                type="button"
                onClick={prev}
                disabled={activeIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-border-accent border-2 border-border-accent text-cream text-lg font-bold shadow-[2px_2px_0_var(--shadow-color)] hover:bg-highlight-color transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
              >
                &lt;
              </button>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={next}
                disabled={activeIndex === filtered.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-border-accent border-2 border-border-accent text-cream text-lg font-bold shadow-[2px_2px_0_var(--shadow-color)] hover:bg-highlight-color transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
              >
                &gt;
              </button>

              {/* Posters 3D Group (pointer-events-none to let buttons click, pointer-events-auto on child poster card) */}
              <div className="absolute inset-0 mx-12 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
                {filtered.map((film, i) => (
                  <div
                    key={film.id}
                    style={{
                      ...getStyle(i),
                      width: 150,
                      height: 210,
                    }}
                    className="pointer-events-auto"
                    onClick={() => i !== activeIndex && setActiveIndex(i)}
                  >
                    <div
                      className={`border-2 overflow-hidden transition-all bg-cream/90 dark:bg-card-bg w-full h-full
                        ${i === activeIndex
                          ? "border-highlight-color shadow-[4px_4px_0_var(--shadow-color)] scale-100"
                          : "border-border-accent opacity-75 scale-90"
                        }`}
                      style={{
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <FilmCover film={film} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Film Details */}
            {filtered[activeIndex] && (
              <div className="flex flex-col items-center gap-1.5 text-center bg-cream/30 dark:bg-bg-base/40 border-2 border-border-accent p-3.5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-25 retro-scanline" />
                
                <h3
                  className="pixel-heading font-jersey text-xl sm:text-2xl text-highlight-color uppercase tracking-wider select-text"
                  style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.05)" }}
                >
                  {filtered[activeIndex].title}
                </h3>
                
                <div className="flex items-center justify-center select-none">
                  <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase border-y border-border-accent/40 px-3 py-0.5">
                    {filtered[activeIndex].genre}
                  </span>
                </div>
                
                <StarRating value={filtered[activeIndex].rating} />
              </div>
            )}

            {/* Dot Indicators */}
            <div className="flex justify-center gap-1.5 py-1 select-none">
              {filtered.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`transition-all focus:outline-none h-2
                    ${i === activeIndex
                      ? "w-4 bg-highlight-color border border-border-accent"
                      : "w-2 bg-border-accent/35 border border-border-accent/20 hover:bg-border-accent/60"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieBoard;
