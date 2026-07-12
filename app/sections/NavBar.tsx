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
    <nav className="fixed top-0 left-0 w-full bg-light-pink text-white p-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold font-pixelify text-black px-5">
        Manna Sara Bilu
      </Link>

      <div className="hidden md:flex space-x-6 items-center pr-2">
        <NavButton href="#about">About</NavButton>
        <NavButton href="#projects">Projects</NavButton>
        <NavButton href="#gallery">Certifications</NavButton>
        <NavButton href="#experience">Experience</NavButton>
        <NavButton href="#contact">Contact</NavButton>
        
        <Link
          href="/dashboard"
          className="relative px-3 py-1 font-pixelify text-black border-2 border-transparent 
                     hover:border-mauve-brown hover:bg-raspberry hover:shadow-[4px_4px_0px_#412722] hover:text-white
                     transition-all duration-150"
        >
          Dashboard
        </Link>

        {/* Retro Theme Toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="relative px-3 py-1 font-pixelify text-black border-2 border-transparent 
                       hover:border-mauve-brown hover:bg-raspberry hover:shadow-[4px_4px_0px_#412722] hover:text-white
                       transition-all duration-150 cursor-pointer select-none"
            aria-label="Toggle light and dark mode"
          >
            [ {theme === "dark" ? "LIGHT" : "DARK"} MODE ]
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
          <span className="w-6 h-1 bg-black"></span>
          <span className="w-6 h-1 bg-black"></span>
          <span className="w-6 h-1 bg-black"></span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mounted && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {mounted && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-light-pink shadow-lg transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ backgroundColor: "#EEC8CF" }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 left-4 text-black text-xl font-bold"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <div className="flex flex-col mt-20 px-8 font-pixelify text-black gap-6 text-lg">
            <ScrollLink href="#about" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">About</ScrollLink>
            <ScrollLink href="#projects" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Projects</ScrollLink>
            <ScrollLink href="#gallery" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Certifications</ScrollLink>
            <ScrollLink href="#experience" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Experience</ScrollLink>
            <ScrollLink href="#contact" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Contact</ScrollLink>
            
            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-raspberry transition"
            >
              Dashboard
            </Link>

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="hover:text-raspberry text-left transition select-none cursor-pointer"
              aria-label="Toggle light and dark mode"
            >
              {theme === "dark" ? "Light" : "Dark"} Mode
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}