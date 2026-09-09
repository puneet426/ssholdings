import type { Metadata } from "next";
import { BackToHome } from "@/components/layout/BackToHome";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Notes on construction quality, materials and design from the SS Holdings team, for anyone planning their next property in Visakhapatnam.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-bg pt-32 pb-16 text-fg lg:pt-40 lg:pb-24">
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <BackToHome />

            <div className="mt-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-fg/50">
                The SS Holdings Journal
              </p>
              <h1 className="font-display mt-4 text-4xl font-medium text-balance sm:text-5xl">
                Blogs
              </h1>
              <p className="mt-5 leading-relaxed text-fg/70">
                Notes on construction quality, design decisions and what
                actually makes a home worth building, written for anyone
                planning their next property in Visakhapatnam and beyond.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
