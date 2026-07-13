'use client';

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";

const About = () => {
    const router = useRouter();

    return (  
        <div className="min-h-screen max-w-2xl mx-auto px-4 flex flex-col items-center pt-10 pb-20">
            <ScrollReveal>
                <SectionHeading>About Me</SectionHeading>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="w-full">
                <div className="cute-panel p-5 sm:p-8 flex flex-col justify-center leading-relaxed text-base text-center font-body gap-5 text-text-base/90">
                    <p className="text-justify">I&apos;m Manna Sara Bilu, a Computer Engineering student with a strong interest in Data Analytics, Machine Learning, and Software Development.</p>
                    <p className="text-justify">From developing IoT solutions at IIIT Hyderabad to building forecasting models during my internship at SAIL Bhilai Steel Plant, I enjoy using technology to solve real-world problems. I also have experience leading technical event operations, where I combined problem-solving with teamwork to deliver seamless experiences.</p>
                    <p className="text-justify">I&apos;m particularly interested in Data Science, Data Analytics, and AI/ML, where I can leverage data to build predictive models and develop intelligent, real-world solutions.</p>
                    <p className="mt-2 p-4 border-2 border-dashed border-border-accent bg-cream/60 dark:bg-card-bg/60 text-highlight-color font-semibold text-[15px] md:text-[16px] tracking-wide shadow-[4px_4px_0px_var(--shadow-color)]">
                        ♡ Curious to know more about me?? Check out my dashboard — it&apos;s basically my digital personality card! ♡
                    </p>
                </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
                <div className="relative mt-8">
                    <span className="absolute -top-2 -right-2 text-blush text-xl animate-heart-beat" aria-hidden="true">♡</span>
                    <span className="absolute -bottom-1 -left-3 text-sparkle text-sm animate-pixel-twinkle" aria-hidden="true">✦</span>
                    <img src="/manna-avatar.png" alt="Manna Sara Bilu" width={200} height={300} className="object-contain filter drop-shadow-[4px_4px_0px_var(--shadow-color)] animate-pixel-float" suppressHydrationWarning/>
                </div>
            </ScrollReveal>
            <ScrollReveal delay={0.3} className="mt-6 flex justify-center">
                <Button
                    onClick={() => router.push("/dashboard")}
                    bg="#ffe8f0"
                    textColor="#5c3a48"
                    borderColor="#e8a0b8"
                    shadow="#d489a8"
                    className="cursor-pointer"
                >
                    <span className="font-jersey text-2xl uppercase tracking-wide px-4 py-1 block">
                        ♡ Dashboard
                    </span>
                </Button>
            </ScrollReveal>
        </div>
    );
}

export default About;
