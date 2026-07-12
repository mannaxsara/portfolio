"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MouseEvent } from "react";

interface ScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "a" | "span";
}

const ScrollLink = ({ href, children, className, onClick, as = "a" }: ScrollLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [targetPath, hash] = href.split("#");

  const scrollWithOffset = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbar = document.querySelector("nav");
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;

      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (onClick) onClick();

    // Determine if we're on the homepage
    const isHomePage = pathname === "/" || pathname === "";
    const needsNavigation = targetPath && targetPath !== "/" && pathname !== targetPath;

    if (isHomePage && !targetPath) {
      // On homepage, href is like "#about" — scroll directly
      if (hash) scrollWithOffset(hash);
    } else if (!isHomePage && (!targetPath || targetPath === "/")) {
      // On a sub-page, href is like "#about" — navigate home first, then scroll
      if (hash) sessionStorage.setItem("scrollTo", hash);
      router.push("/");
    } else if (needsNavigation) {
      // Navigate to a different page and scroll
      if (hash) sessionStorage.setItem("scrollTo", hash);
      router.push(targetPath);
    } else {
      // Same page — just scroll
      if (hash) scrollWithOffset(hash);
    }
  };

  useEffect(() => {
    const scrollTo = sessionStorage.getItem("scrollTo");
    if (scrollTo) {
      // Wait for page content to render before scrolling
      const timer = setTimeout(() => {
        scrollWithOffset(scrollTo);
        sessionStorage.removeItem("scrollTo");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const Component = as;

  return (
    <Component
      href={as === "a" ? href : undefined}
      role={as === "span" ? "link" : undefined}
      tabIndex={as === "span" ? 0 : undefined}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Component>
  );
};

export default ScrollLink;