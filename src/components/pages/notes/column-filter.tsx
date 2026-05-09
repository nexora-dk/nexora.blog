import Link from "next/link";
import type { NoteColumn } from "./notes-data";
import { noteColumns } from "./notes-data";

// 筛选条只关心当前激活的专栏值；未传入时表示“全部”。
type ColumnFilterProps = {
  activeColumn?: NoteColumn;
};

// 根据是否选中返回按钮视觉状态，集中维护避免每个 Link 重复条件样式。
function getFilterClassName(active: boolean) {
  return active
    ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
    : "border-neutral-200/70 bg-white/65 text-neutral-500 hover:border-neutral-300 hover:text-neutral-950 dark:border-white/10 dark:bg-neutral-950/35 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-100";
}

// 顶部专栏筛选组件：渲染“全部”和每个手记专栏入口，不直接处理列表数据。
export function ColumnFilter({ activeColumn }: ColumnFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* “全部”入口通过无 column 查询参数回到完整手记列表。 */}
      <Link href="/notes" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getFilterClassName(!activeColumn)}`}>
        全部
      </Link>
      {/* 循环渲染所有专栏元信息，URL 查询值与数据结构中的 value 保持一致。 */}
      {noteColumns.map((column) => (
        <Link key={column.value} href={`/notes?column=${column.value}`} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getFilterClassName(activeColumn === column.value)}`}>
          {column.label}
        </Link>
      ))}
    </div>
  );
}
