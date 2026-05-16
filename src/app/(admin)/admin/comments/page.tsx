import { AdminCommentsContent } from "@/components/pages/admin/comments/admin-comments-content";
import { getAdminComments } from "@/db/queries/admin-comments.query";

export default async function AdminCommentsPage() {
  const comments = await getAdminComments();

  return <AdminCommentsContent comments={comments} />;
}
