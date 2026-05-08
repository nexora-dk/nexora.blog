import { ArticleCard } from "./article-card";
import { WritingArchive } from "./writing-archive";
import { WritingPagination } from "./writing-pagination";
import { articleItems, isArticleCategory, writingCategories } from "./writing-data";

type WritingContentProps = {
  selectedCategory?: string;
  selectedPage?: string;
};

const pageSize = 10;

function WritingEmptyState() {
  return <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个分类下暂时还没有文章。</section>;
}

export function WritingContent({ selectedCategory, selectedPage }: WritingContentProps) {
  const activeCategory = isArticleCategory(selectedCategory) ? selectedCategory : undefined;
  const activeCategoryLabel = writingCategories.find((category) => category.value === activeCategory)?.label;
  const articles = activeCategory ? articleItems.filter((article) => article.category === activeCategory) : articleItems;
  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  const parsedPage = Number(selectedPage);
  const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, totalPages) : 1;
  const pageArticles = articles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (activeCategory) {
    return (
      <div className="pt-2">
        {articles.length > 0 ? (
          <section className="space-y-7">
            <WritingArchive articles={pageArticles} totalCount={articles.length} activeCategoryLabel={activeCategoryLabel} />
            <WritingPagination currentPage={currentPage} totalPages={totalPages} activeCategory={activeCategory} />
          </section>
        ) : (
          <WritingEmptyState />
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
          <WritingPagination currentPage={currentPage} totalPages={totalPages} activeCategory={activeCategory} />
        </>
      ) : (
        <WritingEmptyState />
      )}
    </div>
  );
}
