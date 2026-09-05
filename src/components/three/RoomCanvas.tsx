"use client";

import { useCallback, useState, type MutableRefObject } from "react";
import { useGLTF } from "@react-three/drei";
import { RoomScene } from "./RoomScene";
import { RoomFallback } from "./RoomFallback";
import { ModelErrorBoundary } from "./ModelErrorBoundary";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { CAMERA_PATHS_URL, FLOORS, type FloorId } from "@/lib/three/gallery";

interface RoomCanvasProps {
  floorId: FloorId;
  progressRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  onLoaded?: () => void;
}

export function RoomCanvas({
  floorId,
  progressRef,
  pointerRef,
  onLoaded,
}: RoomCanvasProps) {
  const webglSupported = useWebGLSupport();
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback((boundaryRetry: () => void) => {
    useGLTF.clear(CAMERA_PATHS_URL);
    FLOORS.forEach((f) => useGLTF.clear(f.url));
    setAttempt((n) => n + 1);
    boundaryRetry();
  }, []);

  if (webglSupported === false) {
    return <RoomFallback variant="unsupported" />;
  }

  return (
    <ModelErrorBoundary
      fallback={(boundaryRetry) => (
        <RoomFallback variant="error" onRetry={() => retry(boundaryRetry)} />
      )}
    >
      <RoomScene
        key={attempt}
        floorId={floorId}
        progressRef={progressRef}
        pointerRef={pointerRef}
        onLoaded={onLoaded}
      />
    </ModelErrorBoundary>
  );
}
