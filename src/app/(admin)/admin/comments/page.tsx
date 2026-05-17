import { AdminCommentsContent } from "@/components/pages/admin/comments/admin-comments-content";
import { getAdminComments } from "@/db/queries/admin-comments.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export default async function AdminCommentsPage() {
  const [comments, settings] = await Promise.all([
    getAdminComments(),
    getSiteSettings(),
  ]);

  return <AdminCommentsContent comments={comments} pageSize={settings.adminPageSize} />;
}
