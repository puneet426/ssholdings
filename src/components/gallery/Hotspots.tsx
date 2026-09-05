"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { EYE_URL, type GalleryFloor, type Hotspot } from "@/lib/three/gallery";

interface HotspotsProps {
  floor: GalleryFloor;
  progressRef: MutableRefObject<number>;
  activeId: string | null;
  onOpen: (hotspot: Hotspot) => void;
}

// A marker eases in as the rail nears its `at`, and out again past it.
const FADE_WINDOW = 0.16;

/**
 * The eye markers, as a screen-space overlay. Each fades in as the
 * walk-through reaches its point on the rail and opens the detail card on
 * click. A bright white disc so it stands out against the dark scenes, with a
 * dark eye glyph inside — as in the reference.
 */
export function Hotspots({ floor, progressRef, activeId, onOpen }: HotspotsProps) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current;
      const node = wrap.current;
      if (node) {
        node.querySelectorAll<HTMLElement>("[data-hotspot]").forEach((el) => {
          const at = Number(el.dataset.at);
          const isActive = el.dataset.id === activeId;
          const vis = isActive
            ? 0
            : Math.max(0, Math.min(1, 1 - Math.abs(p - at) / FADE_WINDOW));
          el.style.opacity = String(vis);
          el.style.transform = `translate(-50%, -50%) scale(${0.7 + vis * 0.3})`;
          el.style.pointerEvents = vis > 0.6 ? "auto" : "none";
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, activeId]);

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 z-30">
      {floor.hotspots.map((h) => {
        const [left, top] = h.screen ?? ["50%", "45%"];
        return (
          <button
            key={h.id}
            type="button"
            data-hotspot
            data-id={h.id}
            data-at={h.at}
            aria-label={`${h.eyebrow}: ${h.title}`}
            onClick={() => onOpen(h)}
            className="absolute grid h-12 w-12 place-items-center rounded-full bg-white text-charcoal shadow-[0_4px_18px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-transform duration-200 hover:scale-110"
            style={{
              left,
              top,
              opacity: 0,
              transform: "translate(-50%, -50%) scale(0.7)",
              willChange: "opacity, transform",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={EYE_URL} alt="" className="h-[18px] w-[18px]" draggable={false} />
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-white/50" />
          </button>
        );
      })}
    </div>
  );
}
