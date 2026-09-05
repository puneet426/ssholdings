"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DevPlacementHelperProps {
  progressRef: MutableRefObject<number>;
}

/**
 * Dev-only tuning aid for WallText3D placement. Hover a wall in the running
 * scene and press "P" — logs a ready-to-paste
 * `{ at, position: [x, y, z], rotation: [x, y, z] }` using the current rail
 * progress and a raycast hit under the pointer: position is nudged slightly
 * off the surface so the text doesn't end up embedded in the wall, and
 * rotation aligns the text's face to the surface normal so it sits flush
 * against the wall like a sticker instead of billboarding to the camera.
 * No-op in production.
 */
export function DevPlacementHelper({ progressRef }: DevPlacementHelperProps) {
  const { camera, scene } = useThree();
  const ndc = useRef(new THREE.Vector2(0, 0));
  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const onMove = (e: PointerEvent) => {
      ndc.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "p") return;

      raycaster.current.setFromCamera(ndc.current, camera);
      const hit = raycaster.current
        .intersectObjects(scene.children, true)
        .find((h) => (h.object as THREE.Mesh).isMesh);

      if (!hit || !hit.face) {
        console.log("[wall-text] no surface under the pointer — hover a wall first");
        return;
      }

      // Nudge off the surface along its normal, toward the camera's side,
      // so the text sits just in front of the wall instead of inside it.
      const worldNormal = hit.face.normal
        .clone()
        .transformDirection(hit.object.matrixWorld);
      if (worldNormal.dot(new THREE.Vector3().subVectors(camera.position, hit.point)) < 0) {
        worldNormal.negate();
      }
      const p = hit.point.clone().addScaledVector(worldNormal, 0.08);

      // Text faces +Z by default (troika/drei) — aligning it to the wall's
      // outward normal instead of the camera makes it sit flush like a
      // sticker, holding that angle as the camera moves past.
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        worldNormal
      );
      const euler = new THREE.Euler().setFromQuaternion(quat, "XYZ");

      console.log(
        `[wall-text] { at: ${progressRef.current.toFixed(2)}, position: [${p.x.toFixed(
          2
        )}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}], rotation: [${euler.x.toFixed(
          2
        )}, ${euler.y.toFixed(2)}, ${euler.z.toFixed(2)}] }`
      );
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [camera, scene, progressRef]);

  return null;
}
