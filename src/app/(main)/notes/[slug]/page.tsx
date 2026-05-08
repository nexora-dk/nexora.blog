import { notFound } from "next/navigation";
import { NoteDetail } from "@/components/pages/notes/note-detail";
import { getNoteBySlug, getNoteStaticParams } from "@/components/pages/notes/notes-data";
import { PageShell } from "@/components/ui/page-shell";

type NotesDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getNoteStaticParams();
}

export default async function NotesDetailPage({ params }: NotesDetailPageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <PageShell title={note.title} description={note.description} hideHeader>
      <NoteDetail note={note} />
    </PageShell>
  );
}
