"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Returns true if the user has requested reduced motion at the OS level.
 * SSR-safe (assumes motion is allowed on the server, reconciles on the
 * client) and updates live when the preference changes. Used to tone down
 * or disable non-essential animation — camera moves, scroll reveals,
 * parallax — per WCAG 2.3.3.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
