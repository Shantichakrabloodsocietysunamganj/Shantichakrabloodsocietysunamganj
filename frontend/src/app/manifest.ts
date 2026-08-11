import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "শান্তিচক্র ব্লাড সোসাইটি",
    short_name: "শান্তিচক্র",
    description: "সুনামগঞ্জের স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F7FA",
    theme_color: "#0b4f9c",
    lang: "bn",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
