import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Project } from "@/data/projects";

const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "border-accent-soft/40 text-accent-soft",
  Ongoing: "border-copper/40 text-copper",
  Upcoming: "border-slate/50 text-slate",
};

/**
 * Shared card used on the homepage's Projects section and the full
 * /projects listing — one place to keep the card's look consistent.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-fg/10 bg-fg/[0.04] transition-colors hover:border-fg/20 hover:bg-fg/[0.07]"
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
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-fg/50">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
          {project.location}
        </p>
        <h3 className="font-display mt-3 text-xl font-medium leading-snug text-balance">
          {project.name}
        </h3>
        <p className="mt-1 text-xs text-fg/50">{project.type}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg/65">
          {project.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-soft">
          View Project
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </span>
      </div>
    </Link>
  );
}
