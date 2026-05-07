import { CommentsContent } from "@/components/pages/comments/comments-content";
import { PageShell } from "@/components/ui/page-shell";

export default function CommentsPage() {
  return (
    <PageShell title="留言" description="快点留下你想对我说的话">
      <CommentsContent />
    </PageShell>
  );
}
