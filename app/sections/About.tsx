'use client';

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import ScrollReveal from "../components/ScrollReveal";

const About = () => {
    const router = useRouter();

    return (  
        <div className="min-h-screen max-w-2xl mx-auto px-4 flex flex-col items-center pt-10 pb-20 bg-bg-alt/80">
            <ScrollReveal>
                <h1 className="font-jersey text-4xl sm:text-6xl md:text-8xl uppercase tracking-[0.12em] text-text-base text-center py-6">
                    ✦ About Me ✦
                </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <div className="flex flex-col justify-center leading-relaxed text-center font-pixelify gap-5 text-text-base/90">
                    <p className="text-justify">I&apos;m Manna Sara Bilu, a Computer Engineering student with a strong interest in Data Analytics, Machine Learning, and Software Development.</p>
                    <p className="text-justify">From developing IoT solutions at IIIT Hyderabad to building forecasting models during my internship at SAIL Bhilai Steel Plant, I enjoy using technology to solve real-world problems. I also have experience leading technical event operations, where I combined problem-solving with teamwork to deliver seamless experiences.</p>
                    <p className="text-justify">I&apos;m particularly interested in Data Science, Data Analytics, and AI/ML, where I can leverage data to build predictive models and develop intelligent, real-world solutions.</p>
                    <p className="mt-4 p-4 border-2 border-dashed border-border-accent bg-bg-alt/50 text-raspberry dark:text-rosewood font-bold text-[15px] md:text-[16px] tracking-wide shadow-[4px_4px_0px_var(--shadow-color)]">
                        ✦ Curious to know more about me?? Check out my dashboard — it&apos;s basically my digital personality card! ✦
                    </p>
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