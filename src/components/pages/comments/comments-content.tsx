"use client";

// Client Component：留言编辑器需要使用本地状态和表单事件，因此必须保持 use client 在第一行。
import { useState } from "react";
import { Image as ImageIcon, Pencil, Smile } from "lucide-react";
import { CommentCard } from "./comment-card";
import { commentItems } from "./comments-data";

// getAvatar 根据输入名称生成一个字符头像；空值时回退为“访”。
function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

// CommentsContent 是留言页主体，包含留言统计、编辑器开关、编辑表单和留言列表。
export function CommentsContent() {
  // isEditorOpen 控制留言编辑器是否展开。
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  // name 保存访客名称，当前用于头像字符预览。
  const [name, setName] = useState("");
  // message 保存留言内容，并驱动字数统计和 textarea 受控输入。
  const [message, setMessage] = useState("");

  // handleSubmit 阻止默认提交，并清空当前编辑状态后关闭编辑器。
  function handleSubmit(event: Parameters<NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]>>[0]) {
    event.preventDefault();
    setName("");
    setMessage("");
    setIsEditorOpen(false);
  }

  return (
    <div className="mx-auto max-w-3xl pb-10 pt-2">
      {/* 顶部栏展示留言数量，并提供展开/收起编辑器的按钮。 */}
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200/70 pb-4 dark:border-white/10">
        <p className="text-sm font-semibold text-zinc-500 dark:text-neutral-400">{commentItems.length} 条留言</p>
        <button type="button" onClick={() => setIsEditorOpen((current) => !current)} className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm shadow-zinc-950/[0.03] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-500 dark:border-white/10 dark:bg-white/[0.045] dark:text-neutral-300 dark:hover:border-sky-300/25 dark:hover:text-sky-300" aria-expanded={isEditorOpen}>
          <span className="text-base leading-none">+</span>
          写留言
        </button>
      </div>

      {/* 条件渲染留言编辑器：只有 isEditorOpen 为 true 时才显示表单。 */}
      {isEditorOpen ? (
        <form onSubmit={handleSubmit} className="mb-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/45 shadow-[0_10px_30px_rgba(24,24,27,0.035)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035] dark:shadow-black/20">
          {/* 受控 textarea 同步 message 状态，用于提交清空和字数统计。 */}
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="君之一言，胜却鞭策。" className="h-[120px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-7 text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-neutral-100 dark:placeholder:text-neutral-600" />

          {/* 表单底部工具栏展示头像预览、能力提示、装饰图标、字数统计和发表按钮。 */}
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

      {/* 留言列表区：按静态数据顺序渲染每张评论卡片。 */}
      <section className="space-y-10">
        {commentItems.map((item) => (
          <CommentCard key={`${item.name}-${item.date}`} item={item} />
        ))}
      </section>
    </div>
  );
}
