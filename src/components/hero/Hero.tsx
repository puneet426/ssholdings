"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGalleryAudio } from "@/hooks/useGalleryAudio";
import { ProductPanel } from "@/components/gallery/ProductPanel";
import { GalleryChrome } from "@/components/gallery/GalleryChrome";
import { StairsPrompt } from "@/components/gallery/StairsPrompt";
import { Hotspots } from "@/components/gallery/Hotspots";
import {
  DEFAULT_FLOOR,
  getFloor,
  type FloorId,
  type Hotspot,
} from "@/lib/three/gallery";

const RoomCanvas = dynamic(
  () => import("@/components/three/RoomCanvas").then((m) => m.RoomCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-paper-warm" /> }
);

// Wheel delta (px) to travel the whole rail — a long, unhurried scroll.
const WHEEL_DIVISOR = 7200;
// Pixels of mouse drag to travel the whole rail.
const DRAG_DIVISOR = 3400;
// Touch is lighter: a phone swipe covers more rail per pixel so it doesn't
// take five drags to cross a floor, and — paired with the fling below — a
// flick keeps gliding after the finger lifts instead of dead-stopping.
const TOUCH_DRAG_DIVISOR = 1500;
// The First Floor scrubs ~12% slower than the other floors — its wall
// captions each need an extra beat to land as the camera passes. Applied to
// every scrub delta (wheel, drag, touch, fling) while "ff" is active.
const FF_SCRUB_SCALE = 0.88;
// Most the target may move in one event, so a hard fling can't tear the
// eased camera off the front of the rail.
const MAX_STEP = 0.03;
// Touch fling: after a swipe ends, decay the last measured velocity each
// frame until it's spent or the rail hits an end.
const FLING_FRICTION = 0.92; // survives per ~16ms frame
const MIN_FLING_VELOCITY = 3e-5; // progress units / ms — below this, stop
const MAX_FLING_VELOCITY = 3e-3; // clamp a wild flick

/**
 * The gallery hero. It drops straight into a floor's pinned first-person
 * walk-through — scroll / drag / touch scrub the baked camera rail. Eye markers
 * open a detail card; the Floors list and the stairs prompt swap the whole rail.
 */
export function Hero() {
  const reducedMotion = usePrefersReducedMotion();
  const audio = useGalleryAudio();

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Mirrors `floorId` for the event handlers (their effect isn't re-run per
  // floor) so the scrub can slow down on the First Floor.
  const floorIdRef = useRef<FloorId>(DEFAULT_FLOOR);

  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const hintDismissed = useRef(false);
  const unlockedRef = useRef(false);
  const veilTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardOpenRef = useRef(false);
  const veiledRef = useRef(false);
  // Touch swipe momentum: signed progress-units/ms, plus the rAF handle for
  // the glide that keeps feeding it after the finger lifts.
  const flingVelocity = useRef(0);
  const lastMoveTs = useRef(0);
  const flingRaf = useRef<number | null>(null);

  const [floorId, setFloorId] = useState<FloorId>(DEFAULT_FLOOR);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [dragUnlocked, setDragUnlocked] = useState(false);
  const [veiled, setVeiled] = useState(false);

  const unlocked = dragUnlocked || reducedMotion;

  useEffect(() => {
    cardOpenRef.current = activeHotspot !== null;
  }, [activeHotspot]);

  useEffect(() => {
    veiledRef.current = veiled;
  }, [veiled]);

  useEffect(() => {
    floorIdRef.current = floorId;
  }, [floorId]);

  // Cover the swap with a warm plate, flip state behind it, then let the new
  // scene's own loader lift it (with a failsafe).
  const changeFloor = useCallback(
    (id: FloorId) => {
      if (id === floorId) return;

      setVeiled(true);
      setSceneReady(false);
      setActiveHotspot(null);
      if (veilTimer.current) clearTimeout(veilTimer.current);

      setTimeout(() => {
        progressRef.current = reducedMotion ? 1 : 0;
        unlockedRef.current = reducedMotion;
        setDragUnlocked(reducedMotion);
        setFloorId(id);
        audio.play("floor");
      }, 380);
      veilTimer.current = setTimeout(() => setVeiled(false), 6000);
    },
    [floorId, reducedMotion, audio]
  );

  const openHotspot = useCallback(
    (h: Hotspot) => {
      setActiveHotspot(h);
      audio.play("click");
    },
    [audio]
  );

  const onLoaded = useCallback(() => {
    setSceneReady(true);
    setVeiled(false);
    if (veilTimer.current) clearTimeout(veilTimer.current);
    if (!hintDismissed.current) setHintVisible(true);
  }, []);

  // Dev-only: scrub the rail from the console while tuning hotspot positions.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as Record<string, unknown>).__galleryProgress = (v: number) => {
      progressRef.current = Math.min(Math.max(v, 0), 1);
    };
  }, []);

  // Scroll / drag / touch → rail progress.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (reducedMotion) {
      progressRef.current = 1;
      unlockedRef.current = true;
    }

    const bump = (deltaProgress: number) => {
      if (reducedMotion) return;
      // First Floor rides its rail a touch slower (see FF_SCRUB_SCALE).
      const scaled =
        floorIdRef.current === "ff"
          ? deltaProgress * FF_SCRUB_SCALE
          : deltaProgress;
      const step = Math.max(-MAX_STEP, Math.min(MAX_STEP, scaled));
      const next = Math.min(Math.max(progressRef.current + step, 0), 1);
      progressRef.current = next;

      if (next > 0.03 && !hintDismissed.current) {
        hintDismissed.current = true;
        setHintVisible(false);
      }
      const done = next > 0.995;
      if (done !== unlockedRef.current) {
        unlockedRef.current = done;
        setDragUnlocked(done);
      }
    };

    const stopFling = () => {
      if (flingRaf.current !== null) {
        cancelAnimationFrame(flingRaf.current);
        flingRaf.current = null;
      }
      flingVelocity.current = 0;
    };

    // Coast on the last swipe velocity, shedding it a little each frame, so a
    // flick on a phone glides to rest instead of stopping the instant the
    // finger leaves the glass.
    const startFling = () => {
      if (flingRaf.current !== null) cancelAnimationFrame(flingRaf.current);
      let prev = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(now - prev, 32);
        prev = now;
        if (reducedMotion || cardOpenRef.current || veiledRef.current) {
          flingRaf.current = null;
          flingVelocity.current = 0;
          return;
        }
        const v = flingVelocity.current;
        bump(v * dt);
        flingVelocity.current = v * Math.pow(FLING_FRICTION, dt / 16);
        const p = progressRef.current;
        const spent = Math.abs(flingVelocity.current) < MIN_FLING_VELOCITY;
        const atEnd =
          (flingVelocity.current > 0 && p >= 1) ||
          (flingVelocity.current < 0 && p <= 0);
        if (spent || atEnd) {
          flingRaf.current = null;
          flingVelocity.current = 0;
          return;
        }
        flingRaf.current = requestAnimationFrame(tick);
      };
      flingRaf.current = requestAnimationFrame(tick);
    };

    // The overlay UI (Floors panel, chrome, stairs card, product panel) lives
    // on top of the scene — a press there must not start a camera drag or the
    // section's pointer capture would eat the button's click.
    const fromScene = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      return t === el || t?.tagName === "CANVAS";
    };

    const onWheel = (e: WheelEvent) => {
      // While a detail card is open the walk-through is frozen: let a wheel
      // over the card scroll the card, and swallow anything else so neither
      // the camera nor the page moves.
      if (cardOpenRef.current) {
        const t = e.target as HTMLElement | null;
        if (!t?.closest?.("[data-product-card]")) e.preventDefault();
        return;
      }
      const p = progressRef.current;
      const forward = e.deltaY > 0;
      if (forward && p >= 0.999) return;
      if (!forward && (p <= 0.001 || window.scrollY > 0)) return;
      e.preventDefault();
      stopFling();
      bump(e.deltaY / WHEEL_DIVISOR);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (cardOpenRef.current || !fromScene(e)) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.pointerType !== "mouse" && unlockedRef.current) return;
      stopFling();
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      lastMoveTs.current = e.timeStamp || performance.now();
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) {
        pointerRef.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        };
        return;
      }

      const isTouch = e.pointerType !== "mouse";
      const divisor = isTouch ? TOUCH_DRAG_DIVISOR : DRAG_DIVISOR;
      // Fast flicks can arrive as one pointermove carrying several coalesced
      // samples — walk them so the travel and the measured velocity match
      // what the finger actually did. Some browsers hand back an empty list
      // for an un-coalesced move, so fall back to the event itself.
      const coalesced =
        isTouch && typeof e.getCoalescedEvents === "function"
          ? e.getCoalescedEvents()
          : null;
      const samples = coalesced && coalesced.length ? coalesced : [e];

      for (const ev of samples) {
        const dx = lastX.current - ev.clientX;
        const dy = lastY.current - ev.clientY;
        lastX.current = ev.clientX;
        lastY.current = ev.clientY;
        const deltaProgress = (isTouch ? dy : dx) / divisor;
        bump(deltaProgress);

        if (isTouch) {
          const now = ev.timeStamp || performance.now();
          const dt = Math.max(1, now - lastMoveTs.current);
          lastMoveTs.current = now;
          // Recent-weighted average so the release velocity tracks the end
          // of the swipe, not its whole history.
          flingVelocity.current =
            0.7 * (deltaProgress / dt) + 0.3 * flingVelocity.current;
        }
      }
    };

    const endDrag = (e: PointerEvent) => {
      const wasDragging = dragging.current;
      dragging.current = false;
      el.style.cursor = "";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

      if (
        wasDragging &&
        e.pointerType !== "mouse" &&
        !reducedMotion &&
        !cardOpenRef.current
      ) {
        flingVelocity.current = Math.max(
          -MAX_FLING_VELOCITY,
          Math.min(MAX_FLING_VELOCITY, flingVelocity.current)
        );
        if (Math.abs(flingVelocity.current) > MIN_FLING_VELOCITY) startFling();
        else flingVelocity.current = 0;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return () => {
      stopFling();
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
    };
  }, [reducedMotion]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[100svh] w-full cursor-grab select-none overflow-hidden bg-paper-warm"
      style={{ touchAction: unlocked ? "pan-y" : "none" }}
    >
      <RoomCanvas
        floorId={floorId}
        progressRef={progressRef}
        pointerRef={pointerRef}
        onLoaded={onLoaded}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />

      {sceneReady && (
        <>
          <Hotspots
            floor={getFloor(floorId)}
            progressRef={progressRef}
            activeId={activeHotspot?.id ?? null}
            onOpen={openHotspot}
          />
          <GalleryChrome
            progressRef={progressRef}
            hintVisible={hintVisible && !reducedMotion}
          />
          <StairsPrompt
            current={floorId}
            progressRef={progressRef}
            onSelect={changeFloor}
          />
        </>
      )}

      <ProductPanel hotspot={activeHotspot} onClose={() => setActiveHotspot(null)} />

      {/* Warm plate that covers every floor swap. */}
      <motion.div
        className="absolute inset-0 z-50 bg-paper-warm"
        initial={false}
        animate={{ opacity: veiled ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: veiled ? "auto" : "none" }}
      />
    </section>
  );
}
