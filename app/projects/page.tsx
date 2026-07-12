import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projects — Manna Sara Bilu",
  description: "Explore portfolio projects in data engineering, analytics modeling, and IoT systems built by Manna Sara Bilu.",
  openGraph: {
    title: "Projects — Manna Sara Bilu",
    description: "Explore portfolio projects in data engineering, analytics modeling, and IoT systems built by Manna Sara Bilu.",
    url: "https://mannaportfolio.vercel.app/projects",
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
    title: "Projects — Manna Sara Bilu",
    description: "Explore portfolio projects in data engineering, analytics modeling, and IoT systems built by Manna Sara Bilu.",
    images: ["https://mannaportfolio.vercel.app/manna-avatar-heart.png"],
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}