"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGalleryAudio } from "@/hooks/useGalleryAudio";
import { ProductPanel } from "@/components/gallery/ProductPanel";
import { FloorsPanel } from "@/components/gallery/FloorsPanel";
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
// Pixels of pointer / touch drag to travel the whole rail.
const DRAG_DIVISOR = 3400;
// Most the target may move in one event, so a hard fling can't tear the
// eased camera off the front of the rail.
const MAX_STEP = 0.03;

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

  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const hintDismissed = useRef(false);
  const unlockedRef = useRef(false);
  const veilTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardOpenRef = useRef(false);

  const [floorId, setFloorId] = useState<FloorId>(DEFAULT_FLOOR);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [floorsOpen, setFloorsOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [dragUnlocked, setDragUnlocked] = useState(false);
  const [veiled, setVeiled] = useState(false);

  const unlocked = dragUnlocked || reducedMotion;

  useEffect(() => {
    cardOpenRef.current = activeHotspot !== null;
  }, [activeHotspot]);

  // Cover the swap with a warm plate, flip state behind it, then let the new
  // scene's own loader lift it (with a failsafe).
  const changeFloor = useCallback(
    (id: FloorId) => {
      setFloorsOpen(false);
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
      const step = Math.max(-MAX_STEP, Math.min(MAX_STEP, deltaProgress));
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
      bump(e.deltaY / WHEEL_DIVISOR);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (cardOpenRef.current || !fromScene(e)) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.pointerType !== "mouse" && unlockedRef.current) return;
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragging.current) {
        const dx = lastX.current - e.clientX;
        const dy = lastY.current - e.clientY;
        lastX.current = e.clientX;
        lastY.current = e.clientY;
        const delta = e.pointerType === "mouse" ? dx : dy;
        bump(delta / DRAG_DIVISOR);
      } else {
        pointerRef.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        };
      }
    };

    const endDrag = (e: PointerEvent) => {
      dragging.current = false;
      el.style.cursor = "";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return () => {
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
            muted={audio.muted}
            onToggleSound={audio.toggleMuted}
          />
          <FloorsPanel
            open={floorsOpen}
            current={floorId}
            onToggle={() => setFloorsOpen((v) => !v)}
            onSelect={changeFloor}
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
