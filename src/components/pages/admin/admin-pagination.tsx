type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel: string;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemLabel,
  onPreviousPage,
  onNextPage,
}: AdminPaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200/70 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-400">
        第 {currentPage} / {totalPages} 页，共 {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
        >
          上一页
        </button>
        <button
          type="button"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
