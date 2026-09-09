"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { featuredByStatus, type ProjectStatus } from "@/data/projects";

interface ProjectsSectionProps {
  id: string;
  status: ProjectStatus;
  heading: string;
  intro: string;
  /** Where "see the rest" goes — that status's own listing page. */
  href: string;
  linkLabel: string;
  className: string;
}

/**
 * Two of a status's projects, then a link to the rest. Completed and Ongoing
 * each get their own homepage section and their own listing page.
 */
function ProjectsSection({
  id,
  status,
  heading,
  intro,
  href,
  linkLabel,
  className,
}: ProjectsSectionProps) {
  const featured = featuredByStatus(status);

  return (
    <section
      id={id}
      className={`relative overflow-hidden py-13 text-fg sm:py-16 lg:py-20 ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <div className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
            {heading}
          </h2>
          <p className="mt-4 text-fg/65">{intro}</p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
          {featured.map((project) => (
            <motion.div key={project.slug} variants={revealItemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="mt-12 flex justify-center">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full border border-fg/20 px-7 py-3 text-sm font-medium text-fg transition-colors hover:bg-fg/10"
          >
            {linkLabel}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function CompletedProjects() {
  return (
    <ProjectsSection
      id="projects"
      status="Completed"
      heading="Completed Projects"
      intro="Some of our completed projects"
      href="/projects"
      linkLabel="View All Completed Projects"
      className="bg-panel"
    />
  );
}

export function OngoingProjects() {
  return (
    <ProjectsSection
      id="ongoing-projects"
      status="Ongoing"
      heading="Ongoing Projects"
      intro="Homes we are building right now"
      href="/projects/ongoing"
      linkLabel="View All Ongoing Projects"
      className="bg-bg"
    />
  );
}
