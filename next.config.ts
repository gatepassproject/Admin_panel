import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "..",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // @ts-ignore - Property requested by Next.js runtime during local network access
    allowedDevOrigins: ["192.168.1.36"],
  },
};

export default nextConfig;
