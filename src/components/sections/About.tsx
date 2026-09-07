import { Reveal } from "@/components/ui/Reveal";

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
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-fg/50">
              About SS Holdings
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-8">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-balance">
              We make surfaces that architects can build a room around.
            </h2>
            <p className="mt-6 max-w-2xl text-fg/70 leading-relaxed">
              SS Holdings works at the intersection of material science and
              interior design — producing tiles and surfaces engineered for
              durability without compromising on the tactile, visual quality
              a premium space demands. Every collection starts with how a
              surface will actually be lived on.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
