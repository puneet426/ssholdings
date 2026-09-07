"use client";

import { Suspense, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, AdaptiveDpr, Preload } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { FloorModel } from "./FloorModel";
import { CameraPathRig } from "./CameraPathRig";
import { WallText3D } from "./WallText3D";
import { DevPlacementHelper } from "./DevPlacementHelper";
import { LoadingOverlay } from "./LoadingOverlay";
import { ModelErrorBoundary } from "./ModelErrorBoundary";
import { useDeviceQuality } from "@/hooks/useDeviceQuality";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  ENV_MAP_URL,
  MOBILE_FOV_SCALE,
  getFloor,
  type FloorId,
} from "@/lib/three/gallery";

interface RoomSceneProps {
  floorId: FloorId;
  progressRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  onLoaded?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function RoomScene({
  floorId,
  progressRef,
  pointerRef,
  onLoaded,
}: RoomSceneProps) {
  const quality = useDeviceQuality();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const floor = getFloor(floorId);
  // Phones get a wider lens so the baked walk-through frames ~15% more of
  // each room — the desktop framing crops the wall captions on a narrow
  // screen. Desktop is untouched.
  const fov = isMobile ? floor.fov * MOBILE_FOV_SCALE : floor.fov;

  // `ready` gates the crossfade from the loading plate to the scene. Tracked
  // per-floor (not a boolean we'd have to reset) so a floor swap re-shows the
  // plate until the new rig has placed the camera.
  const [readyFloor, setReadyFloor] = useState<FloorId | null>(null);
  const ready = readyFloor === floorId;
  // Wall captions fade with the camera's actual (damped) position, not the
  // raw scroll target, so they never light up ahead of where the camera has
  // physically arrived — see CameraPathRig's `smoothProgressRef`.
  const smoothProgressRef = useRef(0);
  useEffect(() => {
    if (ready) onLoaded?.();
  }, [ready, onLoaded]);

  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <Canvas
          flat
          dpr={quality.dpr}
          gl={{
            antialias: quality.antialias,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
          }}
          camera={{ fov, near: 0.1, far: 1000 }}
        >
          <color attach="background" args={["#0b0a09"]} />
          <ambientLight intensity={0.12} />

          <Suspense fallback={null}>
            {/* Re-key the whole floor subtree so a swap fully tears down the
                previous shell, its idle mixers and its camera rig. */}
            <group key={floorId}>
              <FloorModel floor={floor} />
              <CameraPathRig
                floor={floor}
                progressRef={progressRef}
                pointerRef={pointerRef}
                reducedMotion={reducedMotion}
                fov={fov}
                smoothProgressRef={smoothProgressRef}
                onReady={() => setReadyFloor(floorId)}
              />
              <WallText3D
                floor={floor}
                progressRef={smoothProgressRef}
                targetProgressRef={progressRef}
                isMobile={isMobile}
              />
              <DevPlacementHelper progressRef={smoothProgressRef} />
            </group>
            {/* Reflections for the glass / polished bits. Non-critical — if
                the map ever fails to load, the scene carries on without it. */}
            <ModelErrorBoundary fallback={() => null}>
              <Environment files={ENV_MAP_URL} environmentIntensity={0.25} />
            </ModelErrorBoundary>
            <Preload all />
          </Suspense>

          <AdaptiveDpr pixelated />
        </Canvas>
      </motion.div>

      <AnimatePresence>{!ready && <LoadingOverlay />}</AnimatePresence>
    </div>
  );
}
