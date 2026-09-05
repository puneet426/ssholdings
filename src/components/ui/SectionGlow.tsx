const TONE_CLASS = {
  clay: "bg-accent",
  sand: "bg-accent-soft",
  copper: "bg-copper",
  slate: "bg-slate",
} as const;

/**
 * A soft pair of blurred color pools pulled from the hero's material
 * textures (alchimia veining, the copper vault, moonlight onyx) — no
 * images, just CSS, so each section reads as a different "room" of the
 * same gallery without any extra network weight. Parent needs `relative
 * overflow-hidden`.
 */
export function SectionGlow({ tone }: { tone: keyof typeof TONE_CLASS }) {
  const cls = TONE_CLASS[tone];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute -top-32 -left-20 h-80 w-80 rounded-full opacity-[0.14] blur-[100px] ${cls}`}
      />
      <div
        className={`absolute -bottom-32 -right-20 h-96 w-96 rounded-full opacity-[0.1] blur-[120px] ${cls}`}
      />
    </div>
  );
}
