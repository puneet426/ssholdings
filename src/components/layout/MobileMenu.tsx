"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navLinks } from "@/data/nav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

// The panel is theme-fixed dark for the same reason the header is: it opens
// under the header's white close button, so a daylight-cream ground would
// swallow it. See Header.tsx.
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const reducedMotion = useReducedMotion();

  // While the menu covers the screen the page behind it must not move: on a
  // phone a drag over the panel would otherwise scroll the document (or scrub
  // the 3D hero) underneath, which reads as the menu itself sliding around.
  // `touch-none` on the panel stops the gesture; locking the body keeps a
  // stray wheel or keyboard scroll out too. The scroll position is left
  // alone so a link to an anchor still lands where it should.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 touch-none overscroll-contain bg-charcoal md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <nav
            className="flex h-full flex-col items-start justify-center gap-2 px-8"
            aria-label="Mobile"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reducedMotion ? 0 : 0.04 * i,
                  duration: reducedMotion ? 0.01 : 0.3,
                }}
                className="font-display text-4xl font-medium py-3 text-paper"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reducedMotion ? 0 : 0.04 * navLinks.length,
                duration: reducedMotion ? 0.01 : 0.3,
              }}
              className="mt-8 flex items-center gap-3 border-t border-paper/10 pt-6 text-sm uppercase tracking-[0.25em] text-paper/60"
            >
              <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-paper transition-colors hover:bg-paper/10" />
              Theme
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
