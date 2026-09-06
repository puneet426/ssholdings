"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getFloor, stepFloor, type FloorId } from "@/lib/three/gallery";

interface StairsPromptProps {
  current: FloorId;
  progressRef: MutableRefObject<number>;
  onSelect: (id: FloorId) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;
// The rail ends at the stairs; surface the prompt once you're most of the way.
const SHOW_FROM = 0.9;

/**
 * Near the end of a floor's walk-through you arrive at the stairs — this card
 * fades in there offering the storeys directly above and below.
 */
export function StairsPrompt({ current, progressRef, onSelect }: StairsPromptProps) {
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    // Poll the rail on rAF (never a render per frame — React bails when the
    // boolean is unchanged). A floor swap resets progress to 0, which hides
    // this again on the next tick.
    const tick = () => {
      setVisible(progressRef.current >= SHOW_FROM);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [progressRef]);

  // The First Floor's walk-through ends on its own closing caption
  // ("Now come see us.") — no stairs / change-floor card there.
  if (current === "ff") return null;

  const up = stepFloor(current, 1);
  const down = stepFloor(current, -1);
  const options = [up, down].filter(Boolean) as ReturnType<typeof getFloor>[];

  return (
    <AnimatePresence>
      {visible && options.length > 0 && (
        <motion.div
          className="pointer-events-auto absolute right-8 top-1/2 z-30 w-72 -translate-y-1/2 bg-paper/95 p-6 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.22)]"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-charcoal/45">
            Floors
          </p>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
            You&apos;ve reached the stairs. Discover the other floors of the gallery.
          </p>
          <div className="mt-4 flex flex-col gap-px bg-stone/60">
            {options.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelect(f.id)}
                className="bg-paper px-4 py-3 text-left text-sm text-charcoal/80 transition-colors hover:bg-paper-warm hover:text-charcoal"
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
