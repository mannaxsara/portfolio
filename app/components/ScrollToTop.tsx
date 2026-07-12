"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear URL hash to prevent browser from auto-scrolling to anchors during hydration
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      
      // Force scroll to top on mount after a layout delay to let the DOM settle
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
