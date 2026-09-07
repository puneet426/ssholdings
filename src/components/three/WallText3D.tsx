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

// A line eases in as the rail nears its `at`, and out again past it. Windows
// are trimmed against their neighbours (see `spans`) so two captions never
// both hold nonzero opacity — two on screen together is the one thing this
// component exists to avoid.
const FADE_WINDOW = 0.09;

// Sticker, not strobe: hold the caption at full opacity through most of its
// window and only ramp over the outer edge, so it stays planted on the wall
// while you scroll past rather than pulsing in and out.
const HOLD_FRACTION = 0.65;
// The default window split into its two parts: the opaque middle and the ramp
// on either side of it.
const HOLD_HALF = FADE_WINDOW * HOLD_FRACTION;
const FADE_EDGE = FADE_WINDOW * (1 - HOLD_FRACTION);

/** Resolved rail range for one caption: transparent before `in0`, ramping to
 *  opaque at `in1`, planted until `out0`, back to transparent at `out1`. */
interface Span {
  in0: number;
  in1: number;
  out0: number;
  out1: number;
}

/**
 * Turn the entries' `at` / `hold` into non-overlapping spans.
 *
 * A caption's opaque stretch is its `hold` when it declares one — the wall it
 * is stuck to is only square in frame over that part of the walk — otherwise
 * a symmetric window around `at`. Where two of those stretches crowd each
 * other the pair is split at the midpoint with a ramp's worth of clearance on
 * each side, so one caption has always finished fading out before the next
 * starts fading in. A declared `hold` is never trimmed — space is taken from
 * the default windows around it.
 */
function spans(entries: WallTextEntry[]): Span[] {
  const holds: [number, number][] = entries.map((e) =>
    e.hold ? [e.hold[0], e.hold[1]] : [e.at - HOLD_HALF, e.at + HOLD_HALF]
  );
  // How far trimming may go: a declared `hold` is kept whole, while a default
  // window may collapse all the way to its `at`.
  const keep: [number, number][] = entries.map((e) =>
    e.hold ? [e.hold[0], e.hold[1]] : [e.at, e.at]
  );

  for (let i = 1; i < holds.length; i++) {
    const prev = holds[i - 1];
    const cur = holds[i];
    if (cur[0] - prev[1] >= 2 * FADE_EDGE) continue;
    const mid = (prev[1] + cur[0]) / 2;
    prev[1] = Math.max(keep[i - 1][1], mid - FADE_EDGE);
    cur[0] = Math.min(keep[i][0], mid + FADE_EDGE);
  }

  return holds.map(([h0, h1], i) => {
    // Ramps take at most half the gap to the neighbouring hold, so the two
    // meet at zero opacity instead of crossing over.
    const before = i > 0 ? (h0 - holds[i - 1][1]) / 2 : Infinity;
    const after =
      i < holds.length - 1 ? (holds[i + 1][0] - h1) / 2 : Infinity;
    return {
      in0: h0 - Math.max(0, Math.min(FADE_EDGE, before)),
      in1: h0,
      out0: h1,
      out1: h1 + Math.max(0, Math.min(FADE_EDGE, after)),
    };
  });
}

/** Trapezoid: 0 outside the span, 1 across its opaque middle, smoothstepped
 *  over each ramp — the caption sticks in place instead of flashing past. */
