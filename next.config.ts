import type { NextConfig } from "next";

const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? "";
const isLocalWp = wpApiUrl.includes("localhost") || wpApiUrl.includes("127.0.0.1");

const nextConfig: NextConfig = {
  images: {
    unoptimized: isLocalWp,
    dangerouslyAllowLocalIP: isLocalWp,
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
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/v2maiyah/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '/v2maiyah/**',
      },
      {
        protocol: 'https',
        hostname: 'www.terusberjalan.id',
      },
    ],
  },
};

export default nextConfig;
