import type { NextConfig } from "next";

type Protocol = "http" | "https";

const defaultApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://assets.mymaiyah.id/graphql"
    : "http://localhost/v2maiyah/graphql";

const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || defaultApiUrl;
const siteUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  apiUrl.replace(/\/graphql\/?$/, "");

function toRemotePattern(urlString: string): { protocol: Protocol; hostname: string; pathname?: string } | null {
  try {
    const parsed = new URL(urlString);
    const protocol = parsed.protocol === "https:" ? "https" : "http";
    const cleanedPath = parsed.pathname.replace(/\/+$/, "");

    return {
      protocol,
      hostname: parsed.hostname,
      ...(cleanedPath && cleanedPath !== "/" ? { pathname: `${cleanedPath}/**` } : {}),
    };
  } catch {
    return null;
  }
}

const dynamicPatterns = [toRemotePattern(siteUrl), toRemotePattern(apiUrl)].filter(
  (pattern): pattern is { protocol: Protocol; hostname: string; pathname?: string } => Boolean(pattern)
);

const isLocalWp = dynamicPatterns.some((pattern) =>
  ["localhost", "127.0.0.1", "::1"].includes(pattern.hostname)
);

const nextConfig: NextConfig = {
  images: {
    unoptimized: isLocalWp,
    dangerouslyAllowLocalIP: isLocalWp,
    remotePatterns: [
      ...dynamicPatterns,
      { protocol: "https", hostname: "mymaiyah.id" },
      { protocol: "https", hostname: "www.terusberjalan.id" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
    ],
  },
};

export default nextConfig;
