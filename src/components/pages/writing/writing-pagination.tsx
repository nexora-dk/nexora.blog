// 文稿分页组件负责渲染上一页、当前页信息和下一页链接。
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getWritingPageHref } from "./writing-list-utils";
import type { ArticleCategory } from "./writing-data";

// currentPage 和 totalPages 控制禁用态；activeCategory 用于分页时保留分类筛选。
type WritingPaginationProps = {
  currentPage: number;
  totalPages: number;
  activeCategory?: ArticleCategory;
};

// WritingPagination 不改变页码，只通过链接让路由查询参数驱动列表更新。
export function WritingPagination({ currentPage, totalPages, activeCategory }: WritingPaginationProps) {
  // 只有一页或没有额外页时隐藏分页控件。
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/65 pt-5 text-sm dark:border-white/10" aria-label="文稿分页">
      {/* 上一页链接在第一页时通过 aria-disabled 和 pointer-events 禁用。 */}
      <Link href={getWritingPageHref(currentPage - 1, activeCategory)} aria-disabled={currentPage === 1} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${currentPage === 1 ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
        <ArrowLeft className="size-4" />
        上一页
      </Link>
      {/* 中间页码文本说明当前分页位置。 */}
      <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">
        第 {currentPage} / {totalPages} 页
      </span>
      {/* 下一页链接在最后一页时禁用，仍保留相同布局宽度。 */}
      <Link href={getWritingPageHref(currentPage + 1, activeCategory)} aria-disabled={currentPage === totalPages} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${currentPage === totalPages ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
        下一页
        <ArrowRight className="size-4" />
      </Link>
    </nav>
  );
}
