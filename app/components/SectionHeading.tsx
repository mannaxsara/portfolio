import PixelIcon from "./PixelIcon";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
}

const SectionHeading = ({ children, subtitle }: SectionHeadingProps) => {
  return (
    <div className="flex flex-col items-center text-center py-6 gap-3">
      <div className="flex items-center gap-2 sm:gap-3 text-border-accent select-none" aria-hidden="true">
        <PixelIcon name="heart" solid className="text-blush animate-pixel-twinkle" size={14} />
        <PixelIcon name="sparkles" className="text-sparkle animate-pixel-twinkle" size={14} style={{ animationDelay: "0.4s" }} />
        <PixelIcon name="star" solid className="text-highlight-color animate-heart-beat" size={16} />
        <PixelIcon name="sparkles" className="text-sparkle animate-pixel-twinkle" size={14} style={{ animationDelay: "0.8s" }} />
        <PixelIcon name="heart" solid className="text-blush animate-pixel-twinkle" size={14} style={{ animationDelay: "1.2s" }} />
      </div>

      <h2 className="pixel-heading font-jersey text-4xl sm:text-6xl md:text-8xl tracking-[0.1em] text-text-base inline-flex items-center gap-2 sm:gap-3 justify-center flex-wrap uppercase">
        <PixelIcon name="sparkles" className="text-highlight-color" size={22} />
        <span>{children}</span>
        <PixelIcon name="sparkles" className="text-highlight-color" size={22} />
      </h2>

      {subtitle && (
        <p className="font-body max-w-xl text-base sm:text-lg text-text-base/85 leading-relaxed px-2">
          {subtitle}
        </p>
      )}

      <div className="heart-divider max-w-xs mt-1" aria-hidden="true">
        <PixelIcon name="heart" solid className="text-highlight-color animate-heart-beat" size={12} />
      </div>
    </div>
  );
};

export default SectionHeading;
