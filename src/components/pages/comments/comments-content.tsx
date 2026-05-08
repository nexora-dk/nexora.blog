"use client";

import { useState } from "react";
import { Image as ImageIcon, Pencil, Smile } from "lucide-react";
import { CommentCard } from "./comment-card";
import { commentItems } from "./comments-data";

function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

export function CommentsContent() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: Parameters<NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]>>[0]) {
    event.preventDefault();
    setName("");
    setMessage("");
    setIsEditorOpen(false);
  }

  return (
    <div className="mx-auto max-w-3xl pb-10 pt-2">
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200/70 pb-4 dark:border-white/10">
        <p className="text-sm font-semibold text-zinc-500 dark:text-neutral-400">{commentItems.length} 条留言</p>
        <button type="button" onClick={() => setIsEditorOpen((current) => !current)} className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm shadow-zinc-950/[0.03] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-500 dark:border-white/10 dark:bg-white/[0.045] dark:text-neutral-300 dark:hover:border-sky-300/25 dark:hover:text-sky-300" aria-expanded={isEditorOpen}>
          <span className="text-base leading-none">+</span>
          写留言
        </button>
      </div>

      {isEditorOpen ? (
        <form onSubmit={handleSubmit} className="mb-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/45 shadow-[0_10px_30px_rgba(24,24,27,0.035)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035] dark:shadow-black/20">
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="君之一言，胜却鞭策。" className="h-[120px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-7 text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-neutral-100 dark:placeholder:text-neutral-600" />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/70 px-4 py-3 text-xs text-zinc-500 dark:border-white/10 dark:text-neutral-400">
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 shadow-sm shadow-zinc-950/[0.04] ring-4 ring-white dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-950">{getAvatar(name || "访客")}</div>
              <span>支持 <strong className="font-semibold">Markdown</strong> 与 GFM</span>
              <ImageIcon className="size-4" />
              <Smile className="size-4" />
              <span>(・∀・)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="tabular-nums text-zinc-400 dark:text-neutral-500">{message.length} 字</span>
              <button type="submit" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200">
                <Pencil className="size-3.5" />
                发表
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <section className="space-y-10">
        {commentItems.map((item) => (
          <CommentCard key={`${item.name}-${item.date}`} item={item} />
        ))}
      </section>
    </div>
  );
}
