import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tagflow QR Operations",
    short_name: "Tagflow",
    description: "Production QR batch management",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#111f3c",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
