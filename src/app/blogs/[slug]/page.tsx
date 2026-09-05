import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionGlow } from "@/components/ui/SectionGlow";
import { blogPosts, getBlogBySlug } from "@/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="relative overflow-hidden bg-charcoal pt-32 pb-20 text-paper lg:pt-40 lg:pb-28">
          <SectionGlow tone="clay" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-paper/60 transition-colors hover:text-paper"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back to Home
              </Link>
              <span className="h-4 w-px bg-paper/15" aria-hidden="true" />
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm text-paper/60 transition-colors hover:text-paper"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back to Blogs
              </Link>
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-paper/50">
              {post.date}
            </p>
            <h1 className="font-display mt-4 text-3xl font-medium leading-tight text-balance sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-xs text-paper/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 aspect-16/9 w-full overflow-hidden rounded-2xl border border-paper/10 bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-12 space-y-6 leading-relaxed text-paper/75">
              {post.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-14 border-t border-paper/10 pt-8">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 border-b border-paper/40 pb-1 text-sm font-medium text-paper transition-colors hover:border-paper"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back to Blogs
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
