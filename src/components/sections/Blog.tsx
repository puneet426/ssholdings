"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";
import { SectionGlow } from "@/components/ui/SectionGlow";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blog";

export function Blog() {
  const featuredPosts = blogPosts.filter((post) => post.featured).slice(0, 2);

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-charcoal py-16 text-paper sm:py-20 lg:py-24"
    >
      <SectionGlow tone="sand" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <div className="h-px w-10 bg-accent" />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-paper/50">
            From the Journal
          </p>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
            Ideas on building spaces that last.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
          {featuredPosts.map((post) => (
            <motion.div key={post.slug} variants={revealItemVariants}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="mt-12 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
          >
            See All Blogs
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
