"use client";

import { useState, useEffect } from "react";
import ScrollLink from "../components/ScrollLink";
import NavButton from "../components/NavButton";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-light-pink text-white p-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold font-pixelify text-black px-5">
        Manna Sara Bilu
      </Link>

      <div className="hidden md:flex space-x-4">
        <NavButton href="#about">About</NavButton>
        <NavButton href="#projects">Projects</NavButton>
        <NavButton href="#gallery">Certifications</NavButton>
        <NavButton href="#experience">Experience</NavButton>
        <NavButton href="#contact">Contact</NavButton>
      </div>

      <button
        className="md:hidden flex flex-col space-y-1 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-6 h-1 bg-black"></span>
        <span className="w-6 h-1 bg-black"></span>
        <span className="w-6 h-1 bg-black"></span>
      </button>

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
          >
            ✕
          </button>

          <div className="flex flex-col mt-20 px-8 font-pixelify text-black gap-6 text-lg">
            <ScrollLink href="#about" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">About</ScrollLink>
            <ScrollLink href="#projects" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Projects</ScrollLink>
            <ScrollLink href="#gallery" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Certifications</ScrollLink>
            <ScrollLink href="#experience" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Experience</ScrollLink>
            <ScrollLink href="#contact" onClick={() => setIsOpen(false)} className="hover:text-raspberry transition">Contact</ScrollLink>
          </div>
        </div>
      )}
    </nav>
  );
}