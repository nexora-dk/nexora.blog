import { NoteCard } from "./note-card";
import { NotesArchive } from "./notes-archive";
import { NotesPagination } from "./notes-pagination";
import { isNoteColumn, noteColumns, type NoteItem } from "./notes-data";

// 页面内容组件接收路由层解析出的 column 查询值和当前页码。
type NotesContentProps = {
  notes: NoteItem[];
  selectedColumn?: string;
  currentPage: number;
};

// 普通全部列表每页展示数量；专栏归档模式不使用分页切片。
const NOTES_PER_PAGE = 10;

// 空状态用于无手记或某个专栏暂无内容的条件渲染。
function NotesEmptyState() {
  return <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个专栏下暂时还没有手记。</section>;
}

// 手记列表内容控制器：决定展示全部分页列表，还是某个专栏的年份归档。
export function NotesContent({notes: noteItems, selectedColumn, currentPage }: NotesContentProps) {
  const activeColumn = isNoteColumn(selectedColumn) ? selectedColumn : undefined;
  const activeColumnMeta = noteColumns.find((column) => column.value === activeColumn);
  const notes = activeColumn ? noteItems.filter((note) => note.column === activeColumn) : noteItems;
  const totalPages = Math.max(1, Math.ceil(notes.length / NOTES_PER_PAGE));
  const page = activeColumn ? 1 : Math.min(Math.max(1, currentPage), totalPages);
  const visibleNotes = activeColumn ? notes : notes.slice((page - 1) * NOTES_PER_PAGE, page * NOTES_PER_PAGE);

  // 专栏模式进入归档视图：不分页，按年份分组展示该专栏的全部手记。
  if (activeColumn && activeColumnMeta) {
    return (
      <div className="pt-2">
        {/* 有内容渲染归档，无内容渲染同一个空状态组件。 */}
        {notes.length > 0 ? <NotesArchive notes={visibleNotes} totalCount={notes.length} activeColumn={activeColumn} activeColumnMeta={activeColumnMeta} /> : <NotesEmptyState />}
      </div>
    );
  }

  return (
    <div className="pt-4">
      {/* 全部模式优先渲染卡片列表和分页；没有任何手记时显示空状态。 */}
      {notes.length > 0 ? (
        <section className="grid gap-4">
          {/* visibleNotes 是当前页切片，循环渲染每张手记卡片。 */}
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
