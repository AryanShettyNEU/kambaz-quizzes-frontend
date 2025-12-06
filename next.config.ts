import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skips all ESLint errors at build time
  },
};

export default nextConfig;
