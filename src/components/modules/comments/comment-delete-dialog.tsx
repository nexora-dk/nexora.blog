"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type CommentDeleteDialogProps = {
  isOpen: boolean;
  isDeleting: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CommentDeleteDialog({
  isOpen,
  isDeleting,
  message,
  onCancel,
  onConfirm,
}: CommentDeleteDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-zinc-950/20 px-5 backdrop-blur-sm dark:bg-black/45">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="取消删除评论"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-[360px] rounded-3xl border border-zinc-200/80 bg-white/95 px-6 pb-6 pt-7 text-center shadow-2xl shadow-zinc-950/15 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/95 dark:shadow-black/40">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-neutral-50">
          删除确认
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-neutral-400">
          {message}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex h-9 items-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-neutral-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-9 items-center rounded-full bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-400"
          >
            {isDeleting ? "删除中" : "确认删除"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
