import { AdminMessagesContent } from "@/components/pages/admin/messages/admin-messages-content";
import { getAdminGuestbookComments } from "@/db/queries/guestbook-comments.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export default async function AdminMessagesPage() {
  const [messages, settings] = await Promise.all([
    getAdminGuestbookComments(),
    getSiteSettings(),
  ]);

  return <AdminMessagesContent messages={messages} pageSize={settings.adminPageSize} />;
}
