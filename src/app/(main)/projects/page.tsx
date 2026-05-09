// 项目页面主体组件，负责展示项目列表和项目卡片。
import { ProjectsContent } from "@/components/pages/projects/projects-content";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 项目页面：集中展示作者亲手完成或维护的作品。
 */
export default function ProjectsPage() {
  return (
    // 页面壳定义项目页的标题和介绍。
    <PageShell title="项目" description="那些亲手造过的开源东西。">
      {/* 项目内容组件内部负责读取项目数据并渲染项目卡片列表。 */}
      <ProjectsContent />
    </PageShell>
  );
}
