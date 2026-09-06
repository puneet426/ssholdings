"use client";

import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import { SectionGlow } from "@/components/ui/SectionGlow";

const reasons = [
  {
    title: "Built for real spaces",
    body: "Every material is evaluated for how it performs in daily use, not just how it photographs.",
  },
  {
    title: "Architect-first process",
    body: "We work directly with design teams from concept through installation, not after the fact.",
  },
  {
    title: "Considered sourcing",
    body: "Materials are selected for consistency and longevity across large-scale projects.",
  },
];

export function WhyUs() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-charcoal py-16 text-paper sm:py-20 lg:py-24"
    >
      <SectionGlow tone="copper" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-paper/50">
            Why SS Holdings
          </p>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
            A material partner, not just a supplier.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-10 sm:grid-cols-3">
          {reasons.map((reason) => (
            <motion.div key={reason.title} variants={revealItemVariants}>
              <div className="h-px w-10 bg-accent" />
              <h3 className="font-display mt-5 text-lg font-medium">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm text-paper/65 leading-relaxed">
                {reason.body}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
