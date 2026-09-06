"use client";

import { useState, useCallback } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Play, X } from "lucide-react";
import { SectionGlow } from "@/components/ui/SectionGlow";


type TileType = "photo" | "video" | "text";

interface TestimonialContent {
  id: number;
  type: TileType;
  image?: string; // photo source, or video poster/thumbnail
  video?: string; // empty string = placeholder, no real clip yet
  quote?: string;
  customerName?: string;
  location?: string;
  project?: string;
  verified?: boolean;
  featured?: boolean;
}

interface TilePosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface TileLayout {
  width: number; // px, authored at the canvas's base size
  height: number;
  position: TilePosition; // percentages
  rotation: number; // degrees
  zIndex: number;
}

// ─── Content (swap for real customers) ─────────────────────────────────
const TESTIMONIAL_CONTENT: TestimonialContent[] = [
  {
    id: 1,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80",
    customerName: "Ravi Teja Varma",
    location: "MVP Colony, Vizag",
    project: "Duplex villa",
  },
  {
    id: 2,
    type: "video",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&auto=format&fit=crop&q=80",
    video: "",
    customerName: "Srinivas Rao",
    location: "Rushikonda",
    verified: true,
  },
  {
    id: 3,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=700&auto=format&fit=crop&q=80",
    customerName: "Lakshmi Prasanna",
    location: "Bheemili",
  },
  {
    id: 4,
    type: "video",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&auto=format&fit=crop&q=80",
    video: "",
    customerName: "Divya Sri",
    location: "Yendada",
  },
  {
    id: 5,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=700&auto=format&fit=crop&q=80",
    customerName: "Nagaraju K",
    location: "Gajuwaka",
  },
  {
    id: 6,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=700&auto=format&fit=crop&q=80",
    customerName: "Kavitha Reddy",
    location: "Pendurthi",
  },
  {
    id: 7,
    type: "text",
    quote: "Site handover was smooth and right on schedule.",
    customerName: "Anil Kumar",
    location: "Madhurawada",
  },
  {
    id: 8,
    type: "text",
    featured: true,
    quote: "Every promise in the contract was kept — rare in this industry.",
    customerName: "Ramesh Naidu",
    location: "Seethammadhara",
    verified: true,
  },
  {
    id: 9,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=700&auto=format&fit=crop&q=80",
    customerName: "Sunitha Devi",
    location: "MVP Colony",
  },
  {
    id: 10,
    type: "video",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&auto=format&fit=crop&q=80",
    video: "",
    customerName: "Swathi Reddy",
    location: "Seethammadhara",
  },
  {
    id: 11,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=700&auto=format&fit=crop&q=80",
    customerName: "Bhaskar Rao",
    location: "Yendada",
  },
  {
    id: 12,
    type: "text",
    quote: "Great quality construction, delivered within budget.",
    customerName: "Padma Latha",
    location: "Pendurthi",
  },
  {
    id: 13,
    type: "video",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&auto=format&fit=crop&q=80",
    video: "",
    customerName: "Kiran Kumar",
    location: "Madhurawada",
  },
  {
    id: 14,
    type: "text",
    quote: "Would recommend them to any first-time builder.",
    customerName: "Aruna Kumari",
    location: "Seethammadhara",
    verified: true,
  },
  {
    id: 15,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&auto=format&fit=crop&q=80",
    customerName: "Naveen Babu",
    location: "MVP Colony",
  },
  {
    id: 16,
    type: "photo",
    image:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=700&auto=format&fit=crop&q=80",
    customerName: "Vijaya Lakshmi",
    location: "Gajuwaka",
  },
  {
    id: 17,
    type: "text",
    quote: "Transparent pricing from day one, no hidden costs.",
    customerName: "Chandra Sekhar",
    location: "Bheemili",
  },
  {
    id: 18,
    type: "video",
    image:
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=700&auto=format&fit=crop&q=80",
    video: "",
    customerName: "Deepthi Rani",
    location: "Rushikonda",
    verified: true,
  },
];

// ─── Desktop / tablet layout — canvas base 1060 × 600 ──────────────────
const DESKTOP_BASE = { width: 1060, height: 600 };

