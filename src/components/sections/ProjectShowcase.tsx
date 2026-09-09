"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ShowcaseVideo } from "@/components/sections/ShowcaseVideo";
import { showcaseVideos } from "@/data/projectShowcase";

// A teaser pair only — the full set lives on /gallery.
const previewVideos = showcaseVideos.slice(1, 3);

export function ProjectShowcase() {
  return (
    <section
      id="project-showcase"
      className="relative overflow-hidden bg-panel py-13 text-fg sm:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-10 max-w-2xl lg:mb-14">
          <div className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-fg/50">
            A Closer Look
          </p>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
            Gallery
          </h2>
        </Reveal>

        <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-3">
          {previewVideos.map((video) => (
            <ShowcaseVideo key={video.id} path={video.path} />
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-12 flex justify-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-fg/20 px-7 py-3 text-sm font-medium text-fg transition-colors hover:bg-fg/10"
          >
            View Gallery
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
