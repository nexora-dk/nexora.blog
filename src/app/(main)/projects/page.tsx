import { ProjectsContent } from "@/components/pages/projects/projects-content";
import { PageShell } from "@/components/ui/page-shell";

export default function ProjectsPage() {
  return (
    <PageShell title="项目" description="那些亲手造过的开源东西。">
      <ProjectsContent />
    </PageShell>
  );
}
