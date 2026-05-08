import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getNotesPageHref } from "./notes-list-utils";
import type { NoteColumn } from "./notes-data";

type NotesPaginationProps = {
  page: number;
  totalPages: number;
  activeColumn?: NoteColumn;
};

export function NotesPagination({ page, totalPages, activeColumn }: NotesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/65 pt-5 text-sm dark:border-white/10" aria-label="手记分页">
      <Link href={getNotesPageHref(page - 1, activeColumn)} aria-disabled={page === 1} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${page === 1 ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
        <ArrowLeft className="size-4" />
        上一页
      </Link>
      <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">
        第 {page} / {totalPages} 页
      </span>
      <Link href={getNotesPageHref(page + 1, activeColumn)} aria-disabled={page === totalPages} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${page === totalPages ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
        下一页
        <ArrowRight className="size-4" />
      </Link>
    </nav>
  );
}
