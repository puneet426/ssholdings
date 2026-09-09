import { Reveal } from "@/components/ui/Reveal";

// The section is three plain statements now — no display headline above them,
// so "About Us" carries the heading semantics for the section.
const points = [
  "With 25 years of experience and 35+ projects delivered, SS Holdings has built a reputation for quality, trust, and reliability.",
  "We create thoughtfully designed homes with a strong focus on quality construction, attention to detail, and delivering every project on time, every time.",
  "For us, every home is more than a project. It is a promise we take seriously.",
];

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-bg py-13 text-fg sm:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-4">
            <div className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
            <h2 className="mt-4 text-xs uppercase tracking-[0.3em] text-fg/50">
              About Us
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-8">
            <ul className="max-w-2xl space-y-5">
              {points.map((point) => (
                <li
                  key={point}
                  className="text-lg leading-relaxed text-fg/80 sm:text-xl"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
