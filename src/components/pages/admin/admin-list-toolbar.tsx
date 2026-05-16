import Link from "next/link";
import { Plus, Search } from "lucide-react";

type AdminListToolbarProps = {
  title: string;
  count: number;
  countLabel: string;
  searchPlaceholder: string;
  actionLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actionHref?: string;
};

export function AdminListToolbar({
  title,
  count,
  countLabel,
  searchPlaceholder,
  actionLabel,
  searchValue,
  onSearchChange,
  actionHref,
}: AdminListToolbarProps) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          {title}
        </h2>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
          {count} {countLabel}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block sm:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 pl-11 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20"
          />
        </label>

        {actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex h-12 min-w-24 items-center justify-center gap-2 rounded-2xl border border-neutral-200/80 bg-white/90 px-6 text-sm font-semibold text-neutral-950 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.08] dark:text-neutral-50 dark:hover:bg-white/[0.12]"
          >
            <Plus className="size-4" />
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex h-12 min-w-24 items-center justify-center gap-2 rounded-2xl border border-neutral-200/80 bg-white/90 px-6 text-sm font-semibold text-neutral-950 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/[0.08] dark:text-neutral-50 dark:hover:bg-white/[0.12]"
          >
            <Plus className="size-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
