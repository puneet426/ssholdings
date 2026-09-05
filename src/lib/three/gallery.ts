// Everything the 3D gallery hero is wired from. The models, the baked camera
// rails and the hotspot copy all live here so a content edit never means
// touching a component.
//
// The assets are the Iris Ceramica Group "ICG Gallery" set the client dropped
// into public/webgl. Each floor is one first-person .glb ("*_pov.glb") plus a
// baked camera animation in the shared camera_paths.glb — an animated empty
// (translation + rotation, 97 LINEAR keys) with the camera parented at its
// origin. Scrubbing that clip's time from 0 → duration IS the walk-through.

export const DRACO_PATH = "/webgl/draco/";
export const CAMERA_PATHS_URL = "/webgl/models/camera_paths.glb";
export const ENV_MAP_URL = "/webgl/textures/pov_env.jpg";
export const EYE_URL = "/images/svg/eye.svg";
export const LOGO_URL = "/images/logo.jpg";

/** Sound plays only on a button press (Floors / eye) and is cut after this. */
export const CUE_SECONDS = 5;

export const AUDIO = {
  click: "/audio/click.mp3",
  floor: "/audio/floor.mp3",
} as const;

export type FloorId = "gf" | "ff" | "uf" | "pu";

export interface HotspotMedia {
  /** Still images shown as a strip in the card. */
  images?: string[];
  /** A YouTube video id — embedded and played inside the card. */
  youtube?: string;
}

export interface Hotspot {
  id: string;
  /** Rail progress (0–1) the marker sits at — it also fades in near this. */
  at: number;
  /** Where the eye sits on screen while shown — CSS [left, top]. */
  screen?: [string, string];
  /** Room-style name shown big at the top of the card, e.g. "Meeting Room". */
  heading: string;
  eyebrow: string;
  title: string;
  body: string[];
  media?: HotspotMedia;
  /** Optional footnote. */
  note?: string;
}

export interface WallText3D {
  id: string;
  /** Rail progress (0–1) this line is centered on — fades in/out around it. */
  at: number;
  /** World-space point on (or just off) the wall, in the floor's own scene units. */
  position: [number, number, number];
  /**
   * Fixed Euler rotation (radians, XYZ order) that lays the text flush
   * against its wall — a sticker, not a billboard. Captured alongside
   * `position` by DevPlacementHelper. Omit to fall back to the old
   * always-face-camera behavior.
   */
  rotation?: [number, number, number];
  /** World-unit character height — auto-sized by distance from camera if omitted. */
  fontSize?: number;
  text: string;
}

export interface GalleryFloor {
  id: FloorId;
  label: string;
  /** Storey number shown in the "Change floor" list (…-1, 0, +1, +2). */
  level: number;
  /** First-person shell for this floor. */
  url: string;
  /** Empty node inside camera_paths.glb whose world transform drives the camera. */
  emptyName: string;
  /** Animation clip inside camera_paths.glb to scrub. */
  clipName: string;
  /** Vertical FOV (deg) — converted from the matching camera's yfov in the glb. */
  fov: number;
  /** Subtle idle animations baked into the shell; looped at low speed. */
  idleClips: string[];
  hotspots: Hotspot[];
  /**
   * Real 3D text mounted in the scene at a wall coordinate, fading in/out
   * as the rail passes it — no eye icon, no click, no detail card. A floor
   * using this should leave `hotspots` empty.
   */
  wallTexts3D?: WallText3D[];
}

// Placeholder media. Photos are the only image assets in the repo; the film is
// the YouTube clip the client supplied. Swap the photos for real room
// photography before launch.
const IMG = {
  alchimia: "/webgl/textures/gf/alchimia.webp",
  hypertouch: "/webgl/textures/gf/hypertouch-on.webp",
  moonlight: "/webgl/textures/gf/moonlight-on.webp",
  cube: "/webgl/textures/uf/cube_front.jpg",
  env: "/webgl/textures/uf/env.jpg",
};
const YT = "hrW0tPPtXxM";

// Screen anchors so markers that overlap in time don't stack — cycled per
// hotspot within a floor.
const SLOTS: [string, string][] = [
  ["45%", "44%"],
  ["57%", "40%"],
  ["49%", "53%"],
  ["55%", "47%"],
];
const withSlots = (hs: Omit<Hotspot, "screen">[]): Hotspot[] =>
  hs.map((h, i) => ({ ...h, screen: SLOTS[i % SLOTS.length] }));


// yfov (rad) → deg, straight from camera_paths.glb:
//   gf 0.39960 → 22.9°   ff 0.56320 → 32.3°   uf 0.53422 → 30.6°   pu 0.56320 → 32.3°

