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
    <nav className="fixed top-0 left-0 w-full bg-plum-brown/90 backdrop-blur-md border-b-2 border-rosewood text-light-pink p-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold font-pixelify text-light-pink px-5">
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
      </div>

      <button
        className="md:hidden flex flex-col space-y-1 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="w-6 h-1 bg-light-pink"></span>
        <span className="w-6 h-1 bg-light-pink"></span>
        <span className="w-6 h-1 bg-light-pink"></span>
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
          className={`fixed top-0 right-0 h-full w-64 bg-deep-plum border-l-2 border-rosewood shadow-lg transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close button */}
          <button
            className="absolute top-4 left-4 text-light-pink text-xl font-bold"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <div className="flex flex-col mt-20 px-8 font-pixelify text-light-pink gap-6 text-lg">
            <ScrollLink href="#about" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">About</ScrollLink>
            <ScrollLink href="#projects" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Projects</ScrollLink>
            <ScrollLink href="#gallery" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Certifications</ScrollLink>
            <ScrollLink href="#experience" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Experience</ScrollLink>
            <ScrollLink href="#contact" onClick={() => setIsOpen(false)} className="hover:text-soft-pink transition">Contact</ScrollLink>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-raspberry hover:text-soft-pink transition">
              ✦ Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}