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
  /** Rail progress (0–1) where this wall reads squarest — where it was placed
   *  from, and the centre of the fallback window when `visible` is unset. */
  at: number;
  /**
   * `[from, to]` rail range over which the wall this sticker sits on is in
   * view: at least partly inside the frame, facing the camera, and not wholly
   * behind other geometry. The caption is fully opaque across it and absent
   * outside it, with only a couple of frames of ramp at each edge — it leaves
   * because its wall does, never because a timer ran out. Ranges may overlap:
   * two walls in view means two stickers in view. Measured offline against
   * the baked rail and ff_pov's geometry, not eyeballed.
   */
  visible?: [number, number];
  /**
   * Opening caption: shown from the start of the walk, held through the
   * first 60% of the way to this progress, then faded out by it — keyed to
   * the *scroll target* (ahead of the eased camera) on the way out, and to
   * both target and camera on the way back in, so it returns only once the
   * view has settled at the start. Overrides `visible`.
   */
  vanishBy?: number;
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
   * Phone-only `fitWidth`. Sibling of `fontSizeMobile`, and the guarantee that
   * a pinned caption clears a narrow portrait frame: a caption carrying its own
   * `fontSize` skips the frame-fill trim (that trim scales with camera
   * distance, which is what made the lettering drift over its wall), so this
   * takes over the job — set it to 82% of the frame width at the caption's
   * closest approach along the rail and it can never overrun the screen.
   */
  fitWidthMobile?: number;
  /**
   * Paint this caption onto the surface behind it instead of over the whole
   * scene. A decal is depth-tested — a pillar, wall corner or shelf passing
   * between it and the camera hides it, the way lettering on a real panel
   * would be — and its size is never trimmed by the frame-fill guard, so it
   * stays welded to its surface as you walk past rather than sliding across
   * whatever geometry crosses in front. Only for a caption sitting flush on
   * a surface that is genuinely in view across its whole `visible` range; every other
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
    // One sticker per wall, each on screen for exactly as long as its own wall
    // is — see the note above ff-wall-2 for how every `visible` range was
    // measured. Heights sit in a ~2.6–3.0 band: above the
    // kitchen island / sofas / pillars that would clip a lower line, but low
    // enough that the wider mobile FOV doesn't crop the top. ff-wall-1 has no
    // `rotation` (it faces the viewer — the opening title) and is pulled
    // forward so it reads big on a phone. ff-wall-3/4/5 are spread along the
    // run of walls the camera faces through the middle of the walk so no two
    // share a spot, each centred on that moment's sightline (ff-wall-4 nudged
    // off the centre column). ff-wall-2/7/8/9 are the hand-placed originals.
    wallTexts3D: [
      // The opening title. It reads against the black ceiling band, clear of
      // the navbar: the navbar is a fixed 80px over a 100svh hero, so its
      // share of the frame grows as the window gets shorter, and this height
      // is set for a laptop-height window (~14px clear at 639px tall, more on
      // anything taller) — a tenth-of-viewport lift cleared it on a 1080-tall
      // screen and by nothing at all at 639.
      //
      // Unlike every other caption it is not on a wall — there is no wall in
      // that part of the frame — and a sign floating in mid-air slides against
      // its background by parallax as the camera walks sideways, which read as
      // the title "moving". The background it is judged against is the
      // kitchen's back wall — the shelving and slatted panels — whose face is
      // at x -3.55 (raycast from the p=0 camera; the shelf units in front of
      // it reach x -4.05/-4.25). So the anchor sits ON that wall plane, where
      // the liked sight-line reaches it: the camera at (-17.48, 1.71) looking
      // through (-8.00, 3.28) meets x -3.55 at y 4.02. Same ray, so it lands
      // on the same pixels; size scaled by the distance ratio (14.12 / 9.61)
      // so it is the same size on screen; and being on the wall's own plane
      // it moves with the shelving one-to-one — no parallax left. y 4.02 is
      // above the ceiling line (the ceiling's visible underside is y 3.63),
      // which is the black band it reads against; it is drawn on top, not
      // depth-tested, so the slab does not hide it. Fixed rotation (-1.57
      // about Y faces it down -X, at the camera) and a world-unit size.
      //
      // The opening title. The client's two rules for it — "a sticker on the
      // ceiling, front-facing, as if written there" and "must not move when
      // we scroll" — contradict each other the moment the camera moves:
      // anything painted in the room slides on screen as the camera walks,
      // and right after the start the camera slides sideways past this wall,
      // so a sticker here sweeps across the frame (built, seen, rejected), and
      // a screen-fixed overlay has the room slide under it instead (built,
      // seen, rejected). Both rules hold only if the text is never on screen
      // while the camera is moving. So it is a real sticker — front-facing on
      // the kitchen's back wall (face x -3.55, raycast), its top edge at the
      // ceiling line (block 1.06m tall, y 3.08 → top 3.61 under the ceiling's
      // visible underside at 3.63), centred on the slatted panel, drawn on
      // top so the shelf units in front cannot slice it — and `vanishBy`
      // 0.01 takes it away on the first scroll notch, keyed to the scroll
      // input rather than the eased camera, so it is gone before the room has
      // visibly moved. Scroll back to the top and it is there again. Phone
      // 0.35 is edge-limited to 96% of the portrait frame (fitWidthMobile).
      //
      // Then, at the client's request, written on the CEILING band and
      // vanishing by 0.05: the anchor stays on the back wall's plane
      // (x -3.55, so it rides with the shelving, not the lamps) but up where
      // the opening sight-line reaches that plane above the ceiling line —
      // y 4.02, the block spanning 3.49–4.55 against the ceiling's visible
      // underside at 3.63 — so it reads as lettering in the black band, top
      // edge ~15px under the navbar on a laptop-height window. Drawn on top,
      // so the ceiling slab does not hide it. It holds through the first
      // 0.03 of scroll and fades out over 0.03–0.05 (see WallText3D), riding
      // with the room for that short stretch, which the client accepted in
      // exchange for a longer look at it. Phone anchor y 4.52 (same band,
      // wider FOV), block top 0.68 NDC against the 0.81 navbar edge.
      {
        id: "ff-wall-1",
        at: 0.00,
        vanishBy: 0.08,
        position: [-3.55, 4.02, -5.90],
        positionMobile: [-3.55, 4.52, -5.90],
        rotation: [0.00, -1.57, 0.00],
        fontSize: 0.44,
        fontSizeMobile: 0.35,
        fitWidth: 5.29,
        fitWidthMobile: 4.20,
        bold: true,
        text: "SS Holdings\nBuilders in Visakhapatnam",
      },
      // Every `visible` range below is the stretch of the rail over which that
      // sticker's wall is physically in view, swept at 0.002 steps against the
      // baked camera path and ff_pov's geometry: any part of the laid-out block
      // inside the desktop 16:9 frame, the surface facing the camera, and its
      // centre plus four corners not all behind front-facing geometry (the
      // shell's materials are all single-sided — you look into a room through
      // its near wall — so the raycast culls back faces). Only the pass in
      // which the sticker is meant to be read is kept: wall-7 and wall-9 are
      // also glimpsed down the corridor from the pool room at ~15m, where the
      // lettering is a few pixels tall and would only register as a flicker.
      // Ranges overlap wherever two walls share the frame (1/2, 2/3, 3/4,
      // 4/5, 5/6, 6/7/8, 8/9) — that is the point, not a defect: a sticker
      // stays as long as its wall does, and leaves with it.
      //
      // wall-2 is centred across its wall face — that panel is the
      // rectangle x -13.43, z -0.83–5.58, so mid-wall is z 2.38 — and
      // lifted to y 2.55 to clear the floor lamp's head (tops at 2.14).
      // In view 0.058–0.276: it is the corner the camera swings around, so it
      // rakes steadily and is nearly edge-on (89°) by the time it leaves the
      // frame — exactly what a sticker on that corner does. Pinned like wall-1: it
      // already had a fixed rotation, but it was auto-sized, so the lettering
      // held its on-screen size while the wall grew past it. The size is now
      // world-units-fixed, then raised 20% (0.28 → 0.34, phone 0.22 → 0.26).
      // Phone: the camera passes within 6.32m of this wall at 0.104, where a
      // portrait frame is only 1.96m across, so the 2.8m-wide block is clipped
      // at the screen edges for a moment there — which is exactly what a
      // sticker does as you pass close to it, and the price of it being
      // readable rather than tiny for the rest of its pass.
      { id: "ff-wall-2", at: 0.1775, visible: [0.058, 0.276], position: [-13.51, 2.55, 2.38], rotation: [0.00, -1.57, 0.00], bold: true, fontSize: 0.34, fontSizeMobile: 0.34, fitWidth: 3.55, fitWidthMobile: 2.80, text: "Vastu-Compliant Design\nand Construction" },
      // wall-3 sits on the leaning marble panel in the niche past the
      // credenza: that panel is 1.20 wide x 1.47 tall, centred at
      // (-10.44, 1.94, 0.86) and tilted back ~10deg, so the caption takes
      // its centre (nudged 0.06 off the face) and its tilt. In view
      // 0.222–0.408; the pillar crosses in front of it around 0.32, and as a
      // decal it is hidden per pixel while that happens rather than switched
      // off. Broken over two lines, 0.23 puts the longer line at ~1.05 inside
      // the 1.20 frame. Phones take 0.25 instead (~1.14 of the 1.20) so the
      // plaque is not too quiet to read on a small screen while still fitting.
      { id: "ff-wall-3", at: 0.2925, visible: [0.222, 0.408], position: [-10.44, 1.95, 0.92], rotation: [-0.17, 0.00, 0.00], fontSize: 0.18, fontSizeMobile: 0.18, decal: true, text: "No Shortcuts\nJust Quality" },
      // wall-4 is lettering on the chimney breast above the fireplace — the
      // panel the client marked up in public/demo/fourthtext.png. That face is
      // the rectangle x -9.40..-5.10 at z 1.86 (its neighbours on both sides
      // step back to z 0.72), with the log niche cut out of it between y 1.20
      // and y 2.25 and clear wall above that up to the mezzanine glass at
      // y 4.03. So the caption centres on the panel (x -7.25) in the band over
      // the niche, 0.06 off the face. `fitWidth` 3.70 keeps the longer line
      // inside the 4.30 panel whatever the glyph metrics work out to, and the
      // hard line break splits it the way the markup does. In view
      // 0.174–0.454 — first from across the room at 61°, square by 0.35 — and
      // the pillar and the plant cross in front of it repeatedly along the
      // way; as a decal it is hidden wherever they are, per pixel, and never
      // switched off for them.
      { id: "ff-wall-4", at: 0.3535, visible: [0.174, 0.454], position: [-7.25, 2.90, 1.92], rotation: [0.00, 0.00, 0.00], fontSize: 0.36, fitWidth: 3.70, decal: true, text: "35+ Projects\nDelivered on time Always" },
      // wall-5 is lettering on the dark stone slab behind the pool table
      // (public/demo/fifthtext.png). That slab leans back ~2.3deg against the
      // wall: its face runs x 5.26..8.28, top edge y 3.38, and the pale marble
      // block in front of it cuts it off at y 1.88 — so the clear band is
      // 3.02 x 1.50, centred at (6.77, 2.63) with the face at z 0.38 there.
      // Three lines, as marked up. This is the long one: the camera tracks
      // straight past this wall and then turns towards it, so the slab is
      // never occluded and stays within 6° of the sightline all the way to
      // 0.65 — in view 0.412–0.770, over a third of the rail, leaving the
      // frame edge-on at the end.
      { id: "ff-wall-5", at: 0.523, visible: [0.412, 0.770], position: [6.77, 2.63, 0.44], rotation: [-0.05, 0.00, 0.00], fontSize: 0.27, fitWidth: 2.60, decal: true, text: "25 years of Building\nQuality Homes and\nLasting Trust" },
      // wall-6 moves onto the framed artwork over the bed
      // (public/demo/sixthtext.png) — it used to sit on the pool-room wall,
      // one caption after wall-5 and on the same surface, which is what the
      // client wanted cleared. The canvas inside its frame is z -2.25..-3.28,
      // y 1.45..3.02 on the panel face at x 9.23, so the lettering centres in
      // it at 0.05 off the face. Squarest at 0.812 (3deg), never occluded;
      // in view 0.714–0.870, from the moment the camera rounds the corner
      // towards the bed until the frame edge takes it.
      { id: "ff-wall-6", at: 0.812, visible: [0.714, 0.870], position: [9.28, 2.24, -2.77], rotation: [0.00, 1.57, 0.00], fontSize: 0.26, fitWidth: 0.90, decal: true, text: "Built Right,\nBuilt to Last" },
      // wall-7 goes on the marble slab leaning in the dressing room
      // (public/demo/seventhtext.png): face z -7.47..-8.70, y 0.05..2.13,
      // leaning back 0.08 rad so its x runs 11.69 at the foot to 11.51 at the
      // top (11.59 at the caption's own height). The rotation is the roll-free
      // basis for that normal — a +X wall with a lean cannot be written as
      // [tilt, 1.57, 0], because in XYZ order the yaw is applied after the
      // tilt and swallows it. Five short lines keep the type big enough to
      // read on a 1.23m-wide slab. Squarest at 0.874, in view 0.826–0.920,
      // sharing the frame with wall-6 at the start and wall-8 at the end.
      { id: "ff-wall-7", at: 0.874, visible: [0.826, 0.920], position: [11.64, 1.25, -8.08], rotation: [-1.5708, 1.4910, 1.5708], fontSize: 0.21, fitWidth: 1.02, bold: true, decal: true, text: "Visit Our\nProjects\nand See\nthe Quality\nFeel the\ndifference" },
      // wall-8 goes on the framed panel beside the bathroom basin
      // (public/demo/eighthtext.png). That panel is its own plane at x 10.00,
      // standing 0.08 proud of the wall behind it; canvas z -11.27..-12.57,
      // y 0.35..2.46. The block centres at y 1.70 rather than mid-canvas so it
      // clears the vanity, which crosses the panel's lower right below y 1.03.
      // Dead square at 0.92; in view 0.862–0.974.
      { id: "ff-wall-8", at: 0.9235, visible: [0.862, 0.974], position: [10.05, 1.70, -11.92], rotation: [0.00, 1.57, 0.00], fontSize: 0.27, fitWidth: 1.10, decal: true, text: "Something\ntells us\nyou like\nour work" },
      // The closing line: in view over the last 0.056 of the rail, since it
      // sits at the far end of the bathroom and the camera is still walking
      // towards it, and up to the very end so it is there when you arrive.
      { id: "ff-wall-9", at: 1.00, visible: [0.944, 1.000], position: [11.59, 2.50, -18.54], rotation: [0.00, 1.57, 0.00], text: "Visit Our Projects, It will be worth it" },
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
