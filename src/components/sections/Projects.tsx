"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/Reveal";
import { SectionGlow } from "@/components/ui/SectionGlow";
import { ProjectCard } from "@/components/project/ProjectCard";
import { projects } from "@/data/projects";

export function Projects() {
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-paper/10 bg-charcoal py-28 text-paper lg:py-36"
    >
      <SectionGlow tone="copper" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-xl">
          <div className="h-px w-10 bg-accent" />
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-paper/50">
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
            className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-7 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
          >
            See All Projects
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