// Every tile is positioned with `left` (never `right`) computed so each
// row is a genuinely connected sequence — tile N+1 starts ~2% before
// tile N ends, guaranteeing real overlap with no disconnected "floating"
// tile off on its own, and no big dead gap in the middle of a row.
//
// Three rows of five. An earlier fourth row held only three tiles
// (ids 16–18) and read as lopsided against the full rows above, so it was
// dropped and the canvas shortened to match — those three still appear in
// the mobile composition below. `top` values carry the 740→600 rescale so
// rows 1–3 land exactly where they did before, just without the trailing
// empty band. `left` values then carry a uniform +7 nudge so the ~87%-wide
// block of five sits centred in the canvas with an even ~6% margin each
// side (dropping the fourth row had left ~14% dead space on the right).
const DESKTOP_LAYOUT: Record<number, TileLayout> = {
  // Row 1
  1: { width: 195, height: 190, position: { left: 6, top: 7.4 }, rotation: -2, zIndex: 5 },
  2: { width: 190, height: 240, position: { left: 22, top: 0 }, rotation: 2, zIndex: 7 },
  3: { width: 210, height: 195, position: { left: 38, top: -1.2 }, rotation: -1, zIndex: 6 },
  4: { width: 210, height: 175, position: { left: 56, top: -1.2 }, rotation: 0, zIndex: 5 },
  5: { width: 185, height: 210, position: { left: 74, top: 3.7 }, rotation: 2, zIndex: 6 },
  // Row 2
  6: { width: 195, height: 220, position: { left: 6, top: 28.4 }, rotation: -1, zIndex: 5 },
  7: { width: 195, height: 175, position: { left: 22, top: 27.1 }, rotation: 1, zIndex: 6 },
  8: { width: 235, height: 210, position: { left: 39, top: 24.7 }, rotation: 0, zIndex: 10 },
  9: { width: 195, height: 210, position: { left: 59, top: 25.9 }, rotation: -2, zIndex: 6 },
  10: { width: 200, height: 235, position: { left: 75, top: 27.1 }, rotation: 1, zIndex: 7 },
  // Row 3
  11: { width: 175, height: 165, position: { left: 6, top: 64.1 }, rotation: -1, zIndex: 5 },
  12: { width: 210, height: 170, position: { left: 21, top: 61.7 }, rotation: 2, zIndex: 7 },
  13: { width: 230, height: 190, position: { left: 38, top: 62.9 }, rotation: -1, zIndex: 6 },
  14: { width: 215, height: 180, position: { left: 58, top: 60.4 }, rotation: 1, zIndex: 7 },
  15: { width: 180, height: 205, position: { left: 76, top: 62.9 }, rotation: -2, zIndex: 5 },
};

// ─── Mobile layout — dedicated composition, canvas base 375 × 460 ─────
// Three rows of three. It was four rows, but that left a tall empty band
// under the last row and made the section eat far too much of a phone
// screen. Dropping row 4 mirrors the desktop (which also lost its short
// final row); the `top` values carry the 700→460 rescale so rows 1–3
// render exactly where they did before — the canvas just ends where the
// content does instead of running on with dead space.
const MOBILE_BASE = { width: 375, height: 460 };

const MOBILE_LAYOUT: Partial<Record<number, TileLayout>> = {
  // Row 1 — widened + pushed right so it bleeds off both edges like rows
  // 2 and 3; before, it stopped ~9% short on the right and read as
  // left-aligned against the fuller rows below.
  1: { width: 138, height: 120, position: { left: -1, top: 1.5 }, rotation: -1, zIndex: 5 },
  2: { width: 132, height: 165, position: { left: 31, top: -1.5 }, rotation: 1, zIndex: 7 },
  5: { width: 130, height: 130, position: { left: 64, top: 4.6 }, rotation: -2, zIndex: 5 },
  // Row 2
  6: { width: 135, height: 145, position: { left: -1, top: 33.5 }, rotation: 0, zIndex: 5 },
  7: { width: 140, height: 125, position: { left: 31, top: 30.4 }, rotation: 2, zIndex: 6 },
  10: { width: 130, height: 150, position: { left: 64, top: 32 }, rotation: -1, zIndex: 6 },
  // Row 3
  13: { width: 125, height: 145, position: { left: -1, top: 63.9 }, rotation: 1, zIndex: 6 },
  8: { width: 155, height: 145, position: { left: 28, top: 60.9 }, rotation: 0, zIndex: 9 },
  15: { width: 130, height: 140, position: { left: 66, top: 63.9 }, rotation: -2, zIndex: 5 },
};

