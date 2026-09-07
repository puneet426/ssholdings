import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blog";

/**
 * Shared card used on the homepage's "From the Journal" section and the
 * full /blogs listing — one place to keep the card's look consistent.
 */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-fg/10 bg-fg/[0.04] transition-colors hover:border-fg/20 hover:bg-fg/[0.07]"
    >
      <div className="aspect-16/10 w-full overflow-hidden bg-well">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-fg/50">
          {post.date}
        </p>
        <h3 className="font-display mt-3 text-xl font-medium leading-snug text-balance">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg/65">
          {post.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-soft">
          Read Full Blog
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </Link>
  );
}
