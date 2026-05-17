import { AdminSettingsContent } from "@/components/pages/admin/settings/admin-settings-content";
import { getAdminSiteSettings } from "@/db/queries/site-settings.query";

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();

  return <AdminSettingsContent settings={settings} />;
}
