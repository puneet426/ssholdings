import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Ruler, Tag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { projects, getProjectBySlug, type Project } from "@/data/projects";

const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "border-accent-soft/40 text-accent-soft",
  Ongoing: "border-copper/40 text-copper",
  Upcoming: "border-slate/50 text-slate",
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectDetailsPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const facts = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Tag, label: "Type", value: project.type },
    { icon: Calendar, label: "Year", value: project.year },
    { icon: Ruler, label: "Area", value: project.area },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="relative overflow-hidden bg-bg pt-32 pb-16 text-fg lg:pt-40 lg:pb-24">
          <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-fg/60 transition-colors hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back to Home
              </Link>
              <span className="h-4 w-px bg-fg/15" aria-hidden="true" />
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-fg/60 transition-colors hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back to Projects
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border bg-well/40 px-3 py-1 text-xs font-medium ${STATUS_STYLES[project.status]}`}
              >
                {project.status}
              </span>
              <p className="text-xs uppercase tracking-[0.3em] text-fg/50">
                {project.year}
              </p>
            </div>

            <h1 className="font-display mt-4 text-3xl font-medium leading-tight text-balance sm:text-4xl lg:text-5xl">
              {project.name}
            </h1>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-fg/15 bg-fg/5 px-3 py-1 text-xs text-fg/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 aspect-16/9 w-full overflow-hidden rounded-xl border border-fg/10 bg-well">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 rounded-xl border border-fg/10 bg-fg/[0.04] p-6 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-2">
                  <fact.icon
                    className="h-5 w-5 text-accent-soft"
                    strokeWidth={1.5}
                  />
                  <p className="text-xs text-fg/50">{fact.label}</p>
                  <p className="text-sm font-medium text-fg">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-6 leading-relaxed text-fg/75">
              {project.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
