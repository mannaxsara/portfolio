"use client";

import React from "react";

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
            "Processed and cleaned industrial sensor data streams from active blast furnace components using Python and Pandas.",
            "Engineered predictive time-series models using Facebook's Prophet framework to forecast component temperature variables.",
            "Constructed database queries to retrieve and clean operational records, reducing diagnostics latency."
        ]
    },
    {
        role: "Research Intern (IoT)",
        company: "IIIT Hyderabad (RLabs)",
        period: "May 2025 - July 2025",
        sysLabel: "iiith_research.sys",
        bullets: [
            "Contributed to the RLabs remote laboratory platform, enabling web-based remote experiment triggers.",
            "Built WebSockets data streaming bridges to pipe low-latency telemetry between browser interfaces and gateway routers.",
            "Programmed ESP32/Arduino microcontrollers to transmit real-time physical sensor data and actuate stepper motors."
        ]
    },
    {
        role: "Event Technology Head",
        company: "ACM Student Chapter",
        period: "August 2024 - Present",
        sysLabel: "acm_event_tech.exe",
        bullets: [
            "Built and managed event registration software portals, coordinating pipelines for college-level tech events.",
            "Designed relational database tables and registration pipelines, preventing performance lags under peak user traffic.",
            "Collaborated with developers and student organizers to automate attendee check-ins and registration reports."
        ]
    }
];

export default function Experience() {
    return (
        <div className="min-h-screen max-w-3xl mx-auto px-4 flex flex-col items-center justify-center py-20">
            <h1 className="font-jersey font-bold text-5xl py-12">Experience</h1>
            
            {/* Timeline Line */}
            <div className="relative border-l-4 border-rosewood ml-4 flex flex-col gap-12 w-full font-pixelify">
                {experiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-8">
                        {/* Timeline Diamond Node */}
                        <span className="absolute -left-[14px] top-1.5 w-6 h-6 bg-light-pink border-4 border-rosewood rotate-45 flex items-center justify-center shadow-[2px_2px_0px_#412722]">
                            <span className="w-1.5 h-1.5 bg-raspberry rotate-45"></span>
                        </span>
                        
                        {/* Experience Card */}
                        <div className="bg-light-pink border-4 border-rosewood shadow-[6px_6px_0px_#412722] hover:shadow-[8px_8px_0px_#412722] transition-all duration-200">
                            {/* Card Header bar */}
                            <div className="bg-rosewood text-light-pink px-3 py-1.5 flex items-center justify-between text-[9px] tracking-widest opacity-80 select-none">
                                <span>{exp.sysLabel}</span>
                                <div className="flex gap-1">
                                    <span className="w-2.5 h-2.5 bg-raspberry border border-white/20"></span>
                                    <span className="w-2.5 h-2.5 bg-mauve-brown border border-white/20"></span>
                                </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-5">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-raspberry leading-none">{exp.role}</h3>
                                        <p className="text-xs text-mauve-brown mt-1.5 font-bold">{exp.company}</p>
                                    </div>
                                    <span className="text-[10px] text-plum-brown bg-light-pink border border-mauve-brown px-3 py-1 self-start md:self-auto">
                                        {exp.period}
                                    </span>
                                </div>
                                <ul className="flex flex-col gap-2 pl-4 list-disc text-sm text-[#5a3a45] leading-relaxed">
                                    {exp.bullets.map((bullet, bIdx) => (
                                        <li key={bIdx}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
