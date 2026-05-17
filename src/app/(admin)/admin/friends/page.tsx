import { AdminFriendsContent } from "@/components/pages/admin/friends/admin-friends-content";
import { getAdminFriendLinks } from "@/db/queries/friend-links.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export default async function AdminFriendsPage() {
  const [friends, settings] = await Promise.all([
    getAdminFriendLinks(),
    getSiteSettings(),
  ]);

  return <AdminFriendsContent friends={friends} pageSize={settings.adminPageSize} />;
}
