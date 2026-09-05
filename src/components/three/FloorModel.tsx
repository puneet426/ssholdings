"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { DRACO_PATH, type GalleryFloor } from "@/lib/three/gallery";

interface FloorModelProps {
  floor: GalleryFloor;
}

/**
 * One first-person gallery shell. Draco-compressed, WebP textures embedded,
 * lighting baked into the maps — so we barely light it, just tidy the
 * materials and loop whatever idle clips the shell ships with (sliding sample
 * sheets, a range hood settling, a door drifting) at low speed.
 */
export function FloorModel({ floor }: FloorModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(floor.url, DRACO_PATH);

  // Clone so re-mounting a floor after a visit starts from a clean graph.
  const model = useMemo(() => scene.clone(true), [scene]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh || Array.isArray(mesh.material)) return;
      mesh.frustumCulled = true;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const name = mat.name || "";

      // Glass keeps its transmission; emissive strips carry their own glow.
      // Everything else is fully baked — swap it for an unlit material so the
      // lighting painted into the texture shows exactly as authored instead of
      // being re-lit (and crushed) by the scene.
      if (/glass|transmission/i.test(name)) {
        mat.envMapIntensity = 0.6;
        mat.toneMapped = false;
        return;
      }
      if (/emissive/i.test(name)) {
        mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 1.4);
        mat.toneMapped = false;
        return;
      }

      const flatMat = new THREE.MeshBasicMaterial({
        map: mat.map ?? null,
        color: mat.map ? 0xffffff : mat.color,
        transparent: mat.transparent,
        opacity: mat.opacity,
        alphaMap: mat.alphaMap ?? null,
        alphaTest: mat.alphaTest,
        side: mat.side,
        toneMapped: false,
      });
      if (flatMat.map) flatMat.map.colorSpace = THREE.SRGBColorSpace;
      mesh.material = flatMat;
    });
  }, [model]);

  useEffect(() => {
    const started: THREE.AnimationAction[] = [];
    for (const name of floor.idleClips) {
      const action = actions[name];
      if (!action) continue;
      action.reset();
      action.setLoop(THREE.LoopPingPong, Infinity);
      action.clampWhenFinished = false;
      action.timeScale = 0.4;
      action.play();
      started.push(action);
    }
    return () => started.forEach((a) => a.stop());
  }, [actions, floor.idleClips]);

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}
