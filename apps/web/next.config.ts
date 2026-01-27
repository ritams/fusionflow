import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/fusionflow' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fusionflow/' : '',
};

export default nextConfig;
