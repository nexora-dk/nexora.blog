import { ApplyLinksSection } from "./apply-links-section";
import { FriendCard } from "./friend-card";
import { friendLinks } from "./friends-data";

// FriendsContent 是友链页面的内容容器，负责组织友链列表和申请说明区。
export function FriendsContent() {
  return (
    <div className="space-y-12 pt-4">
      {/* 友链列表区：使用响应式网格承载每一张 FriendCard。 */}
      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 循环渲染静态友链数据，以 name 作为稳定 key 并把完整 friend 对象传给卡片。 */}
          {friendLinks.map((friend) => (
            <FriendCard key={friend.name} friend={friend} />
          ))}
        </div>
      </section>

      {/* 申请友链区：包含交换要求、本站信息和添加友链弹窗入口。 */}
      <ApplyLinksSection />
    </div>
  );
}
