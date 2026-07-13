"use client";

import GalleryCard from "../components/GalleryCard";

interface Artwork {
  src: string;
  caption: string;
  titlebar?: string;
}

export default function GalleryFullClient({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 flex flex-col items-center pb-24">
      
      <div className="max-w-2xl pb-12 text-center">
        <h1 className="font-jersey font-bold text-5xl pt-24 pb-6">
          Certifications
        </h1>
        <p className="font-poppins text-text-base opacity-90">
          Here are all the credentials I've picked up on my journey so far — each one represents a rabbit hole I fell into and (eventually) climbed out of, a little wiser and a lot more caffeinated
        </p>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-wrap gap-8 justify-center mt-6">
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