"use client";

import { useState } from "react";

export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  tier: QualityTier;
  dpr: [number, number];
  shadowMapSize: number;
  enableShadows: boolean;
  antialias: boolean;
}

const QUALITY_PRESETS: Record<QualityTier, QualitySettings> = {
  high: {
    tier: "high",
    dpr: [1, 2],
    shadowMapSize: 2048,
    enableShadows: true,
    antialias: true,
  },
  medium: {
    tier: "medium",
    dpr: [1, 1.5],
    shadowMapSize: 1024,
    enableShadows: true,
    antialias: true,
  },
  low: {
    tier: "low",
    dpr: [1, 1],
    shadowMapSize: 512,
    enableShadows: false,
    antialias: false,
  },
};

function detectTier(): QualityTier {
  if (typeof window === "undefined") return "medium";

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const smallViewport = window.innerWidth < 768;

  if (isCoarsePointer && (smallViewport || cores <= 4 || (memory ?? 8) <= 4)) {
    return "low";
  }
  if (isCoarsePointer || cores <= 6) {
    return "medium";
  }
  return "high";
}

/**
 * Picks a rendering quality tier once based on device signals. Desktop/
 * powerful machines get full shadows + higher DPR; mobile/low-end devices
 * get a lighter configuration so the 3D hero stays smooth. This hook is
 * only ever mounted inside a dynamic(..., { ssr: false }) boundary, so
 * reading device signals in the initializer is safe.
 */
export function useDeviceQuality(): QualitySettings {
  const [settings] = useState<QualitySettings>(
    () => QUALITY_PRESETS[detectTier()]
  );

  return settings;
}
