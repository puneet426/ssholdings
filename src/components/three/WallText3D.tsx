"use client";

import { useRef, type ComponentRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { GalleryFloor, WallText3D as WallTextEntry } from "@/lib/three/gallery";

interface WallText3DProps {
  floor: GalleryFloor;
  progressRef: MutableRefObject<number>;
}

// A line eases in as the rail nears its `at`, and out again past it. Capped
// per-entry (see `fadeWindowFor`) so neighbors never both hold nonzero
// opacity at once — two captions on screen together is the one thing this
// component exists to avoid.
const FADE_WINDOW = 0.09;

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

function WallTextItem({
  entry,
  fadeWindow,
  progressRef,
}: {
  entry: WallTextEntry;
  fadeWindow: number;
  progressRef: MutableRefObject<number>;
}) {
  const ref = useRef<ComponentRef<typeof Text>>(null);
  const fixedQuat = useRef<THREE.Quaternion | null>(
    entry.rotation
      ? new THREE.Quaternion().setFromEuler(new THREE.Euler(...entry.rotation, "XYZ"))
      : null
  );

  useFrame(({ camera }) => {
    const node = ref.current;
    if (!node) return;

    const vis = Math.max(
      0,
      Math.min(1, 1 - Math.abs(progressRef.current - entry.at) / fadeWindow)
    );
    node.fillOpacity = vis;
    node.visible = vis > 0.01;

    // A sticker on its wall holds a fixed rotation captured at placement
    // time; only entries without one fall back to always facing the
    // viewer (the old behavior, kept for anything not yet re-placed).
    if (fixedQuat.current) {
      node.quaternion.copy(fixedQuat.current);
    } else {
      node.quaternion.copy(camera.quaternion);
    }

    const distance = node.position.distanceTo(camera.position);
    const size = Math.min(
      MAX_FONT_SIZE,
      Math.max(MIN_FONT_SIZE, distance * SIZE_PER_DISTANCE)
    );
    node.fontSize = entry.fontSize ?? size;
    node.maxWidth = node.fontSize * 11;
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
      material-transparent
      material-toneMapped={false}
      material-depthTest={false}
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
export function WallText3D({ floor, progressRef }: WallText3DProps) {
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
        />
      ))}
    </>
  );
}
