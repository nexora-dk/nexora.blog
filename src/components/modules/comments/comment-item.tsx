"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MessageSquare, MoreVertical } from "lucide-react";

import { CommentDeleteDialog } from "./comment-delete-dialog";
import { CommentMarkdown } from "./comment-markdown";

export type ReplyTarget = {
  id: number;
  rootId: number;
  authorName: string;
};

export type CommentItemData = {
  id: number;
  parentId: number | null;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  content: string;
  createdAt: Date;
};

type CommentActionResult =
  | { success: true }
  | { success: false; message: string };

type CommentItemProps = {
  comment: CommentItemData;
  rootId: number;
  currentUserId?: string;
  isReply?: boolean;
  replyCount?: number;
  onReply: (target: ReplyTarget) => void;
  onDelete: (id: number) => Promise<CommentActionResult>;
};

function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

function formatCommentDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function CommentItem({
  comment,
  rootId,
  currentUserId,
  isReply,
  replyCount = 0,
  onReply,
  onDelete,
}: CommentItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const router = useRouter();
  const canDelete = currentUserId === comment.authorId;
  const deleteConfirmMessage =
    !isReply && replyCount > 0
      ? `删除这条评论会同时删除下方 ${replyCount} 条回复，确定继续吗？`
      : isReply
        ? "确定删除这条回复吗？"
        : "确定删除这条评论吗？";

  function copyCommentLink() {
    const url = `${window.location.origin}${window.location.pathname}#comment-${comment.id}`;
    void navigator.clipboard.writeText(url);
    setIsMenuOpen(false);
  }

  function deleteComment() {
    startDeleteTransition(async () => {
      const result = await onDelete(comment.id);

      if (result.success) {
        setIsMenuOpen(false);
        setIsDeleteDialogOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <article
      id={`comment-${comment.id}`}
      className={`grid grid-cols-[2.25rem_minmax(0,1fr)_1.75rem] gap-3 sm:grid-cols-[2.75rem_minmax(0,1fr)_2rem] sm:gap-4 ${
        isReply
          ? "ml-4 border-l border-zinc-200/70 pl-3 dark:border-white/10 sm:ml-14 sm:pl-4"
          : ""
      }`}
    >
      <div className="pt-1">
        <div className="grid size-9 place-items-center overflow-hidden rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 shadow-sm shadow-zinc-950/[0.04] ring-4 ring-white dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-950 sm:size-11 sm:text-sm">
          {comment.authorImage ? (
            <Image
              src={comment.authorImage}
              alt={comment.authorName}
              width={44}
              height={44}
              className="size-full object-cover"
            />
          ) : (
            getAvatar(comment.authorName)
          )}
        </div>
      </div>

      <div className="min-w-0 space-y-2.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
          <h3 className="min-w-0 break-words font-semibold text-zinc-950 dark:text-neutral-50">
            {comment.authorName}
          </h3>
          <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">
            {formatCommentDate(comment.createdAt)}
          </span>
        </div>

        <div className="group/comment flex max-w-full flex-wrap items-center gap-2">
          <div
            className={`${isReply ? "bg-zinc-50/85 text-[0.93rem]" : "bg-white/80 text-[0.98rem]"} inline-block max-w-full break-words rounded-2xl rounded-tl-md border border-zinc-200/75 px-3 py-2.5 leading-7 text-zinc-700 shadow-sm shadow-zinc-950/[0.035] backdrop-blur-xl transition group-hover/comment:border-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:group-hover/comment:border-white/20 sm:px-4`}
          >
            <CommentMarkdown content={comment.content} />
          </div>

          <button
            type="button"
            onClick={() =>
              onReply({
                id: comment.id,
                rootId,
                authorName: comment.authorName,
              })
            }
            className="grid size-8 shrink-0 place-items-center rounded-full border border-zinc-200/70 bg-white/80 text-zinc-400 opacity-0 shadow-sm shadow-zinc-950/[0.03] transition group-hover/comment:opacity-100 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-neutral-950/80 dark:text-neutral-500 dark:hover:border-white/20 dark:hover:text-neutral-100"
            aria-label={`回复 ${comment.authorName}`}
          >
            <MessageSquare className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="relative pt-1">
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="grid size-8 place-items-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-neutral-500 dark:hover:bg-white/10 dark:hover:text-neutral-200"
          aria-label="评论操作"
        >
          <MoreVertical className="size-4" />
        </button>

        {isMenuOpen ? (
          <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl border border-zinc-200/80 bg-white p-1.5 text-sm shadow-2xl shadow-zinc-950/10 dark:border-white/10 dark:bg-neutral-950 dark:shadow-black/30">
            <button
              type="button"
              onClick={copyCommentLink}
              className="w-full rounded-xl px-3 py-2 text-left text-zinc-700 transition hover:bg-zinc-100 dark:text-neutral-200 dark:hover:bg-white/10"
            >
              复制评论链接
            </button>

            {canDelete ? (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsDeleteDialogOpen(true);
                }}
                disabled={isDeleting}
                className="mt-1 w-full rounded-xl bg-red-50 px-3 py-2 text-left text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
              >
                {isDeleting ? "删除中" : "删除评论"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <CommentDeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        message={deleteConfirmMessage}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteComment}
      />
    </article>
  );
}
