import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Residential developments by SS Holdings across Visakhapatnam — completed, ongoing and upcoming.",
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-bg pt-32 pb-16 text-fg lg:pt-40 lg:pb-24">
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-fg/60 transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              Back to Home
            </Link>

            <div className="mt-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-fg/50">
                Our Developments
              </p>
              <h1 className="font-display mt-4 text-4xl font-medium text-balance sm:text-5xl">
                Projects
              </h1>
              <p className="mt-5 leading-relaxed text-fg/70">
                A look at what SS Holdings has built, is building, and is
                planning next across Visakhapatnam — from completed
                residencies to upcoming villa communities.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
