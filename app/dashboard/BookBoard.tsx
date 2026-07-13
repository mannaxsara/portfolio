"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import Book from "../components/Book";
import bookData from "../data/books.json";
import PixelIcon from "../components/PixelIcon";

interface BookType {
  id: number;
  title: string;
  author: string;
  cover: string;
  comment: string;
}

const books: BookType[] = bookData;
const PREVIEW_WIDTH = 152;

const BookBoard = () => {
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [hoveredBook, setHoveredBook] = useState<BookType | null>(null);
  const [previewLeft, setPreviewLeft] = useState(8);
  const shelfWrapRef = useRef<HTMLDivElement>(null);

  const handleHoverChange = useCallback(
    (book: BookType | null, hovered: boolean, anchor: HTMLElement | null) => {
      if (!hovered || !book || !anchor || !shelfWrapRef.current) {
        setHoveredBook(null);
        return;
      }

      const wrapRect = shelfWrapRef.current.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const center =
        anchorRect.left - wrapRect.left + anchorRect.width / 2 - PREVIEW_WIDTH / 2;
      const maxLeft = Math.max(8, wrapRect.width - PREVIEW_WIDTH - 8);
      const clamped = Math.max(8, Math.min(center, maxLeft));

      setPreviewLeft(clamped);
      setHoveredBook(book);
    },
    []
  );

  return (
    <div className="w-full font-body cute-card overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[11px] tracking-widest inline-flex items-center gap-1.5">
          <PixelIcon name="book" solid size={11} />
          bookshelf.exe
        </span>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-cream border border-white/30" />
          <span className="w-3 h-3 bg-blush border border-white/30" />
          <span className="w-3 h-3 bg-raspberry border border-white/30" />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-2xl uppercase">
          <PixelIcon name="book-heart" solid size={16} />
          books read
          <span className="flex-1 h-px bg-border-accent opacity-40" />
        </p>

        <div ref={shelfWrapRef} className="relative z-20">
          {/* Preview stays inside the shelf bounds (overlays books, never escapes card) */}
          {hoveredBook && (
            <div
              className="pointer-events-none absolute top-2 z-50 w-[152px]"
              style={{ left: previewLeft }}
              role="tooltip"
            >
              <div className="bg-cream/95 dark:bg-card-bg/95 backdrop-blur-sm border-[3px] border-border-accent shadow-[4px_4px_0_var(--shadow-color)] overflow-hidden">
                <div className="flex items-center justify-between px-2 py-0.5 bg-border-accent">
                  <span className="text-cream text-[9px] tracking-widest inline-flex items-center gap-1">
                    <PixelIcon name="book" solid size={9} />
                    peek.exe
                  </span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-raspberry border border-white/30" />
                    <span className="w-1.5 h-1.5 bg-blush border border-white/30" />
                    <span className="w-1.5 h-1.5 bg-cream border border-white/30" />
                  </div>
                </div>

                <div className="p-1.5 flex gap-2 items-center">
                  <div className="flex-shrink-0 border-2 border-border-accent bg-bg-alt overflow-hidden shadow-[2px_2px_0_var(--shadow-color)]">
                    <Image
                      src={hoveredBook.cover}
                      alt={hoveredBook.title}
                      width={56}
                      height={80}
                      className="block object-cover"
                      style={{ width: 56, height: 80, imageRendering: "pixelated" }}
                    />
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col gap-1">
                    <p className="pixel-heading font-jersey text-xs text-highlight-color leading-tight uppercase line-clamp-3">
                      {hoveredBook.title}
                    </p>
                    <p className="text-[9px] text-text-muted tracking-wide truncate">
                      by {hoveredBook.author}
                    </p>
                    <span className="text-[9px] text-highlight-color tracking-widest font-semibold inline-flex items-center gap-1 mt-0.5">
                      <PixelIcon name="sparkles" size={9} />
                      click more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className="bookshelf-shelf flex items-end overflow-x-auto gap-1 pt-10 pb-0 border-b-[6px] border-border-accent shadow-[0_4px_0_var(--shadow-color)] relative z-10"
          >
            {books.map((book) => (
              <Book
                key={book.id}
                seed={book.id}
                title={book.title}
                cover={book.cover}
                isActive={hoveredBook?.id === book.id || selectedBook?.id === book.id}
                onClick={() =>
                  setSelectedBook((prev) => (prev?.id === book.id ? null : book))
                }
                onHoverChange={(hovered, anchor) =>
                  handleHoverChange(hovered ? book : null, hovered, anchor)
                }
              />
            ))}
            <div className="flex-shrink-0 ml-auto flex items-end relative z-0">
              <img
                src="/icons/flowerpot.png?v=8"
                alt="flowerpot"
                style={{
                  imageRendering: "pixelated",
                  height: "140px",
                  width: "auto",
                }}
                className="block"
              />
            </div>
          </div>
          <div className="h-1.5 bg-border-accent/40" />
        </div>

        {selectedBook ? (
          <div className="bg-peach/30 dark:bg-card-bg border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] p-4 relative z-0">
            <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blush" />
            <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blush" />
            <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blush" />
            <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blush" />

            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-shrink-0 mx-auto md:mx-0 border-2 border-border-accent shadow-[3px_3px_0_var(--shadow-color)] bg-cream">
                <Image
                  src={selectedBook.cover}
                  alt={selectedBook.title}
                  width={120}
                  height={180}
                  className="block h-auto w-auto max-w-[120px]"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="pixel-heading font-jersey text-2xl sm:text-3xl text-highlight-color leading-snug uppercase">
                    {selectedBook.title}
                  </h3>
                  <span className="inline-block mt-2 text-xs text-text-base px-2 py-0.5 border-y-2 border-border-accent tracking-wide">
                    by {selectedBook.author}
                  </span>
                </div>

                <div className="bg-cream/80 dark:bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
                  <p className="text-highlight-color text-sm tracking-widest mb-2 flex items-center gap-2 font-semibold">
                    <PixelIcon name="sparkles" size={12} />
                    thoughts
                    <span className="flex-1 h-px bg-border-accent opacity-40" />
                  </p>
                  <p className="text-sm text-text-base leading-relaxed">
                    {selectedBook.comment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-5 relative overflow-hidden z-0">
            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
            <p className="text-xs text-text-muted text-center tracking-widest inline-flex items-center justify-center gap-2 w-full">
              <PixelIcon name="book" size={12} />
              hover a book to peek · click to learn more
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookBoard;
