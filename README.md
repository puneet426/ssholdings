# SS Holdings — Premium 3D Interior Website

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm run start
```

## What's implemented (Stage 2 — Scroll-and-mouse 3D walkthrough)

- **New model**: `loft_interior_6_for_free.glb` replaces the placeholder
  Backrooms asset. It's a real interior with proper PBR materials (base
  color + normal maps), optimized from 24MB to **1.89MB** (Draco geometry
  compression + WebP textures capped at 1536px, via `gltf-transform
  optimize`) with the original mesh/node names preserved for future
  per-surface material-switching work.
- **Interaction model rebuilt end-to-end** to match your reference
  recordings: no drag-to-orbit anymore. Instead:
  - **Scroll** dollies the camera from an "entry" position near one corner
    of the room toward an "inner" position closer to its center. The hero
    section is a tall (220vh) pinned container — the canvas stays fixed
    full-viewport while the page scrolls underneath, exactly like the
    reference gallery site.
  - **Mouse position** (no click/drag needed) adds a small look-around
    parallax on top of the current scroll position, damped smoothly so it
    never feels jittery.
  - Both are derived generically from the model's bounding box
    (`src/lib/three/cameraLayout.ts` — `computeCameraPath`), not hardcoded,
    so a future model swap will still produce a reasonable path.
- **No text or CTAs over the 3D scene** — only the navbar (logo + nav
  links) sits on top, with a very subtle top gradient purely so nav text
  stays legible over bright parts of the scene. Nav text switches from
  light (over the dark 3D scene) to dark (once scrolled onto the paper
  background) automatically.
- **New loading screen**, restyled toward the warm/soft tone from your
  reference recording: a minimal pulsing/expanding square mark on a warm
  paper background, crossfading smoothly into the 3D scene once loaded —
  no more dark loading screen.
- `prefers-reduced-motion` is still respected: scroll position is applied
  directly with no damping/parallax smoothing for users who've asked for
  reduced motion.

Verified: `npm run lint` and `npm run build` both pass clean; production
server smoke-tested again after the rebuild (homepage + new model both
return HTTP 200).

## What's implemented (Stage 1 — Homepage, Scroll & Animation)

- **3D Hero** (`src/components/hero/Hero.tsx` + `src/components/three/`):
  client-only Three.js/React Three Fiber scene, loaded from
  `public/models/room.glb`. Camera position is **computed generically from
  the model's bounding box** (`src/lib/three/cameraLayout.ts`) — it is not
  hardcoded, so swapping in a different GLB will still produce a reasonable
  "standing inside the room" shot.
- **Cinematic entrance**: camera dollies in slowly on load, then hands off
  to a restricted OrbitControls (limited zoom/tilt/rotation range so
  visitors can't clip through walls or flip under the floor).
- **Adaptive quality**: `useDeviceQuality` picks shadow resolution / pixel
  ratio / antialiasing based on device signals (coarse pointer, CPU cores,
  memory), so mobile stays smooth.
- **Loading state**: branded overlay with real load progress
  (`LoadingOverlay.tsx`), never a blank canvas.
- **Error handling**: `ModelErrorBoundary` + `RoomFallback` show a graceful
  message and retry button if the model fails to load, and a separate
  fallback if WebGL isn't supported at all — the rest of the page still
  works either way.
- **Scroll sections** (`src/components/sections/`): About, Collections,
  Spaces, Why Us, Contact — each using a shared `Reveal` / `RevealGroup`
  primitive (Framer Motion) that respects `prefers-reduced-motion`.
- **Nav + mobile menu**, **footer**, full **SEO metadata** (Open Graph,
  Twitter card, canonical URL) in `src/app/layout.tsx`.

Verified: `npm run lint` and `npm run build` both pass clean, and the
production server (`npm run start`) was smoke-tested — homepage and the
model asset both return HTTP 200, all JS chunks load.

## About the 3D model

The current model (`public/models/room.glb`) is `loft_interior_6_for_free.glb`,
converted from the original 24MB Sketchfab export. It's a generic loft
interior — good for validating the walkthrough experience, but not
SS Holdings-branded content. Swap in a real showroom/interior model
whenever ready; the camera path and lighting adapt automatically from the
new model's bounding box. If you want per-surface material-switching
later, this model's original mesh/material names were preserved during
optimization (unlike a fully flattened export), so they're available to
target once that stage starts.

## Placeholder content

Collection names, contact details, and address in `src/data/collections.ts`
and `src/components/sections/Contact.tsx` are clearly marked placeholders —
no real business claims, certifications, or specifications have been
invented. Replace with real SS Holdings content before launch.

## Next stages (not yet built, per the brief's own staging)

- Material-switching system (`applyMaterialToSurface`) for floor/wall
  surfaces once a proper interior model with real named meshes is supplied
- Interactive product hotspots inside the 3D room
- CMS/API-backed product data instead of the static `collections.ts` file

## Project structure

```
src/
├── app/                  # layout.tsx (SEO/fonts), page.tsx, globals.css
├── components/
│   ├── layout/           # Header, MobileMenu, Footer
│   ├── hero/             # Hero (3D + branding)
│   ├── three/            # RoomCanvas, RoomScene, RoomModel, CameraRig,
│   │                       LoadingOverlay, InteractionHint, RoomFallback,
│   │                       ModelErrorBoundary
│   ├── sections/         # About, Collections, Spaces, WhyUs, Contact
│   └── ui/               # Reveal / RevealGroup scroll-animation primitives
├── data/                 # nav.ts, collections.ts (placeholder data)
├── hooks/                # useDeviceQuality, usePrefersReducedMotion,
│                           useWebGLSupport
├── lib/three/            # cameraLayout.ts (bounding-box-driven camera math)
└── types/three.ts
```
