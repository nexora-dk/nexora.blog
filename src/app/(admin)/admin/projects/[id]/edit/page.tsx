import { notFound } from "next/navigation";

import { AdminProjectCreateContent } from "@/components/pages/admin/projects/admin-project-create-content";
import { getAdminProjectById } from "@/db/queries/projects.query";

type AdminEditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProjectPage({
  params,
}: AdminEditProjectPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const project = await getAdminProjectById(numericId);

  if (!project) {
    notFound();
  }

  return (
    <AdminProjectCreateContent
      mode="edit"
      initialValue={{
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        category: project.category,
        tags: project.tags.join(", "),
        href: project.href ?? "",
        repoHref: project.repoHref ?? "",
        developmentTime: project.developmentTime,
        coverImageUrl: project.coverImageUrl ?? "",
        isFeatured: project.isFeatured,
        isVisible: project.isVisible,
        sortOrder: project.sortOrder,
      }}
    />
  );
}
