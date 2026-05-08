import { NotesContent } from "@/components/pages/notes/notes-content";
import { isNoteColumn, noteColumns } from "@/components/pages/notes/notes-data";
import { PageShell } from "@/components/ui/page-shell";

type NotesPageProps = {
  searchParams?: Promise<{
    column?: string | string[];
    page?: string | string[];
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const column = Array.isArray(params?.column) ? params.column[0] : params?.column;
  const page = Array.isArray(params?.page) ? params.page[0] : params?.page;
  const pageNumber = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const activeColumn = isNoteColumn(column) ? column : undefined;
  const columnLabel = noteColumns.find((item) => item.value === activeColumn)?.label;

  return (
    <PageShell title={columnLabel ? `专栏-${columnLabel}` : "手记"} description="记录日常观察、碎碎念和阶段性想法。" hideHeader={Boolean(columnLabel)}>
      <NotesContent selectedColumn={column} currentPage={pageNumber} />
    </PageShell>
  );
}
