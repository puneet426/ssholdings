"use client";

import { useSyncExternalStore } from "react";

// Matches the `smallViewport` cutoff in useDeviceQuality so the two agree on
// what "phone" means.
const QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Returns true on phone-width viewports. SSR-safe (assumes desktop on the
 * server, reconciles on the client) and updates live on resize / rotate.
 * Used to give the 3D hero a wider FOV and tighter caption wrapping on
 * mobile, where the desktop framing crops the wall text and the swipe needs
 * more room to breathe.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
