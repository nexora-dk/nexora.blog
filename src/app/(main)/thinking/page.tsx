import { ThinkingContent } from "@/components/pages/thinking/thinking-content";
import { PageShell } from "@/components/ui/page-shell";

export default function ThinkingPage() {
  return (
    <PageShell title="思考" description="谢谢你愿意听我诉讼🎉">
      <ThinkingContent />
    </PageShell>
  );
}
