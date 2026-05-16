import { CommentsContent } from "@/components/pages/comments/comments-content";
import { PageShell } from "@/components/ui/page-shell";
import { getGuestbookComments } from "@/db/queries/guestbook-comments.query";
import { getDatabaseErrorMessage } from "@/db/queries/retry";

export default async function CommentsPage() {
  let comments: Awaited<ReturnType<typeof getGuestbookComments>> = [];

  try {
    comments = await getGuestbookComments();
  } catch (error) {
    console.warn(`Failed to load guestbook comments: ${getDatabaseErrorMessage(error)}`);
  }

  return (
    <PageShell title="留言" description="快点留下你想对我说的话">
      <CommentsContent initialComments={comments} />
    </PageShell>
  );
}
