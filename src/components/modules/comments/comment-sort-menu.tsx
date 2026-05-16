"use client";

export type CommentSortMode = "latest" | "oldest" | "mostReplies";

const COMMENT_SORT_OPTIONS = [
  { value: "latest", label: "最新优先" },
  { value: "oldest", label: "最早优先" },
  { value: "mostReplies", label: "回复最多" },
] satisfies Array<{ value: CommentSortMode; label: string }>;

type CommentSortMenuProps = {
  sortMode: CommentSortMode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSortChange: (sortMode: CommentSortMode) => void;
};

export function getCommentSortLabel(sortMode: CommentSortMode) {
  return COMMENT_SORT_OPTIONS.find((option) => option.value === sortMode)?.label ?? "排序";
}

export function CommentSortMenu({
  sortMode,
  isOpen,
  onOpenChange,
  onSortChange,
}: CommentSortMenuProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className="inline-flex h-8 items-center rounded-full border border-zinc-200/80 bg-white/70 px-3 text-xs font-medium text-zinc-500 shadow-sm shadow-zinc-950/[0.03] transition hover:border-zinc-300 hover:text-zinc-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-200"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {getCommentSortLabel(sortMode)}
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-36 rounded-2xl border border-zinc-200/80 bg-white p-1.5 text-sm shadow-2xl shadow-zinc-950/10 dark:border-white/10 dark:bg-neutral-950 dark:shadow-black/30"
        >
          {COMMENT_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              onClick={() => {
                onSortChange(option.value);
                onOpenChange(false);
              }}
              className={`w-full rounded-xl px-3 py-2 text-left transition ${
                sortMode === option.value
                  ? "bg-zinc-100 font-medium text-zinc-950 dark:bg-white/10 dark:text-neutral-50"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-neutral-200 dark:hover:bg-white/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
