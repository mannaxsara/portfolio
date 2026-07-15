"use client";

import Link from "next/link";
import ProjectCard from "../components/ProjectCard";
// import EssayCard from "../components/EssayCard"; // TODO: re-enable writeups later
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";
import PixelIcon from "../components/PixelIcon";

import projectsData from "../data/projects.json";

const PROJECTS = projectsData;

// TODO: re-enable writeups later
// const WRITEUPS = [
//   {
//     title: "RLabs: Building a Remote Lab You Can Use from Your Browser",
//     description:
//       "How I helped build a platform that lets students run real physical experiments through their browser — no lab coat required.",
//     fileLabel: "rlabs_writeup.md",
//     date: "20 Jun 2025",
//   },
//   {
//     title: "Predicting the Future (of Blast Furnaces) with Facebook Prophet",
//     description:
//       "What happens when you throw time-series forecasting at messy industrial plant data? Spoiler: a lot of data cleaning and a few surprised engineers.",
//     fileLabel: "prophet_writeup.md",
//     date: "15 Jun 2026",
//   },
// ] as const;

const ProjectsFull = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 flex flex-col items-center pt-28 pb-24">
      <ScrollReveal>
        <SectionHeading subtitle="Here's the lineup of things I've built, broken, and tinkered with — from cloud-connected IoT labs to predictive analytics pipelines. Each one taught me something new (and probably caused at least one 2am debugging session).">
          Projects
        </SectionHeading>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="w-full max-w-2xl">
        <div className="cute-panel p-4 sm:p-5 mb-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { icon: "wifi" as const, label: "IoT" },
            { icon: "chart-line" as const, label: "Analytics" },
            { icon: "robot" as const, label: "ML" },
            { icon: "laptop-code" as const, label: "Full-stack" },
            { icon: "calendar-alt" as const, label: "Event Tech" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 bg-cream/80 dark:bg-card-bg border-2 border-border-accent shadow-[2px_2px_0_var(--shadow-color)] text-text-base"
            >
              <PixelIcon name={icon} solid size={13} className="text-highlight-color" />
              {label}
            </span>
          ))}
        </div>
      </ScrollReveal>

      <div className="mt-8 w-full">
        <ScrollReveal delay={0.12}>
          <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-2xl uppercase mb-6 justify-center sm:justify-start">
            <PixelIcon name="laptop-code" solid size={18} />
            built things
            <span className="flex-1 max-w-xs h-px bg-border-accent opacity-40 hidden sm:block" />
          </p>
        </ScrollReveal>

        <div className="flex flex-wrap gap-8 sm:gap-10 justify-center">
          {PROJECTS.map((project, i) => (
            <ScrollReveal key={project.title} delay={0.15 + i * 0.08}>
              <div
                onClick={() => window.open(project.url, "_blank")}
                className="cursor-pointer"
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.open(project.url, "_blank");
                  }
                }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  skills={[...project.skills]}
                  image={project.image}
                  git={project.git}
                  fileLabel={project.fileLabel}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* TODO: re-enable writeups later
      <div className="mt-16 w-full max-w-3xl">
        <ScrollReveal delay={0.2}>
          <p className="pixel-heading font-jersey text-highlight-color tracking-widest flex items-center gap-2 text-2xl uppercase mb-6 justify-center sm:justify-start">
            <PixelIcon name="book" solid size={18} />
            writeups
            <span className="flex-1 max-w-xs h-px bg-border-accent opacity-40 hidden sm:block" />
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-5">
          {WRITEUPS.map((essay, i) => (
            <ScrollReveal key={essay.title} delay={0.25 + i * 0.1}>
              <EssayCard
                title={essay.title}
                description={essay.description}
                fileLabel={essay.fileLabel}
                date={essay.date}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
      */}

      <ScrollReveal delay={0.35} className="mt-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 font-jersey text-xl uppercase tracking-wide
                     bg-cream/90 dark:bg-card-bg text-text-base border-[3px] border-border-accent
                     shadow-[4px_4px_0_var(--shadow-color)] hover:-translate-y-0.5
                     hover:shadow-[5px_5px_0_var(--shadow-color)] hover:text-highlight-color
                     transition-all"
        >
          <PixelIcon name="heart" solid size={14} className="text-highlight-color" />
          back home
        </Link>
      </ScrollReveal>
    </div>
  );
};

export default ProjectsFull;
