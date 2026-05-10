import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TalkTuahBank",
    short_name: "TalkTuahBank",
    description:
      "Voice-based, multi-agent banking assistant built in 24 hours at HackUTD 2024.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e16",
    theme_color: "#0a0e16",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