export const FLOORS: GalleryFloor[] = [
  {
    id: "gf",
    label: "Ground Floor",
    level: 0,
    url: "/webgl/models/gf_pov.glb",
    emptyName: "gf_empty",
    clipName: "gf_empty_action",
    fov: 22.9,
    idleClips: [
      "gf_split-004_sheet-004Action",
      "gf_split-004_sheet-003Action",
      "gf_split-004_sheet-002Action",
      "gf_split-005_disk-001Action.001",
    ],
    hotspots: withSlots([
      {
        id: "gf-kitchen",
        at: 0.14,
        heading: "The Kitchen",
        eyebrow: "Kitchen surfaces",
        title: "Haute couture surfaces.",
        body: [
          "An “intelligent stone” for an incomparable user experience — porcelain stoneware taken to the kitchen top, the built-in induction surface and the table.",
          "Full attention to aesthetics, carried by a flexible and extremely resistant designer element suited more than any other for lasting daily use.",
        ],
        media: { images: [IMG.hypertouch, IMG.alchimia, IMG.moonlight], youtube: YT },
        note: "Placeholder copy and photos.",
      },
      {
        id: "gf-bar",
        at: 0.34,
        heading: "The Bar",
        eyebrow: "Counter & shelving",
        title: "One block, poured.",
        body: [
          "The counter, the back shelving and the plinths read as a single quarried block — the veining is matched across every cut.",
        ],
        media: { images: [IMG.alchimia, IMG.hypertouch] },
        note: "Placeholder copy and photos.",
      },
      {
        id: "gf-living",
        at: 0.56,
        heading: "Living Wall",
        eyebrow: "Large-format slabs",
        title: "A slab, wall to wall.",
        body: [
          "Large-format slabs run floor to ceiling with no interruption, so the veining reads as one continuous drawing across the room.",
        ],
        media: { images: [IMG.alchimia, IMG.moonlight], youtube: YT },
        note: "Placeholder copy and photos.",
      },
      {
        id: "gf-lounge",
        at: 0.82,
        heading: "The Lounge",
        eyebrow: "Floors",
        title: "Warm minimal, hard-wearing.",
        body: [
          "Matte micro-textured floors in a warm neutral — the tactile, grounded finish used through the lounge and the rooms that open off it.",
        ],
        media: { images: [IMG.moonlight] },
        note: "Placeholder copy and photos.",
      },
    ]),
  },
  {
    id: "ff",
    label: "First Floor",
    level: 1,
    url: "/webgl/models/ff_pov.glb",
    emptyName: "ff_empty",
    clipName: "ff_empty_action",
    fov: 32.3,
    idleClips: ["ff_split-001_hood-001Action"],
    // No eye-icon hotspots on this floor — real 3D text mounted on the
    // walls instead, synced to the rail. `position` below is UNPLACED
    // (world origin) until run through DevPlacementHelper.
    hotspots: [],
    wallTexts3D: [
      { id: "ff-wall-1", at: 0.00, position: [-4.42, 3.55, -6.08], text: "SS Holdings Builders in Visakhapatnam" },
      { id: "ff-wall-2", at: 0.15, position: [-13.51, 2.60, 3.74], rotation: [0.00, -1.57, 0.00], text: "Designed and built as per Vastu Principles" },
      { id: "ff-wall-3", at: 0.28, position: [-6.57, 4.00, 2.02], rotation: [0.00, 0.00, 0.00], text: "Address of Quality" },
      { id: "ff-wall-4", at: 0.40, position: [-6.29, 3.50, 1.94], rotation: [0.00, 0.00, 0.00], text: "35+ Projects Delivered on time Every Time" },
      { id: "ff-wall-5", at: 0.50, position: [7.21, 4.10, 0.48], rotation: [0.00, 0.00, 0.00], text: "25 years of Building Quality Homes with Trust" },
      { id: "ff-wall-6", at: 0.61, position: [7.55, 3.88, 0.56], rotation: [0.00, 0.00, 0.00], text: "Building Luxury Homes" },
      { id: "ff-wall-7", at: 0.73, position: [12.59, 2.81, 0.16], rotation: [0.00, 1.57, 0.00], text: "Visit Our Projects and See the Quality Firsthand" },
      { id: "ff-wall-8", at: 0.84, position: [10.02, 0.84, -4.80], rotation: [0.00, 1.57, 0.00], text: "Something tells us you like our work" },
      { id: "ff-wall-9", at: 1.00, position: [11.59, 2.50, -18.54], rotation: [0.00, 1.57, 0.00], text: "You’ve seen enough. Now come see us." },
    ],
  },
  {
    id: "uf",
    label: "Underground",
    level: -1,
    url: "/webgl/models/uf_pov.glb",
    emptyName: "uf_empty",
    clipName: "uf_empty_action",
    fov: 30.6,
    idleClips: [
      "uf_split-001_sheet-002Action",
      "uf_split-001_sheet-003Action",
      "uf_split-001_sheet-004Action",
      "uf_split-002_door-001Action",
    ],
    hotspots: withSlots([
      {
        id: "uf-moodboard",
        at: 0.1,
        heading: "The Moodboard",
        eyebrow: "Sample library",
        title: "Every finish, on one wall.",
        body: [
          "The full range in sample size, arranged by tone — the room designers start in before they commit to a slab.",
        ],
        media: { images: [IMG.alchimia, IMG.moonlight, IMG.hypertouch], youtube: YT },
        note: "Placeholder copy and photos.",
      },
      {
        id: "uf-gallery",
        at: 0.32,
        heading: "Slab Gallery",
        eyebrow: "Side by side",
        title: "Every finish, compared.",
        body: [
          "Full slabs stand on a run of low plinths so two finishes of the same stone can be compared at architectural scale.",
        ],
        media: { images: [IMG.alchimia, IMG.moonlight] },
        note: "Placeholder copy and photos.",
      },
      {
        id: "uf-archive",
        at: 0.55,
        heading: "The Archive",
        eyebrow: "Reference sheets",
        title: "Pull, compare, file.",
        body: [
          "Sliding reference sheets hold the technical data — sizes, finishes, performance — next to the material they describe.",
        ],
        media: { images: [IMG.cube] },
        note: "Placeholder copy and photos.",
      },
      {
        id: "uf-caveau",
        at: 0.8,
        heading: "The Caveau",
        eyebrow: "Bottega d'Arte",
        title: "A collection by Iris Ceramica.",
        body: [
          "An intimate understanding of ceramics: Bottega d'Arte is a rebirth of the traditional ceramic art, a return to the origins of an age-old, long-admired quality.",
          "Inspired by the atmosphere of a craftsman's workshop, the line rediscovers familiar sensations — tempting smells, captivating sounds, enchanting shapes.",
        ],
        media: { images: [IMG.cube, IMG.env], youtube: YT },
        note: "Placeholder photos — copy transcribed from the reference walk-through.",
      },
    ]),
  },
  {
    id: "pu",
    label: "Pop-Up Window",
    level: 2,
    url: "/webgl/models/pu_pov.glb",
    emptyName: "pu_empty",
    clipName: "pu_empty_action",
    fov: 32.3,
    idleClips: [],
    hotspots: withSlots([
      {
        id: "pu-ledwall",
        at: 0.3,
        heading: "Meeting Room",
        eyebrow: "LED backdrop",
        title: "The room that travels.",
        body: [
          "A compact set — one wall, one LED backdrop, one stair — that ships to fairs and takeovers and rebuilds in a day.",
          "The LED wall runs the brand's films on loop; the surfaces around it are swapped per event.",
        ],
        media: { images: [IMG.moonlight, IMG.hypertouch], youtube: YT },
        note: "Placeholder copy and photos.",
      },
      {
        id: "pu-stair",
        at: 0.6,
        heading: "The Stair",
        eyebrow: "Single-piece tread",
        title: "Cut, not clad.",
        body: [
          "Each tread is one piece of porcelain — the pop-up's signature detail, and the first thing that goes back in the crate.",
        ],
        media: { images: [IMG.alchimia] },
        note: "Placeholder copy and photos.",
      },
      {
        id: "pu-set",
        at: 0.85,
        heading: "The Set",
        eyebrow: "Kit of parts",
        title: "Everything folds flat.",
        body: [
          "Wall, floor and plinth break down into a handful of panels — the whole gallery fits two flight cases.",
        ],
        media: { images: [IMG.env], youtube: YT },
        note: "Placeholder copy and photos.",
      },
    ]),
  },
];

export const DEFAULT_FLOOR: FloorId = "ff";

/** Floors from the lowest storey up — the order the "Change floor" list uses. */
export const FLOORS_BY_LEVEL: GalleryFloor[] = [...FLOORS].sort(
  (a, b) => a.level - b.level
);

export function getFloor(id: FloorId): GalleryFloor {
  return FLOORS.find((f) => f.id === id) ?? FLOORS[0];
}

/** The next floor up (dir 1) or down (dir -1) the stack, or null at the ends. */
export function stepFloor(id: FloorId, dir: 1 | -1): GalleryFloor | null {
  const i = FLOORS_BY_LEVEL.findIndex((f) => f.id === id);
  return FLOORS_BY_LEVEL[i + dir] ?? null;
}