function pctOf(px: number, base: number): string {
  return `${(px / base) * 100}%`;
}

function tileStyle(layout: TileLayout, base: { width: number; height: number }): CSSProperties {
  const { position } = layout;
  const style: CSSProperties = {
    position: "absolute",
    width: pctOf(layout.width, base.width),
    height: pctOf(layout.height, base.height),
    zIndex: layout.zIndex,
  };
  if (position.top !== undefined) style.top = `${position.top}%`;
  if (position.bottom !== undefined) style.bottom = `${position.bottom}%`;
  if (position.left !== undefined) style.left = `${position.left}%`;
  if (position.right !== undefined) style.right = `${position.right}%`;
  return style;
}

function CollageTile({
  content,
  layout,
  base,
  index,
  onOpen,
}: {
  content: TestimonialContent;
  layout: TileLayout;
  base: { width: number; height: number };
  index: number;
  onOpen: (content: TestimonialContent) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  const entrance = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.92 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-10% 0px" },
        transition: { duration: 0.4, delay: Math.min(index * 0.025, 0.35) },
      };

  const hover = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.06, zIndex: 50, transition: { duration: 0.3 } },
        whileTap: { scale: 1.06, zIndex: 50 },
      };

  const baseStyle = tileStyle(layout, base);

  const cardClasses =
    "group cursor-pointer overflow-hidden rounded-sm border-2 border-paper box-border shadow-[0_2px_8px_rgba(0,0,0,0.25)] bg-ink";

  if (content.type === "text") {
    return (
      <motion.div
        {...entrance}
        {...hover}
        style={{ ...baseStyle, rotate: layout.rotation }}
        onClick={() => onOpen(content)}
        className={`${cardClasses} flex flex-col justify-between p-3 ${
          content.featured
            ? "bg-paper text-ink"
            : "bg-charcoal text-paper"
        }`}
      >
        <p className="text-balance text-[clamp(11px,1.4vw,14px)] font-medium leading-snug">
          {content.quote}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="min-w-0">
            <p className="truncate text-[clamp(9px,1.05vw,12px)] font-semibold">
              {content.customerName}
            </p>
            <p
              className={`truncate text-[clamp(8px,0.9vw,10px)] ${
                content.featured ? "text-stone-dark" : "text-paper/70"
              }`}
            >
              {content.location}
            </p>
          </div>
          {content.verified && (
            <BadgeCheck
              className={`ml-auto h-3.5 w-3.5 shrink-0 ${
                content.featured ? "text-accent" : "text-accent-soft"
              }`}
            />
          )}
        </div>
      </motion.div>
    );
  }

  // photo / video
  const initial = content.customerName?.[0] ?? "?";

  return (
    <motion.div
      {...entrance}
      {...hover}
      style={{ ...baseStyle, rotate: layout.rotation }}
      onClick={() => onOpen(content)}
      className={`${cardClasses} bg-paper`}
    >
      {content.image && (
        // Default: cropped to fill the tile, like the reference collage.
        // On hover/focus the image switches to `object-contain` so the
        // *entire* photo becomes visible (nothing hidden by the crop),
        // while the tile itself pops forward via the whileHover scale
        // above — that's the "show it fully on hover" behavior.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.image}
          alt={content.customerName ?? "Customer"}
          loading="lazy"
          className="h-full w-full bg-ink object-cover object-center transition-[object-fit] duration-200 ease-out group-hover:object-contain group-focus-visible:object-contain"
        />
      )}

      {content.type === "video" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 shadow-md transition-transform duration-200 group-hover:scale-110 sm:h-10 sm:w-10">
            <Play className="ml-0.5 h-4 w-4 fill-ink text-ink" />
          </div>
        </div>
      )}

      {/* Always-visible profile + name strip, Instagram-tag style */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent px-2 py-1.5">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-paper/70 bg-charcoal text-[9px] font-semibold text-paper">
          {initial}
        </div>
        <p className="truncate text-[10px] font-semibold text-paper drop-shadow sm:text-xs">
          {content.customerName}
        </p>
        {content.verified && (
          <BadgeCheck className="ml-auto h-3.5 w-3.5 shrink-0 text-paper drop-shadow" />
        )}
      </div>
    </motion.div>
  );
}

