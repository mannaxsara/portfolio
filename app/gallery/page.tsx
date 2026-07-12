import GalleryFullClient from "./GalleryFullClient";

export default function GalleryPage() {
  const certifications = [
    {
      src: "/cert-data-analytics.png",
      caption: "Google Data Analytics Professional Certificate",
      titlebar: "google_data_analytics.sys"
    },
    {
      src: "/cert-advanced-analytics.png",
      caption: "Google Advanced Data Analytics Certificate",
      titlebar: "google_advanced_analytics.sys"
    },
    {
      src: "/cert-acm-w.png",
      caption: "ACM-W Coding Contest Achievement",
      titlebar: "acm_w_contest.sys"
    },
    {
      src: "/cert-iot-affiliate.png",
      caption: "College Research Affiliate - IOT",
      titlebar: "college_iot_research.sys"
    },
    {
      src: "/cert-sail-internship.png",
      caption: "One-Month Industrial Training Certificate (SAIL)",
      titlebar: "sail_internship.sys"
    }
  ];

  return <GalleryFullClient artworks={certifications} />;
}