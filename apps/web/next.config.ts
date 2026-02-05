import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/user/:path*',
        destination: 'http://localhost:3001/api/user/:path*',
      },
      {
        source: '/api/assets/:path*',
        destination: 'http://localhost:3001/api/assets/:path*',
      },
      {
        source: '/api/generate/:path*',
        destination: 'http://localhost:3001/api/generate/:path*',
      },
      {
        source: '/api/upload/:path*',
        destination: 'http://localhost:3001/api/upload/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3001/uploads/:path*',
      },
    ]
  },
};

export default nextConfig;
