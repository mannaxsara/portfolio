import React from "react";
import ProjectGithub from "./icons/ProjGit";
import Youtube from "./icons/Youtube";
import PixelIcon from "./PixelIcon";

interface ProjectCardProps {
  title: string;
  description: string;
  skills: string[];
  image: string;
  git?: string;
  yt?: string;
  className?: string;
  fileLabel?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  skills,
  image,
  git,
  yt,
  className = "",
  fileLabel = "project.exe",
}) => {
  const finalGit =
    !git || git.includes("Chaitanyahoon")
      ? "https://github.com/mannaxsara"
      : git;

  return (
    <div className="group w-full max-w-72 font-body cute-card flex flex-col overflow-hidden">
      <div className="px-3 py-1.5 flex items-center justify-between text-cream bg-border-accent">
        <span className="text-[10px] tracking-widest opacity-90 uppercase inline-flex items-center gap-1.5">
          <PixelIcon name="laptop-code" solid size={10} />
          {fileLabel}
        </span>
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 bg-raspberry border border-white/30" />
          <span className="w-2.5 h-2.5 bg-blush border border-white/30" />
          <span className="w-2.5 h-2.5 bg-cream border border-white/30" />
        </div>
      </div>

      <div className="overflow-hidden border-b-[3px] border-border-accent transition-all duration-500 ease-in-out h-[17rem] group-hover:h-24 flex-shrink-0 relative">
        <img
          src={image}
          alt={title}
          width={400}
          height={600}
          className={`w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 ${className}`}
          style={{ imageRendering: "pixelated" }}
          suppressHydrationWarning
        />
        <div className="absolute inset-0 bg-gradient-to-t from-border-accent/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="px-3 pt-3 pb-2 flex-grow">
        <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 mb-2 text-lg uppercase">
          <PixelIcon name="sparkles" size={14} />
          {title}
          <span className="flex-1 h-px bg-border-accent opacity-40" />
        </p>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 text-[10px] bg-peach/50 dark:bg-card-bg text-text-base border border-border-accent/60 shadow-[1px_1px_0_var(--shadow-color)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-hover:max-h-56 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0">
        <div className="mx-3 mb-3 p-3 relative border-2 border-border-accent bg-cream/70 dark:bg-bg-base/80">
          <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-blush" />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-blush" />
          <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-blush" />
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-blush" />

          <div className="bg-bg-alt border-2 border-border-accent p-2.5 relative overflow-hidden mb-2.5">
            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-40 retro-scanline" />
            <p className="text-xs text-text-base leading-relaxed font-body opacity-90">
              {description}
            </p>
          </div>

          <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
            {finalGit && <ProjectGithub url={finalGit} />}
            {yt && <Youtube url={yt} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
