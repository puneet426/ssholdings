import type { Metadata } from "next";
import { BackToHome } from "@/components/layout/BackToHome";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShowcaseVideo } from "@/components/sections/ShowcaseVideo";
import { showcaseVideos } from "@/data/projectShowcase";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Walkthroughs of SS Holdings homes in Visakhapatnam — a closer look at our apartments, interiors and finishes.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-bg pt-32 pb-16 text-fg lg:pt-40 lg:pb-24">
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <BackToHome section="project-showcase" />

            <div className="mt-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-fg/50">
                A Closer Look
              </p>
              <h1 className="font-display mt-4 text-4xl font-medium text-balance sm:text-5xl">
                Gallery
              </h1>
              <p className="mt-5 leading-relaxed text-fg/70">
                Step inside and explore the quality of SS Holdings. Every
                walkthrough, in full.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-3">
              {showcaseVideos.map((video) => (
                <ShowcaseVideo key={video.id} path={video.path} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
