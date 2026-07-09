import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats first for the Core Web Vitals budget (spec §9.8).
    formats: ["image/avif", "image/webp"],
  },
  // All content is static — no remote images, everything lives in /public.
  reactStrictMode: true,
};

export default nextConfig;
