import React from "react";

interface BookProps {
  seed: number;
  onClick?: () => void;
}

const Book = ({ seed, onClick }: BookProps) => {
  const spineIndex = (seed % 8) + 1;
  
  // Custom height ratios for vertical rhythm in the flex container
  // [Silence of Lambs, Perks, Guest List, Mockingbird, Then None, Verity, Evelyn Hugo, Harry Potter]
  const bookHeights = [144, 112, 128, 152, 120, 160, 152, 136];
  const height = bookHeights[seed % 8];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:-translate-y-2 hover:-translate-x-0.5 active:translate-y-0 active:translate-x-0 transition-all duration-100 ease-out flex-shrink-0"
    >
      <img
        src={`/icons/book-spine-${spineIndex}.png?v=3`}
        alt="book spine"
        className="block w-auto select-none"
        style={{
          imageRendering: "pixelated",
          height: `${height}px`,
        }}
        suppressHydrationWarning
      />
    </div>
  );
};

export default Book;