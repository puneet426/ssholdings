"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Layers } from "lucide-react";
import { FLOORS_BY_LEVEL, type FloorId } from "@/lib/three/gallery";

interface FloorsPanelProps {
  open: boolean;
  current: FloorId;
  onToggle: () => void;
  onSelect: (id: FloorId) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function levelTag(level: number) {
  return level > 0 ? `+${level}` : `${level}`;
}

/**
 * Bottom-left floor switcher. The trigger sits over the scene; the panel is
 * the "Change floor" list — every storey with its level number, current one
 * marked — and picking one swaps the walk-through.
 */
export function FloorsPanel({ open, current, onToggle, onSelect }: FloorsPanelProps) {
  return (
    <div className="pointer-events-auto absolute bottom-16 left-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-12 left-0 w-64 bg-paper/95 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <p className="text-[11px] uppercase tracking-[0.35em] text-charcoal/45">
                Change floor
              </p>
            </div>
            <ul className="mt-3">
              {[...FLOORS_BY_LEVEL].reverse().map((f) => {
                const active = f.id === current;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(f.id)}
                      aria-current={active}
                      className={`flex w-full items-center gap-4 px-5 py-3 text-sm transition-colors ${
                        active
                          ? "bg-charcoal/[0.04] font-medium text-charcoal"
                          : "text-charcoal/60 hover:text-charcoal"
                      }`}
                    >
                      <span className="w-6 text-right tabular-nums text-charcoal/40">
                        {levelTag(f.level)}
                      </span>
                      {f.label}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-paper/80 transition-colors hover:text-paper"
      >
        <Layers className="h-4 w-4" strokeWidth={1.5} />
        Floors
      </button>
    </div>
  );
}
