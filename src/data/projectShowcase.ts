// Fill in the remaining Cloudinary paths below. `path` is everything after
// `/video/upload/` in the Cloudinary delivery URL — version + public id,
// e.g. "v1788597393/ssvideo1_v9cumr". Leave a slot as "" until its video is
// uploaded; the section renders an empty placeholder tile for it instead of
// requesting a broken URL.

export interface ShowcaseVideo {
  id: string;
  path: string;
}

export const showcaseVideos: ShowcaseVideo[] = [
  { id: "showcase-1", path: "v1788597393/ssvideo1_v9cumr" },
  { id: "showcase-2", path: "v1788597411/ssvideo2_zwbe3p" },
  { id: "showcase-3", path: "v1788597477/ssvideo3_ibmsps" },
  { id: "showcase-4", path: "v1788597487/ssvideo4_i49cxy" },
];
