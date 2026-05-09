// 留言页面主体组件，负责展示留言列表或留言输入区域。
import { CommentsContent } from "@/components/pages/comments/comments-content";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 留言页面：给访客留下想法、反馈或问候的入口。
 */
export default function CommentsPage() {
  return (
    // 页面壳定义留言页标题和引导文案。
    <PageShell title="留言" description="快点留下你想对我说的话">
      {/* 留言主体组件负责具体留言卡片、内容区和交互展示。 */}
      <CommentsContent />
    </PageShell>
  );
}
