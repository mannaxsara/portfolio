import GalleryFullClient from "./GalleryFullClient";
import certificationsData from "../data/certifications.json";

export const metadata = {
  title: "Certifications — Manna Sara Bilu",
  description: "View the academic and professional certifications earned by Manna Sara Bilu in data analytics, cyber-physical systems, and competitive coding.",
};

export default function GalleryPage() {
  return <GalleryFullClient artworks={certificationsData} />;
}