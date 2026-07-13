"use client";

import GalleryCard from "../components/GalleryCard";
import SectionHeading from "../components/SectionHeading";

interface Artwork {
  src: string;
  caption: string;
  titlebar?: string;
}

export default function GalleryFullClient({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 flex flex-col items-center pb-24 pt-16">
      <div className="max-w-2xl pb-8 text-center">
        <SectionHeading subtitle="Here are all the credentials I've picked up on my journey so far — each one represents a rabbit hole I fell into and (eventually) climbed out of, a little wiser and a lot more caffeinated">
          Certifications
        </SectionHeading>
      </div>

      <div className="flex flex-wrap gap-8 justify-center mt-2">
        {artworks.map((art, idx) => (
          <div key={`${art.src}-${idx}`} className="w-full max-w-72">
            <GalleryCard 
              image={art.src} 
              caption={art.caption} 
              titlebar={art.titlebar}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
