// 思考页面主体组件，负责渲染碎片想法或观点列表。
import { ThinkingContent } from "@/components/pages/thinking/thinking-content";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 思考页面：展示作者的随想、观点或阶段性思考内容。
 */
export default function ThinkingPage() {
  return (
    // 页面壳定义思考页标题和欢迎文案。
    <PageShell title="思考" description="谢谢你愿意听我诉讼🎉">
      {/* 思考内容组件内部负责读取数据并渲染卡片列表。 */}
      <ThinkingContent />
    </PageShell>
  );
}
