import type { NextConfig } from "next";

const isStaging = process.env.NEXT_PUBLIC_ENV === "staging";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "export", // Required for GitHub Pages
  distDir: "out", // Output directory
  images: {
    unoptimized: true, // GitHub Pages does not support image optimization
  },
  basePath: isStaging ? "/staging" : "", // Set base path for staging
  trailingSlash: true, // Ensures correct routing on GitHub Pages
};

export default nextConfig;
