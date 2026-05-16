import { AdminNoteCreateContent } from "@/components/pages/admin/notes/admin-note-create-content";
import { noteColumns } from "@/components/pages/notes/notes-data";

export default function AdminNewNotePage() {
  return <AdminNoteCreateContent columns={noteColumns} />;
}
