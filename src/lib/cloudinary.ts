const CLOUD_NAME = "dp7clwitm";

/**
 * The source clips are shot at 1886×1060 — close to 16:9 (1.7792:1 vs
 * 1.7778:1) but not exact, so cropping to a hardcoded `ar_16:9` shaved a
 * sliver off every frame. Match the tile's CSS aspect-ratio (see
 * ProjectShowcase) to this exact source ratio so `c_fill` only resizes,
 * never crops.
 */
const SOURCE_ASPECT = "1886:1060";

/**
 * `path` is everything after `/video/upload/` in a Cloudinary delivery URL —
 * version + public id, e.g. "v1788597393/ssvideo1_v9cumr". Videos are served
 * as f_auto/q_auto (Cloudinary picks the smallest format/bitrate the
 * requesting browser supports) at a size that matches the grid card, so
 * nothing over-downloads.
 *
 * Deliberately no `so_` (start-offset) trim here: that forces Cloudinary to
 * re-encode the clip, and the first request for a given transformation pays
 * for that transcode live — visible as the video just not starting. The
 * 2-second-skip-intro behavior is done client-side instead (see
 * ProjectShowcase's `ShowcaseVideo`), which costs nothing server-side.
 */
export function projectVideoUrl(path: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto,w_1280,ar_${SOURCE_ASPECT},c_fill/${path}.mp4`;
}

/** A frame just past the 2s trim point, delivered as a still poster. */
export function projectVideoPoster(path: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_2,f_auto,q_auto,w_1280,ar_${SOURCE_ASPECT},c_fill/${path}.jpg`;
}
