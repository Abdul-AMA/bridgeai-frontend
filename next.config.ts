import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  reactStrictMode: true,
  turbopack: {},
  // Disable Fast Refresh temporarily
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization.runtimeChunk = false;
    }
    return config;
  }

};

export default nextConfig;