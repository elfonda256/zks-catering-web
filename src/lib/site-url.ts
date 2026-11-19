/**
 * Absolute site origin for metadata, sitemap and robots.
 * On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically (without protocol);
 * NEXT_PUBLIC_SITE_URL can override it once a custom domain is connected.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
