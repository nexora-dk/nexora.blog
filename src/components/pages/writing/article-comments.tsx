"use client";

// 客户端评论区组件负责展示示例评论、回复和本地新增评论表单。
import { useState } from "react";
import { Image as ImageIcon, MessageSquare, Pencil, Smile } from "lucide-react";
import { commentItems, type CommentItem, type CommentReply } from "@/components/pages/comments/comments-data";

// articleTitle 用于评论区 aria-label，说明评论所属文章。
type ArticleCommentsProps = {
  articleTitle: string;
};

// PlainComment 可接收主评论或回复；isReply 控制缩进和边线样式。
type PlainCommentProps = {
  comment: CommentItem | CommentReply;
  isReply?: boolean;
};

// 根据名称生成头像占位字符，空名称时回退为“访”。
function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

// PlainComment 负责单条评论气泡渲染，不管理评论列表状态。
function PlainComment({ comment, isReply }: PlainCommentProps) {
  return (
    <article className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 ${isReply ? "ml-14 border-l border-zinc-200/70 pl-4 dark:border-white/10" : ""}`}>
      {/* 左侧头像显示数据自带 avatar 或新评论生成的首字。 */}
      <div className="pt-1">
        <div className="grid size-11 place-items-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 shadow-sm shadow-zinc-950/[0.04] ring-4 ring-white dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-950">{comment.avatar}</div>
      </div>

      <div className="min-w-0 space-y-2.5">
        {/* 评论头部展示昵称、可选身份、日期和可选位置。 */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <h3 className="font-semibold text-zinc-950 dark:text-neutral-50">{comment.name}</h3>
          {comment.role ? <span className="text-xs font-medium text-zinc-900 dark:text-neutral-200">{comment.role}</span> : null}
          <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">{comment.date}</span>
          {"location" in comment && comment.location ? <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">{comment.location}</span> : null}
        </div>

        {/* 评论正文气泡和回复按钮组成一行，回复样式通过 isReply 条件区分。 */}
        <div className="group/comment flex max-w-full items-center gap-2">
          <p className={`${isReply ? "bg-zinc-50/85 text-[0.93rem]" : "bg-white/80 text-[0.98rem]"} inline-block max-w-full rounded-2xl rounded-tl-md border border-zinc-200/75 px-4 py-2.5 leading-7 text-zinc-700 shadow-sm shadow-zinc-950/[0.035] backdrop-blur-xl transition group-hover/comment:border-zinc-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:group-hover/comment:border-white/20`}>
            {comment.message}
          </p>
          <button type="button" className="grid size-8 shrink-0 place-items-center rounded-full border border-zinc-200/70 bg-white/80 text-zinc-400 opacity-0 shadow-sm shadow-zinc-950/[0.03] transition group-hover/comment:opacity-100 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-neutral-950/80 dark:text-neutral-500 dark:hover:border-white/20 dark:hover:text-neutral-100" aria-label={`回复 ${comment.name}`}>
            <MessageSquare className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

// ArticleComments 管理评论输入、提交和当前展示的评论列表。
export function ArticleComments({ articleTitle }: ArticleCommentsProps) {
  // 初始只取评论数据前两条，模拟详情页下方的简短讨论区。
  const [comments, setComments] = useState<CommentItem[]>(commentItems.slice(0, 2));
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  // 统计主评论和回复总数，使用 reduce 累加可选 replies 长度。
  const totalComments = comments.reduce((total, comment) => total + 1 + (comment.replies?.length ?? 0), 0);

  // 表单提交只在本地插入新评论，不发起网络请求。
  function handleSubmit(event: Parameters<NonNullable<React.ComponentPropsWithoutRef<"form">["onSubmit"]>>[0]) {
    event.preventDefault();
    const nextMessage = message.trim();

    // 空评论不插入列表，避免出现无内容气泡。
    if (!nextMessage) {
      return;
    }

    const nextName = name.trim() || "匿名访客";

    // 新评论插到列表顶部，并生成头像、日期等展示字段。
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
    <section className="space-y-10 border-t border-zinc-200/70 pt-10 dark:border-white/10" aria-label={`关于《${articleTitle}》的评论`}>
      {/* 评论表单包含正文输入、编辑辅助信息、字数统计和提交按钮。 */}
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/45 shadow-[0_10px_30px_rgba(24,24,27,0.035)] backdrop-blur dark:border-white/10 dark:bg-white/[0.035] dark:shadow-black/20">
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="君之一言，胜却鞭策。" className="h-[120px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-7 text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-neutral-100 dark:placeholder:text-neutral-600" />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/70 px-4 py-3 text-xs text-zinc-500 dark:border-white/10 dark:text-neutral-400">
          {/* 左侧展示头像预览和 Markdown 支持提示。 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid size-12 place-items-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 shadow-sm shadow-zinc-950/[0.04] ring-4 ring-white dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-950">{getAvatar(name || "访客")}</div>
            <span>支持 <strong className="font-semibold">Markdown</strong> 与 GFM</span>
            <ImageIcon className="size-4" />
            <Smile className="size-4" />
            <span>(・∀・)</span>
          </div>

          {/* 右侧展示输入字数和提交操作。 */}
          <div className="flex items-center gap-3">
            <span className="tabular-nums text-zinc-400 dark:text-neutral-500">{message.length} 字</span>
            <button type="submit" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200">
              <Pencil className="size-3.5" />
              发表
            </button>
          </div>
        </div>
      </form>

      {/* 评论总数包含回复数量。 */}
      <p className="text-sm font-medium text-zinc-700 dark:text-neutral-300">共 {totalComments} 条评论</p>

      <div className="space-y-10">
        {/* 先循环主评论，再在每条主评论下循环其 replies。 */}
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
