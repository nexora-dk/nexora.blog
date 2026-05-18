"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { LogIn, Pencil } from "lucide-react";

import {
  createReadmeCommentAction,
  deleteReadmeCommentAction,
} from "@/app/actions/readme-comments";
import type { ReadmeCommentTreeItem } from "@/db/queries/readme-comments.query";
import { authClient } from "@/lib/auth-client";

import {
  CommentEditor,
  type CommentEditorHandle,
} from "@/components/modules/comments/comment-editor";
import { CommentEmojiPicker } from "@/components/modules/comments/comment-emoji-picker";
import {
  CommentItem,
  type ReplyTarget,
} from "@/components/modules/comments/comment-item";
import {
  CommentSortMenu,
  type CommentSortMode,
} from "@/components/modules/comments/comment-sort-menu";

type ReadmeCommentsProps = {
  initialComments: ReadmeCommentTreeItem[];
};

function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

function subscribeToHydration() {
  return () => {};
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export function ReadmeComments({ initialComments }: ReadmeCommentsProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [sortMode, setSortMode] = useState<CommentSortMode>("latest");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const editorRef = useRef<CommentEditorHandle>(null);
  const { data: session } = authClient.useSession();
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const isSignedIn = hasHydrated && Boolean(session?.user);
  const sortedComments = useMemo(() => {
    return [...initialComments].sort((left, right) => {
      if (sortMode === "oldest") {
        return left.createdAt.getTime() - right.createdAt.getTime();
      }

      if (sortMode === "mostReplies") {
        const replyDiff = right.replies.length - left.replies.length;

        if (replyDiff !== 0) {
          return replyDiff;
        }
      }

      return right.createdAt.getTime() - left.createdAt.getTime();
    });
  }, [initialComments, sortMode]);

  const rootCommentCount = initialComments.length;
  const replyCount = initialComments.reduce(
    (total, comment) => total + comment.replies.length,
    0,
  );

  function openAuthDialog() {
    window.dispatchEvent(new Event("open-auth-dialog"));
  }

  function handleReply(target: ReplyTarget) {
    if (!isSignedIn) {
      openAuthDialog();
      return;
    }

    setReplyTarget(target);
    setError("");
    editorRef.current?.focusWrite();
  }

  function handleSubmit(
    event: Parameters<
      NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]>
    >[0],
  ) {
    event.preventDefault();

    const content = message.trim();

    if (!isSignedIn) {
      setError("请先登录后再评论");
      return;
    }

    if (!content || isPending) {
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await createReadmeCommentAction({
        content,
        parentId: replyTarget?.rootId ?? null,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMessage("");
      setReplyTarget(null);
      editorRef.current?.focusWrite();
      router.refresh();
    });
  }

  return (
    <section
      className="space-y-10 border-t border-zinc-200/70 pt-10 dark:border-white/10"
      aria-label="关于自述的评论"
    >
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/45 shadow-[0_10px_30px_rgba(24,24,27,0.035)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035] dark:shadow-black/20"
      >
        {replyTarget ? (
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 px-5 py-2.5 text-xs text-zinc-500 dark:border-white/10 dark:text-neutral-400">
            <span>
              正在回复 <strong className="font-semibold text-zinc-800 dark:text-neutral-100">@{replyTarget.authorName}</strong>
            </span>
            <button
              type="button"
              onClick={() => setReplyTarget(null)}
              className="font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              取消回复
            </button>
          </div>
        ) : null}

        <div className="relative">
          <CommentEditor
            ref={editorRef}
            value={message}
            onChange={setMessage}
            disabled={isPending || !isSignedIn}
            placeholder={
              isSignedIn
                ? replyTarget
                  ? `回复 @${replyTarget.authorName}...`
                  : "君之一言，胜却鞭策。"
                : "登录后参与评论。"
            }
          />

          {!isSignedIn ? (
            <button
              type="button"
              onClick={openAuthDialog}
              className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:-translate-y-[calc(50%+2px)] hover:bg-zinc-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <LogIn className="size-3.5" />
              登录
            </button>
          ) : null}
        </div>

        {error ? (
          <p className="border-t border-zinc-200/70 px-5 py-2 text-xs text-red-500 dark:border-white/10">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/70 px-4 py-3 text-xs text-zinc-500 dark:border-white/10 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid size-12 place-items-center overflow-hidden rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 shadow-sm shadow-zinc-950/[0.04] ring-4 ring-white dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-950">
              {isSignedIn && session?.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "用户头像"}
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              ) : (
                getAvatar(hasHydrated ? session?.user.name || "访客" : "访客")
              )}
            </div>

            <span>
              支持 <strong className="font-semibold">Markdown</strong> 与 GFM
            </span>
            <CommentEmojiPicker
              disabled={!isSignedIn || isPending}
              onEmojiSelect={(emoji) => editorRef.current?.insertText(emoji)}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="tabular-nums text-zinc-400 dark:text-neutral-500">
              {message.length} 字
            </span>
            <button
              type="submit"
              disabled={isPending || !isSignedIn || !message.trim()}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <Pencil className="size-3.5" />
              {isPending ? "发表中" : replyTarget ? "回复" : "发表"}
            </button>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-700 dark:text-neutral-300">
          {rootCommentCount} 条评论 · {replyCount} 条回复
        </p>
        <CommentSortMenu
          sortMode={sortMode}
          isOpen={isSortMenuOpen}
          onOpenChange={setIsSortMenuOpen}
          onSortChange={setSortMode}
        />
      </div>

      {initialComments.length > 0 ? (
        <div className="space-y-10">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="space-y-6">
              <CommentItem
                comment={comment}
                rootId={comment.id}
                currentUserId={session?.user.id}
                replyCount={comment.replies.length}
                onReply={handleReply}
                onDelete={(id) => deleteReadmeCommentAction({ id })}
              />
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  rootId={comment.id}
                  currentUserId={session?.user.id}
                  isReply
                  onReply={handleReply}
                  onDelete={(id) => deleteReadmeCommentAction({ id })}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-zinc-400 dark:text-neutral-500">
          暂无评论
        </p>
      )}
    </section>
  );
}
