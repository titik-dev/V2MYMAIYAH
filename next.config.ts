import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'mymaiyah.id',
      },
      {
        protocol: 'https',
        hostname: 'assets.mymaiyah.id',
      },
      {
        protocol: 'https',
        hostname: 'www.terusberjalan.id',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow external images if any
      },
    ],
  },
};

export default nextConfig;
