import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { Project } from "@/data/projects";

const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "border-accent-soft/40 text-accent-soft",
  Ongoing: "border-copper/40 text-copper",
};

/**
 * Shared card used on the homepage's project sections and the full
 * /projects listing — one place to keep the card's look consistent.
 *
 * The flagship project (`specialFocus`) gets an accent border and its own
 * badge so it reads as the one to look at first.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-fg/[0.04] transition-colors hover:bg-fg/[0.07] ${
        project.specialFocus
          ? "border-accent/40 hover:border-accent/60"
          : "border-fg/10 hover:border-fg/20"
      }`}
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-well">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span
          className={`absolute left-4 top-4 rounded-full border bg-well/70 px-3 py-1 text-xs font-medium backdrop-blur-sm ${STATUS_STYLES[project.status]}`}
        >
          {project.status}
        </span>
        {project.specialFocus && (
          <span className="absolute right-4 top-4 rounded-full border border-accent/50 bg-well/70 px-3 py-1 text-xs font-medium text-accent backdrop-blur-sm">
            Special Focus
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-fg/50">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
          {project.location}
        </p>
        <h3 className="font-display mt-3 text-xl font-medium leading-snug text-balance">
          {project.name}
        </h3>

        {project.homeSizes.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-xs text-fg/50">
            {project.homeSizes.map((size) => (
              <li key={size}>{size}</li>
            ))}
          </ul>
        )}

        {project.content.length > 0 && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg/65">
            {project.content[0]}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-accent-soft">
            View Project
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </span>
          {project.constructionMonths && (
            <span className="inline-flex items-center gap-1.5 text-xs text-fg/50">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              Built in {project.constructionMonths} months
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
