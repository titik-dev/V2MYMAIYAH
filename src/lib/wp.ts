const DEFAULT_LOCAL_SITE_URL = "http://localhost/v2maiyah";
const DEFAULT_PROD_SITE_URL = "https://assets.mymaiyah.id";

const DEFAULT_LOCAL_API_URL = `${DEFAULT_LOCAL_SITE_URL}/graphql`;
const DEFAULT_PROD_API_URL = `${DEFAULT_PROD_SITE_URL}/graphql`;

const isProd = process.env.NODE_ENV === "production";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function normalizeApiUrl(value: string): string {
  const cleaned = trimTrailingSlash(value.trim());
  return cleaned.endsWith("/graphql") ? cleaned : `${cleaned}/graphql`;
}

function deriveSiteUrlFromApi(apiUrl: string): string {
  return trimTrailingSlash(apiUrl.replace(/\/graphql$/, ""));
}

const rawApiUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  process.env.WORDPRESS_API_URL ||
  (isProd ? DEFAULT_PROD_API_URL : DEFAULT_LOCAL_API_URL);

const rawSiteUrl =
  process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
  process.env.WORDPRESS_SITE_URL;

export const WORDPRESS_API_URL = normalizeApiUrl(rawApiUrl);
export const WORDPRESS_SITE_URL = rawSiteUrl
  ? trimTrailingSlash(rawSiteUrl)
  : deriveSiteUrlFromApi(WORDPRESS_API_URL);

export function getWpMediaUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${WORDPRESS_SITE_URL}${normalizedPath}`;
}

