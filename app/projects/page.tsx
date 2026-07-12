'use client';

import ProjectCard from "../components/ProjectCard";
import ScrollReveal from "../components/ScrollReveal";

const ProjectsFull = () => {
    return (  
        <div className="min-h-screen max-w-6xl mx-auto px-4 flex flex-col items-center pt-28 pb-20">
            {/* Staggered Heading matching About/Experience styles */}
            <ScrollReveal>
                <h1 className="font-jersey text-7xl md:text-8xl uppercase tracking-[0.12em] text-text-base text-center py-6">
                    ✦ Projects ✦
                </h1>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
                <p className="max-w-2xl leading-relaxed text-center font-pixelify text-text-base/90 text-[15px] md:text-[16px]">
                    Here&apos;s the lineup of work I&apos;ve built and optimized! From cloud-connected IoT systems enabling remote physics experiments to predictive time-series modeling pipelines designed to analyze industrial manufacturing operational variables. 🌸✨💫
                </p>
            </ScrollReveal>
        
            {/* Project Cards with staggered scroll reveal delays */}
            <div className="mt-16 flex flex-wrap gap-10 justify-center">
                <ScrollReveal delay={0.2}>
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

                <ScrollReveal delay={0.3}>
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

                <ScrollReveal delay={0.4}>
                    <div
                        onClick={() => window.open("https://facebook.github.io/prophet/", "_blank")}
                        className="cursor-pointer"
                    >
                        <ProjectCard
                            title="Industrial Anomaly Detector"
                            description="Predictive modeling and time-series anomaly detection on manufacturing dataset variables to pre-emptively identify component thermal fatigue."
                            skills={["Python", "Prophet", "Scikit-Learn", "Jupyter", "Machine Learning"]}
                            image="/projects/proj-prophet.webp"
                            git="https://github.com/mannaxsara"
                        />
                    </div>
                </ScrollReveal>
            </div>

        </div>
    );
}
 
export default ProjectsFull;