"use client";

import { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import ScrollLink from "../components/ScrollLink";
import NavButton from "../components/NavButton";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

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
    <nav className="fixed top-0 left-0 w-full bg-nav-bg backdrop-blur-md border-b-2 border-border-accent text-text-base p-4 flex justify-between items-center z-50 shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-all duration-300">
      
      {/* Logo */}
      <Link 
        href="/" 
        className="flex items-center gap-2 text-3xl font-bold font-jersey tracking-wider text-text-base px-5 hover:text-highlight-color transition-colors group"
        onClick={(e) => {
          if (typeof window !== 'undefined' && window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        {/* Lotus Icon Image */}
        <img 
          src="/icons/favicon.png" 
          alt="Lotus Logo" 
          className="w-7 h-7 object-contain group-hover:scale-110 transition-transform duration-200"
          suppressHydrationWarning
        />
        <span>Manna</span>
      </Link>

      {/* Desktop Menu links */}
      <div className="hidden md:flex space-x-4 items-center">
        <NavButton href="#about">About</NavButton>
        <NavButton href="/dashboard">Dashboard</NavButton>
        <NavButton href="#projects">Projects</NavButton>
        <NavButton href="#gallery">Certifications</NavButton>
        <NavButton href="#experience">Experience</NavButton>
        <NavButton href="#contact">Contact</NavButton>

        {/* Retro Theme Toggle Button (Sun/Moon) */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="group w-9 h-9 border-2 border-transparent hover:border-border-accent hover:bg-highlight-color hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none ml-2 text-text-base"
            aria-label="Toggle light and dark mode"
          >
            {theme === "dark" ? (
              /* Moon Icon for Dark Mode */
              <svg className="w-5 h-5 fill-current transform transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              /* Sun Icon for Light Mode */
              <svg className="w-5 h-5 fill-current transform transition-transform duration-300 group-hover:rotate-45" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2v-2H2v2zm18 0h2v-2h-2v2zM11 2v2h2V2h-2zm0 18v2h2v-2h-2zm-5.5-12.1l1.4-1.4-1.4-1.4-1.4 1.4 1.4 1.4zm11.3 11.3l1.4-1.4-1.4-1.4-1.4 1.4 1.4 1.4zm-1.4-12.7l1.4 1.4 1.4-1.4-1.4-1.4-1.4 1.4zM5.1 17.5l1.4 1.4 1.4-1.4-1.4-1.4-1.4 1.4z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile Hamburger Button — wrapped in md:hidden to bulletproof desktop hiding */}
      <div className="md:hidden">
        <button
          className="flex flex-col space-y-1 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="w-6 h-1 bg-text-base"></span>
          <span className="w-6 h-1 bg-text-base"></span>
          <span className="w-6 h-1 bg-text-base"></span>
        </button>
      </div>

      {mounted && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {mounted && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-bg-alt shadow-lg transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Sidebar backgroundColor="var(--bg-alt)" className="h-full border-l-2 border-border-accent">
            {/* Close button */}
            <button
              className="absolute top-4 left-4 text-text-base text-xl font-bold"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>

            <Menu className="mt-16 font-pixelify text-text-base">
              <MenuItem>
                <ScrollLink as="span" href="#about" onClick={() => setIsOpen(false)} className="hover:text-highlight-color transition">About</ScrollLink>
              </MenuItem>
              <MenuItem>
                <ScrollLink as="span" href="/dashboard" onClick={() => setIsOpen(false)} className="hover:text-highlight-color transition">
                  Dashboard
                </ScrollLink>
              </MenuItem>
              <MenuItem>
                <ScrollLink as="span" href="#projects" onClick={() => setIsOpen(false)} className="hover:text-highlight-color transition">Projects</ScrollLink>
              </MenuItem>
              <MenuItem>
                <ScrollLink as="span" href="#gallery" onClick={() => setIsOpen(false)} className="hover:text-highlight-color transition">Certifications</ScrollLink>
              </MenuItem>
              <MenuItem>
                <ScrollLink as="span" href="#experience" onClick={() => setIsOpen(false)} className="hover:text-highlight-color transition">Experience</ScrollLink>
              </MenuItem>
              <MenuItem>
                <ScrollLink as="span" href="#contact" onClick={() => setIsOpen(false)} className="hover:text-highlight-color transition">Contact</ScrollLink>
              </MenuItem>

              {/* Mobile Sidebar Theme slider toggle */}
              <MenuItem
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="hover:text-highlight-color transition"
              >
                <div className="flex items-center justify-between w-full pr-4">
                  <span>Theme: {theme === "dark" ? "Dark" : "Light"}</span>
                  {theme === "dark" ? (
                    <span className="text-xl">🌙</span>
                  ) : (
                    <span className="text-xl">☀️</span>
                  )}
                </div>
              </MenuItem>
            </Menu>
          </Sidebar>
        </div>
      )}
    </nav>
  );
}