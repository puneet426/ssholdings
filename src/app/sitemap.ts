import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { projects } from "@/data/projects";
import { siteConfig } from "@/lib/site-config";

/**
 * The blog is currently hidden from the site navigation (see
 * `src/data/nav.ts`), so its pages are left out of the sitemap too — there is
 * no point asking Google to index pages we don't link to. Flip this to `true`
 * at the same time the nav entry comes back and the posts are advertised
 * again; nothing else needs to change.
 */
const INCLUDE_BLOG = false;

/**
 * Nothing in `src/data` carries a real edited-on date, so pages fall back to
 * the build time. Redeploying refreshes `lastmod`, which is the honest signal
 * for a statically generated site.
 */
const buildDate = new Date();

/** "March 4, 2026" -> Date. Falls back to the build date if it won't parse. */
function postDate(display: string): Date {
  const parsed = new Date(display);
  return Number.isNaN(parsed.getTime()) ? buildDate : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/projects`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/projects/ongoing`,
      lastModified: buildDate,
      // The one listing that genuinely moves — new launches land here first.
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/gallery`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Every project in `src/data/projects.ts` gets its detail URL, so adding a
  // project to that file is all it takes to appear here.
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: buildDate,
    changeFrequency: project.status === "Ongoing" ? "weekly" : "yearly",
    priority: project.status === "Ongoing" ? 0.8 : 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = INCLUDE_BLOG
    ? [
        {
          url: `${base}/blogs`,
          lastModified: buildDate,
          changeFrequency: "weekly",
          priority: 0.6,
        },
        ...blogPosts.map((post) => ({
          url: `${base}/blogs/${post.slug}`,
          lastModified: postDate(post.date),
          changeFrequency: "yearly" as const,
          priority: 0.5,
        })),
      ]
    : [];

  return [...staticPages, ...projectPages, ...blogPages];
}
