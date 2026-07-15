"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VisitorTracker() {
  useEffect(() => {
    const recordVisit = async () => {
      const isPlaceholder =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");
      
      const currentPath = window.location.pathname;

      if (isPlaceholder) {
        console.log(`[Local Analytics] Registered mock page view for: ${currentPath}`);
        return;
      }

      try {
        // Generate anonymous session token for unique counting
        let visitorSession = localStorage.getItem("visitor-session-id");
        if (!visitorSession) {
          visitorSession = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          localStorage.setItem("visitor-session-id", visitorSession);
        }

        await supabase
          .schema("SyePhasuk")
          .from("VisitorAnalytics")
          .insert([
            {
              pathname: currentPath,
              referrer: document.referrer || "direct",
              session_id: visitorSession,
            },
          ]);
      } catch (err) {
        console.error("Failed to post visitor metrics:", err);
      }
    };

    recordVisit();
  }, []);

  return null;
}
