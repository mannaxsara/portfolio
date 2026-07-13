import "./globals.css";
import "pixel-retroui/dist/index.css";
import "@hackernoon/pixel-icon-library/fonts/iconfont.css";
import NavBar from "./sections/NavBar";
import Footer from "./sections/Footer";
import SmoothScroll from "./components/SmoothScroll";

import { Quicksand, Jersey_10 } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
});

const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-jersey",
});

export const metadata = {
  title: "Manna Sara Bilu ✦ Portfolio",
  description: "ACM Event Technologist Head & Data Analyst. Exploring data pipelines, certifications, and technical articles in a cute pixel world.",
  icons: {
    icon: "/icons/favicon.png",
  },
  openGraph: {
    title: "Manna Sara Bilu ✦ Portfolio",
    description: "ACM Event Technologist Head & Data Analyst. Exploring data pipelines, certifications, and technical articles in a cute pixel world.",
    url: "https://mannaportfolio.vercel.app",
    siteName: "Manna Sara Bilu Portfolio",
    images: [
      {
        url: "https://mannaportfolio.vercel.app/manna-avatar-heart.png",
        width: 800,
        height: 800,
        alt: "Manna Sara Bilu Illustration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Manna Sara Bilu ✦ Portfolio",
    description: "ACM Event Technologist Head & Data Analyst. Exploring data pipelines, certifications, and technical articles in a cute pixel world.",
    images: ["https://mannaportfolio.vercel.app/manna-avatar-heart.png"],
  },
};

export const viewport = {
  themeColor: "#db6b8f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={`${quicksand.variable} ${jersey.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem("theme") || "light";
                  document.documentElement.setAttribute("data-theme", savedTheme);
                  if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'manual';
                  }
                } catch (e) {
                  console.error(e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-bg-base text-text-base flex flex-col min-h-screen" suppressHydrationWarning>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <SmoothScroll>
          <NavBar />
          <div id="main-content" className="flex-grow">{children}</div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}