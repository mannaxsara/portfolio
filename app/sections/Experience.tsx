"use client";

import React from "react";
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";

interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    bullets: string[];
    sysLabel: string;
}

const experiences: ExperienceItem[] = [
    {
        role: "Trainee Data Analyst",
        company: "Bhilai Steel Plant (SAIL)",
        period: "June 2026 - July 2026",
        sysLabel: "sail_analytics.sys",
        bullets: [
            "Developed robust data pre-processing and cleansing pipelines for high-frequency industrial sensor telemetry from operational blast furnaces using Python and Pandas.",
            "Engineered predictive time-series models using Facebook's Prophet framework to forecast critical component temperatures, enabling proactive thermal maintenance.",
            "Optimized SQL database queries to fetch and clean raw operational records, significantly reducing diagnostic latency for furnace engineers."
        ]
    },
    {
        role: "Research Intern (IoT)",
        company: "IIIT Hyderabad (RLabs)",
        period: "May 2025 - July 2025",
        sysLabel: "iiith_research.sys",
        bullets: [
            "Collaborated on the development of the IIIT-H RLabs remote laboratory platform, facilitating web-based triggers and monitoring for physical experiments.",
            "Designed and implemented high-throughput, low-latency WebSocket communication layers to stream telemetry between gateway routers and responsive client browser interfaces.",
            "Programmed ESP32 and Arduino microcontrollers to integrate sensor networks, process real-time telemetry, and actuate stepper motors with high precision."
        ]
    },
    {
        role: "Event Technology Head",
        company: "ACM Student Chapter",
        period: "August 2024 - Present",
        sysLabel: "acm_event_tech.exe",
        bullets: [
            "Architected and managed full-stack event registration portals, successfully coordinating digital infrastructure for large-scale, college-level technical events.",
            "Designed high-performance relational database schemas and optimized data ingestion pipelines, maintaining zero downtime and minimal latency under peak concurrent traffic.",
            "Spearheaded collaboration with cross-functional development teams and student coordinators to automate attendee check-in systems and generate real-time analytics reports."
        ]
    }
];

export default function Experience() {
    return (
        <div className="min-h-screen max-w-3xl mx-auto px-4 flex flex-col items-center justify-center py-20">
            <ScrollReveal>
                <SectionHeading>Experience</SectionHeading>
            </ScrollReveal>
            
            <div className="relative border-l-4 border-border-accent ml-4 flex flex-col gap-12 font-body mt-4">
                {experiences.map((exp, idx) => (
                    <ScrollReveal key={idx} delay={0.1 + idx * 0.15} direction="left">
                        <div className="relative pl-8">
                            <span className="absolute -left-[15px] top-1.5 w-6 h-6 bg-bg-alt border-[3px] border-border-accent rotate-45 flex items-center justify-center shadow-[2px_2px_0px_var(--shadow-color)]">
                                <span className="w-1.5 h-1.5 bg-highlight-color rounded-none" />
                            </span>
                            
                            <div className="cute-card text-text-base overflow-hidden">
                                <div className="bg-border-accent text-cream px-3 py-1.5 flex items-center justify-between text-[11px] tracking-widest select-none">
                                    <span>♡ {exp.sysLabel}</span>
                                    <div className="flex gap-1">
                                        <span className="w-2.5 h-2.5 bg-raspberry border border-white/30" />
                                        <span className="w-2.5 h-2.5 bg-blush border border-white/30" />
                                        <span className="w-2.5 h-2.5 bg-cream border border-white/30" />
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                                        <div>
                                            <h3 className="pixel-heading font-jersey text-xl sm:text-2xl text-highlight-color leading-snug">
                                            {exp.role}
                                            </h3>
                                            <p className="text-base text-text-base/80 mt-1.5 font-semibold">{exp.company}</p>
                                        </div>
                                        <span className="text-sm text-text-base bg-cream/80 dark:bg-bg-base border-2 border-border-accent px-3 py-1 self-start md:self-auto shadow-[2px_2px_0_var(--shadow-color)]">
                                            {exp.period}
                                        </span>
                                    </div>
                                    <ul className="flex flex-col gap-3.5 pl-1 text-base text-text-base opacity-95 leading-relaxed">
                                        {exp.bullets.map((bullet, bIdx) => (
                                            <li key={bIdx} className="flex items-start gap-2.5">
                                                <span className="text-highlight-color mt-2 flex-shrink-0">
                                                    <span className="block w-1.5 h-1.5 rotate-45 bg-highlight-color" />
                                                </span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}
