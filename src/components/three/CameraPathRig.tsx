"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CAMERA_PATHS_URL, type GalleryFloor } from "@/lib/three/gallery";

interface CameraPathRigProps {
  floor: GalleryFloor;
  /** 0 → 1 along this floor's baked rail. Driven by scroll / drag / touch. */
  progressRef: MutableRefObject<number>;
  /** Normalised pointer, each axis ~ -1..1, for a small look-around parallax. */
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  /**
   * Written every frame with the damped progress actually driving the
   * camera — lags behind `progressRef` while easing catches up. Anything
   * that fades in sync with what's on screen (wall captions) should read
   * this instead of the raw scroll target.
   */
  smoothProgressRef?: MutableRefObject<number>;
  /** Fires once the rig has placed the camera for the first time. */
  onReady?: () => void;
}

// Heavier = silkier. Half-life in seconds for the eased scrub / pointer.
const PROGRESS_SMOOTHING = 0.5;
const POINTER_SMOOTHING = 0.32;
// World-space look-around the mouse is allowed (radians).
const YAW_RANGE = 0.05;
const PITCH_RANGE = 0.035;
// Drop frame hitches so a stutter never lurches the camera.
const MAX_DELTA = 1 / 30;

function damp(current: number, target: number, smoothing: number, delta: number) {
  return THREE.MathUtils.damp(current, target, 1 / smoothing, delta);
}

/**
 * Rides the baked camera rail for the active floor. `camera_paths.glb` holds an
 * animated empty per floor (translation + rotation); we scrub that clip's time
 * from the eased scroll progress and copy the empty's world transform onto the
 * live camera, then add a damped mouse look-around on top.
 */
export function CameraPathRig({
  floor,
  progressRef,
  pointerRef,
  reducedMotion,
  smoothProgressRef,
  onReady,
}: CameraPathRigProps) {
  const camera = useThree((s) => s.camera);
  const { scene, animations } = useGLTF(CAMERA_PATHS_URL);

  // One mixer per mounted rig; the component is re-keyed on floor change.
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  const clip = useMemo(
    () => animations.find((a) => a.name === floor.clipName) ?? animations[0],
    [animations, floor.clipName]
  );
  const empty = useMemo(
    () => scene.getObjectByName(floor.emptyName) ?? null,
    [scene, floor.emptyName]
  );

  const smoothProgress = useRef(0);
  const smoothPointer = useRef({ x: 0, y: 0 });
  const announced = useRef(false);

  const tmpPos = useRef(new THREE.Vector3());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpScale = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    smoothProgress.current = 0;
    smoothPointer.current = { x: 0, y: 0 };
    announced.current = false;

    const action = mixer.clipAction(clip);
    action.reset();
    action.play();
    action.paused = false;

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = floor.fov;
      camera.near = 0.1;
      camera.far = 1000;
      camera.updateProjectionMatrix();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheClip(clip);
    };
  }, [mixer, clip, camera, floor.fov]);

  useFrame((_, rawDelta) => {
    if (!empty) return;
    const delta = Math.min(rawDelta, MAX_DELTA);
    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);

    if (reducedMotion) {
      smoothProgress.current = target;
      smoothPointer.current.x = 0;
      smoothPointer.current.y = 0;
    } else {
      smoothProgress.current = damp(
        smoothProgress.current,
        target,
        PROGRESS_SMOOTHING,
        delta
      );
      smoothPointer.current.x = damp(
        smoothPointer.current.x,
        pointerRef.current.x,
        POINTER_SMOOTHING,
        delta
      );
      smoothPointer.current.y = damp(
        smoothPointer.current.y,
        pointerRef.current.y,
        POINTER_SMOOTHING,
        delta
      );
    }

    if (smoothProgressRef) smoothProgressRef.current = smoothProgress.current;

    // Scrub. Keep just inside the clip so LoopRepeat never wraps to the start.
    const dur = clip.duration;
    mixer.setTime(THREE.MathUtils.clamp(smoothProgress.current, 0, 1) * dur * 0.999);

    empty.updateWorldMatrix(true, false);
    empty.matrixWorld.decompose(tmpPos.current, tmpQuat.current, tmpScale.current);
    camera.position.copy(tmpPos.current);
    camera.quaternion.copy(tmpQuat.current);

    // Mouse look-around, applied in the camera's own frame.
    euler.current.set(0, 0, 0);
    euler.current.setFromQuaternion(camera.quaternion, "YXZ");
    euler.current.y -= smoothPointer.current.x * YAW_RANGE;
    euler.current.x -= smoothPointer.current.y * PITCH_RANGE;
    camera.quaternion.setFromEuler(euler.current);

    if (!announced.current) {
      announced.current = true;
      onReady?.();
    }
  });

  return null;
}

useGLTF.preload(CAMERA_PATHS_URL);
