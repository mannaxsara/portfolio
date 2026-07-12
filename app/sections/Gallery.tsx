'use client'

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import GalleryCard from "../components/GalleryCard";
import ScrollReveal from "../components/ScrollReveal";

const Gallery = () => {
    const router = useRouter();
    const featuredCertifications = [
        {
          src: "/cert-data-analytics.png",
          caption: "Google Data Analytics Professional Certificate",
          titlebar: "google_data_analytics.sys"
        },
        {
          src: "/cert-advanced-analytics.png",
          caption: "Google Advanced Data Analytics Certificate",
          titlebar: "google_advanced_analytics.sys"
        },
        {
          src: "/cert-acm-w.png",
          caption: "ACM-W Coding Contest Achievement",
          titlebar: "acm_w_contest.sys"
        }
    ];

    return (  
        <div className="min-h-screen max-w-5xl mx-auto px-4 flex flex-col items-center bg-bg-alt py-16">
            <ScrollReveal>
                <h1 className="font-jersey font-bold text-6xl md:text-7xl py-12 text-text-base text-center">Certifications</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <p className="font-pixelify text-center leading-relaxed text-text-base/90">A few of the badges I&apos;ve collected along the way — proof that I actually finished those courses and didn&apos;t just bookmark them forever 😅🎓✨</p>
            </ScrollReveal>
            <div className="mt-10 flex flex-wrap gap-8 justify-center">
                {featuredCertifications.map((cert, i) => (
                    <ScrollReveal key={cert.caption} delay={0.15 + i * 0.1}>
                        <GalleryCard 
                            image={cert.src}
                            caption={cert.caption}
                            titlebar={cert.titlebar}
                            className="w-72"
                        />
                    </ScrollReveal>
                ))}
            </div>  
            <ScrollReveal delay={0.4} className="mt-12 flex justify-center">
                <Button
                    onClick={() => router.push("/gallery")}
                    bg="#f4e2ea"
                    textColor="#0f0c3c"
                    borderColor="#af7491"
                    shadow="#412722"
                    className="cursor-pointer"
                >
                    <span className="font-jersey text-xl uppercase tracking-wide px-4 py-1 block">
                        See all credentials
                    </span>
                </Button>
            </ScrollReveal>
        </div>
    );
}
 
export default Gallery;