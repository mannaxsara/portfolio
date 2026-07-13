import Link from "next/link";
import ScrollLink from "../components/ScrollLink";
import PixelIcon from "../components/PixelIcon";

const Footer = () => {
  return (
    <footer className="font-body text-base text-text-base flex flex-col justify-center items-center bg-bg-alt/70 backdrop-blur-sm py-10 border-t-[3px] border-border-accent gap-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <span className="absolute top-3 left-[12%] text-blush animate-pixel-twinkle">
          <PixelIcon name="heart" solid size={12} />
        </span>
        <span className="absolute top-6 right-[18%] text-sparkle animate-pixel-twinkle" style={{ animationDelay: "0.7s" }}>
          <PixelIcon name="sparkles" size={12} />
        </span>
        <span className="absolute bottom-4 left-[40%] text-peach animate-heart-beat">
          <PixelIcon name="heart" solid size={12} />
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-5 sm:gap-6 text-base relative z-10">
        <ScrollLink href="#about" className="hover:text-highlight-color transition-colors">About</ScrollLink>
        <ScrollLink href="#projects" className="hover:text-highlight-color transition-colors">Projects</ScrollLink>
        <ScrollLink href="#gallery" className="hover:text-highlight-color transition-colors">Certifications</ScrollLink>
        <ScrollLink href="#experience" className="hover:text-highlight-color transition-colors">Experience</ScrollLink>
        <ScrollLink href="#contact" className="hover:text-highlight-color transition-colors">Contact</ScrollLink>
        <Link href="/dashboard" className="hover:text-highlight-color transition-colors inline-flex items-center gap-1.5">
          <PixelIcon name="heart" solid size={12} />
          Dashboard
        </Link>
      </div>

      <div className="w-full max-w-md flex items-center gap-3 px-4 relative z-10">
        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />
        <span className="text-highlight-color inline-flex items-center gap-2">
          <PixelIcon name="heart" solid size={11} className="animate-heart-beat" />
          <PixelIcon name="sparkles" size={11} />
          <PixelIcon name="heart" solid size={11} className="animate-heart-beat" />
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />
      </div>

      <div className="flex gap-6 text-sm text-text-base/80 relative z-10 items-center">
        <a href="https://www.linkedin.com/in/mannasarabilu/" target="_blank" rel="noopener noreferrer" className="hover:text-highlight-color transition-colors">LinkedIn</a>
        <PixelIcon name="heart" size={10} className="text-border-accent" />
        <a href="https://github.com/mannaxsara" target="_blank" rel="noopener noreferrer" className="hover:text-highlight-color transition-colors">GitHub</a>
        <PixelIcon name="heart" size={10} className="text-border-accent" />
        <a href="https://www.instagram.com/mannaxsara/" target="_blank" rel="noopener noreferrer" className="hover:text-highlight-color transition-colors">Instagram</a>
        <PixelIcon name="heart" size={10} className="text-border-accent" />
        <a href="mailto:mannasarabilu@gmail.com" className="hover:text-highlight-color transition-colors">Email</a>
      </div>

      <div className="text-center flex flex-col gap-1.5 px-4 relative z-10">
        <p className="text-sm text-text-base/80 inline-flex items-center justify-center gap-1.5 flex-wrap">
          made with
          <PixelIcon name="heart" solid size={12} className="text-highlight-color" />
          and way too much coffee by manna
        </p>
        <p className="text-xs text-text-muted">© {new Date().getFullYear()} Manna Sara Bilu. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
