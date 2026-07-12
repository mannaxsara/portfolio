'use client'

import GalleryCard from "../components/GalleryCard";
import Button from "../components/Button";

const Gallery = () => {
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
        <div className="min-h-screen max-w-5xl mx-auto px-4 flex flex-col items-center">
            <h1 className="font-jersey font-bold text-5xl py-12">Certifications</h1>
            <p className="font-pixelify text-center leading-relaxed">A few of the badges I've collected along the way — proof that I actually finished those courses and didn't just bookmark them forever 😅🎓✨</p>
            <div className="mt-10 flex flex-wrap gap-8 justify-center">
                {featuredCertifications.map((cert) => (
                    <GalleryCard 
                        key={cert.caption}
                        image={cert.src}
                        caption={cert.caption}
                        titlebar={cert.titlebar}
                        className="w-72"
                    />
                ))}
            </div>  
            <a
                href="/gallery"
                className="mt-12"
            >
                <Button 
                    text="See all credentials"
                />
            </a>    
        </div>
    );
}
 
export default Gallery;