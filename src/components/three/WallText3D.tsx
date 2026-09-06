"use client";

import { useRef, type ComponentRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { GalleryFloor, WallText3D as WallTextEntry } from "@/lib/three/gallery";

interface WallText3DProps {
  floor: GalleryFloor;
  progressRef: MutableRefObject<number>;
  /** Phone-width viewport — captions shrink a touch and wrap sooner so a
   *  long line like "SS Holdings Builders in Visakhapatnam" isn't cropped
   *  by the narrow screen. */
  isMobile?: boolean;
}

// A line eases in as the rail nears its `at`, and out again past it. Capped
// per-entry (see `fadeWindowFor`) so neighbors never both hold nonzero
// opacity at once — two captions on screen together is the one thing this
// component exists to avoid.
const FADE_WINDOW = 0.09;

// Sticker, not strobe: hold the caption at full opacity through most of its
// window and only ramp over the outer edge, so it stays planted on the wall
// while you scroll past rather than pulsing in and out. Fraction of the
// half-window spent fully opaque before the ramp begins.
const HOLD_FRACTION = 0.65;

/** Half-window for `entry`, shrunk so it never reaches past the midpoint to
 *  its nearest neighbor on either side — keeps consecutive captions from
 *  ever being visible at the same time regardless of how closely spaced
 *  their `at` values are. */
function fadeWindowFor(entries: WallTextEntry[], index: number): number {
  let half = FADE_WINDOW;
  if (index > 0) {
    half = Math.min(half, (entries[index].at - entries[index - 1].at) / 2);
  }
  if (index < entries.length - 1) {
    half = Math.min(half, (entries[index + 1].at - entries[index].at) / 2);
  }
  return half;
}

// How big the text reads on screen, independent of how near/far its anchor
// point happens to be from the camera at that moment — world-unit font size
// is derived from distance every frame instead of being fixed, so nothing
// ever balloons to fill the screen (too close) or shrinks to nothing (too
// far). Tuned as a fraction of distance; clamp keeps both ends sane.
const SIZE_PER_DISTANCE = 0.032;
const MIN_FONT_SIZE = 0.14;
const MAX_FONT_SIZE = 0.42;

// How wide a caption grows before it wraps, as a multiple of its font size.
// Phones wrap sooner so long lines break into narrower rows that clear the
// screen edges even with the wider mobile FOV.
const MAX_WIDTH_EMS = 11;
const MAX_WIDTH_EMS_MOBILE = 7.5;
// Phones also trim the font a touch so a wrapped 2–3 line caption still fits
// between floor and ceiling.
const MOBILE_FONT_SCALE = 0.9;

function WallTextItem({
  entry,
  fadeWindow,
  progressRef,
  isMobile = false,
}: {
  entry: WallTextEntry;
  fadeWindow: number;
  progressRef: MutableRefObject<number>;
  isMobile?: boolean;
}) {
  const ref = useRef<ComponentRef<typeof Text>>(null);
  // A caption with an explicit `rotation` is a sticker: it holds that fixed
  // angle flat against its wall and never swims as the camera passes. One
  // without a `rotation` falls back to facing the viewer head-on — used for
  // the opening title, which should read instantly however you enter.
  const fixedQuat = useRef<THREE.Quaternion | null>(
    entry.rotation
      ? new THREE.Quaternion().setFromEuler(
          new THREE.Euler(...entry.rotation, "XYZ")
        )
      : null
  );

  useFrame(({ camera }) => {
    const node = ref.current;
    if (!node) return;

    // Trapezoid: 1 through the inner HOLD_FRACTION of the window, then a
    // smoothstepped ramp to 0 at the edge — the caption sticks in place
    // instead of flashing past.
    const d = Math.abs(progressRef.current - entry.at) / fadeWindow;
    let vis: number;
    if (d >= 1) vis = 0;
    else if (d <= HOLD_FRACTION) vis = 1;
    else {
      const t = 1 - (d - HOLD_FRACTION) / (1 - HOLD_FRACTION);
      vis = t * t * (3 - 2 * t);
    }
    node.fillOpacity = vis;
    node.outlineOpacity = vis;
    node.visible = vis > 0.01;

    // Force "always on top" on troika's real render materials. Once an
    // outline is set, `node.material` is a [outline, fill] array, so the
    // declarative `material-depthTest` prop lands on the array and is
    // ignored — the caption would then be occluded by any wall, pillar or
    // shelf between it and the camera. Set it on each material here instead.
    const mtl = node.material as
      | (THREE.Material & { depthTest: boolean; depthWrite: boolean })
      | (THREE.Material & { depthTest: boolean; depthWrite: boolean })[];
    for (const m of Array.isArray(mtl) ? mtl : [mtl]) {
      if (m.depthTest) m.depthTest = false;
      if (m.depthWrite) m.depthWrite = false;
    }

    if (fixedQuat.current) node.quaternion.copy(fixedQuat.current);
    else node.quaternion.copy(camera.quaternion);

    const distance = node.position.distanceTo(camera.position);
    const size = Math.min(
      MAX_FONT_SIZE,
      Math.max(MIN_FONT_SIZE, distance * SIZE_PER_DISTANCE)
    );
    node.fontSize = (entry.fontSize ?? size) * (isMobile ? MOBILE_FONT_SCALE : 1);
    node.maxWidth = node.fontSize * (isMobile ? MAX_WIDTH_EMS_MOBILE : MAX_WIDTH_EMS);
  });

  return (
    <Text
      ref={ref}
      position={entry.position}
      renderOrder={999}
      color="#f7f5f2"
      anchorX="center"
      anchorY="middle"
      textAlign="center"
      fillOpacity={0}
      // A dark keyline so the lettering reads as a decal stuck on the wall
      // and stays legible over any surface behind it.
      outlineWidth="4%"
      outlineBlur="8%"
      outlineColor="#0b0a09"
      outlineOpacity={0}
      material-transparent
      material-toneMapped={false}
    >
      {entry.text}
    </Text>
  );
}

/**
 * Real 3D captions mounted at wall coordinates — moves and scales with real
 * perspective as the camera passes, unlike a screen-space overlay. Depth
 * testing is off so a wall corner, a shelf bar, or any other geometry that
 * happens to sit between the camera and the anchor point can never slice
 * through mid-sentence — legibility wins over strict physical occlusion.
 * Each fades in/out around its own rail progress.
 */
export function WallText3D({ floor, progressRef, isMobile }: WallText3DProps) {
  if (!floor.wallTexts3D?.length) return null;
  const entries = floor.wallTexts3D;
  return (
    <>
      {entries.map((entry, i) => (
        <WallTextItem
          key={entry.id}
          entry={entry}
          fadeWindow={fadeWindowFor(entries, i)}
          progressRef={progressRef}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}
