"use client";

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import ProjectCard from "../components/ProjectCard";
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";
import PixelIcon from "../components/PixelIcon";

const Projects = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 flex flex-col items-center justify-center py-16">
      <ScrollReveal>
        <SectionHeading subtitle="A little collection of things I've been building, breaking, and tinkering with — from IoT lab platforms to predictive analytics pipelines. Each one taught me something new (and probably caused at least one 2am debugging session)">
          Projects
        </SectionHeading>
      </ScrollReveal>

      <div className="mt-8 flex flex-wrap gap-10 justify-center">
        <ScrollReveal delay={0.15}>
          <div
            onClick={() => window.open("https://rlabs.iiit.ac.in/", "_blank")}
            className="cursor-pointer"
          >
            <ProjectCard
              title="RLabs Platform"
              description="An innovative cloud-connected remote lab platform enabling students to perform real-time physical experiments through the browser."
              skills={["React", "IoT", "Node.js", "WebSockets", "ESP32", "C++"]}
              image="/projects/proj-rlabs.webp"
              git="https://github.com/mannaxsara"
              fileLabel="rlabs.exe"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.25}>
          <div
            onClick={() => window.open("https://www.sail.co.in/", "_blank")}
            className="cursor-pointer"
          >
            <ProjectCard
              title="SAIL Analytics"
              description="Analysis of industrial manufacturing operational datasets and predictive time-series modeling for Bhilai Steel Plant (SAIL)."
              skills={["Python", "Prophet", "SQL", "Pandas", "Data Analytics"]}
              image="/projects/proj-sail.webp"
              git="https://github.com/mannaxsara"
              fileLabel="sail_analytics.exe"
            />
          </div>
        </ScrollReveal>
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
