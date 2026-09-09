"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";

// Drop a partner's photo in at the path below and it appears — until the file
// exists the portrait falls back to their initials, so a missing photo never
// shows a broken image.
const partners = [
  {
    name: "Soma Raju Bhupatiraju",
    image: "/images/managing/1.png",
  },
  {
    name: "Seetharama Raju Sayyaparaju",
    image: "/images/managing/2.jpeg",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function Portrait({ name, image }: { name: string; image: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-full border border-dashed border-fg/15 bg-fg/[0.04]">
        <span className="font-display text-2xl font-medium text-fg/25">
          {initials(name)}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image}
      alt={name}
      onError={() => setFailed(true)}
      // Square crop centred a little above the middle so the face sits in
      // the circle rather than the chest.
      className="aspect-square w-full rounded-full border border-fg/10 bg-well object-cover object-[center_28%]"
    />
  );
}

export function ManagingPartners() {
  return (
    <section
      id="managing"
      className="relative overflow-hidden bg-panel py-10 text-fg sm:py-12 lg:py-14"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <div className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
          <h2 className="font-display mt-4 text-2xl sm:text-3xl font-medium text-balance">
            Managing Partners
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-fg/70">
            Both managing partners share a passion for building elegant,
            practical homes designed around Vastu principles. With 25 years of
            experience, SS Holdings continues to create homes that combine
            thoughtful design, comfort, and timeless appeal.
          </p>
        </Reveal>

        <RevealGroup className="mt-8 grid max-w-sm grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6">
          {partners.map((partner) => (
            <motion.div key={partner.name} variants={revealItemVariants}>
              <Portrait name={partner.name} image={partner.image} />
              <h3 className="font-display mt-3 text-sm font-medium text-balance sm:text-base">
                {partner.name}
              </h3>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
