"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PixelIcon from "../components/PixelIcon";
import { motion } from "framer-motion";
import songData from "../data/music.json";
import bookData from "../data/bookRecommendations.json";
import movieData from "../data/movieRecommendations.json";

interface SongRec {
  id: number;
  title: string;
  artist: string;
  cover: string;
  rating: number;
  comment: string;
  url: string;
}

interface BookRec {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  comment: string;
}

interface MovieRec {
  id: number;
  title: string;
  genre: string;
  cover: string;
  rating: number;
  comment: string;
}

type TabType = "songs" | "books" | "movies";

export default function CuratedRecommendations() {
  const [activeTab, setActiveTab] = useState<TabType>("songs");
  const [songs, setSongs] = useState<SongRec[]>([]);
  const [books, setBooks] = useState<BookRec[]>([]);
  const [movies, setMovies] = useState<MovieRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Simulate database loading state for dynamic ready architecture
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        // Fetch recommendations from local json mock stores
        setSongs(songData as SongRec[]);
        setBooks(bookData as BookRec[]);
        setMovies(movieData as MovieRec[]);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div className="w-full font-body cute-card overflow-hidden transition-all shadow-[4px_4px_0_var(--shadow-color)]">
      {/* Titlebar */}
      <div 
        onDoubleClick={() => setIsMinimized(!isMinimized)}
        className="flex items-center justify-between px-3 py-1.5 bg-border-accent cursor-row-resize select-none"
        title="Double click to shade minimize/expand"
      >
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5">
          <PixelIcon name="bookmark" solid size={11} />
          curated_recs.exe
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-cream text-[8px] font-bold opacity-75 font-mono mr-1">
            {isMinimized ? "[+]" : "[-]"}
          </span>
          <span 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="w-3 h-3 bg-cream border border-white/30 cursor-pointer hover:brightness-110 active:scale-95" 
          />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out origin-top overflow-hidden ${
        isMinimized ? "max-h-0 opacity-0 scale-y-95 pointer-events-none p-0" : "max-h-[1200px] opacity-100 scale-y-100 p-5 flex flex-col gap-5"
      }`}>
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-2xl uppercase">
            <PixelIcon name="star" solid size={16} />
            my recommendations
            <span className="flex-1 max-w-[80px] h-px bg-border-accent opacity-40 hidden sm:block" />
          </p>

          {/* Navigation Tabs */}
          <div className="relative flex bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-0.5 self-start sm:self-auto select-none">
            {(
              [
                { key: "songs", label: "Music", icon: "music" },
                { key: "books", label: "Books", icon: "book-heart" },
                { key: "movies", label: "Movies", icon: "camera" },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="relative px-3 py-1.5 font-jersey text-sm uppercase tracking-wider flex items-center gap-1.5 focus:outline-none cursor-pointer z-10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRecTabHighlight"
                      className="absolute inset-0 bg-peach/60 dark:bg-highlight-color/20 border-2 border-border-accent shadow-[1px_1px_0_var(--shadow-color)] z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 28,
                      }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${
                    isActive ? "text-highlight-color font-semibold" : "text-text-muted"
                  }`}>
                    <PixelIcon name={tab.icon} solid size={12} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Box */}
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <p className="text-xs text-text-muted tracking-widest animate-pulse">
              fetching database records...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Tab Contents */}
            {activeTab === "songs" &&
              songs.map((song) => (
                <div
                  key={song.id}
                  className="bg-cream/50 dark:bg-bg-base/40 border-2 border-border-accent p-3.5 flex gap-3.5 shadow-[2px_2px_0_var(--shadow-color)] relative group hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--shadow-color)] transition-all"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-20 retro-scanline" />
                  
                  {/* Song Cover */}
                  <div className="w-16 h-16 relative flex-shrink-0 border-2 border-border-accent bg-bg-alt overflow-hidden shadow-[2px_2px_0_var(--shadow-color)]">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  {/* Song Info */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <p className="text-sm font-bold text-text-base truncate">
                          {song.title}
                        </p>
                        <a
                          href={song.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] bg-highlight-color/10 border border-border-accent/40 text-highlight-color px-1.5 py-0.5 hover:bg-highlight-color/20 transition-all font-semibold flex items-center gap-0.5 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Listen
                          <PixelIcon name="sparkles" size={8} />
                        </a>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        by {song.artist}
                      </p>
                      {/* Rating */}
                      <div className="flex gap-0.5 text-highlight-color my-1 select-none">
                        {Array.from({ length: song.rating }).map((_, rIdx) => (
                          <PixelIcon key={rIdx} name="heart" solid size={11} />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-text-base/80 italic mt-1 line-clamp-2 leading-relaxed bg-cream/80 dark:bg-bg-base/60 p-1.5 border border-border-accent/20">
                      &ldquo;{song.comment}&rdquo;
                    </p>
                  </div>
                </div>
              ))}

            {activeTab === "books" &&
              books.map((book) => (
                <div
                  key={book.id}
                  className="bg-cream/50 dark:bg-bg-base/40 border-2 border-border-accent p-3.5 flex gap-3.5 shadow-[2px_2px_0_var(--shadow-color)] relative group hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--shadow-color)] transition-all"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-20 retro-scanline" />
                  
                  {/* Book Cover */}
                  <div className="w-16 h-24 relative flex-shrink-0 border-2 border-border-accent bg-bg-alt overflow-hidden shadow-[2px_2px_0_var(--shadow-color)]">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  {/* Book Info */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-text-base truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        by {book.author}
                      </p>
                      {/* Rating */}
                      <div className="flex gap-0.5 text-highlight-color my-1 select-none">
                        {Array.from({ length: book.rating }).map((_, rIdx) => (
                          <PixelIcon key={rIdx} name="heart" solid size={11} />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-text-base/80 italic mt-1 line-clamp-3 leading-relaxed bg-cream/80 dark:bg-bg-base/60 p-1.5 border border-border-accent/20">
                      &ldquo;{book.comment}&rdquo;
                    </p>
                  </div>
                </div>
              ))}

            {activeTab === "movies" &&
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-cream/50 dark:bg-bg-base/40 border-2 border-border-accent p-3.5 flex gap-3.5 shadow-[2px_2px_0_var(--shadow-color)] relative group hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--shadow-color)] transition-all"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-20 retro-scanline" />
                  
                  {/* Movie Cover */}
                  <div className="w-16 h-22 relative flex-shrink-0 border-2 border-border-accent bg-bg-alt overflow-hidden shadow-[2px_2px_0_var(--shadow-color)]">
                    <img
                      src={movie.cover}
                      alt={movie.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-text-base truncate">
                        {movie.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        {movie.genre}
                      </p>
                      {/* Rating */}
                      <div className="flex gap-0.5 text-highlight-color my-1 select-none">
                        {Array.from({ length: movie.rating }).map((_, rIdx) => (
                          <PixelIcon key={rIdx} name="heart" solid size={11} />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-text-base/80 italic mt-1 line-clamp-2 leading-relaxed bg-cream/80 dark:bg-bg-base/60 p-1.5 border border-border-accent/20">
                      &ldquo;{movie.comment}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
