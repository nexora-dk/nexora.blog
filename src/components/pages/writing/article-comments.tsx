"use client";

import { type FormEvent, useState } from "react";
import { CommentCard } from "@/components/pages/comments/comment-card";
import { commentItems, type CommentItem } from "@/components/pages/comments/comments-data";

type ArticleCommentsProps = {
  articleTitle: string;
};

function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

export function ArticleComments({ articleTitle }: ArticleCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>(commentItems.slice(0, 2));
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    <section className="space-y-8 border-t border-zinc-200/70 pt-10 dark:border-white/10" aria-labelledby="article-comments-title">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-400 dark:text-neutral-500">Comments</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="article-comments-title" className="font-[family-name:var(--font-dingtalk)] text-2xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50">
              评论
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-neutral-400">关于《{articleTitle}》的留言会显示在这里。</p>
          </div>
          <span className="text-sm font-medium text-zinc-400 dark:text-neutral-500">{comments.length} 条</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 border-y border-zinc-200/70 py-6 dark:border-white/10">
        <div className="grid gap-3 md:grid-cols-[12rem_1fr]">
          <label className="space-y-2 text-sm font-medium text-zinc-600 dark:text-neutral-300">
            <span>昵称</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="匿名访客" className="w-full rounded-2xl border border-zinc-200/80 bg-transparent px-4 py-3 text-sm font-normal text-zinc-800 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400 dark:border-white/10 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-white/25" />
          </label>
          <label className="space-y-2 text-sm font-medium text-zinc-600 dark:text-neutral-300">
            <span>留言</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="写下你的想法..." rows={4} className="w-full resize-none rounded-2xl border border-zinc-200/80 bg-transparent px-4 py-3 text-sm font-normal leading-6 text-zinc-800 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400 dark:border-white/10 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-white/25" />
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 dark:text-neutral-500">
          <span>当前留言会先显示在本页，接入数据库后再保存到服务端。</span>
          <button type="submit" className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200">
            发表留言
          </button>
        </div>
      </form>

      <div className="space-y-9">
        {comments.map((comment) => (
          <CommentCard key={`${comment.name}-${comment.date}-${comment.message}`} item={comment} />
        ))}
      </div>
    </section>
  );
}
