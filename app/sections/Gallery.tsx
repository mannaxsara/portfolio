'use client'

import { Button } from "pixel-retroui";
import { useRouter } from "next/navigation";
import GalleryCard from "../components/GalleryCard";
import ScrollReveal from "../components/ScrollReveal";
import SectionHeading from "../components/SectionHeading";

import certificationsData from "../data/certifications.json";

const Gallery = () => {
    const router = useRouter();
    const featuredCertifications = certificationsData.slice(0, 3);

    return (  
        <div className="min-h-screen max-w-5xl mx-auto px-4 flex flex-col items-center pt-10 pb-16">
            <ScrollReveal>
                <SectionHeading subtitle="A few of the badges I've collected along the way — proof that I actually finished those courses and didn't just bookmark them forever">
                    Certifications
                </SectionHeading>
            </ScrollReveal>
            <div className="mt-6 flex flex-wrap gap-8 justify-center">
                {featuredCertifications.map((cert, i) => (
                    <ScrollReveal key={cert.caption} delay={0.15 + i * 0.1}>
                        <GalleryCard 
                            image={cert.src}
                            caption={cert.caption}
                            titlebar={cert.titlebar}
                            className="w-full max-w-72"
                        />
                    </ScrollReveal>
                ))}
            </div>  
            <ScrollReveal delay={0.4} className="mt-12 flex justify-center">
                <Button
                    onClick={() => router.push("/gallery")}
                    bg="#ffe8f0"
                    textColor="#5c3a48"
                    borderColor="#e8a0b8"
                    shadow="#d489a8"
                    className="cursor-pointer"
                >
                    <span className="font-jersey text-xl uppercase tracking-wide px-4 py-1 block">
                        See all credentials ♡
                    </span>
                </Button>
            </ScrollReveal>
        </div>
    );
}
 
export default Gallery;
