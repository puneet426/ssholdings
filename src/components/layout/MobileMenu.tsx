"use client";

import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/data/nav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 bg-bg md:hidden"
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                className="font-display text-4xl font-medium py-3 text-fg"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * navLinks.length, duration: 0.4 }}
              className="mt-8 flex items-center gap-3 border-t border-fg/10 pt-6 text-sm uppercase tracking-[0.25em] text-fg/60"
            >
              <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded-full border border-fg/15 text-fg transition-colors hover:bg-fg/10" />
              Theme
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
