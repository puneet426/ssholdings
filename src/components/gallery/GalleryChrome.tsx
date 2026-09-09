"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface GalleryChromeProps {
  progressRef: MutableRefObject<number>;
  hintVisible: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;
const TICKS = 9;

/**
 * The non-nav overlay: a vertical scroll-progress read-out bottom-right, plus
 * the "scroll to explore" onboarding line. Polls
 * `progressRef` on rAF so it never forces a React render per frame.
 */
export function GalleryChrome({ progressRef, hintVisible }: GalleryChromeProps) {
  const ticksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current;
      const node = ticksRef.current;
      if (node) {
        const lit = Math.round(p * TICKS);
        node.querySelectorAll<HTMLElement>("[data-tick]").forEach((el, i) => {
          el.style.opacity = i < lit ? "1" : "0.25";
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <>
      <div className="pointer-events-auto absolute bottom-6 right-6 z-40 flex items-end gap-4">
        <div ref={ticksRef} className="mb-1 flex h-10 flex-col justify-between">
          {Array.from({ length: TICKS }).map((_, i) => (
            <span
              key={i}
              data-tick
              className="block h-px w-4 bg-paper transition-opacity duration-300"
              style={{ opacity: 0.25 }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hintVisible && (
          <motion.div
            key="hint"
            className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
          >
            <span className="block h-8 w-px bg-paper/40" />
            <span className="font-display text-[11px] uppercase tracking-[0.4em] text-paper/70">
              Scroll or drag to explore
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