function Lightbox({
  content,
  onClose,
}: {
  content: TestimonialContent;
  onClose: () => void;
}) {
  const isMedia = content.type === "photo" || content.type === "video";
  const hasVideo = content.type === "video" && !!content.video;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-paper/10 bg-charcoal shadow-2xl sm:max-w-xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur-md transition-colors hover:bg-ink/90"
        >
          <X className="h-5 w-5" />
        </button>

        {isMedia && (
          <div className="relative aspect-[4/5] w-full bg-ink sm:aspect-video">
            {hasVideo ? (
              <video
                src={content.video}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                poster={content.image}
                className="h-full w-full object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.image}
                alt={content.customerName ?? ""}
                className="h-full w-full object-contain"
              />
            )}
          </div>
        )}

        <div className="p-5 text-paper">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold leading-tight">{content.customerName}</h3>
              <p className="mt-0.5 text-xs text-paper/50">{content.location}</p>
            </div>
            {content.verified && (
              <span className="flex items-center gap-1 text-xs text-paper/60">
                <BadgeCheck className="h-4 w-4 text-accent" />
                Verified
              </span>
            )}
          </div>
          {content.quote && (
            <p className="mt-4 border-t border-paper/10 pt-3 text-sm italic leading-relaxed text-paper/70">
              &ldquo;{content.quote}&rdquo;
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Testimonials() {
  const [active, setActive] = useState<TestimonialContent | null>(null);
  const close = useCallback(() => setActive(null), []);

  const contentById = new Map(TESTIMONIAL_CONTENT.map((c) => [c.id, c]));
  const desktopIds = Object.keys(DESKTOP_LAYOUT).map(Number);
  const mobileIds = Object.keys(MOBILE_LAYOUT).map(Number);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-charcoal py-16 text-paper sm:py-20 lg:py-24"
    >
      <SectionGlow tone="clay" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-paper/50">Testimonials</p>
          <h2 className="font-display mt-3 text-balance text-2xl font-medium sm:text-3xl lg:text-4xl">
            Real experiences from the people we build for.
          </h2>
        </div>

        {/* Desktop / tablet collage — hidden below md */}
        <div
          className="relative mx-auto hidden w-full overflow-visible md:block"
          style={{ maxWidth: 1100, aspectRatio: `${DESKTOP_BASE.width} / ${DESKTOP_BASE.height}` }}
        >
          {desktopIds.map((id, i) => {
            const content = contentById.get(id);
            const layout = DESKTOP_LAYOUT[id];
            if (!content || !layout) return null;
            return (
              <CollageTile
                key={id}
                content={content}
                layout={layout}
                base={DESKTOP_BASE}
                index={i}
                onOpen={setActive}
              />
            );
          })}
        </div>

        {/* Mobile collage — dedicated composition, not a shrunk desktop */}
        <div
          className="relative mx-auto w-full overflow-visible md:hidden"
          style={{ maxWidth: 420, aspectRatio: `${MOBILE_BASE.width} / ${MOBILE_BASE.height}` }}
        >
          {mobileIds.map((id, i) => {
            const content = contentById.get(id);
            const layout = MOBILE_LAYOUT[id];
            if (!content || !layout) return null;
            return (
              <CollageTile
                key={id}
                content={content}
                layout={layout}
                base={MOBILE_BASE}
                index={i}
                onOpen={setActive}
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence>{active && <Lightbox content={active} onClose={close} />}</AnimatePresence>
    </section>
  );
}