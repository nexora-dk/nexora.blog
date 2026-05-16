import { AdminCollectionContent } from "@/components/pages/admin/collection/admin-collection-content";
import { collectionGroups } from "@/components/pages/collection/collection-data";

export default function AdminCollectionPage() {
  return <AdminCollectionContent groups={collectionGroups} />;
}
