import { AdminNotesContent } from "@/components/pages/admin/notes/admin-notes-content";
import { getNoteItems } from "@/db/queries/notes.query";

export default async function AdminNotesPage() {
  const notes = await getNoteItems();

  return <AdminNotesContent notes={notes} />;
}
