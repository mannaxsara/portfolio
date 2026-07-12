import React from "react";

interface ProjectGithubProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: number;
  alt?: string;
  url?: string; 
}

const ProjectGithub: React.FC<ProjectGithubProps> = ({
  size = 32,
  alt = "GitHub icon",
  url,
  ...props
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      <img
        src="/icons/github.png"
        alt={alt}
        width={size}
        height={size}
        className="hover:opacity-30 transition"
      />
    </a>
  );
};

export default ProjectGithub;