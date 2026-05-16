import { notFound } from "next/navigation";

import { AdminNoteCreateContent } from "@/components/pages/admin/notes/admin-note-create-content";
import {
  getNoteBySlug,
  noteColumns,
} from "@/components/pages/notes/notes-data";
import { getAdminNoteBySlug } from "@/db/queries/notes.query";

type AdminEditNotePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminEditNotePage({ params }: AdminEditNotePageProps) {
  const { slug } = await params;
  const [note, markdownNote] = await Promise.all([
    getAdminNoteBySlug(slug),
    Promise.resolve(getNoteBySlug(slug)),
  ]);

  if (!note || !markdownNote) {
    notFound();
  }

  return (
    <AdminNoteCreateContent
      mode="edit"
      columns={noteColumns}
      initialValue={{
        title: note.title,
        slug: note.slug,
        description: note.description,
        column: note.column,
        mood: note.mood ?? "",
        location: note.location ?? "",
        tags: note.tags.join(", "),
        date: note.date,
        publishedAt: note.publishedAt,
        readingTime: note.readingTime,
        insight: note.insight,
        content: markdownNote.content,
      }}
    />
  );
}
