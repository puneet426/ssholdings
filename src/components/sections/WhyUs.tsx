"use client";

import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

// Left label, then the full claim: "Our Construction: <lead> — <body>".
const reasons = [
  {
    label: "Quality",
    lead: "Uncompromised Quality",
    body: "Premium specification, premium-grade materials, and trusted brands you can verify.",
  },
  {
    label: "Timely Delivery",
    lead: "On-Time Delivery",
    body: "The timeline we promise is the timeline we deliver.",
  },
  {
    label: "All Inclusive Price",
    lead: "All-Inclusive Pricing",
    body: "Car parking, amenities, and other essential facilities are included in the price.",
  },
];

export function WhyUs() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-bg py-13 text-fg sm:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <div className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
          <h2 className="mt-4 text-xs uppercase tracking-[0.3em] text-fg/50">
            Why Us
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 divide-y divide-fg/10 border-y border-fg/10 lg:mt-14">
          {reasons.map((reason) => (
            <motion.div
              key={reason.label}
              variants={revealItemVariants}
              className="grid gap-2 py-7 md:grid-cols-12 md:gap-16 md:py-9"
            >
              <h3 className="font-display text-lg font-medium md:col-span-4">
                {reason.label}
              </h3>
              <p className="leading-relaxed text-fg/65 md:col-span-8">
                <span className="text-fg">Our Construction: {reason.lead}.</span>{" "}
                {reason.body}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
