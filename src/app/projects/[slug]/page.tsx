import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Clock,
  FileText,
  MapPin,
  Ruler,
} from "lucide-react";
import { BackToHome } from "@/components/layout/BackToHome";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { projects, getProjectBySlug, type Project } from "@/data/projects";

const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "border-accent-soft/40 text-accent-soft",
  Ongoing: "border-copper/40 text-copper",
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
    description:
      project.content[0] ??
      `${project.name}, an SS Holdings development in ${project.location}.`,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailsPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // Back to the listing this project came from, not the other one.
  const listingHref =
    project.status === "Ongoing" ? "/projects/ongoing" : "/projects";

  // Only the facts this project actually has — SS Pearl has no sizes, ongoing
  // projects have no build time yet, and only some list block/home counts.
  const facts = [
    { icon: MapPin, label: "Location", values: [project.location] },
    project.homeSizes.length > 0 && {
      icon: Ruler,
      label: "Home Sizes",
      values: project.homeSizes,
    },
    project.constructionMonths && {
      icon: Clock,
      label: "Construction Time",
      values: [`${project.constructionMonths} months`],
    },
    project.scale && {
      icon: Building2,
      label: "Scale",
      values: project.scale,
    },
  ].filter(Boolean) as {
    icon: typeof MapPin;
    label: string;
    values: string[];
  }[];

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="relative overflow-hidden bg-bg pt-32 pb-16 text-fg lg:pt-40 lg:pb-24">
          <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <BackToHome
                section={
                  project.status === "Completed" ? "projects" : "ongoing-projects"
                }
              />
              <span className="h-4 w-px bg-fg/15" aria-hidden="true" />
              <Link
                href={listingHref}
                className="inline-flex items-center gap-2 text-sm text-fg/60 transition-colors hover:text-fg"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Back to {project.status} Projects
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border bg-well/40 px-3 py-1 text-xs font-medium ${STATUS_STYLES[project.status]}`}
              >
                {project.status}
              </span>
              {project.specialFocus && (
                <span className="rounded-full border border-accent/50 bg-well/40 px-3 py-1 text-xs font-medium text-accent">
                  Special Focus
                </span>
              )}
            </div>

            <h1 className="font-display mt-4 text-3xl font-medium leading-tight text-balance sm:text-4xl lg:text-5xl">
              {project.name}
            </h1>

            <div className="mt-10 aspect-16/9 w-full overflow-hidden rounded-xl border border-fg/10 bg-well">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            </div>

            {project.floorPlan && (
              <figure className="mt-10">
                <div className="overflow-hidden rounded-xl border border-fg/10 bg-white p-3 sm:p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.floorPlan}
                    alt={`${project.name} floor plan`}
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-fg/50">
                  Typical Floor Plan
                </figcaption>
              </figure>
            )}

            {project.brochure && (
              <div className="mt-8 flex justify-center">
                <a
                  href={project.brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-accent/50 px-7 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
                >
                  <FileText className="h-4 w-4" strokeWidth={1.5} />
                  View and Download Brochure
                </a>
              </div>
            )}

            <div className="mt-10 grid grid-cols-2 gap-6 rounded-xl border border-fg/10 bg-fg/[0.04] p-6 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-2">
                  <fact.icon
                    className="h-5 w-5 text-accent-soft"
                    strokeWidth={1.5}
                  />
                  <p className="text-xs text-fg/50">{fact.label}</p>
                  <div className="space-y-0.5">
                    {fact.values.map((value) => (
                      <p key={value} className="text-sm font-medium text-fg">
                        {value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {project.content.length > 0 && (
              <div className="mt-12 space-y-6 leading-relaxed text-fg/75">
                {project.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}

            {project.specs && (
              <div className="mt-16 border-t border-fg/10 pt-12">
                <h2 className="font-display text-2xl font-medium sm:text-3xl">
                  Specifications That Make a Difference
                </h2>

                <div className="mt-10 grid gap-10 sm:grid-cols-2">
                  {project.specs.map((group) => (
                    <section key={group.title}>
                      <h3 className="text-xs uppercase tracking-[0.3em] text-accent-soft">
                        {group.title}
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <li
                            key={item.name}
                            className="text-sm leading-relaxed text-fg/65"
                          >
                            <span className="font-medium text-fg">
                              {item.name}:
                            </span>{" "}
                            {item.detail}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
