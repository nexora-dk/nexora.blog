// 友链页面主体组件，负责渲染友链列表和申请入口。
import { FriendsContent } from "@/components/pages/friends/friends-content";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 友链页面：展示站点朋友、外部博客链接和友链说明。
 */
export default function FriendsPage() {
  return (
    // 页面壳负责展示“友链”标题和页面说明文案。
    <PageShell title="友链" description="互联网上走散又相遇的朋友。">
      {/* 友链内容组件内部处理卡片列表、申请链接等页面主体内容。 */}
      <FriendsContent />
    </PageShell>
  );
}
