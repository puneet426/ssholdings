"use client";

import {
  useMemo,
  useRef,
  type ComponentRef,
  type MutableRefObject,
} from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { GalleryFloor, WallText3D as WallTextEntry } from "@/lib/three/gallery";

interface WallText3DProps {
  floor: GalleryFloor;
  /** The eased progress actually driving the camera — what stickers fade on. */
  progressRef: MutableRefObject<number>;
  /**
   * The raw scroll target, ahead of the eased camera. A `vanishBy` caption
   * fades on this instead, so it is gone before the room visibly moves.
   * Defaults to `progressRef`.
   */
  targetProgressRef?: MutableRefObject<number>;
  /** Phone-width viewport — captions shrink a touch and wrap sooner so a
   *  long line like "SS Holdings Builders in Visakhapatnam" isn't cropped
   *  by the narrow screen. */
  isMobile?: boolean;
}

// A caption is a sticker on its wall: it is there whenever the wall is, and
// gone only when the wall is — out of frame, turned away, or hidden behind
// something. So its opacity is not a timer around `at`; it is 1 across the
// entry's `visible` range, which is the measured stretch of the rail over
// which that wall is actually in view, and 0 outside it. Two stickers on
// screen at once is normal — two walls in view is what a room looks like —
// so there is no handover, no crossfade, and nothing is ever taken off a wall
// you can still see.
//
// Half the fallback window for an entry with no measured `visible` range —
// centred on its `at`, and only there until the range is measured.
const HOLD_HALF = 0.0585;

// The ramp at each edge of the range. It is not a fade you are meant to
// notice: the range ends where the wall leaves the frame or goes behind
// something, so this only softens the last couple of frames against a
// one-frame pop. Anything longer would be visible as the caption dimming while
// its wall is still there — the one thing a sticker must never do.
const FADE_EDGE = 0.005;

/** Resolved rail range for one caption: transparent before `in0`, ramping to
 *  opaque at `in1`, planted until `out0`, back to transparent at `out1`. */
interface Span {
  in0: number;
  in1: number;
  out0: number;
  out1: number;
}

/** One span per entry, straight from its `visible` range — no trimming
 *  against neighbours, since overlap is allowed. */
function spans(entries: WallTextEntry[]): Span[] {
  return entries.map((e) => {
    const [v0, v1] = e.visible ?? [e.at - HOLD_HALF, e.at + HOLD_HALF];
    return { in0: v0 - FADE_EDGE, in1: v0, out0: v1, out1: v1 + FADE_EDGE };
  });
}

