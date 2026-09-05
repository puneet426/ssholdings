"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { LOGO_URL } from "@/lib/three/gallery";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The intro while the 3D floor streams in — the SS Holdings mark wiping into
 * view, the wordmark, and a hairline rule tracking real load progress. The
 * percentage only ever climbs, and finishes at 100.
 */
export function LoadingOverlay() {
  const { progress, active } = useProgress();
  const reduceMotion = useReducedMotion();

  // Monotonic: drei's progress can dip when a new load registers mid-stream.
  const [shown, setShown] = useState(0);
  const peak = useRef(0);
  useEffect(() => {
    // Snap to 100 only once real loading has happened and then gone idle;
    // otherwise track drei's climbing progress (never below 2%).
    const next = !active && peak.current > 2 ? 100 : Math.max(progress, 2);
    if (next > peak.current) {
      peak.current = next;
      setShown(next);
    }
  }, [progress, active]);

  const rise: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 + i * 0.09, ease: EASE },
    }),
  };

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-paper-warm"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.03 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <motion.div
        className="mb-6 h-16 w-16 overflow-hidden"
        initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)", opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.1 }}
      >
        <motion.img
          src={LOGO_URL}
          alt="SS Holdings"
          className="h-full w-full object-contain"
          draggable={false}
          animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>

      <motion.p
        custom={0}
        variants={rise}
        initial="hidden"
        animate="visible"
        className="mb-3 text-[11px] uppercase tracking-[0.4em] text-charcoal/45"
      >
        Welcome to the galleries
      </motion.p>

      <h1 className="font-display flex items-baseline gap-[0.22em] text-3xl font-semibold uppercase tracking-[0.22em] text-charcoal sm:text-5xl">
        <motion.span custom={1} variants={rise} initial="hidden" animate="visible">
          SS
        </motion.span>
        <motion.span
          custom={2}
          variants={rise}
          initial="hidden"
          animate="visible"
          className="text-charcoal/40"
        >
          Holdings
        </motion.span>
      </h1>

      <div className="mt-7 h-px w-44 overflow-hidden bg-charcoal/10 sm:w-56">
        <motion.div
          className="h-full bg-accent"
          animate={{ width: `${shown}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <motion.p
        className="mt-4 text-[10px] uppercase tracking-[0.35em] text-charcoal/35 tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
      >
        {Math.round(shown)}%
      </motion.p>
    </motion.div>
  );
}
