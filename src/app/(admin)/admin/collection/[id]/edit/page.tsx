import { notFound } from "next/navigation";

import { AdminCollectionCreateContent } from "@/components/pages/admin/collection/admin-collection-create-content";
import {
  getAdminCollectionItemById,
  getCollectionGroupsForSelect,
} from "@/db/queries/collection.query";

type AdminEditCollectionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditCollectionPage({
  params,
}: AdminEditCollectionPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const [item, groups] = await Promise.all([
    getAdminCollectionItemById(numericId),
    getCollectionGroupsForSelect(),
  ]);

  if (!item) {
    notFound();
  }

  return (
    <AdminCollectionCreateContent
      mode="edit"
      groups={groups}
      initialValue={{
        id: item.id,
        groupId: item.groupId,
        title: item.title,
        description: item.description,
        href: item.href ?? "",
        iconType: item.icon.type,
        iconName: item.icon.type === "simple" ? item.icon.name : "",
        iconSrc: item.icon.type === "image" ? item.icon.src ?? "" : "",
        iconAlt: item.icon.type === "image" ? item.icon.alt ?? "" : "",
        iconClassName: item.icon.className ?? "",
        isVisible: item.isVisible,
        sortOrder: item.sortOrder,
      }}
    />
  );
}
