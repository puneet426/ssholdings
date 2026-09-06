const CLOUD_NAME = "dp7clwitm";

/**
 * The source clips are 1886×1060 but every one carries a baked-in pillarbox:
 * a solid black bar 26px wide down the left edge and 24px down the right
 * (nothing top or bottom), identical across all four. Crop that window out
 * first — 1836×1060 starting at x=26 — so only real footage reaches the tile.
 */
const CONTENT_CROP = "c_crop,x_26,y_0,w_1836,h_1060";

/**
 * Trim the ~2s intro/title card server-side so playback — and every native
 * loop — starts on real footage, with no client-side seek to stutter on.
 *
 * The URL already re-encodes (any crop/resize does), so `so_` adds no new
 * transcode cost beyond what `c_fill` was always paying; it just means the
 * *first* hit on each of these four URLs after a deploy is a live transcode.
 * Pre-warm them once (curl the four delivery URLs) so a visitor never does.
 */
const INTRO_TRIM_AND_CROP = `so_2.0,${CONTENT_CROP}`;

/**
 * Tile aspect the cropped footage is re-filled to. Still the original
 * 1886:1060 that ProjectShowcase's `aspect-1886/1060` box (and the poster)
 * use, so `c_fill` only shaves ~14px off top and bottom to make up the
 * ratio difference — nothing in the layout has to change.
 */
const TILE_ASPECT = "1886:1060";

/**
 * `path` is everything after `/video/upload/` in a Cloudinary delivery URL —
 * version + public id, e.g. "v1788597393/ssvideo1_v9cumr".
 *
 * These are ambient background loops, so the stream is biased hard toward
 * cheap-to-decode: `q_auto:eco` for a low bitrate and `w_960` to roughly
 * match the rendered tile rather than the source. That, plus per-tile
 * visibility gating and dropping the per-loop seek, is what fixes the
 * playback lag. (Deliberately no `fps_` — forcing a frame rate the source
 * isn't a clean multiple of adds judder that reads as more lag, not less.)
 */
export function projectVideoUrl(path: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${INTRO_TRIM_AND_CROP}/f_auto,q_auto:eco,w_960,c_fill,ar_${TILE_ASPECT}/${path}.mp4`;
}

/** A still from the first played frame — same trim + crop as the video. */
export function projectVideoPoster(path: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${INTRO_TRIM_AND_CROP}/f_auto,q_auto,w_960,c_fill,ar_${TILE_ASPECT}/${path}.jpg`;
}
