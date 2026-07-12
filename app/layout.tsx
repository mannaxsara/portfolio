import "./globals.css";
import NavBar from "./sections/NavBar";
import Footer from "./sections/Footer";

import { Pixelify_Sans, Jersey_10 } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-pixelify",
});

const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
  variable: "--font-jersey",
});

export const metadata = {
  title: "Manna Sara Bilu — Portfolio",
  description: "Manna Sara Bilu — ACM Event Technologist Head & Data Analyst Portfolio. Explore projects, certifications, and technical articles.",
  icons: {
    icon: "/icons/favicon.png", 
  },
  openGraph: {
    title: "Manna Sara Bilu — Portfolio",
    description: "ACM Event Technologist Head & Data Analyst. Projects, certifications, and technical articles.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manna Sara Bilu — Portfolio",
    description: "ACM Event Technologist Head & Data Analyst. Projects, certifications, and technical articles.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixelify.variable} ${jersey.variable} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem("theme") || "dark";
                  document.documentElement.setAttribute("data-theme", savedTheme);
                } catch (e) {
                  console.error(e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-bg-base text-text-base flex flex-col min-h-screen">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <NavBar />
        <main id="main-content" className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}