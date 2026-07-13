"use client";

import { useState, useEffect } from "react";
import ScrollLink from "../components/ScrollLink";
import NavButton from "../components/NavButton";
import Link from "next/link";
import PixelIcon from "../components/PixelIcon";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#gallery", label: "Certifications" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const distanceX = touchStartX - touchEndX;
      const distanceY = touchStartY - touchEndY;

      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (distanceX > 60 && touchStartX > window.innerWidth - 60) {
          setIsOpen(true);
        }
        if (distanceX < -60) {
          setIsOpen(false);
        }
      }
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleResize();
    handleScroll();
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-nav-bg/95 backdrop-blur-xl shadow-[0_6px_24px_var(--glow-pink)] py-2.5"
          : "bg-nav-bg/80 backdrop-blur-md shadow-[0_2px_12px_var(--glow-pink)] py-3.5"
      }`}
    >
      {/* Soft blush bottom edge */}
      <div
        className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-border-accent to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-50"
        aria-hidden="true"
      >
        <span className="absolute top-2 left-[22%] text-blush animate-pixel-twinkle">
          <PixelIcon name="sparkles" size={10} />
        </span>
        <span className="absolute top-3 right-[30%] text-sparkle animate-pixel-twinkle" style={{ animationDelay: "0.8s" }}>
          <PixelIcon name="heart" solid size={10} />
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-5 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-2xl sm:text-3xl pixel-heading font-jersey tracking-wider text-highlight-color hover:text-raspberry transition-colors group"
          onClick={(e) => {
            if (typeof window !== "undefined" && window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span
            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 overflow-hidden shrink-0 group-hover:-translate-y-0.5 transition-all"
          >
            <img
              src="/logoo.png"
              alt="Manna logo"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              suppressHydrationWarning
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="inline-flex items-center gap-1.5">
              Manna
              <PixelIcon name="heart" solid size={12} className="text-blush animate-heart-beat" />
            </span>
            <span className="hidden sm:block font-body text-[10px] tracking-[0.18em] uppercase text-text-muted font-medium mt-0.5">
              cute pixel world
            </span>
          </span>
        </Link>

        {/* Desktop Menu */}
        {mounted && !isMobile && (
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="flex items-center gap-0.5 lg:gap-1 px-1.5 py-1 border-2 border-border-accent/50 bg-cream/40 dark:bg-card-bg/40 shadow-[2px_2px_0_var(--shadow-color)]">
              {NAV_LINKS.map((link) => (
                <NavButton key={link.href} href={link.href}>
                  {link.label}
                </NavButton>
              ))}
            </div>

            <NavButton href="/dashboard" accent>
              Dashboard
            </NavButton>

            <button
              onClick={toggleTheme}
              className="group w-10 h-10 border-2 border-border-accent bg-cream/70 dark:bg-card-bg text-highlight-color shadow-[2px_2px_0_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--shadow-color)] hover:bg-highlight-color hover:text-cream flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none ml-1"
              aria-label="Toggle light and dark mode"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 fill-current transform transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current transform transition-transform duration-300 group-hover:rotate-45" viewBox="0 0 24 24">
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zm-5.5-12.1l1.4-1.4-1.4-1.4-1.4 1.4 1.4 1.4zm11.3 11.3l1.4-1.4-1.4-1.4-1.4 1.4 1.4 1.4zm-1.4-12.7l1.4 1.4 1.4-1.4-1.4-1.4-1.4 1.4zM5.1 17.5l1.4 1.4 1.4-1.4-1.4-1.4-1.4 1.4z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Mobile controls */}
        {mounted && isMobile && (
          <div className="flex items-center gap-2 relative z-50">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 border-2 border-border-accent bg-cream/70 dark:bg-card-bg text-highlight-color shadow-[2px_2px_0_var(--shadow-color)] flex items-center justify-center transition-all"
              aria-label="Toggle light and dark mode"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zm-5.5-12.1l1.4-1.4-1.4-1.4-1.4 1.4 1.4 1.4zm11.3 11.3l1.4-1.4-1.4-1.4-1.4 1.4 1.4 1.4zm-1.4-12.7l1.4 1.4 1.4-1.4-1.4-1.4-1.4 1.4zM5.1 17.5l1.4 1.4 1.4-1.4-1.4-1.4-1.4 1.4z" />
                </svg>
              )}
            </button>
            <button
              className="w-10 h-10 border-2 border-border-accent bg-cream/70 dark:bg-card-bg flex flex-col items-center justify-center gap-1.5 focus:outline-none shadow-[2px_2px_0_var(--shadow-color)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 text-highlight-color"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span className={`w-5 h-[3px] bg-current transition-transform duration-200 ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`w-5 h-[3px] bg-current transition-opacity duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-[3px] bg-current transition-transform duration-200 ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mounted && isMobile && isOpen && (
        <div className="absolute top-full left-0 w-full bg-bg-alt/95 backdrop-blur-xl border-b-[3px] border-border-accent shadow-[0_8px_0_var(--shadow-color)] z-40 px-5 py-5 font-body text-text-base">
          <div className="flex items-center gap-2 mb-4 text-highlight-color text-sm">
            <PixelIcon name="heart" solid size={12} className="animate-heart-beat" />
            <span className="tracking-widest uppercase text-xs font-semibold">menu</span>
            <span className="flex-1 h-px bg-gradient-to-r from-border-accent to-transparent" />
          </div>

          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <ScrollLink
                key={link.href}
                as="span"
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2.5 px-3 border-2 border-border-accent/40 bg-cream/50 dark:bg-card-bg/50 hover:border-border-accent hover:text-highlight-color hover:shadow-[2px_2px_0_var(--shadow-color)] cursor-pointer transition-all"
              >
                <PixelIcon name="sparkles" size={12} className="text-blush" />
                {link.label}
              </ScrollLink>
            ))}

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 mt-1 border-2 border-border-accent bg-highlight-color text-cream font-semibold shadow-[3px_3px_0_var(--shadow-color)] hover:-translate-y-0.5 transition-all"
            >
              <PixelIcon name="heart" solid size={12} />
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
