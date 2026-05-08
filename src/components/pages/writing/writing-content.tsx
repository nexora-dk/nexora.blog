import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ArticleCard } from "./article-card";
import { articleItems, isArticleCategory, writingCategories } from "./writing-data";

type WritingContentProps = {
  selectedCategory?: string;
  selectedPage?: string;
};

const pageSize = 10;

function getArticleYear(date: string) {
  return date.match(/^(\d{4})年/)?.[1] ?? "未归档";
}

function getArticleShortDate(date: string) {
  const match = date.match(/^\d{4}年(\d{1,2})月(\d{1,2})日/);
  return match ? `${match[1]}月${match[2]}日` : date;
}

function getPageHref(page: number, category?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/writing?${query}` : "/writing";
}

export function WritingContent({ selectedCategory, selectedPage }: WritingContentProps) {
  const activeCategory = isArticleCategory(selectedCategory) ? selectedCategory : undefined;
  const activeCategoryLabel = writingCategories.find((category) => category.value === activeCategory)?.label;
  const articles = activeCategory ? articleItems.filter((article) => article.category === activeCategory) : articleItems;
  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  const parsedPage = Number(selectedPage);
  const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, totalPages) : 1;
  const pageArticles = articles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const yearGroups = pageArticles.reduce<Array<{ year: string; items: typeof pageArticles }>>((groups, article) => {
    const year = getArticleYear(article.date);
    const group = groups.find((item) => item.year === year);

    if (group) {
      group.items.push(article);
    } else {
      groups.push({ year, items: [article] });
    }

    return groups;
  }, []);
  const startYear = yearGroups.at(-1)?.year;
  const pagination =
    totalPages > 1 ? (
      <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/65 pt-5 text-sm dark:border-white/10" aria-label="文稿分页">
        <Link href={getPageHref(currentPage - 1, activeCategory)} aria-disabled={currentPage === 1} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${currentPage === 1 ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
          <ArrowLeft className="size-4" />
          上一页
        </Link>
        <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">
          第 {currentPage} / {totalPages} 页
        </span>
        <Link href={getPageHref(currentPage + 1, activeCategory)} aria-disabled={currentPage === totalPages} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium transition ${currentPage === totalPages ? "pointer-events-none border-zinc-200/60 text-zinc-300 dark:border-white/10 dark:text-neutral-700" : "border-zinc-200/80 text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"}`}>
          下一页
          <ArrowRight className="size-4" />
        </Link>
      </nav>
    ) : null;

  if (activeCategory) {
    return (
      <div className="pt-2">
        {articles.length > 0 ? (
          <section className="space-y-7">
            <header className="grid gap-4 border-b border-zinc-200/65 pb-6 dark:border-white/10 md:grid-cols-[8rem_1fr] md:items-end">
              <div>
                <p className="text-xs tracking-[0.24em] text-zinc-400 dark:text-neutral-500">分类</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-light tracking-tight text-zinc-900 dark:text-neutral-50">{articles.length}</span>
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
              {yearGroups.map((group) => (
                <section key={group.year} className="grid gap-2 md:grid-cols-[8rem_1fr]">
                  <div className="flex items-baseline gap-2 pt-1.5 md:block">
                    <h3 className="text-3xl font-light tracking-tight text-zinc-300 dark:text-neutral-600">{group.year}</h3>
                    <span className="text-xs text-zinc-400 dark:text-neutral-600 md:mt-1 md:block">{group.items.length} 篇</span>
                  </div>

                  <div className="divide-y divide-zinc-200/65 border-t border-zinc-200/65 dark:divide-white/10 dark:border-white/10">
                    {group.items.map((article) => (
                      <Link key={article.title} href={article.href} className="group grid gap-x-5 gap-y-2 py-3 transition md:grid-cols-[minmax(0,1fr)_auto_4.5rem] md:items-center">
                        <span className="relative w-fit text-[0.95rem] font-medium leading-6 text-zinc-700 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-sky-400 after:transition-transform after:duration-300 group-hover:after:scale-x-100 dark:text-neutral-200 dark:after:bg-sky-300">{article.title}</span>
                        <span className="flex min-w-0 flex-wrap gap-1.5 md:justify-end">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full border border-zinc-200/80 bg-zinc-50/70 px-2 py-0.5 text-[0.68rem] leading-4 text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400">
                              {tag}
                            </span>
                          ))}
                        </span>
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
            {pagination}
          </section>
        ) : (
          <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个分类下暂时还没有文章。</section>
        )}
      </div>
    );
  }

  return (
    <div className="pt-4">
      {articles.length > 0 ? (
        <>
          <section className="grid gap-4">
            {pageArticles.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </section>
          {pagination}
        </>
      ) : (
        <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个分类下暂时还没有文章。</section>
      )}
    </div>
  );
}
