import { AdminNotesContent } from "@/components/pages/admin/notes/admin-notes-content";
import { getNoteItems } from "@/db/queries/notes.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export default async function AdminNotesPage() {
  const [notes, settings] = await Promise.all([
    getNoteItems(),
    getSiteSettings(),
  ]);

  return <AdminNotesContent notes={notes} pageSize={settings.adminPageSize} />;
}
