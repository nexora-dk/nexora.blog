import { AdminMessagesContent } from "@/components/pages/admin/messages/admin-messages-content";
import { getAdminGuestbookComments } from "@/db/queries/guestbook-comments.query";

export default async function AdminMessagesPage() {
  const messages = await getAdminGuestbookComments();

  return <AdminMessagesContent messages={messages} />;
}
