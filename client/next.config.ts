import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lint is run separately; do not let it block production builds.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
