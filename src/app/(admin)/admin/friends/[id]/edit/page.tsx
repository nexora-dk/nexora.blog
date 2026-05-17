import { notFound } from "next/navigation";

import { AdminFriendCreateContent } from "@/components/pages/admin/friends/admin-friend-create-content";
import { getAdminFriendLinkById } from "@/db/queries/friend-links.query";

type AdminEditFriendPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditFriendPage({
  params,
}: AdminEditFriendPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const friend = await getAdminFriendLinkById(numericId);

  if (!friend) {
    notFound();
  }

  return (
    <AdminFriendCreateContent
      mode="edit"
      initialValue={{
        id: friend.id,
        name: friend.name,
        description: friend.description,
        avatarUrl: friend.avatarUrl,
        blogUrl: friend.blogUrl,
        status: friend.status,
        isVisible: friend.isVisible,
        sortOrder: friend.sortOrder,
      }}
    />
  );
}
