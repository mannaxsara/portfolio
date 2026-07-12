import React from "react";
import ProjectGithub from "./icons/ProjGit";
import Youtube from "./icons/Youtube";

interface ProjectCardProps {
  title: string;
  description: string;
  skills: string[];
  image: string;
  git?: string;
  yt?: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  skills,
  image,
  git,
  yt,
  className = "",
}) => {
  // Safe fallback to Manna's github username if none or default is supplied
  const finalGit = !git || git.includes("Chaitanyahoon") 
    ? "https://github.com/mannaxsara" 
    : git;

  return (
    <div 
      className="group w-full max-w-72 font-pixelify bg-bg-alt border-4 border-border-accent shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[8px_8px_0px_var(--shadow-color)] hover:-translate-y-2 transition-all duration-500 ease-in-out flex flex-col overflow-hidden"
    >
      {/* Titlebar */}
      <div className="px-3 py-1 flex items-center justify-between text-bg-base bg-border-accent">
        <span className="text-[8px] tracking-widest opacity-80 uppercase">project.exe</span>
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 bg-raspberry border border-white/20"></span>
          <span className="w-2.5 h-2.5 bg-mauve-brown border border-white/20"></span>
          <span className="w-2.5 h-2.5 bg-light-pink border border-white/20"></span>
        </div>
      </div>

      {/* Image Container with smooth height shrink on hover */}
      <div className="overflow-hidden border-b-4 border-border-accent transition-all duration-500 ease-in-out h-[17rem] group-hover:h-24 flex-shrink-0">
        <img
          src={image}
          alt={title}
          width={400}
          height={600}
          className={`w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 ${className}`}
          style={{ imageRendering: "pixelated" }}
          suppressHydrationWarning
        />
      </div>

      {/* Always-visible footer: title + skills */}
      <div className="px-3 pt-3 pb-2 flex-grow">
        <p className="text-highlight-color tracking-widest flex items-center gap-2 mb-2 font-bold uppercase text-[13px]">
          ✦ {title}
          <span className="flex-1 h-px bg-border-accent opacity-30"></span>
        </p>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[8px] bg-border-accent text-bg-base border border-border-accent/40"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Sliding and fading detail panel */}
      <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-hover:max-h-56 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0">
        <div className="mx-3 mb-3 p-3 relative border-2 border-border-accent bg-bg-base">
          {/* Corner accents */}
          <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-border-accent"></span>
          <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-border-accent"></span>
          <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-border-accent"></span>
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-border-accent"></span>

          {/* Description Card */}
          <div className="bg-bg-alt border-2 border-border-accent p-2.5 relative overflow-hidden mb-2.5">
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-30"
              style={{
                background:
                  "repeating-linear-gradient(90deg, var(--border-accent) 0px, var(--border-accent) 4px, transparent 4px, transparent 8px)",
              }}
            />
            <p className="text-[10px] text-text-base leading-relaxed font-pixelify opacity-90">{description}</p>
          </div>

          {/* Action Links */}
          <div className="flex gap-2 items-center">
            {finalGit && <ProjectGithub url={finalGit} />}
            {yt && <Youtube url={yt} />}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProjectCard;