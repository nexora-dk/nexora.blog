import { AdminThinkingContent } from "@/components/pages/admin/thinking/admin-thinking-content";
import { getAdminThinkingItems } from "@/db/queries/thinking.query";

export default async function AdminThinkingPage() {
  const thoughts = await getAdminThinkingItems();

  return <AdminThinkingContent thoughts={thoughts} />;
}
