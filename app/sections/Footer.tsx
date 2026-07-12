import Link from "next/link";
import ScrollLink from "../components/ScrollLink";

const Footer = () => {
  return (  
    <footer className="font-pixelify text-sm text-text-base flex flex-col justify-center items-center bg-bg-alt py-8 border-t-4 border-border-accent gap-6">
      
      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm">
        <ScrollLink href="#about" className="hover:text-soft-pink transition-colors">About</ScrollLink>
        <ScrollLink href="#projects" className="hover:text-soft-pink transition-colors">Projects</ScrollLink>
        <ScrollLink href="#gallery" className="hover:text-soft-pink transition-colors">Certifications</ScrollLink>
        <ScrollLink href="#experience" className="hover:text-soft-pink transition-colors">Experience</ScrollLink>
        <ScrollLink href="#contact" className="hover:text-soft-pink transition-colors">Contact</ScrollLink>
        <Link href="/dashboard" className="hover:text-soft-pink text-raspberry transition-colors">✦ Dashboard</Link>
      </div>

      {/* Retro decorative divider */}
      <div className="w-full max-w-md flex items-center gap-3 px-4">
        <span className="flex-1 h-px bg-rosewood opacity-30"></span>
        <span className="text-raspberry text-[9px]">✦ ❖ ✦</span>
        <span className="flex-1 h-px bg-rosewood opacity-30"></span>
      </div>

      {/* Social quick links */}
      <div className="flex gap-6 text-xs text-muted-lavender">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-light-pink transition-colors">LinkedIn</a>
        <span>•</span>
        <a href="https://github.com/Chaitanyahoon" target="_blank" rel="noopener noreferrer" className="hover:text-light-pink transition-colors">GitHub</a>
        <span>•</span>
        <a href="mailto:mannasarabilu@gmail.com" className="hover:text-light-pink transition-colors">Email</a>
      </div>

      {/* Copyright info */}
      <div className="text-center flex flex-col gap-1.5 px-4">
        <p className="text-xs text-muted-lavender">made with 💖 and way too much coffee by manna</p>
        <p className="text-[10px] text-muted-lavender opacity-60">© {new Date().getFullYear()} Manna Sara Bilu. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
