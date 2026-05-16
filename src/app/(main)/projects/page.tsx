import { ProjectsContent } from "@/components/pages/projects/projects-content";
import { PageShell } from "@/components/ui/page-shell";
import { getProjects } from "@/db/queries/projects.query";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageShell title="项目" description="那些亲手造过的开源东西。">
      <ProjectsContent projects={projects} />
    </PageShell>
  );
}
