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
            comment:
              "A handbook of agile software craftsmanship. The logical next step for writing robust, clean, and maintainable systems!",
            tag: "DEV",
          },
          {
            id: 102,
            name: "System Design Interview (Alex Xu)",
            comment:
              "An excellent follow-up to Designing Data-Intensive Applications. Breaks down system design concepts with practical diagrams!",
            tag: "SYSTEMS",
          },
          {
            id: 103,
            name: "The Pragmatic Programmer (Andrew Hunt & David Thomas)",
            comment:
              "Essential reading for software craftsmanship, learning how to write code that is easy to debug, test, and adapt!",
            tag: "CRAFT",
          },
          {
            id: 104,
            name: "The Hobbit (J.R.R. Tolkien)",
            comment:
              "For when you want to take a break from tech and dive into classic cozy high fantasy adventure!",
            tag: "FANTASY",
          },
          {
            id: 105,
            name: "Hyperion (Dan Simmons)",
            comment:
              "A brilliant, Hugo Award-winning sci-fi space opera epic for fans of hard science fiction!",
            tag: "SCI-FI",
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
          tag: "REC",
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
        .insert([{ name: newTitle, comment: newComment }])
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
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
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

      <div className="p-5 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Left: recommendations list */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-2xl uppercase">
              <PixelIcon name="book-heart" solid size={16} />
              to be read
              <span className="flex-1 h-px bg-border-accent opacity-40" />
            </p>

            {loading ? (
              <p className="text-xs text-text-muted tracking-widest animate-pulse text-center py-4">
                loading...
              </p>
            ) : recommendList.length === 0 ? (
              <div className="bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-4 text-center shadow-[2px_2px_0_var(--shadow-color)]">
                <p className="text-xs text-text-muted tracking-widest inline-flex items-center justify-center gap-2">
                  <PixelIcon name="book" size={12} />
                  tbr list is empty
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recommendList.map((rec) => {
                  const tag = rec.tag || "REC";
                  return (
                    <div
                      key={rec.id}
                      className="relative overflow-hidden bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-3 shadow-[2px_2px_0_var(--shadow-color)]"
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm text-text-base font-bold flex gap-1.5 items-center">
                          <PixelIcon
                            name="sparkles"
                            size={12}
                            className="text-highlight-color shrink-0"
                          />
                          {rec.name}
                        </p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 border border-border-accent tracking-wide bg-peach/50 dark:bg-card-bg text-highlight-color">
                          {tag}
                        </span>
                      </div>
                      {rec.comment && (
                        <p className="text-sm text-text-muted mt-1.5 leading-relaxed pl-5">
                          {rec.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden md:block w-px self-stretch flex-shrink-0 bg-border-accent/30" />
          <div className="md:hidden h-px bg-border-accent/30" />

          {/* Right: suggest form */}
          <div className="md:w-72 flex-shrink-0 flex flex-col gap-3">
            <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-2xl uppercase">
              <PixelIcon name="heart" solid size={16} />
              suggest
              <span className="flex-1 h-px bg-border-accent opacity-40" />
            </p>

            <div className="relative bg-peach/35 dark:bg-card-bg border-[3px] border-border-accent shadow-[3px_3px_0_var(--shadow-color)] p-4 flex flex-col gap-3.5">
              <span className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-blush" />
              <span className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-blush" />
              <span className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-blush" />
              <span className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-blush" />

              <p className="text-sm text-text-base leading-relaxed pr-1">
                got a book or show i should check out? drop it here
              </p>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="suggest-title"
                  className="text-xs text-highlight-color tracking-widest font-semibold"
                >
                  title
                </label>
                <input
                  id="suggest-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addRecommendation()}
                  placeholder="name of book or show..."
                  className="w-full border-2 border-border-accent bg-cream dark:bg-bg-base px-3 py-2.5
                             text-sm text-text-base tracking-wide
                             placeholder:text-text-muted/60
                             focus:outline-none focus:border-highlight-color focus:shadow-[2px_2px_0_var(--shadow-color)]
                             transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="suggest-why"
                  className="text-xs text-highlight-color tracking-widest font-semibold"
                >
                  why should i? (optional)
                </label>
                <textarea
                  id="suggest-why"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="sell it to me..."
                  rows={3}
                  className="w-full border-2 border-border-accent bg-cream dark:bg-bg-base px-3 py-2.5
                             text-sm text-text-base tracking-wide leading-relaxed
                             placeholder:text-text-muted/60
                             focus:outline-none focus:border-highlight-color focus:shadow-[2px_2px_0_var(--shadow-color)]
                             transition-all resize-none"
                />
              </div>

              <button
                type="button"
                onClick={addRecommendation}
                disabled={submitting || !newTitle.trim()}
                className="w-full py-2.5 px-3 bg-highlight-color text-cream text-sm tracking-widest font-semibold
                           border-[3px] border-border-accent shadow-[3px_3px_0_var(--shadow-color)]
                           hover:brightness-105 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)]
                           active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--shadow-color)]
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_var(--shadow-color)]
                           transition-all inline-flex items-center justify-center gap-2"
              >
                <PixelIcon name="heart" solid size={12} />
                {submitting ? "adding..." : "add suggestion"}
              </button>

              {submitted && (
                <p className="text-xs text-highlight-color text-center tracking-widest animate-pulse inline-flex items-center justify-center gap-1.5 w-full">
                  <PixelIcon name="sparkles" size={11} />
                  thanks for the rec!
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
