import { useState, useEffect } from "react";

interface GalleryCardProps {
  image: string;
  caption?: string;
  titlebar?: string;
  className?: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ image, caption, titlebar, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distanceY = touchStart - touchEnd;
    
    // Swipe Up or Swipe Down by more than 80px closes lightbox
    if (Math.abs(distanceY) > 80) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setIsOpen(true)}
        className={`group cursor-pointer font-body cute-card ${className}`}
      >
        {/* Titlebar */}
        <div className="bg-border-accent text-cream px-3 py-1.5 flex items-center justify-between">
          <span className="text-[10px] tracking-widest opacity-90">♡ {titlebar || "certificate.sys"}</span>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-raspberry border border-white/30"></span>
            <span className="w-2.5 h-2.5 bg-blush border border-white/30"></span>
            <span className="w-2.5 h-2.5 bg-cream border border-white/30"></span>
          </div>
        </div>

        {/* Image */}
        <div className="border-b-[3px] border-border-accent overflow-hidden">
          <img
            src={image}
            alt={caption || "Artwork"}
            width={400}
            height={500}
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            suppressHydrationWarning
          />
        </div>

        {/* Caption */}
        {caption && (
          <div className="px-3 py-2 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-40"
              style={{
                background:
                  "repeating-linear-gradient(90deg, var(--border-accent) 0px, var(--border-accent) 4px, transparent 4px, transparent 8px)",
              }}
            />
            <p className="text-xs text-text-base tracking-wide opacity-90">♡ {caption}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 font-body p-4"
          onClick={() => setIsOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-bg-alt border-4 border-border-accent shadow-[8px_8px_0px_var(--shadow-color)]
              max-w-[90vw] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal titlebar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent flex-shrink-0">
              <span className="text-bg-base text-[10px] tracking-widest opacity-80">
                {titlebar ? `view_${titlebar}` : "certificate_view.exe"}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-5 h-5 flex items-center justify-center
                           bg-highlight-color border-2 border-border-accent text-bg-base
                           text-[10px] hover:bg-border-accent transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Full image */}
            <div className="p-4 flex flex-col gap-3 overflow-auto">
              <div className="border-2 border-border-accent shadow-[3px_3px_0px_var(--border-accent)] relative">
                {/* Corner accents */}
                <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-border-accent z-10"></span>
                <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-border-accent z-10"></span>
                <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-border-accent z-10"></span>
                <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-border-accent z-10"></span>
                <img
                  src={image}
                  alt={caption || "Full Artwork"}
                  width={800}
                  height={800}
                  className="block max-w-full max-h-[70vh] object-contain"
                  suppressHydrationWarning
                />
              </div>

              {/* Caption in modal */}
              {caption && (
                <div className="bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-30"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, var(--border-accent) 0px, var(--border-accent) 4px, transparent 4px, transparent 8px)",
                    }}
                  />
                  <p className="text-highlight-color text-xs tracking-widest flex items-center gap-2">
                    ✦ {caption}
                    <span className="flex-1 h-px bg-border-accent opacity-30"></span>
                  </p>
                </div>
              )}

              {/* Click outside hint */}
              <p className="text-[10px] text-text-muted text-center tracking-widest opacity-60">
                click outside or press ESC to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryCard;