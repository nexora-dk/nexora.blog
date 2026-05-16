import Link from "next/link";
import { Hammer } from "lucide-react";

import { GalleryFillImage } from "@/components/pages/gallery/gallery-image";
import type { ProjectItem } from "@/db/queries/projects.query";

function SectionTitle({ label, title, ghost }: { label: string; title: string; ghost: string }) {
  return (
    <div className="relative mx-auto w-fit px-10 py-4 text-center">
      <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-6xl font-black uppercase tracking-tight text-neutral-100 dark:text-neutral-900/80">
        {ghost}
      </span>
      <span className="absolute left-1/2 top-1/2 -z-10 h-14 w-48 -translate-x-1/2 -translate-y-1/2 -rotate-[-8deg] rounded-[50%] border border-neutral-300 dark:border-neutral-800" />
      <p className="font-serif text-sm italic leading-none text-neutral-500 dark:text-neutral-400">{label}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}

function ProjectPoster({ project }: { project: ProjectItem }) {
  if (!project.coverImageUrl) {
    return (
      <div className="relative min-h-56 overflow-hidden rounded-[1.45rem] bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-400 p-7 text-white dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.7),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.65),transparent_58%)]" />
        <div className="relative flex h-full min-h-44 flex-col justify-end">
          <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/82">{project.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-56 overflow-hidden rounded-[1.45rem] bg-neutral-100 p-7 text-white dark:bg-neutral-900">
      <GalleryFillImage
        src={project.coverImageUrl}
        alt={project.title}
        sizes="(max-width: 768px) 100vw, 500px"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />
      <div className="relative flex h-full min-h-44 flex-col justify-end">
        <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/82">{project.description}</p>
      </div>
    </div>
  );
}

export function Project({ projects }: { projects: ProjectItem[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="space-y-10">
      <SectionTitle label="project" title="精选项目" ghost="works" />
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={project.href ?? "/projects"}
            className="group overflow-hidden rounded-[2rem] border border-neutral-200/55 bg-white/60 p-4 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 dark:border-neutral-800/55 dark:bg-neutral-900/35"
          >
            <div className="flex items-center justify-between px-2 pb-4 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Hammer className="size-4" />
                项目
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">{project.status}</span>
            </div>
            <ProjectPoster project={project} />
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 py-1.5 pl-5 pr-1.5 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/55 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-50"
        >
          查看全部项目
          <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-xs text-white transition group-hover:translate-x-0.5 dark:bg-neutral-50 dark:text-neutral-950" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
