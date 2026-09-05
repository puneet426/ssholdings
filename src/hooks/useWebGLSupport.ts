"use client";

import { useState } from "react";

function detectWebGLSupport(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Detects whether WebGL is available. Resolved once, synchronously, on
 * first render of the (client-only) component that uses it — this hook is
 * only ever mounted inside a dynamic(..., { ssr: false }) boundary.
 */
export function useWebGLSupport(): boolean | null {
  const [supported] = useState(detectWebGLSupport);
  return supported;
}
