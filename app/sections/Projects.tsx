'use client';

import ProjectCard from "../components/ProjectCard";
import Button from "../components/Button";
import ScrollReveal from "../components/ScrollReveal";

const Projects = () => {
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 flex flex-col items-center">
        <ScrollReveal>
            <h1 className="font-jersey font-bold text-5xl py-12 text-text-base text-center">Projects</h1>
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
                    skills={["React", "IoT", "Node.js", "WebSockets", "Microcontrollers"]}
                    image="/projects/proj-rlabs.png"
                    git="https://github.com/Chaitanyahoon"
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
                image="/projects/proj-sail.png"
                git="https://github.com/Chaitanyahoon"
              />
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.3}>
            <a href="/projects" className="mt-10">
              <Button text="See more projects" />
            </a>
        </ScrollReveal>
    </div>
  );
};

export default Projects;