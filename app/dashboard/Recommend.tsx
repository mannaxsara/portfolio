"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PixelIcon from "../components/PixelIcon";

interface RecommendType {
  id: number;
  name: string;
  comment: string;
  tag?: string;
}

const Recommend = () => {
  const [recommendList, setRecommendList] = useState<RecommendType[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [category, setCategory] = useState("SONG"); // SONG, BOOK, MOVIE, REC
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const isPlaceholder =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");

      if (isPlaceholder) {
        setRecommendList([
          {
            id: 101,
            name: "Clean Code (Robert C. Martin)",
            comment: "A handbook of agile software craftsmanship. The logical next step for writing clean code!",
            tag: "DEV",
          },
          {
            id: 102,
            name: "System Design Interview (Alex Xu)",
            comment: "Breaks down modern scaling and system design concepts with practical diagrams!",
            tag: "SYSTEMS",
          },
          {
            id: 103,
            name: "The Pragmatic Programmer",
            comment: "Essential reading for learning how to write code that is easy to debug and adapt!",
            tag: "CRAFT",
          },
          {
            id: 104,
            name: "The Hobbit (J.R.R. Tolkien)",
            comment: "For when you want to take a break from tech and dive into classic fantasy!",
            tag: "FANTASY",
          },
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .schema("SyePhasuk")
          .from("Recommend")
          .select("*");

        if (error) {
          console.warn("Supabase fetch warning:", error.message || error);
        } else {
          setRecommendList(data || []);
        }
      } catch (err) {
        console.warn("Failed to connect to Supabase database:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const addRecommendation = async () => {
    if (!newTitle.trim()) return;
    setSubmitting(true);

    const isPlaceholder =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");

    if (isPlaceholder) {
      setRecommendList((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newTitle,
          comment: newComment,
          tag: category,
        },
      ]);
      setNewTitle("");
      setNewComment("");
      setSubmitted(true);
      setSubmitting(false);
      setTimeout(() => setSubmitted(false), 3000);
      return;
    }

    try {
      const { data, error } = await supabase
        .schema("SyePhasuk")
        .from("Recommend")
        .insert([{ name: newTitle, comment: newComment, tag: category }])
        .select();

      if (error) {
        console.error("Error inserting recommendation:", error);
      } else {
        setRecommendList((prev) => [...prev, ...(data || [])]);
        setNewTitle("");
        setNewComment("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error("Supabase insert exception:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full font-body cute-card overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent select-none">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5">
          <PixelIcon name="bookmark" solid size={11} />
          tbr.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-5 items-stretch">
          
          {/* Left Column: Compact scrollable recommendations list */}
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">
            <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-xl uppercase select-none">
              <PixelIcon name="book-heart" solid size={14} />
              to be read
              <span className="flex-1 h-px bg-border-accent opacity-40" />
            </p>

            {loading ? (
              <p className="text-xs text-text-muted tracking-widest animate-pulse text-center py-4 select-none">
                loading...
              </p>
            ) : recommendList.length === 0 ? (
              <div className="bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-3 text-center shadow-[2px_2px_0_var(--shadow-color)]">
                <p className="text-xs text-text-muted tracking-widest inline-flex items-center justify-center gap-2 select-none">
                  <PixelIcon name="book" size={12} />
                  tbr list is empty
                </p>
              </div>
            ) : (
              // Fixed height container with vertical scrolling
              <div 
                className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin"
                data-lenis-prevent
              >
                {recommendList.map((rec) => {
                  const tag = rec.tag || "REC";
                  return (
                    <div
                      key={rec.id}
                      className="relative overflow-hidden bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-2.5 shadow-[2px_2px_0_var(--shadow-color)] shrink-0"
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-30 retro-scanline" />
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-text-base font-bold flex gap-1.5 items-start min-w-0">
                          <PixelIcon
                            name="sparkles"
                            size={11}
                            className="text-highlight-color shrink-0 mt-0.5"
                          />
                          <span className="truncate">{rec.name}</span>
                        </p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 border border-border-accent tracking-wide bg-peach/50 dark:bg-card-bg text-highlight-color shrink-0">
                          {tag}
                        </span>
                      </div>
                      {rec.comment && (
                        <p className="text-xs text-text-muted mt-1 leading-relaxed pl-4.5">
                          {rec.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Border Dividers */}
          <div className="hidden md:block w-px self-stretch flex-shrink-0 bg-border-accent/20" />
          <div className="md:hidden h-px bg-border-accent/20" />

          {/* Right Column: Compact Suggest Form */}
          <div className="md:w-60 flex-shrink-0 flex flex-col gap-2.5">
            <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-xl uppercase select-none">
              <PixelIcon name="heart" solid size={14} />
              suggest
              <span className="flex-1 h-px bg-border-accent opacity-40" />
            </p>

            <div className="relative bg-peach/25 dark:bg-card-bg border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] p-3 flex flex-col gap-3">
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-blush" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-blush" />
              <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-blush" />
              <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-blush" />

              <p className="text-xs text-text-base leading-snug pr-1 select-none">
                got a book, song, or show I should check out? drop it below
              </p>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="suggest-category"
                  className="text-[9px] text-highlight-color tracking-widest font-bold uppercase select-none"
                >
                  category
                </label>
                <select
                  id="suggest-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-2 border-border-accent bg-cream dark:bg-bg-base px-2 py-1.5
                             text-xs text-text-base tracking-wide
                             focus:outline-none focus:border-highlight-color focus:shadow-[2px_2px_0_var(--shadow-color)]
                             transition-all cursor-pointer font-bold"
                >
                  <option value="SONG">🎵 Song</option>
                  <option value="BOOK">📚 Book</option>
                  <option value="MOVIE">🎬 Movie</option>
                  <option value="REC">⭐ Rec</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="suggest-title"
                  className="text-[9px] text-highlight-color tracking-widest font-bold uppercase select-none"
                >
                  title
                </label>
                <input
                  id="suggest-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRecommendation()}
                  placeholder="name of item..."
                  className="w-full border-2 border-border-accent bg-cream dark:bg-bg-base px-2 py-1.5
                             text-xs text-text-base tracking-wide
                             placeholder:text-text-muted/60
                             focus:outline-none focus:border-highlight-color focus:shadow-[2px_2px_0_var(--shadow-color)]
                             transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="suggest-why"
                  className="text-[9px] text-highlight-color tracking-widest font-bold uppercase select-none"
                >
                  why? (optional)
                </label>
                <textarea
                  id="suggest-why"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="sell it to me..."
                  rows={2}
                  className="w-full border-2 border-border-accent bg-cream dark:bg-bg-base px-2 py-1.5
                             text-xs text-text-base tracking-wide leading-snug
                             placeholder:text-text-muted/60
                             focus:outline-none focus:border-highlight-color focus:shadow-[2px_2px_0_var(--shadow-color)]
                             transition-all resize-none"
                />
              </div>

              <button
                type="button"
                onClick={addRecommendation}
                disabled={submitting || !newTitle.trim()}
                className="w-full py-1.5 px-3 bg-highlight-color text-cream text-[10px] tracking-widest font-bold uppercase
                           border-[2px] border-border-accent shadow-[2px_2px_0_var(--shadow-color)]
                           hover:brightness-105 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--shadow-color)]
                           active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)]
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_var(--shadow-color)]
                           transition-all inline-flex items-center justify-center gap-1.5"
              >
                <PixelIcon name="heart" solid size={11} />
                {submitting ? "adding..." : "submit rec"}
              </button>

              {submitted && (
                <p className="text-[9px] text-highlight-color text-center tracking-widest animate-pulse inline-flex items-center justify-center gap-1 w-full font-bold select-none">
                  <PixelIcon name="sparkles" size={10} />
                  rec saved!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Recommend;
