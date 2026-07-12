'use client';

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import ScrollReveal from "../components/ScrollReveal";

const About = () => {
    const router = useRouter();

    return (  
        <div className="min-h-screen max-w-2xl mx-auto px-4 flex flex-col items-center py-20 bg-bg-alt">
            <ScrollReveal>
                <h1 className="font-jersey font-bold text-6xl md:text-7xl py-12 text-text-base text-center">About Me</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <div className="flex flex-col justify-center leading-relaxed text-center font-pixelify gap-5 text-text-base/90">
                    <p>Hi there! I&apos;m Manna — a Computer Science student at St. Vincent Pallotti College of Engineering, Nagpur, and I absolutely love building things that sit at the intersection of code, data, and real-world impact 💻🌱</p>
                    <p>My journey so far has taken me from wiring up IoT microcontrollers in the RLabs cyber-physical systems lab at IIIT Hyderabad, to crunching industrial datasets and building time-series forecasting models as a trainee data analyst at the SAIL Bhilai Steel Plant. I also lead event technology for our college&apos;s ACM student chapter — which basically means I&apos;m the person making sure the registration portals don&apos;t crash on event day 😅</p>
                    <p>When I&apos;m not debugging WebSocket connections or writing SQL queries, you&apos;ll probably find me exploring new frameworks, geeking out over clean dashboards, or brainstorming ways to make tech more accessible for everyone around me. I believe the best software is built with empathy, curiosity, and maybe a little bit of chaos ✨</p>
                    <p>Want the full picture? Check out my dashboard — it&apos;s basically my digital personality card!</p>
                </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
                <img src="/manna-avatar.png" alt="Manna Sara Bilu" width={200} height={300} className="object-contain mt-6 filter drop-shadow-[4px_4px_0px_#634A45] animate-pixel-float" suppressHydrationWarning/>
            </ScrollReveal>
            <ScrollReveal delay={0.3} className="mt-6 flex justify-center">
                <Button
                    onClick={() => router.push("/dashboard")}
                    bg="#f4e2ea"
                    textColor="#0f0c3c"
                    borderColor="#af7491"
                    shadow="#412722"
                    className="cursor-pointer"
                >
                    <span className="font-jersey text-2xl uppercase tracking-wide px-4 py-1 block">
                        Dashboard
                    </span>
                </Button>
            </ScrollReveal>
        </div>
    );
}

export default About;