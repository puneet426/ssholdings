"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import type { Hotspot } from "@/lib/three/gallery";

interface ProductPanelProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

type Selected =
  | { kind: "image"; src: string }
  | { kind: "video"; playing: boolean }
  | null;

/**
 * The detail card an eye marker opens. It appears where the eye was, is capped
 * at 60% of the viewport height and scrolls its own body — the walk-through
 * behind it is frozen until the card is closed. Media: a photo strip plus the
 * supplied YouTube film.
 */
export function ProductPanel({ hotspot, onClose }: ProductPanelProps) {
  return (
    <AnimatePresence>
      {hotspot && <Card key={hotspot.id} hotspot={hotspot} onClose={onClose} />}
    </AnimatePresence>
  );
}

function Card({ hotspot, onClose }: { hotspot: Hotspot; onClose: () => void }) {
  const images = useMemo(() => hotspot.media?.images ?? [], [hotspot]);
  const youtube = hotspot.media?.youtube;
  const [left, top] = hotspot.screen ?? ["50%", "45%"];

  const [selected, setSelected] = useState<Selected>(() =>
    images.length
      ? { kind: "image", src: images[0] }
      : youtube
        ? { kind: "video", playing: false }
        : null
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasMedia = images.length > 0 || Boolean(youtube);
  const showStrip = images.length + (youtube ? 1 : 0) > 1;

  return (
    <>
      {/* Click-away / dim. */}
      <motion.div
        className="pointer-events-auto absolute inset-0 z-40 bg-charcoal/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      <motion.aside
        data-product-card
        role="dialog"
        aria-label={hotspot.heading}
        className="pointer-events-auto absolute z-40 flex max-h-[60vh] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden bg-paper/95 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md"
        style={{ left, top }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 text-charcoal/70 transition-colors hover:bg-paper hover:text-charcoal"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <div className="overflow-y-auto overscroll-contain px-7 py-8 sm:px-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-charcoal/45">
            {hotspot.eyebrow}
          </p>
          <h2 className="font-display mt-2 pr-8 text-3xl font-medium leading-tight text-charcoal">
            {hotspot.heading}
          </h2>
          <p className="font-display mt-2 text-base text-charcoal/70">
            {hotspot.title}
          </p>

          <div className="mt-5 space-y-3.5 text-sm leading-relaxed text-charcoal/70">
            {hotspot.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {hasMedia && selected && (
            <div className="mt-6">
              <div className="relative aspect-video w-full overflow-hidden bg-charcoal/5">
                {selected.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.src}
                    alt={hotspot.heading}
                    className="h-full w-full object-cover"
                  />
                ) : selected.playing && youtube ? (
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${youtube}?autoplay=1&rel=0`}
                    title={hotspot.heading}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelected({ kind: "video", playing: true })}
                    className="group absolute inset-0 grid place-items-center bg-charcoal/60"
                    aria-label="Play film"
                  >
                    <span className="flex items-center gap-3 bg-paper/95 px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] text-charcoal transition-transform group-hover:scale-105">
                      Play <Play className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </button>
                )}
              </div>

              {showStrip && (
                <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSelected({ kind: "image", src })}
                      className={`h-14 w-20 shrink-0 overflow-hidden border-2 transition-colors ${
                        selected.kind === "image" && selected.src === src
                          ? "border-accent"
                          : "border-transparent hover:border-stone"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                  {youtube && (
                    <button
                      type="button"
                      onClick={() => setSelected({ kind: "video", playing: true })}
                      className={`grid h-14 w-20 shrink-0 place-items-center border-2 bg-charcoal/80 text-paper transition-colors ${
                        selected.kind === "video"
                          ? "border-accent"
                          : "border-transparent hover:border-stone"
                      }`}
                      aria-label="Play film"
                    >
                      <Play className="h-4 w-4" strokeWidth={2} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {hotspot.note && (
            <p className="mt-7 border-l-2 border-accent/50 pl-4 text-xs italic text-charcoal/45">
              {hotspot.note}
            </p>
          )}
        </div>
      </motion.aside>
    </>
  );
}
