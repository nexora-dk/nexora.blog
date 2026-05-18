import { getNoteItems } from "@/db/queries/notes.query";
import { getDatabaseErrorMessage } from "@/db/queries/retry";

import { NotesContent } from "@/components/pages/notes/notes-content";
// 手记专栏工具用于校验 URL 查询参数并读取专栏展示文案。
import { isNoteColumn, noteColumns, noteItems } from "@/components/pages/notes/notes-data";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

// 手记页面接收 URL 查询参数，Next.js 16 中 searchParams 以 Promise 形式传入。
type NotesPageProps = {
  searchParams?: Promise<{
    // column 控制当前筛选的手记专栏，可能来自单值参数或重复参数数组。
    column?: string | string[];
    // page 控制当前分页页码，同样需要兼容重复查询参数。
    page?: string | string[];
  }>;
};

/**
 * 手记列表页面：根据查询参数展示全部手记或某个专栏下的手记。
 */
export default async function NotesPage({ searchParams }: NotesPageProps) {
  // 等待 Next.js 提供的查询参数 Promise，未传参时保持 undefined。
  const params = await searchParams;
  // 当同名 column 出现多次时取第一个值作为当前专栏。
  const column = Array.isArray(params?.column) ? params.column[0] : params?.column;
  // 当同名 page 出现多次时取第一个值作为当前页码。
  const page = Array.isArray(params?.page) ? params.page[0] : params?.page;
  // 把 URL 中的页码转换成最小为 1 的数字，非法输入会回退到第一页。
  const pageNumber = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  // 只接受预定义专栏，避免任意 URL 参数影响页面标题。
  const activeColumn = isNoteColumn(column) ? column : undefined;
  // 根据有效专栏查找中文专栏名，用于页面标题显示。
  const columnLabel = noteColumns.find((item) => item.value === activeColumn)?.label;
  let notes = noteItems;

  try {
    notes = await getNoteItems();
  } catch (error) {
    console.warn(`Failed to load note items: ${getDatabaseErrorMessage(error)}`);
  }

  return (
    // 有专栏时标题显示为“专栏-xxx”，并隐藏默认页头，让专栏页更像筛选结果页。
    <PageShell title={columnLabel ? `专栏-${columnLabel}` : "手记"} description="记录日常观察、碎碎念和阶段性想法。" hideHeader={Boolean(columnLabel)}>
      {/* NotesContent 继续接收原始专栏值和规范化后的页码，由内部完成筛选与分页渲染。 */}
      <NotesContent notes={notes} selectedColumn={column} currentPage={pageNumber} />
    </PageShell>
  );
}