/** 0 outside the span, 1 across it, smoothstepped over the two short edge
 *  ramps. */
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
  targetProgressRef,
  isMobile = false,
}: {
  entry: WallTextEntry;
  span: Span;
  progressRef: MutableRefObject<number>;
  targetProgressRef: MutableRefObject<number>;
  isMobile?: boolean;
}) {
  const ref = useRef<ComponentRef<typeof Text>>(null);
  // Lettering painted on a real surface rather than a caption floating in
  // front of the room: depth-tested, and never resized to fit the frame.
  const isDecal = !!entry.decal;
  // Phones can be given their own line breaks (see `textMobile`).
  const text = isMobile && entry.textMobile ? entry.textMobile : entry.text;
  // A caption with an explicit `rotation` is a sticker: it holds that fixed
  // angle flat against its wall and never swims as the camera passes. One
  // without a `rotation` falls back to facing the viewer head-on. Derived
  // from the entry, not captured once at mount: a ref initialised on first
  // render kept a stale value when the entry's rotation was edited under a
  // running dev session, leaving that caption billboarding (swinging to face
  // the camera) until a hard reload — which reads as the text "moving".
  const [rx, ry, rz] = entry.rotation ?? [0, 0, 0];
  const hasRotation = !!entry.rotation;
  // A screen-locked caption is carried in the camera's own frame rather than
  // left at a point in the room — see `screenLocked` in gallery.ts for why the
  // opening title has to be. Resolved to a vector once, per viewport.
  const lockOffset = useMemo(() => {
    const o = entry.screenLocked;
    if (!o) return null;
    const [x, y, z] = (isMobile && o.offsetMobile) || o.offset;
    return new THREE.Vector3(x, y, z);
  }, [entry.screenLocked, isMobile]);
  const fixedQuat = useMemo(
    () =>
      hasRotation
        ? new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz, "XYZ"))
        : null,
    [hasRotation, rx, ry, rz]
  );


  useFrame(({ camera }) => {
    const node = ref.current;
    if (!node) return;

    // A resting-view caption (`vanishBy`) is only ever shown with the camera
    // at rest. It goes on the scroll *target*, which jumps on the first wheel
    // notch while the camera is still easing out of rest — so it has gone
    // before the room visibly moves — and it comes back only once BOTH the
    // target and the eased camera are back at the start, so it never rides
    // the last of the ease-in either. Everything else fades on the eased
    // progress, in step with what is on screen.
    let vis: number;
    if (entry.vanishBy) {
      const p = Math.max(targetProgressRef.current, progressRef.current);
      // Hold through the first 60% of the way to `vanishBy`, then fade over
      // the last 40% — a deliberate exit rather than dimming from the first
      // notch.
      const hold = entry.vanishBy * 0.6;
      const t = Math.min(1, Math.max(0, (p - hold) / (entry.vanishBy - hold)));
      vis = 1 - t * t * (3 - 2 * t);
    } else {
      vis = opacityAt(progressRef.current, span);
    }
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

    // Re-place a screen-locked caption at its camera-space offset every frame,
    // so it lands on identical pixels however the rig moves — the camera walk
    // and the mouse look-around both leave it alone. `updateMatrixWorld` first:
    // CameraPathRig writes the camera's position and quaternion in its own
    // useFrame and matrixWorld is otherwise only rebuilt at render time, so
    // without it the caption is placed against the PREVIOUS frame's camera —
    // sub-pixel at 60fps, hundreds of pixels in a throttled tab.
    if (lockOffset) {
      camera.updateMatrixWorld();
      node.position.copy(lockOffset).applyMatrix4(camera.matrixWorld);
    }

    if (fixedQuat) node.quaternion.copy(fixedQuat);
    else node.quaternion.copy(camera.quaternion);

    const distance = node.position.distanceTo(camera.position);
    const auto = Math.min(
      MAX_FONT_SIZE,
      Math.max(MIN_FONT_SIZE, distance * SIZE_PER_DISTANCE)
    );
    // A caption is "pinned" once it names a size of its own: that size is in
    // world units, so it scales with the wall behind it exactly like lettering
    // that is really painted there. A phone override stands on its own — it is
    // a size chosen against a real surface, so nothing else may scale it.
    const pinnedSize =
      isDecal ||
      (isMobile && entry.fontSizeMobile !== undefined) ||
      entry.fontSize !== undefined;
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

    // Trim to fit the frame — but only for a caption still being auto-sized.
    // This guard is proportional to camera distance, which is the point: it
    // holds a caption's *on-screen* size steady as you approach. That is the
    // opposite of what lettering on a wall does, so any caption that carries a
    // size of its own — a decal, or one with an explicit `fontSize` — must skip
    // it, or the size would be quietly re-derived every frame and the words
    // would swim and breathe over a wall that is itself growing.
    if (ems > 0 && !pinnedSize && "isPerspectiveCamera" in camera) {
      const cam = camera as THREE.PerspectiveCamera;
      const halfFov = THREE.MathUtils.degToRad(cam.fov) / 2;
      const frame = 2 * distance * Math.tan(halfFov) * cam.aspect;
      fontSize = Math.min(fontSize, (frame * MAX_FRAME_FILL) / ems);
    }

    // Fit the surface. `fitWidth` is a hard ceiling in world units — the width
    // of the panel the lettering has to stay inside — so the real glyph
    // metrics, not an estimate of them, decide the size. Camera-independent,
    // so it never animates. On a phone it doubles as the guarantee that a
    // pinned caption clears the narrow frame, since the frame-fill trim that
    // would otherwise catch it is off: `fitWidthMobile` is set to 82% of the
    // frame at the caption's closest approach along the rail.
    const fitWidth =
      (isMobile ? entry.fitWidthMobile : undefined) ?? entry.fitWidth;
    if (ems > 0 && fitWidth) {
      fontSize = Math.min(fontSize, fitWidth / ems);
    }
    node.fontSize = fontSize;

    // Text with its own hard line breaks is laid out as written — no auto-wrap
    // on top, so "SS Holdings\nBuilders in Visakhapatnam" stays two lines.
    node.maxWidth = text.includes("\n")
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
      {text}
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
export function WallText3D({
  floor,
  progressRef,
  targetProgressRef,
  isMobile,
}: WallText3DProps) {
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
          targetProgressRef={targetProgressRef ?? progressRef}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}
