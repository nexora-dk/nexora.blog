import { AdminCollectionContent } from "@/components/pages/admin/collection/admin-collection-content";
import { getAdminCollectionItems } from "@/db/queries/collection.query";

export default async function AdminCollectionPage() {
  const items = await getAdminCollectionItems();

  return <AdminCollectionContent items={items} />;
}
