"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";

// FAQ copy — one entry per question, shown in this order.
const faqs = [
  {
    question:
      "6000/sqft vs 6500/sqft which one is cheaper or value for money",
    answer:
      "That extra ₹300–₹500 is not just a price difference. It goes into better raw materials, stronger construction, and a longer life for your home. When you compare, look at the quality, the standards followed, and the experience of the builder, not just the number. Low-quality builders may sell cheaper today, but you may end up paying ₹1,000–₹1,500 more later in repairs and maintenance. At SS, we focus only on building high-quality homes, which is why we may sometimes be slightly higher, but it ensures lasting quality, trust, and peace of mind.",
  },
  {
    question: "Are SS Holdings Homes Designed as per Vastu?",
    answer:
      "At SS Holdings, that's how we build. Every project, 100% Vastu-compliant, where ancient wisdom meets modern quality. Because you deserve a home that doesn't just look good. It feels right.",
  },
  {
    question: "Builder Track Record",
    answer:
      "For 25 years, SS Holdings has been building quality homes. With 35+ completed projects, we have earned the trust of our customers through quality work, honest practices, and on-time delivery, every time.",
  },
];

export function FAQ() {
  // Every question starts closed — the answers open only on click.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-bg py-13 text-fg sm:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-4">
            <div className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-fg/50">
              Common Questions
            </p>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
              FAQs
            </h2>
          </Reveal>

          <RevealGroup className="md:col-span-8 divide-y divide-fg/10 border-t border-fg/10">
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
                    <span className="font-display text-lg font-medium text-fg sm:text-xl">
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
                        <p className="max-w-2xl pb-6 text-fg/65 leading-relaxed">
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
