import type { ProjectItem } from "@/db/queries/projects.query";
import { ProjectCard } from "./project-card";

type ProjectsContentProps = {
  projects: ProjectItem[];
};

export function ProjectsContent({ projects }: ProjectsContentProps) {
  return (
    <div className="pt-4">
      {projects.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-neutral-200/70 bg-white/55 p-10 text-center text-sm text-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-500">
          暂无公开项目
        </div>
      )}
    </div>
  );
}
