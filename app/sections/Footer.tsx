import Link from "next/link";
import ScrollLink from "../components/ScrollLink";

const Footer = () => {
  return (  
    <footer className="font-poppins text-base text-text-base flex flex-col justify-center items-center bg-bg-alt/80 py-8 border-t-4 border-border-accent gap-6">
      
      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-6 text-base md:text-base">
        <ScrollLink href="#about" className="hover:text-highlight-color transition-colors">About</ScrollLink>
        <ScrollLink href="#projects" className="hover:text-highlight-color transition-colors">Projects</ScrollLink>
        <ScrollLink href="#gallery" className="hover:text-highlight-color transition-colors">Certifications</ScrollLink>
        <ScrollLink href="#experience" className="hover:text-highlight-color transition-colors">Experience</ScrollLink>
        <ScrollLink href="#contact" className="hover:text-highlight-color transition-colors">Contact</ScrollLink>
        <Link href="/dashboard" className="hover:text-highlight-color transition-colors">✦ Dashboard</Link>
      </div>

      {/* Retro decorative divider */}
      <div className="w-full max-w-md flex items-center gap-3 px-4">
        <span className="flex-1 h-px bg-border-accent opacity-30"></span>
        <span className="text-highlight-color text-[9px]">✦ ❖ ✦</span>
        <span className="flex-1 h-px bg-border-accent opacity-30"></span>
      </div>

      {/* Social quick links */}
      <div className="flex gap-6 text-xs text-text-muted">
        <a href="https://www.linkedin.com/in/mannasarabilu/" target="_blank" rel="noopener noreferrer" className="hover:text-highlight-color transition-colors">LinkedIn</a>
        <span>•</span>
        <a href="https://github.com/mannaxsara" target="_blank" rel="noopener noreferrer" className="hover:text-highlight-color transition-colors">GitHub</a>
        <span>•</span>
        <a href="https://www.instagram.com/mannaxsara/" target="_blank" rel="noopener noreferrer" className="hover:text-highlight-color transition-colors">Instagram</a>
        <span>•</span>
        <a href="mailto:mannasarabilu@gmail.com" className="hover:text-highlight-color transition-colors">Email</a>
      </div>

      {/* Copyright info */}
      <div className="text-center flex flex-col gap-1.5 px-4">
        <p className="text-xs text-text-muted">made with ♥ and way too much coffee by manna</p>
        <p className="text-[10px] text-text-muted opacity-60">© {new Date().getFullYear()} Manna Sara Bilu. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
