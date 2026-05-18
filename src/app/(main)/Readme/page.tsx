// 自述页面主体组件，负责展示更完整的个人介绍内容。
import { ReadmeContent } from "@/components/pages/readme/readme-content";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";
import { getReadmeComments } from "@/db/queries/readme-comments.query";
import { getDatabaseErrorMessage } from "@/db/queries/retry";

/**
 * 自述页面：展示关于作者、代码和生活的长介绍内容。
 */
export default async function ReadmePage() {
  let comments: Awaited<ReturnType<typeof getReadmeComments>> = [];

  try {
    comments = await getReadmeComments();
  } catch (error) {
    console.warn(`Failed to load readme comments: ${getDatabaseErrorMessage(error)}`);
  }

  return (
    // hideHeader 隐藏通用页头，让 ReadmeContent 自己控制页面开场展示。
    <PageShell title="自述" description="关于我、代码与生活的一段自我介绍。" hideHeader>
      {/* 自述内容组件负责具体文案和排版。 */}
      <ReadmeContent initialComments={comments} />
    </PageShell>
  );
}
