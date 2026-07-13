import PixelIcon from "./PixelIcon";

interface EssayCardProps {
  title: string;
  description: string;
  fileLabel?: string;
  href?: string;
  date?: string;
}

const EssayCard = ({
  title,
  description,
  fileLabel = "essay.txt",
  href,
  date,
}: EssayCardProps) => {
  const className =
    "group block w-full font-body cute-card overflow-hidden cursor-pointer";

  const body = (
    <>
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-cream text-[10px] tracking-widest inline-flex items-center gap-1.5">
          <PixelIcon name="book" solid size={10} />
          {fileLabel}
        </span>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-raspberry border border-white/30" />
          <span className="w-2.5 h-2.5 bg-blush border border-white/30" />
          <span className="w-2.5 h-2.5 bg-cream border border-white/30" />
        </div>
      </div>

      <div className="px-4 pt-3 pb-3 flex flex-col gap-2">
        {date && (
          <span className="text-[10px] text-text-muted tracking-widest uppercase inline-flex items-center gap-1.5">
            <PixelIcon name="calendar-alt" size={10} className="text-highlight-color" />
            {date}
          </span>
        )}

        <h3 className="pixel-heading font-jersey text-2xl sm:text-3xl text-highlight-color leading-snug group-hover:text-raspberry transition-colors uppercase">
          {title}
        </h3>

        <div className="bg-cream/70 dark:bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
          <p className="text-highlight-color text-xs tracking-widest mb-2 flex items-center gap-2 font-semibold">
            <PixelIcon name="sparkles" size={11} />
            about
            <span className="flex-1 h-px bg-border-accent opacity-40" />
          </p>
          <p className="text-sm text-text-base leading-relaxed opacity-95">{description}</p>
        </div>

        <p className="text-[10px] text-text-muted tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-right inline-flex items-center justify-end gap-1">
          read more
          <PixelIcon name="sparkles" size={10} className="text-highlight-color" />
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return <div className={className}>{body}</div>;
};

export default EssayCard;
