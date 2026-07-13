"use client";

import React from "react";

interface BookProps {
  seed: number;
  title: string;
  cover: string;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean, anchor: HTMLElement | null) => void;
  isActive?: boolean;
}

const Book = ({
  seed,
  title,
  cover,
  onClick,
  onHoverChange,
  isActive = false,
}: BookProps) => {
  const spineIndex = (seed % 8) + 1;
  const bookHeights = [144, 112, 128, 152, 120, 160, 152, 136];
  const height = bookHeights[seed % 8];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${title}. Click to learn more.`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onMouseEnter={(e) => onHoverChange?.(true, e.currentTarget)}
      onMouseLeave={() => onHoverChange?.(false, null)}
      onFocus={(e) => onHoverChange?.(true, e.currentTarget)}
      onBlur={() => onHoverChange?.(false, null)}
      className={`cursor-pointer flex-shrink-0 relative z-10 transition-transform duration-150 ease-out outline-none
        hover:-translate-y-2 hover:-translate-x-0.5
        focus-visible:-translate-y-2
        active:translate-y-0 active:translate-x-0
        ${isActive ? "-translate-y-2 z-20" : ""}`}
    >
      <img
        src={`/icons/book-spine-${spineIndex}.png?v=3`}
        alt=""
        data-cover={cover}
        className="block select-none pointer-events-none"
        style={{
          imageRendering: "pixelated",
          height: `${height}px`,
          width: "auto",
        }}
        suppressHydrationWarning
      />
    </div>
  );
};

export default Book;
