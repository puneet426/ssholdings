"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";
import { SectionGlow } from "@/components/ui/SectionGlow";

// Dummy copy — swap each `question` / `answer` for the real FAQ content.
const faqs = [
  {
    question: "Standalone vs High rise, in this include UDS concept, why standalone will get more UDS and hence more worth investing",
    answer:
      "Undivided Share (UDS) means the part of the land that you own along with your flat. It is your real ownership in the property, not just the apartment you live in. In standalone apartments, fewer people share the land, so your UDS is higher. This gives you better value, higher appreciation, and a safer long-term investment.",
  },
  {
    question: "⁠⁠6000/sqft vs 6500/sqft which one is cheaper or value for money",
    answer:
      "That extra ₹300–₹500 is not just a price difference—it goes into better raw materials, stronger construction, and a longer life for your home.When you compare, look at the quality, the standards followed, and the experience of the builder—not just the number.Low-quality builders may sell cheaper today, but you may end up paying ₹1,000–₹1,500 more later in repairs and maintenance.At SS, we focus only on building high-quality homes, which is why we may sometimes be slightly higher—but it ensures lasting quality, trust, and peace of mind.",
  },
  {
    question: "When your home is built right by Vastu wealth flows, health thrives, and harmony fills every corner",
    answer:
      "At SS Holdings, that's how we build.Every project, 100% Vastu-compliant — where ancient wisdom meets modern quality.Because you deserve a home that doesn't just look good. It feels right.",
  },
  {
    question: "Builder Track Record",
    answer:
      "With 25 years of excellence and over 30 successfully completed projects, SS Holdings is a pioneer in premium standalone buildings. Our extensive track record reflects a commitment to quality and integrity. By focusing on standalone developments, we ensure higher land share and lasting value for every homeowner we serve.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-charcoal py-16 text-paper sm:py-20 lg:py-24"
    >
      <SectionGlow tone="slate" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-4">
            <div className="h-px w-10 bg-accent" />
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-paper/50">
              Common Questions
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
              Answers before you ask.
            </h2>
          </Reveal>

          <RevealGroup className="md:col-span-8 divide-y divide-paper/10 border-t border-paper/10">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div key={faq.question} variants={revealItemVariants}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg font-medium text-paper sm:text-xl">
                      {faq.question}
                    </span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-accent-soft transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-paper/65 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