function opacityAt(progress: number, span: Span): number {
  if (progress <= span.in0 || progress >= span.out1) return 0;
  if (progress >= span.in1 && progress <= span.out0) return 1;
  const t =
    progress < span.in1
      ? (progress - span.in0) / (span.in1 - span.in0)
      : (span.out1 - progress) / (span.out1 - span.out0);
  return t * t * (3 - 2 * t);
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
// Last-resort width guard: however the size works out, the laid-out block is
// scaled down until it spans at most this much of the frame at its distance.
// It is what keeps a caption written with its own line breaks — which opts
// out of auto-wrapping — from running off the sides of a phone.
const MAX_FRAME_FILL = 0.82;

/** The depth-state fields this component writes on troika's render materials. */
type WallTextMaterial = THREE.Material & {
  depthTest: boolean;
  depthWrite: boolean;
  polygonOffset: boolean;
  polygonOffsetFactor: number;
  polygonOffsetUnits: number;
};

function WallTextItem({
  entry,
  span,
  progressRef,
  isMobile = false,
}: {
  entry: WallTextEntry;
  span: Span;
  progressRef: MutableRefObject<number>;
  isMobile?: boolean;
}) {
  const ref = useRef<ComponentRef<typeof Text>>(null);
  // Lettering painted on a real surface rather than a caption floating in
  // front of the room: depth-tested, and never resized to fit the frame.
  const isDecal = !!entry.decal;
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

    const vis = opacityAt(progressRef.current, span);
    node.fillOpacity = vis;
    node.outlineOpacity = vis;
    node.strokeOpacity = vis;
    node.visible = vis > 0.01;

    // Depth behaviour, written onto troika's real render materials. Once an
    // outline is set, `node.material` is a [outline, fill] array, so the
    // declarative `material-depthTest` prop lands on the array and is
    // ignored — it has to be set per material here.
    //
    // A plain caption draws always on top: legibility beats occlusion, so no
    // wall corner or shelf between it and the camera can slice through
    // mid-sentence. A `decal` is the opposite — it is lettering ON its panel,
    // so it keeps depth testing and anything nearer (the pillar the camera
    // walks behind) hides it instead of having the words painted across it.
    // Depth WRITING stays off either way: the text is transparent, and
    // writing depth would punch its glyph boxes into whatever draws after.
    // polygonOffset pulls a decal a hair towards the camera in depth so it
    // cannot z-fight the surface it sits on.
    const mtl = node.material as WallTextMaterial | WallTextMaterial[];
    for (const m of Array.isArray(mtl) ? mtl : [mtl]) {
      if (m.depthTest !== isDecal) m.depthTest = isDecal;
      if (m.depthWrite) m.depthWrite = false;
      if (isDecal && !m.polygonOffset) {
        m.polygonOffset = true;
        m.polygonOffsetFactor = -1;
        m.polygonOffsetUnits = -1;
      }
    }

    if (fixedQuat.current) node.quaternion.copy(fixedQuat.current);
    else node.quaternion.copy(camera.quaternion);

    const distance = node.position.distanceTo(camera.position);
    const auto = Math.min(
      MAX_FONT_SIZE,
      Math.max(MIN_FONT_SIZE, distance * SIZE_PER_DISTANCE)
    );
    // A phone override stands on its own: it is a size chosen against a real
    // surface, so nothing else may scale it.
    let fontSize =
      isMobile && entry.fontSizeMobile !== undefined
        ? entry.fontSizeMobile
        : (entry.fontSize ?? auto) *
          (entry.fontScale ?? 1) *
          (isMobile ? MOBILE_FONT_SCALE : 1);

    // Both width caps below work off the block troika laid out last frame. Its
    // width in ems holds steady as the size changes (the wrap width is itself
    // in ems), so dividing a target width by it settles in a frame instead of
    // oscillating.
    const laidOut = node.textRenderInfo?.blockBounds;
    const ems =
      laidOut && node.fontSize > 0 ? (laidOut[2] - laidOut[0]) / node.fontSize : 0;

    // Trim to fit the frame — but not for a decal, which was sized against the
    // panel it is painted on: shrinking it as the camera closes in would be
    // exactly the sliding-around that flag exists to stop.
    if (ems > 0 && !isDecal && "isPerspectiveCamera" in camera) {
      const cam = camera as THREE.PerspectiveCamera;
      const halfFov = THREE.MathUtils.degToRad(cam.fov) / 2;
      const frame = 2 * distance * Math.tan(halfFov) * cam.aspect;
      fontSize = Math.min(fontSize, (frame * MAX_FRAME_FILL) / ems);
    }

    // Fit the surface. `fitWidth` is a hard ceiling in world units — the width
    // of the panel the lettering has to stay inside — so the real glyph
    // metrics, not an estimate of them, decide the size. Camera-independent,
    // so it never animates.
    if (ems > 0 && entry.fitWidth) {
      fontSize = Math.min(fontSize, entry.fitWidth / ems);
    }
    node.fontSize = fontSize;

    // Text with its own hard line breaks is laid out as written — no auto-wrap
    // on top, so "SS Holdings\nBuilders in Visakhapatnam" stays two lines.
    node.maxWidth = entry.text.includes("\n")
      ? Infinity
      : node.fontSize * (isMobile ? MAX_WIDTH_EMS_MOBILE : MAX_WIDTH_EMS);
  });

  // Phones can lift a caption to its own anchor (e.g. the opening title onto
  // the ceiling band) while desktop keeps the wall placement.
  const position =
    isMobile && entry.positionMobile ? entry.positionMobile : entry.position;

  return (
    <Text
      ref={ref}
      position={position}
      renderOrder={999}
      color="#f7f5f2"
      anchorX="center"
      anchorY="middle"
      textAlign="center"
      fillOpacity={0}
      // Faux-bold: a same-colour stroke pass fattens the glyphs since the
      // default troika face has no bold weight bundled.
      strokeWidth={entry.bold ? "2.5%" : 0}
      strokeColor="#f7f5f2"
      strokeOpacity={0}
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
  const resolved = spans(entries);
  return (
    <>
      {entries.map((entry, i) => (
        <WallTextItem
          key={entry.id}
          entry={entry}
          span={resolved[i]}
          progressRef={progressRef}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}
