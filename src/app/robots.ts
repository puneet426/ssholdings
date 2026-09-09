import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Served at /robots.txt. The whole public site is open to crawlers — Google
 * needs the CSS, JS and images under /_next/ to render pages, so nothing
 * there is blocked. The one exception is the blog, which is currently
 * unlinked from the site (see the `INCLUDE_BLOG` note in `sitemap.ts`);
 * remove "/blogs" from `disallow` when it goes live again.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/blogs"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
