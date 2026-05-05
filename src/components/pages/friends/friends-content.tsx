import { ApplyLinksSection } from "./apply-links-section";
import { FriendCard } from "./friend-card";
import { friendLinks } from "./friends-data";

export function FriendsContent() {
  return (
    <div className="space-y-12 pt-4">
      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {friendLinks.map((friend) => (
            <FriendCard key={friend.name} friend={friend} />
          ))}
        </div>
      </section>

      <ApplyLinksSection />
    </div>
  );
}
