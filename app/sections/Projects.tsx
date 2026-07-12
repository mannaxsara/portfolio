'use client';

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import ProjectCard from "../components/ProjectCard";
import ScrollReveal from "../components/ScrollReveal";

const Projects = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 flex flex-col items-center justify-center">
        <ScrollReveal>
            <h1 className="font-jersey text-4xl sm:text-6xl md:text-8xl uppercase tracking-[0.12em] text-text-base text-center py-6">
                ✦ Projects ✦
            </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
            <p className="leading-relaxed text-center font-pixelify text-text-base/90">
                A little collection of things I&apos;ve been building, breaking, and tinkering with — from IoT lab platforms to predictive analytics pipelines. Each one taught me something new (and probably caused at least one 2am debugging session) ✨💫
            </p>
        </ScrollReveal>
    
        {/*Project Cards*/}
        <div className="mt-12 flex flex-wrap gap-10 justify-center">
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
              />
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.3} className="mt-12 flex justify-center">
            <Button
                onClick={() => router.push("/projects")}
                bg="#f4e2ea"
                textColor="#0f0c3c"
                borderColor="#af7491"
                shadow="#412722"
                className="cursor-pointer"
            >
                <span className="font-jersey text-xl uppercase tracking-wide px-4 py-1 block">
                    See more projects
                </span>
            </Button>
        </ScrollReveal>
    </div>
  );
};

export default Projects;