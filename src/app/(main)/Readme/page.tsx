import { ReadmeContent } from "@/components/pages/readme/readme-content";
import { PageShell } from "@/components/ui/page-shell";

export default function ReadmePage() {
  return (
    <PageShell title="自述" description="关于我、代码与生活的一段自我介绍。" hideHeader>
      <ReadmeContent />
    </PageShell>
  );
}
