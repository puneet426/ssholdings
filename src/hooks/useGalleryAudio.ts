"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUDIO, CUE_SECONDS } from "@/lib/three/gallery";

type Cue = keyof typeof AUDIO; // "click" | "floor"

/**
 * Interaction-only sound. There is no ambient bed — a clip plays only when a
 * button is pressed (a floor swap, an eye marker) and is faded out and stopped
 * after CUE_SECONDS so nothing ever drones on.
 */
export function useGalleryAudio() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const els = useRef<Partial<Record<Cue, HTMLAudioElement>>>({});
  const timers = useRef<Partial<Record<Cue, ReturnType<typeof setTimeout>>>>({});
  const fades = useRef<Partial<Record<Cue, ReturnType<typeof setInterval>>>>({});

  useEffect(() => {
    mutedRef.current = muted;
    if (muted) {
      for (const el of Object.values(els.current)) el?.pause();
    }
  }, [muted]);

  const stopCue = useCallback((cue: Cue) => {
    const t = timers.current[cue];
    const f = fades.current[cue];
    if (t) clearTimeout(t);
    if (f) clearInterval(f);
    timers.current[cue] = undefined;
    fades.current[cue] = undefined;
  }, []);

  const play = useCallback(
    (cue: Cue) => {
      if (mutedRef.current || typeof window === "undefined") return;

      let el = els.current[cue];
      if (!el) {
        el = new Audio(AUDIO[cue]);
        els.current[cue] = el;
      }
      stopCue(cue);
      el.currentTime = 0;
      el.volume = cue === "floor" ? 0.5 : 0.45;
      el.play().catch(() => {});

      // Hard cap: after (CUE_SECONDS - 0.6)s, fade over ~0.6s and stop.
      const audioEl = el;
      timers.current[cue] = setTimeout(() => {
        fades.current[cue] = setInterval(() => {
          audioEl.volume = Math.max(0, audioEl.volume - 0.08);
          if (audioEl.volume <= 0.001) {
            audioEl.pause();
            audioEl.currentTime = 0;
            stopCue(cue);
          }
        }, 60);
      }, Math.max(0, (CUE_SECONDS - 0.6) * 1000));
    },
    [stopCue]
  );

  useEffect(
    () => () => {
      for (const el of Object.values(els.current)) el?.pause();
      for (const t of Object.values(timers.current)) if (t) clearTimeout(t);
      for (const f of Object.values(fades.current)) if (f) clearInterval(f);
    },
    []
  );

  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggleMuted, play };
}
