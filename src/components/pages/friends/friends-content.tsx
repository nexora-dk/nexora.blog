import type { FriendLinkItem } from "@/db/queries/friend-links.query";
import type { SiteSettings } from "@/lib/site-settings-defaults";
import { ApplyLinksSection } from "./apply-links-section";
import { FriendCard } from "./friend-card";

type FriendsContentProps = {
  friends: FriendLinkItem[];
  settings: Pick<
    SiteSettings,
    | "friendApplyEnabled"
    | "friendApplyIntro"
    | "friendApplyNotes"
    | "friendOwnName"
    | "friendOwnUrl"
    | "friendOwnAvatarUrl"
    | "friendOwnDescription"
    | "friendApplySuccessMessage"
  >;
};

export function FriendsContent({ friends, settings }: FriendsContentProps) {
  return (
    <div className="space-y-12 pt-4">
      <section>
        {friends.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-neutral-200/70 bg-white/55 p-10 text-center text-sm text-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-500">
            暂无公开友链
          </div>
        )}
      </section>

      <ApplyLinksSection settings={settings} />
    </div>
  );
}
