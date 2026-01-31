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
};

export default nextConfig;
