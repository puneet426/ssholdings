"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { projectVideoPoster, projectVideoUrl } from "@/lib/cloudinary";

/**
 * A bare video tile: no title, no caption, no controls, no sound.
 *
 * Playback is gated on *this tile's* own visibility, not the section's — four
 * simultaneous decodes was the remaining lag, and on mobile (single column)
 * only one or two tiles are ever on screen at once. A tile loads its `src`
 * the first time it nears the viewport and just pauses/resumes on every
 * scroll in and out after that (never re-fetches).
 *
 * The ~2s intro card and the baked-in side pillarbox are both handled in the
 * Cloudinary URL (see lib/cloudinary), so this just plays the delivered clip
 * on a native `loop` — no `ended` handler, no per-loop seek.
 */
export function ShowcaseVideo({ path }: { path: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Small `margin` so a tile pre-buffers just before it scrolls in — kept
  // tight on purpose so tiles well off screen stay paused and don't burn a
  // decoder.
  const active = useInView(wrapRef, { margin: "150px 0px 150px 0px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !path) return;

    if (active) {
      // preload="none" fetches nothing until asked: assigning src and
      // calling play() is what kicks off the load.
      if (!video.src) video.src = projectVideoUrl(path);
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, path]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // A backgrounded tab gets its video decoder throttled or dropped, which
    // showed up as playback "just stopping" after a while. Pause on hide,
    // resume on return if the tile is still in view.
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else if (active && video.src) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [active]);

  if (!path) {
    return (
      <div
        ref={wrapRef}
        className="aspect-1886/1060 rounded-xl border border-dashed border-fg/15 bg-fg/3"
      />
    );
  }

  return (
    <div
      ref={wrapRef}
      className="aspect-1886/1060 overflow-hidden rounded-xl border border-fg/10 bg-well"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster={projectVideoPoster(path)}
      />
    </div>
  );
}
