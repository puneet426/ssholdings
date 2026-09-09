import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BackToHome } from "@/components/layout/BackToHome";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projectsByStatus, type ProjectStatus } from "@/data/projects";

interface ProjectListingProps {
  status: ProjectStatus;
  eyebrow: string;
  title: string;
  intro: string;
  /** The other listing, so neither page is a dead end. */
  otherHref: string;
  otherLabel: string;
}

/**
 * A full-page list of the projects with one status. Completed and Ongoing
 * each get their own page — a listing never mixes the two.
 */
export function ProjectListing({
  status,
  eyebrow,
  title,
  intro,
  otherHref,
  otherLabel,
}: ProjectListingProps) {
  const listed = projectsByStatus(status);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-bg pt-32 pb-16 text-fg lg:pt-40 lg:pb-24">
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <BackToHome
              section={status === "Completed" ? "projects" : "ongoing-projects"}
            />

            <div className="mt-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-fg/50">
                {eyebrow}
              </p>
              <h1 className="font-display mt-4 text-4xl font-medium text-balance sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 leading-relaxed text-fg/70">{intro}</p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listed.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <Link
                href={otherHref}
                className="inline-flex items-center gap-2 rounded-full border border-fg/20 px-7 py-3 text-sm font-medium text-fg transition-colors hover:bg-fg/10"
              >
                {otherLabel}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
