"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projects } from "@/data/projects";

export function Projects() {
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-panel py-13 text-fg sm:py-16 lg:py-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <div className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-fg/50">
            Featured Projects
          </p>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-medium text-balance">
            Developments shaping Visakhapatnam's skyline.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <motion.div key={project.slug} variants={revealItemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-fg/20 px-7 py-3 text-sm font-medium text-fg transition-colors hover:bg-fg/10"
          >
            See All Projects
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
