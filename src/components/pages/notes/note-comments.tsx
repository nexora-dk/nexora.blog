"use client";

import { useState } from "react";
import { Image as ImageIcon, MessageSquare, Pencil, Smile } from "lucide-react";
import { commentItems, type CommentItem, type CommentReply } from "@/components/pages/comments/comments-data";

type NoteCommentsProps = {
  noteTitle: string;
};

type PlainCommentProps = {
  comment: CommentItem | CommentReply;
  isReply?: boolean;
};

function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

function PlainComment({ comment, isReply }: PlainCommentProps) {
  return (
    <article className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 ${isReply ? "ml-14 border-l border-[#eadfce] pl-4 dark:border-white/10" : ""}`}>
      <div className="pt-1">
        <div className="grid size-11 place-items-center rounded-full border border-[#eadfce] bg-[#fdfcfa] text-sm font-semibold text-[#756b62] shadow-sm shadow-zinc-950/[0.04] ring-4 ring-[#fdfcfa] dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-[#141414]">{comment.avatar}</div>
      </div>

      <div className="min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <h3 className="font-semibold text-[#151d31] dark:text-neutral-50">{comment.name}</h3>
          {comment.role ? <span className="text-xs font-medium text-[#18181b] dark:text-neutral-200">{comment.role}</span> : null}
          <span className="text-xs font-medium text-[#9c8d80] dark:text-neutral-500">{comment.date}</span>
          {"location" in comment && comment.location ? <span className="text-xs font-medium text-[#9c8d80] dark:text-neutral-500">{comment.location}</span> : null}
        </div>

        <div className="group/comment flex max-w-full items-center gap-2">
          <p className={`${isReply ? "bg-[#fdfaf6]/85 text-[0.93rem]" : "bg-white/75 text-[0.98rem]"} inline-block max-w-full rounded-2xl rounded-tl-md border border-[#eadfce]/85 px-4 py-2.5 leading-7 text-[#473d35] shadow-sm shadow-zinc-950/[0.035] backdrop-blur-xl transition group-hover/comment:border-[#d7cab8] dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:group-hover/comment:border-white/20`}>
            {comment.message}
          </p>
          <button type="button" className="grid size-8 shrink-0 place-items-center rounded-full border border-[#eadfce] bg-white/75 text-[#9c8d80] opacity-0 shadow-sm shadow-zinc-950/[0.03] transition group-hover/comment:opacity-100 hover:border-[#d7cab8] hover:text-[#18181b] dark:border-white/10 dark:bg-neutral-950/80 dark:text-neutral-500 dark:hover:border-white/20 dark:hover:text-neutral-100" aria-label={`回复 ${comment.name}`}>
            <MessageSquare className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function NoteComments({ noteTitle }: NoteCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>(commentItems.slice(0, 2));
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const totalComments = comments.reduce((total, comment) => total + 1 + (comment.replies?.length ?? 0), 0);

  function handleSubmit(event: Parameters<NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]>>[0]) {
    event.preventDefault();
    const nextMessage = message.trim();

    if (!nextMessage) {
      return;
    }

    const nextName = name.trim() || "匿名访客";

    setComments((currentComments) => [
      {
        name: nextName,
        date: "刚刚",
        message: nextMessage,
        avatar: getAvatar(nextName),
      },
      ...currentComments,
    ]);
    setName("");
    setMessage("");
  }

  return (
    <section className="space-y-10 border-t border-[#eadfce] pt-10 dark:border-white/10" aria-label={`关于《${noteTitle}》的手记评论`}>
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-[#eadfce]/90 bg-[#fdfcfa]/70 shadow-[0_10px_30px_rgba(35,31,28,0.04)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035] dark:shadow-black/20">
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="君之一言，胜却鞭策。" className="h-[120px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-7 text-[#42382f] outline-none placeholder:text-[#a79b8d] dark:text-neutral-100 dark:placeholder:text-neutral-600" />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfce]/70 px-4 py-3 text-xs text-[#756b62] dark:border-white/10 dark:text-neutral-400">
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full border border-[#eadfce] bg-[#fdfcfa] text-sm font-semibold text-[#756b62] shadow-sm shadow-zinc-950/[0.04] ring-4 ring-[#fdfcfa] dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-[#141414]">{getAvatar(name || "访客")}</div>
              <span>支持 <strong className="font-semibold">Markdown</strong> 与 GFM</span>
              <ImageIcon className="size-4" />
              <Smile className="size-4" />
              <span>(・∀・)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="tabular-nums text-[#9c8d80] dark:text-neutral-500">{message.length} 字</span>
              <button type="submit" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#18181b] px-3.5 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#27272a] dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200">
                <Pencil className="size-3.5" />
                发表
              </button>
            </div>
          </div>
      </form>

      <p className="text-sm font-medium text-[#473d35] dark:text-neutral-300">共 {totalComments} 条评论</p>

      <div className="space-y-10">
        {comments.map((comment) => (
          <div key={`${comment.name}-${comment.date}-${comment.message}`} className="space-y-6">
            <PlainComment comment={comment} />
            {comment.replies?.map((reply) => (
              <PlainComment key={`${reply.name}-${reply.date}-${reply.message}`} comment={reply} isReply />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
