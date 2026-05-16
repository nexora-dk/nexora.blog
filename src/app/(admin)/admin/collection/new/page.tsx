import { AdminCollectionCreateContent } from "@/components/pages/admin/collection/admin-collection-create-content";
import { getCollectionGroupsForSelect } from "@/db/queries/collection.query";

export default async function AdminNewCollectionPage() {
  const groups = await getCollectionGroupsForSelect();

  return <AdminCollectionCreateContent groups={groups} />;
}
