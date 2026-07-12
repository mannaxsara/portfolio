interface EssayCardProps {
  title: string;
  description: string;
  fileLabel?: string;
  href?: string;
}

const EssayCard = ({
  title,
  description,
  fileLabel = "essay.txt",
  href,
}: EssayCardProps) => {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className="group block w-full font-pixelify bg-bg-alt border-4 border-border-accent
        shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[7px_7px_0px_var(--shadow-color)]
        hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      {/* Titlebar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-border-accent">
        <span className="text-bg-base text-[8px] tracking-widest opacity-80">
          {fileLabel}
        </span>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 bg-raspberry border border-white/20"></span>
          <span className="w-2.5 h-2.5 bg-mauve-brown border border-white/20"></span>
          <span className="w-2.5 h-2.5 bg-light-pink border border-white/20"></span>
        </div>
      </div>

      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">

        {/* Title */}
        <h2
          className="text-lg font-bold text-border-accent hover:text-highlight-color transition-colors duration-200"
          style={{ textShadow: "2px 2px 0 rgba(65,39,34,0.08)" }}
        >
          {title}
        </h2>

        {/* Description */}
        <div className="bg-bg-base border-2 border-border-accent p-3 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-0.5 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(90deg, var(--border-accent) 0px, var(--border-accent) 4px, transparent 4px, transparent 8px)",
            }}
          />
          <p className="text-highlight-color text-[11px] tracking-widest mb-2 flex items-center gap-2">
            ✦ about
            <span className="flex-1 h-px bg-border-accent opacity-30"></span>
          </p>
          <p className="text-[10px] text-text-base leading-relaxed opacity-95">{description}</p>
        </div>

        {/* Read hint */}
        <p className="text-[8px] text-text-muted tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-right">
          read ›
        </p>

      </div>
    </Wrapper>
  );
};

export default EssayCard;