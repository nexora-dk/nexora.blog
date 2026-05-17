import { AdminWritingsContent } from "@/components/pages/admin/writings/admin-writings-content";
import { getSiteSettings } from "@/db/queries/site-settings.query";
import { getWritingItems } from "@/db/queries/writings.query";

export default async function AdminWritingsPage() {
  const [writings, settings] = await Promise.all([
    getWritingItems(),
    getSiteSettings(),
  ]);

  return <AdminWritingsContent writings={writings} pageSize={settings.adminPageSize} />;
}
