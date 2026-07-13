"use client";

import Github from "../components/icons/Github";
import Linkedin from "../components/icons/Linkedin";
import Insta from "../components/icons/Insta";
import Email from "../components/icons/Email";

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-3 sm:px-4 py-16 relative bg-transparent overflow-hidden">

      <div className="w-full max-w-4xl font-poppins bg-bg-alt border-2 sm:border-4 border-border-accent shadow-[3px_3px_0px_var(--shadow-color)] sm:shadow-[6px_6px_0px_var(--shadow-color)] p-4 sm:p-10 md:p-20 text-center relative z-10 overflow-hidden">

        {/* Corner L-bracket accents */}
        <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t-[3px] border-l-[3px] border-border-accent"></span>
        <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t-[3px] border-r-[3px] border-border-accent"></span>
        <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-[3px] border-l-[3px] border-border-accent"></span>
        <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-[3px] border-r-[3px] border-border-accent"></span>

        {/* Top divider */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex-1 h-px bg-border-accent opacity-30"></span>
          <div className="flex gap-2 text-border-accent text-[9px]">
            <span className="animate-pixel-twinkle inline-block" aria-hidden="true">✦</span>
            <span className="animate-pixel-twinkle inline-block" style={{ animationDelay: "0.8s" }} aria-hidden="true">✦</span>
            <span className="animate-pixel-twinkle inline-block" style={{ animationDelay: "1.6s" }} aria-hidden="true">✦</span>
          </div>
          <span className="flex-1 h-px bg-border-accent opacity-30"></span>
        </div>

        {/* Hello label */}
        <p className="text-[13px] text-text-muted tracking-[0.2em] mb-4">
          hello, i&apos;m
        </p>

        {/* Name */}
        <h1
          className="font-jersey font-bold text-raspberry dark:text-light-pink leading-none mb-2 break-words"
          style={{ fontSize: "clamp(36px, 12vw, 130px)" }}
        >
          Manna Sara Bilu
        </h1>

        {/* Identity chips */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 md:gap-3 my-4 sm:my-6">
          {["cs student", "data nerd", "event tech head", "nagpur, India"].map((label, i, arr) => (
            <span key={label} className="flex items-center gap-2 md:gap-3">
              <span
                className="text-text-base text-xs px-2 sm:px-4 py-1 tracking-wide"
                style={{
                  borderTop: "1.5px solid var(--border-accent)",
                  borderBottom: "1.5px solid var(--border-accent)",
                }}
              >
                {label}
              </span>
              {i < arr.length - 1 && (
                <span className="text-border-accent text-[9px]" aria-hidden="true">❖</span>
              )}
            </span>
          ))}
        </div>

        {/* Bottom divider + social icons */}
        <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          <span className="flex-1 h-px bg-border-accent opacity-30"></span>
          <div className="flex gap-4 items-center justify-center">
            <Linkedin />
            <Github />
            <Insta />
            <Email />
          </div>
          <span className="flex-1 h-px bg-border-accent opacity-30"></span>
        </div>

      </div>
    </div>
  );
};

export default Hero;