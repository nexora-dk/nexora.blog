import { FriendsContent } from "@/components/pages/friends/friends-content";
import { PageShell } from "@/components/ui/page-shell";

export default function FriendsPage() {
  return (
    <PageShell title="友链" description="互联网上走散又相遇的朋友。">
      <FriendsContent />
    </PageShell>
  );
}
