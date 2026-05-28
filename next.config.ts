import type { NextConfig } from "next";
import path from "path";

const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? Date.now().toString(36);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  generateBuildId: () => buildId,
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
    additionalData: `@use "abstracts" as *;`,
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "recharts", "date-fns", "lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
