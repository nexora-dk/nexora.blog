import { AdminProjectsContent } from "@/components/pages/admin/projects/admin-projects-content";
import { getAdminProjects } from "@/db/queries/projects.query";

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return <AdminProjectsContent projects={projects} />;
}
