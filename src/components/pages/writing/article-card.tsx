// 文章卡片组件负责在默认文稿列表中展示单篇文章摘要和跳转入口。
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Eye, Heart } from "lucide-react";
import type { ArticleItem } from "./writing-data";

// ArticleItem 是列表层数据结构，包含标题、描述、标签、日期、阅读反馈等展示字段。
type ArticleCardProps = {
  article: ArticleItem;
};

// ArticleCard 不维护状态，只根据传入 article 渲染可点击卡片。
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={article.href} className="group block rounded-[1.6rem] border border-neutral-200/55 bg-white/65 p-5 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88">
      {/* article 语义区包裹卡片主体，桌面端把内容和右侧箭头分成两列。 */}
      <article className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="min-w-0">
          {/* 标题和摘要来自 ArticleItem，摘要使用 line-clamp 控制列表高度。 */}
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 transition group-hover:text-neutral-700 dark:text-neutral-50 dark:group-hover:text-neutral-200">{article.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{article.description}</p>

          {/* 底部信息区左侧渲染标签，右侧渲染日期、浏览量和喜欢数。 */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {/* 循环标签数组生成胶囊标签，key 使用标签文本本身。 */}
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-neutral-200/70 px-2.5 py-1 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                  {tag}
                </span>
              ))}
            </div>

            {/* 元信息图标与数字只做展示，不参与交互。 */}
            <div className="flex items-center gap-3 text-xs font-medium text-neutral-400 dark:text-neutral-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="size-3.5" />
                {article.views}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="size-3.5" />
                {article.likes}
              </span>
            </div>
          </div>
        </div>

        {/* 装饰性箭头只在桌面显示，aria-hidden 避免重复朗读链接含义。 */}
        <span className="hidden size-10 place-items-center rounded-full bg-neutral-100 text-neutral-400 transition group-hover:translate-x-1 group-hover:bg-neutral-950 group-hover:text-white md:grid dark:bg-neutral-900 dark:text-neutral-500 dark:group-hover:bg-neutral-50 dark:group-hover:text-neutral-950" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
      </article>
    </Link>
  );
}
