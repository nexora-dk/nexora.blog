import { FriendsContent } from "@/components/pages/friends/friends-content";
import { PageShell } from "@/components/ui/page-shell";
import { getFriendLinks } from "@/db/queries/friend-links.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export default async function FriendsPage() {
  const [friends, settings] = await Promise.all([
    getFriendLinks(),
    getSiteSettings(),
  ]);

  return (
    <PageShell title={settings.friendPageTitle} description={settings.friendPageDescription}>
      <FriendsContent friends={friends} settings={settings} />
    </PageShell>
  );
}
