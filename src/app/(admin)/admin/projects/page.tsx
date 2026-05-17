import { AdminProjectsContent } from "@/components/pages/admin/projects/admin-projects-content";
import { getAdminProjects } from "@/db/queries/projects.query";
import { isRetryableDatabaseError } from "@/db/queries/retry";
import { getSiteSettings } from "@/db/queries/site-settings.query";

async function readAdminProjects() {
  try {
    return {
      projects: await getAdminProjects(),
      errorMessage: undefined,
    };
  } catch (error) {
    if (isRetryableDatabaseError(error)) {
      return {
        projects: [],
        errorMessage: "数据库暂时连接失败，请检查网络或 DATABASE_URL 后重试。",
      };
    }

    throw error;
  }
}

export default async function AdminProjectsPage() {
  const [{ projects, errorMessage }, settings] = await Promise.all([
    readAdminProjects(),
    getSiteSettings(),
  ]);

  return (
    <AdminProjectsContent
      projects={projects}
      pageSize={settings.adminPageSize}
      errorMessage={errorMessage}
    />
  );
}
