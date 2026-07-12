"use client";

import Github from "../components/icons/Github";
import Linkedin from "../components/icons/Linkedin";

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-16">

      <div className="w-full max-w-4xl font-pixelify bg-light-pink border-4 border-rosewood shadow-[6px_6px_0px_#412722] p-10 md:p-20 text-center relative">

        {/* Corner L-bracket accents */}
        <span className="absolute top-2.5 left-2.5 w-5 h-5 border-t-[3px] border-l-[3px] border-raspberry"></span>
        <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t-[3px] border-r-[3px] border-raspberry"></span>
        <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-[3px] border-l-[3px] border-raspberry"></span>
        <span className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-[3px] border-r-[3px] border-raspberry"></span>

        {/* Top divider */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex-1 h-px bg-mauve-brown opacity-30"></span>
          <div className="flex gap-2 text-raspberry text-[9px]">
            <span className="animate-pixel-twinkle inline-block">✦</span>
            <span className="animate-pixel-twinkle inline-block" style={{ animationDelay: "0.8s" }}>✦</span>
            <span className="animate-pixel-twinkle inline-block" style={{ animationDelay: "1.6s" }}>✦</span>
          </div>
          <span className="flex-1 h-px bg-mauve-brown opacity-30"></span>
        </div>

        {/* Hello label */}
        <p className="text-[13px] text-mauve-brown tracking-[0.2em] mb-4">
          hello, i'm
        </p>

        {/* Name */}
        <h1
          className="font-jersey font-bold text-raspberry leading-none mb-2"
          style={{ fontSize: "clamp(64px, 14vw, 130px)" }}
          data-aos="fade-up"
          data-aos-once="false"
        >
          Manna Sara Bilu
        </h1>

        {/* Identity chips */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 my-6">
          {["cs student", "data nerd", "iot tinkerer", "event tech head", "nagpur 🇮🇳"].map((label, i, arr) => (
            <span key={label} className="flex items-center gap-2 md:gap-3">
              <span
                className="text-mauve-brown text-[9px] px-4 py-1 tracking-wide"
                style={{
                  borderTop: "1.5px solid #8b5c6e",
                  borderBottom: "1.5px solid #8b5c6e",
                }}
              >
                {label}
              </span>
              {i < arr.length - 1 && (
                <span className="text-raspberry text-[9px]">❖</span>
              )}
            </span>
          ))}
        </div>

        {/* Bottom divider + social icons */}
        <div className="flex items-center gap-3 mt-6">
          <span className="flex-1 h-px bg-mauve-brown opacity-30"></span>
          <div className="flex gap-3 items-center justify-center">
            <Linkedin />
            <Github />
            <a href="mailto:mannasarabilu@gmail.com" className="hover:opacity-30 transition flex items-center justify-center w-[32px] h-[32px]" title="Email">
                <svg className="w-7 h-7 text-mauve-brown" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            </a>
          </div>
          <span className="flex-1 h-px bg-mauve-brown opacity-30"></span>
        </div>

      </div>
    </div>
  );
};

export default Hero;