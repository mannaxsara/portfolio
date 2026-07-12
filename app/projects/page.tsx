'use client';

import ProjectCard from "../components/ProjectCard";

const ProjectsFull = () => {
    return (  
        <div className="min-h-screen max-w-6xl mx-auto px-4 flex flex-col items-center py-24">
            <h1 className="font-jersey font-bold text-5xl pb-6">Projects</h1>
            <p className="max-w-2xl leading-relaxed text-center font-pixelify">
                Here's the full lineup! Some are polished, some are scrappy experiments, but every single one taught me something new. I love the process of going from "wait, how does this even work?" to "oh wow, it actually works!" — that's the best feeling ever 🌸✨💫
            </p>
        
            {/*Project Cards*/}
            <div className="mt-12 flex flex-wrap gap-8 justify-center">
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
                <div
                onClick={() => window.open("https://www.acm.org/", "_blank")}
                className="cursor-pointer"
                >
                    <ProjectCard
                        title="ACM Portal"
                        description="Event management and technologist head software portals, streamlining registration pipelines and event workflows."
                        skills={["React", "Next.js", "Tailwind CSS", "Vite", "Node.js"]}
                        image="/projects/proj-acm.png"
                        git="https://github.com/Chaitanyahoon"
                    />
                </div>
                <div
                onClick={() => window.open("https://facebook.github.io/prophet/", "_blank")}
                className="cursor-pointer"
                >
                    <ProjectCard
                        title="Prophet Forecasting"
                        description="Predictive modeling and time-series analysis on manufacturing dataset variables using Facebook's Prophet framework."
                        skills={["Python", "Prophet", "Jupyter", "Machine Learning"]}
                        image="/projects/proj-prophet.png"
                        git="https://github.com/Chaitanyahoon"
                    />
                </div>
            </div>

        </div>
    );
}
 
export default ProjectsFull;