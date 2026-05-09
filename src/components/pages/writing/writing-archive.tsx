// 分类归档组件负责把当前分类下的文章按年份分组展示。
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getArticleShortDate, groupArticlesByYear } from "./writing-list-utils";
import type { ArticleItem } from "./writing-data";

// articles 是当前页文章，totalCount 是当前分类总数，activeCategoryLabel 展示分类名称。
type WritingArchiveProps = {
  articles: ArticleItem[];
  totalCount: number;
  activeCategoryLabel?: string;
};

// WritingArchive 不做筛选和分页，只负责归档视图的分组与渲染。
export function WritingArchive({ articles, totalCount, activeCategoryLabel }: WritingArchiveProps) {
  const yearGroups = groupArticlesByYear(articles);
  const startYear = yearGroups.at(-1)?.year;

  return (
    <>
      {/* 归档头部展示分类统计、分类名和起始年份说明。 */}
      <header className="grid gap-4 border-b border-zinc-200/65 pb-6 dark:border-white/10 md:grid-cols-[8rem_1fr] md:items-end">
        <div>
          <p className="text-xs tracking-[0.24em] text-zinc-400 dark:text-neutral-500">分类</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-light tracking-tight text-zinc-900 dark:text-neutral-50">{totalCount}</span>
            <span className="pb-2 text-xs text-zinc-400 dark:text-neutral-500">篇</span>
          </div>
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-dingtalk)] text-2xl font-semibold tracking-tight text-zinc-900 dark:text-neutral-50">{activeCategoryLabel}</h2>
          <p className="mt-2 text-sm text-zinc-400 dark:text-neutral-500">{startYear ? `始于 ${startYear} 年 · ` : ""}按时间整理这一类文章、笔记和实验记录。</p>
          <div className="mt-5 h-px w-14 bg-gradient-to-r from-sky-300 via-violet-300 to-transparent dark:from-sky-300/70 dark:via-violet-300/70" />
        </div>
      </header>

      <div className="space-y-5">
        {/* 循环年份分组，每组左侧显示年份和数量，右侧显示文章链接列表。 */}
        {yearGroups.map((group) => (
          <section key={group.year} className="grid gap-2 md:grid-cols-[8rem_1fr]">
            <div className="flex items-baseline gap-2 pt-1.5 md:block">
              <h3 className="text-3xl font-light tracking-tight text-zinc-300 dark:text-neutral-600">{group.year}</h3>
              <span className="text-xs text-zinc-400 dark:text-neutral-600 md:mt-1 md:block">{group.items.length} 篇</span>
            </div>

            <div className="divide-y divide-zinc-200/65 border-t border-zinc-200/65 dark:divide-white/10 dark:border-white/10">
              {/* 循环当前年份文章，生成可跳转的归档行。 */}
              {group.items.map((article) => (
                <Link key={article.title} href={article.href} className="group grid gap-x-5 gap-y-2 py-3 transition md:grid-cols-[minmax(0,1fr)_auto_4.5rem] md:items-center">
                  <span className="relative w-fit text-[0.95rem] font-medium leading-6 text-zinc-700 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-sky-400 after:transition-transform after:duration-300 group-hover:after:scale-x-100 dark:text-neutral-200 dark:after:bg-sky-300">{article.title}</span>
                  <span className="flex min-w-0 flex-wrap gap-1.5 md:justify-end">
                    {/* 每篇文章最多展示前两个标签，保持归档行紧凑。 */}
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full border border-zinc-200/80 bg-zinc-50/70 px-2 py-0.5 text-[0.68rem] leading-4 text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </span>
                  {/* 右侧显示短日期和 hover 时出现的跳转箭头。 */}
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 md:justify-end dark:text-neutral-500">
                    {getArticleShortDate(article.date)}
                    <ArrowUpRight className="size-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
