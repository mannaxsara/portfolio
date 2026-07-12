"use client";

import { useState, useEffect } from "react";
import ScrollLink from "../components/ScrollLink";
import NavButton from "../components/NavButton";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-nav-bg backdrop-blur-md border-b-2 border-border-accent text-text-base p-4 flex justify-between items-center z-50 transition-colors duration-300">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold font-pixelify text-text-base px-5">
        Manna Sara Bilu
      </Link>

      <div className="hidden md:flex space-x-4 items-center">
        <NavButton href="#about">About</NavButton>
        <NavButton href="#projects">Projects</NavButton>
        <NavButton href="#gallery">Certifications</NavButton>
        <NavButton href="#experience">Experience</NavButton>
        <NavButton href="#contact">Contact</NavButton>
        <Link
          href="/dashboard"
          className="font-pixelify text-sm text-light-pink bg-raspberry border-2 border-rosewood px-3 py-1 shadow-[2px_2px_0px_#412722] hover:bg-rosewood transition-colors tracking-wide"
        >
          Dashboard
        </Link>
        
        {/* Retro Theme Toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="font-pixelify text-xs border-2 border-border-accent bg-card-bg text-card-text px-3 py-1 hover:bg-highlight-color hover:text-text-base transition-colors select-none"
            aria-label="Toggle light and dark mode"
          >
            [ {theme === "dark" ? "LIGHT" : "DARK"} MODE ]
          </button>
        )}
      </div>

      <button
        className="md:hidden flex flex-col space-y-1 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="w-6 h-1 bg-text-base transition-colors duration-300"></span>
        <span className="w-6 h-1 bg-text-base transition-colors duration-300"></span>
        <span className="w-6 h-1 bg-text-base transition-colors duration-300"></span>
      </button>

      {/* Mobile menu overlay */}
      {mounted && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {mounted && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-bg-alt border-l-2 border-border-accent shadow-lg transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close button */}
          <button
            className="absolute top-4 left-4 text-text-base text-xl font-bold"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <div className="flex flex-col mt-20 px-8 font-pixelify text-text-base gap-6 text-lg">
            <ScrollLink href="#about" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">About</ScrollLink>
            <ScrollLink href="#projects" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Projects</ScrollLink>
            <ScrollLink href="#gallery" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Certifications</ScrollLink>
            <ScrollLink href="#experience" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Experience</ScrollLink>
            <ScrollLink href="#contact" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Contact</ScrollLink>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-raspberry hover:text-soft-pink transition">
              ✦ Dashboard
            </Link>
            
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="font-pixelify text-xs border-2 border-border-accent bg-card-bg text-card-text px-3 py-2 text-center hover:bg-highlight-color hover:text-text-base transition-colors mt-4 select-none"
              aria-label="Toggle light and dark mode"
            >
              [ {theme === "dark" ? "LIGHT" : "DARK"} MODE ]
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}