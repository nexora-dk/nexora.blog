import { NoteCard } from "./note-card";
import { NotesArchive } from "./notes-archive";
import { NotesPagination } from "./notes-pagination";
import { isNoteColumn, noteColumns, noteItems } from "./notes-data";

type NotesContentProps = {
  selectedColumn?: string;
  currentPage: number;
};

const NOTES_PER_PAGE = 10;

function NotesEmptyState() {
  return <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个专栏下暂时还没有手记。</section>;
}

export function NotesContent({ selectedColumn, currentPage }: NotesContentProps) {
  const activeColumn = isNoteColumn(selectedColumn) ? selectedColumn : undefined;
  const activeColumnMeta = noteColumns.find((column) => column.value === activeColumn);
  const notes = activeColumn ? noteItems.filter((note) => note.column === activeColumn) : noteItems;
  const totalPages = Math.max(1, Math.ceil(notes.length / NOTES_PER_PAGE));
  const page = activeColumn ? 1 : Math.min(Math.max(1, currentPage), totalPages);
  const visibleNotes = activeColumn ? notes : notes.slice((page - 1) * NOTES_PER_PAGE, page * NOTES_PER_PAGE);

  if (activeColumn && activeColumnMeta) {
    return (
      <div className="pt-2">
        {notes.length > 0 ? <NotesArchive notes={visibleNotes} totalCount={notes.length} activeColumn={activeColumn} activeColumnMeta={activeColumnMeta} /> : <NotesEmptyState />}
      </div>
    );
  }

  return (
    <div className="pt-4">
      {notes.length > 0 ? (
        <section className="grid gap-4">
          {visibleNotes.map((note) => (
            <NoteCard key={note.href} note={note} />
          ))}
          <NotesPagination page={page} totalPages={totalPages} activeColumn={activeColumn} />
        </section>
      ) : (
        <NotesEmptyState />
      )}
    </div>
  );
}
