import { AdminCollectionContent } from "@/components/pages/admin/collection/admin-collection-content";
import { getAdminCollectionItems } from "@/db/queries/collection.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export default async function AdminCollectionPage() {
  const [items, settings] = await Promise.all([
    getAdminCollectionItems(),
    getSiteSettings(),
  ]);

  return <AdminCollectionContent items={items} pageSize={settings.adminPageSize} />;
}
