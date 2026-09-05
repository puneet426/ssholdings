"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Quote } from "lucide-react";
import { SectionGlow } from "@/components/ui/SectionGlow";

interface TestimonialMedia {
  id: string;
  name: string;
  role: string;
  avatar: string;
  image: string;
  quote?: string;
  videoUrl?: string;
  rotation: string;
  offset: string;
}

const mediaTestimonials: TestimonialMedia[] = [
  {
    id: "1",
    name: "Ramesh Varma",
    role: "Homeowner, MVP Colony",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&auto=format&fit=crop&q=80",
    quote: "Handed over our home three weeks early. Kitchen finishing is genuinely five-star work!",
    rotation: "-rotate-3",
    offset: "translate-y-0",
  },
  {
    id: "2",
    name: "Lakshmi Prasanna",
    role: "Flat Owner, Rushikonda",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&auto=format&fit=crop&q=80",
    quote: "We were so confused about UDS before buying — the standalone building gave us a much better share than the high-rises nearby.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rotation: "rotate-2",
    offset: "translate-y-5",
  },
  {
    id: "3",
    name: "Srinivasa Rao",
    role: "Villa Owner, Bheemili",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=80",
    quote: "Every single detail in the contract was honored — rare honesty in this industry.",
    rotation: "-rotate-2",
    offset: "-translate-y-3",
  },
  {
    id: "4",
    name: "Anitha Reddy",
    role: "Apartment Owner, Seethammadhara",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&auto=format&fit=crop&q=80",
    quote: "The site engineer picked up my calls at odd hours during construction without ever sounding annoyed.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rotation: "rotate-3",
    offset: "translate-y-3",
  },
  {
    id: "5",
    name: "Venkata Krishna",
    role: "Independent House, Madhurawada",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80",
    quote: "Material quality is night and day compared to what our neighbors got.",
    rotation: "-rotate-4",
    offset: "-translate-y-4",
  },
  {
    id: "6",
    name: "Deepika Chowdary",
    role: "Flat Owner, Gajuwaka",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&auto=format&fit=crop&q=80",
    quote: "Nobody ever made me feel talked over during site visits or billing discussions.",
    rotation: "rotate-2",
    offset: "translate-y-2",
  },
  {
    id: "7",
    name: "Suresh Babu Naidu",
    role: "Villa Owner, Yendada",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=80",
    quote: "Twenty-five years in this business really shows in the small stuff — nothing felt like an afterthought.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    rotation: "-rotate-1",
    offset: "translate-y-6",
  },
  {
    id: "8",
    name: "Padma Vasundhara",
    role: "Homeowner, Pendurthi",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&auto=format&fit=crop&q=80",
    quote: "Written cost breakdown on day one. No hidden charges showed up later.",
    rotation: "rotate-3",
    offset: "-translate-y-3",
  },
];

export function Testimonials() {
  const [activeMedia, setActiveMedia] = useState<TestimonialMedia | null>(null);

  return (
    <section
      id="testimonials"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden border-t border-paper/10 bg-charcoal px-4 py-16 text-paper sm:px-6 sm:py-20 lg:px-8"
    >
      <SectionGlow tone="clay" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-4 py-1.5 text-xs text-paper/70">
            <Star className="h-3.5 w-3.5 fill-accent-soft text-accent-soft" />
            Rated 4.8/5 by 250+ homeowners across Visakhapatnam
          </span>
          <p className="mt-5 text-xs uppercase tracking-[0.3em] text-paper/50">
            Client Voices
          </p>
          <h2 className="font-display mt-4 text-2xl font-medium text-balance sm:text-3xl lg:text-4xl">
            Words from homeowners who built with us.
          </h2>
        </div>

        {/* Scattered polaroid collage — negative margins pull every card into
            its neighbors so the pile actually overlaps instead of sitting in
            evenly gapped grid cells. */}
        <div className="flex flex-wrap items-center justify-center">
          {mediaTestimonials.map((item, index) => (
            <motion.div
              key={item.id}
              style={{ zIndex: index + 1 }}
              whileHover={{
                scale: 1.1,
                rotate: 0,
                zIndex: 40,
                transition: { type: "spring", stiffness: 350, damping: 20 },
              }}
              onClick={() => setActiveMedia(item)}
              className={`group relative -m-2.5 cursor-pointer rounded-xl bg-paper p-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] sm:-m-4 sm:p-2.5 ${item.rotation} ${item.offset}`}
            >
              {/* Photo */}
              <div className="relative aspect-3/4 w-28 overflow-hidden rounded-lg bg-ink sm:w-36 md:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* On-image quote bubble */}
                {item.quote && (
                  <div className="absolute inset-x-2 bottom-2 rounded-md border border-stone/40 bg-paper/95 p-1.5 shadow-lg backdrop-blur-sm">
                    <div className="flex items-start gap-1">
                      <Quote className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                      <p className="line-clamp-2 text-[10px] font-medium leading-tight text-ink">
                        {item.quote}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Polaroid footer */}
              <div className="mt-2 flex items-center justify-between gap-1 px-0.5">
                <div className="flex items-center gap-1.5 overflow-hidden pr-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-5 w-5 shrink-0 rounded-full border border-stone object-cover sm:h-6 sm:w-6"
                  />
                  <div className="truncate">
                    <p className="truncate text-[11px] leading-none font-semibold text-ink">
                      {item.name}
                    </p>
                    <p className="mt-0.5 truncate text-[9px] text-stone-dark">
                      {item.role}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 gap-0.5 sm:flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-2.5 w-2.5 fill-accent-soft text-accent-soft"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-paper/10 bg-charcoal shadow-2xl"
            >
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur-md transition-colors hover:bg-ink/90"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-video w-full bg-ink">
                {activeMedia.videoUrl ? (
                  <video
                    src={activeMedia.videoUrl}
                    controls
                    autoPlay
                    className="h-full w-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeMedia.image}
                    alt={activeMedia.name}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              <div className="p-6 text-paper">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeMedia.avatar}
                      alt={activeMedia.name}
                      className="h-10 w-10 rounded-full border border-paper/20 object-cover"
                    />
                    <div>
                      <h3 className="text-base leading-tight font-semibold">
                        {activeMedia.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-paper/50">
                        {activeMedia.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-accent-soft text-accent-soft"
                      />
                    ))}
                  </div>
                </div>
                {activeMedia.quote && (
                  <p className="mt-4 border-t border-paper/10 pt-3 text-sm leading-relaxed text-paper/70 italic">
                    &ldquo;{activeMedia.quote}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
