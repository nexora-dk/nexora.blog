import { CalendarDays } from "lucide-react";
import type { ProjectItem } from "./projects-data";

type ProjectCardProps = {
  project: ProjectItem;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex min-h-72 flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200/55 bg-white/65 p-4 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88">
      <div className="relative min-h-48 overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-pink-100 via-orange-100 to-sky-200 p-6 dark:from-pink-500/20 dark:via-orange-400/10 dark:to-sky-400/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.85),transparent_30%),linear-gradient(to_top,rgba(0,0,0,0.2),transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(to_top,rgba(0,0,0,0.38),transparent_65%)]" />
        <div className="relative flex min-h-36 flex-col justify-end">
          <h3 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{project.title}</h3>
          <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-neutral-500 backdrop-blur dark:bg-neutral-950/45 dark:text-neutral-400">
            <CalendarDays className="size-3.5" />
            {project.developmentTime}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <p className="line-clamp-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-neutral-200/70 px-2.5 py-1 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
