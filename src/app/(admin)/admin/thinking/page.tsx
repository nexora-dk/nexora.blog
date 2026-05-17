import { AdminThinkingContent } from "@/components/pages/admin/thinking/admin-thinking-content";
import { getSiteSettings } from "@/db/queries/site-settings.query";
import { getAdminThinkingItems } from "@/db/queries/thinking.query";

export default async function AdminThinkingPage() {
  const [thoughts, settings] = await Promise.all([
    getAdminThinkingItems(),
    getSiteSettings(),
  ]);

  return <AdminThinkingContent thoughts={thoughts} pageSize={settings.adminPageSize} />;
}
