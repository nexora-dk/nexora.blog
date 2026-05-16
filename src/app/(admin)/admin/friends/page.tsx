import { AdminFriendsContent } from "@/components/pages/admin/friends/admin-friends-content";
import { friendLinks } from "@/components/pages/friends/friends-data";

export default function AdminFriendsPage() {
  return <AdminFriendsContent friends={friendLinks} />;
}
