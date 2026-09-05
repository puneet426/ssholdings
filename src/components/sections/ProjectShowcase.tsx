"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionGlow } from "@/components/ui/SectionGlow";
import { showcaseVideos } from "@/data/projectShowcase";
import { projectVideoPoster, projectVideoUrl } from "@/lib/cloudinary";

/**
 * A bare video tile: no title, no caption, no controls, no sound. `active`
 * is driven by the section's own visibility, not the tile's own, so all
 * four start together. `src` is assigned only on the first activation (so
 * scrolling away and back never re-fetches) and playback just pauses/
 * resumes after that.
 *
 * Every source clip opens on a ~2s title/YouTube-style card, so playback
 * (and every loop restart) is seeked past it manually — no native `loop`,
 * `ended` re-seeks to 2s and plays again instead.
 */
function ShowcaseVideo({ path, active }: { path: string; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !path) return;

    const restartPastIntro = () => {
      video.currentTime = 2;
      video.play().catch(() => {});
    };
    video.addEventListener("ended", restartPastIntro);

    if (active) {
      if (!video.src) {
        video.src = projectVideoUrl(path);
        video.addEventListener("loadedmetadata", restartPastIntro, { once: true });
      } else {
        video.play().catch(() => {});
      }
    } else {
      video.pause();
    }

    return () => video.removeEventListener("ended", restartPastIntro);
  }, [active, path]);

  if (!path) {
    return (
      <div className="aspect-1886/1060 rounded-2xl border border-dashed border-paper/15 bg-paper/3" />
    );
  }

  return (
    <div className="aspect-1886/1060 overflow-hidden rounded-2xl border border-paper/10 bg-ink">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="none"
        poster={projectVideoPoster(path)}
      />
    </div>
  );
}

export function ProjectShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.3,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section
      id="project-showcase"
      className="relative overflow-hidden border-t border-paper/10 bg-charcoal py-20 text-paper lg:py-28"
    >
      <SectionGlow tone="slate" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mb-10 max-w-2xl lg:mb-14">
          <div className="h-px w-10 bg-accent" />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-paper/50">
            A Closer Look
          </p>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
            Step inside and explore the quality of SS Holdings.
          </h2>
        </Reveal>

        <div ref={sectionRef}>
          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-3">
            {showcaseVideos.map((video) => (
              <ShowcaseVideo key={video.id} path={video.path} active={isInView} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
