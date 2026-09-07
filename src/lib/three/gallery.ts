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

/**
 * Phones widen every floor's baked FOV by this factor (~15% more of the room
 * in frame). The desktop framing crops the wall captions on a narrow screen;
 * desktop keeps the raw `floor.fov`.
 */
export const MOBILE_FOV_SCALE = 1.15;

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
  /**
   * Explicit `[from, to]` rail range to hold at full opacity, for a wall the
   * camera only actually faces over a stretch that isn't centred on `at`.
   * Without it the hold is a symmetric window around `at`, which on a corner
   * can ramp the caption out again while the wall is still square in frame.
   * Ramps still shrink so two captions are never on screen together.
   */
  hold?: [number, number];
  /** World-space point on (or just off) the wall, in the floor's own scene units. */
  position: [number, number, number];
  /**
   * Phone-only anchor override. When set, narrow viewports use this point
   * instead of `position` — e.g. the opening title is lifted onto the black
   * ceiling band on mobile while desktop keeps its wall placement.
   */
  positionMobile?: [number, number, number];
  /**
   * Fixed Euler rotation (radians, XYZ order) that lays the text flush
   * against its wall — a sticker, not a billboard. Captured alongside
   * `position` by DevPlacementHelper. Omit to fall back to facing the
   * viewer head-on (used for the opening title).
   */
  rotation?: [number, number, number];
  /** World-unit character height — auto-sized by distance from camera if omitted. */
  fontSize?: number;
  /**
   * Multiplier on the auto-sized height, to push one caption bigger or
   * smaller than the rest without giving up distance-based sizing.
   */
  fontScale?: number;
  /**
   * Phone-only character height, in world units. The final word when set —
   * no auto-sizing, no `fontScale`, and none of the usual phone trim on top,
   * so a caption sized to a fixed surface can be read on a small screen
   * without being re-derived. Sibling of `positionMobile`.
   */
  fontSizeMobile?: number;
  /**
   * Hard ceiling on the laid-out block's width, in world units — the width of
   * the panel the lettering must stay inside. Applied against troika's own
   * measurement of the text, so the real glyph metrics decide the size rather
   * than an estimate of them, and it is camera-independent, so it settles once
   * and never animates. Pair it with `fontSize` on a decal: the `fontSize` is
   * the size you want, `fitWidth` the size the surface allows.
   */
  fitWidth?: number;
  /**
   * Paint this caption onto the surface behind it instead of over the whole
   * scene. A decal is depth-tested — a pillar, wall corner or shelf passing
   * between it and the camera hides it, the way lettering on a real panel
   * would be — and its size is never trimmed by the frame-fill guard, so it
   * stays welded to its surface as you walk past rather than sliding across
   * whatever geometry crosses in front. Only for a caption sitting flush on
   * a surface that is genuinely in view across its whole hold; every other
   * caption stays drawn-on-top, where legibility beats strict occlusion.
   */
  decal?: boolean;
  /** Faux-bold — thickens the strokes with a same-colour stroke pass. */
  bold?: boolean;
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
    // One caption per wall, each fading in only around its own `at` so two are
    // never on screen together. Heights sit in a ~2.6–3.0 band: above the
    // kitchen island / sofas / pillars that would clip a lower line, but low
    // enough that the wider mobile FOV doesn't crop the top. ff-wall-1 has no
    // `rotation` (it faces the viewer — the opening title) and is pulled
    // forward so it reads big on a phone. ff-wall-3/4/5 are spread along the
    // run of walls the camera faces through the middle of the walk so no two
    // share a spot, each centred on that moment's sightline (ff-wall-4 nudged
    // off the centre column). ff-wall-2/7/8/9 are the hand-placed originals.
    wallTexts3D: [
      {
        id: "ff-wall-1",
        at: 0.00,
        position: [-8.00, 3.00, -5.90],
        positionMobile: [-8.00, 3.60, -5.90],
        bold: true,
        text: "SS Holdings\nBuilders in Visakhapatnam",
      },
      // Corner captions: the camera swings from facing +X to facing -Z
      // between 0.12 and 0.34, so an `at`-centred window ramped these out
      // while their wall was still square in frame. Sampled on-screen
      // stretches for these two anchors (desktop 16:9 / phone portrait):
      // wall-2 0.12–0.34 / 0.17–0.26, wall-3 0.19–0.34 / 0.26–0.30 — the
      // holds below hand over at 0.25 so each stays planted for the whole
      // time its own wall is actually facing you, and wall-2 picks up at
      // exactly the point the opening title reaches zero (0.089).
      // wall-2 is centred across its wall face — that panel is the
      // rectangle x -13.43, z -0.83–5.58, so mid-wall is z 2.38 — and
      // lifted to y 2.55 to clear the floor lamp's head (tops at 2.14).
      { id: "ff-wall-2", at: 0.1775, hold: [0.12, 0.235], position: [-13.51, 2.55, 2.38], rotation: [0.00, -1.57, 0.00], bold: true, fontScale: 1.1, text: "Designed and built as\nper Vastu Principles" },
      // wall-3 sits on the leaning marble panel in the niche past the
      // credenza: that panel is 1.20 wide x 1.47 tall, centred at
      // (-10.44, 1.94, 0.86) and tilted back ~10deg, so the caption takes
      // its centre (nudged 0.06 off the face) and its tilt. The anchor is
      // in frame 0.18-0.38 desktop / 0.18-0.33 phone, so the hold runs to
      // 0.315 rather than stopping at 0.305. It is the one caption on a
      // fixed `fontSize` rather than the distance-derived one: broken over
      // two lines, 0.23 puts the longer line at ~1.05 inside the 1.20 frame,
      // and a decal painted on a frame should not resize as you approach.
      // Phones take 0.25 instead (~1.14 of the 1.20) so the plaque is not
      // too quiet to read on a small screen while still fitting the frame.
      { id: "ff-wall-3", at: 0.2925, hold: [0.27, 0.315], position: [-10.44, 1.95, 0.92], rotation: [-0.17, 0.00, 0.00], fontSize: 0.23, fontSizeMobile: 0.25, decal: true, text: "Address\nof Quality" },
      // wall-4 is lettering on the chimney breast above the fireplace — the
      // panel the client marked up in public/demo/fourthtext.png. That face is
      // the rectangle x -9.40..-5.10 at z 1.86 (its neighbours on both sides
      // step back to z 0.72), with the log niche cut out of it between y 1.20
      // and y 2.25 and clear wall above that up to the mezzanine glass at
      // y 4.03. So the caption centres on the panel (x -7.25) in the band over
      // the niche, 0.06 off the face. `fitWidth` 3.70 keeps the longer line
      // inside the 4.30 panel whatever the glyph metrics work out to, and the
      // hard line break splits it the way the markup does. Framing along the
      // rail: the panel is unoccluded 0.32-0.39 and sits square in frame
      // 0.33-0.37 (the marked-up screenshot is ~0.36), which is the hold —
      // past it the camera walks on and the pillar and the plant cross in
      // front, which a decal now handles by simply being hidden.
      { id: "ff-wall-4", at: 0.3535, hold: [0.335, 0.372], position: [-7.25, 2.90, 1.92], rotation: [0.00, 0.00, 0.00], fontSize: 0.36, fitWidth: 3.70, decal: true, text: "35+ Projects Delivered\non time Every Time" },
      // wall-5 is lettering on the dark stone slab behind the pool table
      // (public/demo/fifthtext.png). That slab leans back ~2.3deg against the
      // wall: its face runs x 5.26..8.28, top edge y 3.38, and the pale marble
      // block in front of it cuts it off at y 1.88 — so the clear band is
      // 3.02 x 1.50, centred at (6.77, 2.63) with the face at z 0.38 there.
      // Three lines, as marked up. The camera tracks straight past this wall,
      // so the slab is never occluded; the hold is simply where it reads
      // squarest (obliquity 6-12deg, centred at 0.523).
      { id: "ff-wall-5", at: 0.523, hold: [0.50, 0.55], position: [6.77, 2.63, 0.44], rotation: [-0.05, 0.00, 0.00], fontSize: 0.27, fitWidth: 2.60, decal: true, text: "25 years of Building\nQuality Homes with\nTrust" },
      // wall-6 moves onto the framed artwork over the bed
      // (public/demo/sixthtext.png) — it used to sit on the pool-room wall,
      // one caption after wall-5 and on the same surface, which is what the
      // client wanted cleared. The canvas inside its frame is z -2.25..-3.28,
      // y 1.45..3.02 on the panel face at x 9.23, so the lettering centres in
      // it at 0.05 off the face. Squarest at 0.812 (3deg), never occluded.
      { id: "ff-wall-6", at: 0.812, hold: [0.795, 0.83], position: [9.28, 2.24, -2.77], rotation: [0.00, 1.57, 0.00], fontSize: 0.26, fitWidth: 0.90, decal: true, text: "Building\nLuxury\nHomes" },
      // wall-7 goes on the marble slab leaning in the dressing room
      // (public/demo/seventhtext.png): face z -7.47..-8.70, y 0.05..2.13,
      // leaning back 0.08 rad so its x runs 11.69 at the foot to 11.51 at the
      // top (11.59 at the caption's own height). The rotation is the roll-free
      // basis for that normal — a +X wall with a lean cannot be written as
      // [tilt, 1.57, 0], because in XYZ order the yaw is applied after the
      // tilt and swallows it. Five short lines keep the type big enough to
      // read on a 1.23m-wide slab. Squarest at 0.874.
      { id: "ff-wall-7", at: 0.874, hold: [0.855, 0.885], position: [11.64, 1.25, -8.08], rotation: [-1.5708, 1.4910, 1.5708], fontSize: 0.21, fitWidth: 1.02, bold: true, decal: true, text: "Visit Our\nProjects\nand See\nthe Quality\nFirsthand" },
      // wall-8 goes on the framed panel beside the bathroom basin
      // (public/demo/eighthtext.png). That panel is its own plane at x 10.00,
      // standing 0.08 proud of the wall behind it; canvas z -11.27..-12.57,
      // y 0.35..2.46. The block centres at y 1.70 rather than mid-canvas so it
      // clears the vanity, which crosses the panel's lower right below y 1.03.
      // Dead square at 0.92.
      { id: "ff-wall-8", at: 0.9235, hold: [0.905, 0.94], position: [10.05, 1.70, -11.92], rotation: [0.00, 1.57, 0.00], fontSize: 0.27, fitWidth: 1.10, decal: true, text: "Something\ntells us\nyou like\nour work" },
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
