import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getNotesPageHref } from "./notes-list-utils";
import type { NoteColumn } from "./notes-data";

// 分页组件接收当前页、总页数和可选专栏，用于生成稳定的上一页/下一页链接。
type NotesPaginationProps = {
  page: number;
  totalPages: number;
  activeColumn?: NoteColumn;
};

// 手记列表分页导航：只在需要分页时渲染，并通过 aria-disabled 表达边界状态。
export function NotesPagination({ page, totalPages, activeColumn }: NotesPaginationProps) {
  // 单页或无内容时不展示分页，避免出现无意义导航。
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/65 pt-5 text-sm dark:border-white/10" aria-label="手记分页">
      {/* 上一页在第一页时禁用点击，但仍保留位置让布局稳定。 */}
      <Link href={getNotesPageHref(page - 1, activeColumn)} aria-disabled={page === 1} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${page === 1 ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
        <ArrowLeft className="size-4" />
        上一页
      </Link>
      {/* 中间页码提示当前切片位置，不参与交互。 */}
      <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">
        第 {page} / {totalPages} 页
      </span>
      {/* 下一页在末页时禁用点击，链接生成逻辑会保留当前专栏条件。 */}
      <Link href={getNotesPageHref(page + 1, activeColumn)} aria-disabled={page === totalPages} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${page === totalPages ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
        下一页
        <ArrowRight className="size-4" />
      </Link>
    </nav>
  );
}
