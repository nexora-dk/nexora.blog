import Link from "next/link";
import { ArrowUpRight, CalendarDays, Eye, Heart } from "lucide-react";
import type { NoteItem } from "./notes-data";

// 卡片接收列表态手记数据，字段来自 notes-data 中裁剪后的 NoteItem。
type NoteCardProps = {
  note: NoteItem;
};

// 手记列表卡片：负责把单篇手记摘要、元信息和跳转入口组织成可点击区块。
export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={note.href} className="group block rounded-[1.6rem] border border-neutral-200/55 bg-white/65 p-5 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88">
      {/* article 承载一篇手记的列表摘要，桌面端把箭头操作区放到右侧。 */}
      <article className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="min-w-0">
          {/* 标题和描述来自 Markdown frontmatter，用于列表快速识别内容主题。 */}
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950 transition group-hover:text-neutral-700 dark:text-neutral-50 dark:group-hover:text-neutral-200">{note.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{note.description}</p>

          {/* 元信息行展示专栏、发布日期、浏览量和喜欢数，保持与详情页统计口径一致。 */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-400 dark:text-neutral-500">
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">{note.columnLabel}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              发布于 {note.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3.5" />
              {note.views}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="size-3.5" />
              {note.likes}
            </span>
          </div>
        </div>

        {/* 装饰性跳转箭头只在中等屏以上显示，aria-hidden 避免重复朗读。 */}
        <span className="hidden size-10 place-items-center rounded-full bg-neutral-100 text-neutral-400 transition group-hover:translate-x-1 group-hover:bg-neutral-950 group-hover:text-white md:grid dark:bg-neutral-900 dark:text-neutral-500 dark:group-hover:bg-neutral-50 dark:group-hover:text-neutral-950" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
      </article>
    </Link>
  );
}
