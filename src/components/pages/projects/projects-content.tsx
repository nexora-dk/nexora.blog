import { ProjectCard } from "./project-card";
import { projectItems } from "./projects-data";

export function ProjectsContent() {
  return (
    <div className="pt-4">
      <section className="grid gap-5 md:grid-cols-2">
        {projectItems.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </section>
    </div>
  );
}
