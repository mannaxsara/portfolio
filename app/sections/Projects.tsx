"use client";

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import ProjectCard from "../components/ProjectCard";
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";
import PixelIcon from "../components/PixelIcon";

import projectsData from "../data/projects.json";

const Projects = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 flex flex-col items-center justify-center py-16">
      <ScrollReveal>
        <SectionHeading subtitle="A little collection of things I've been building, breaking, and tinkering with — from IoT lab platforms to predictive analytics pipelines. Each one taught me something new (and probably caused at least one 2am debugging session)">
          Projects
        </SectionHeading>
      </ScrollReveal>

      <div className="mt-8 flex flex-wrap gap-10 justify-center items-stretch">
        {projectsData.slice(0, 2).map((project, idx) => (
          <ScrollReveal key={project.title} delay={0.15 + idx * 0.1} className="flex">
            <div
              onClick={() => window.open(project.url, "_blank")}
              className="cursor-pointer flex flex-col h-full"
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                skills={[...project.skills]}
                image={project.image}
                git={project.git}
                live={project.url}
                fileLabel={project.fileLabel}
              />
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3} className="mt-12 flex justify-center">
        <Button
          onClick={() => router.push("/projects")}
          bg="#ffe8f0"
          textColor="#5c3a48"
          borderColor="#e8a0b8"
          shadow="#d489a8"
          className="cursor-pointer"
        >
          <span className="font-jersey text-xl uppercase tracking-wide px-4 py-1 inline-flex items-center gap-2">
            See more projects
            <PixelIcon name="sparkles" size={14} className="text-highlight-color" />
          </span>
        </Button>
      </ScrollReveal>
    </div>
  );
};

export default Projects;
