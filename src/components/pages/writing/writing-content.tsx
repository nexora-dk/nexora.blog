// 文稿内容组件负责根据 URL 参数筛选、分页并选择列表或归档展示模式。
import { ArticleCard } from "./article-card";
import { WritingArchive } from "./writing-archive";
import { WritingPagination } from "./writing-pagination";
import { isArticleCategory, writingCategories, type ArticleItem } from "./writing-data";


// selectedCategory 和 selectedPage 通常来自页面 searchParams，仍按字符串接收并在组件内校验。
type WritingContentProps = {
  articles: ArticleItem[];
  selectedCategory?: string;
  selectedPage?: string;
};


// 列表每页展示数量，分类归档和默认卡片列表共用同一分页尺寸。
const pageSize = 10;

// 空状态组件用于筛选后没有文章或文章列表为空时的兜底展示。
function WritingEmptyState() {
  return <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个分类下暂时还没有文章。</section>;
}

// WritingContent 是文稿页主体：分类存在时走归档视图，否则走卡片列表视图。
export function WritingContent({ articles: articleItems, selectedCategory, selectedPage }: WritingContentProps) {

  // 先用类型守卫校验分类参数，非法分类视为未选择分类。
  const activeCategory = isArticleCategory(selectedCategory) ? selectedCategory : undefined;
  const activeCategoryLabel = writingCategories.find((category) => category.value === activeCategory)?.label;
  // 根据分类过滤文章；未选分类时展示全部文章。
  const articles = activeCategory ? articleItems.filter((article) => article.category === activeCategory) : articleItems;
  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  const parsedPage = Number(selectedPage);
  // 页码只接受正整数，并限制在总页数以内。
  const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, totalPages) : 1;
  const pageArticles = articles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 有激活分类时使用按年份分组的归档布局。
  if (activeCategory) {
    return (
      <div className="pt-2">
        {articles.length > 0 ? (
          <section className="space-y-7">
            {/* 归档只接收当前页文章，同时用 totalCount 展示分类总数。 */}
            <WritingArchive articles={pageArticles} totalCount={articles.length} activeCategoryLabel={activeCategoryLabel} />
            <WritingPagination currentPage={currentPage} totalPages={totalPages} activeCategory={activeCategory} />
          </section>
        ) : (
          <WritingEmptyState />
        )}
      </div>
    );
  }

  // 未选择分类时展示默认卡片列表。
  return (
    <div className="pt-4">
      {articles.length > 0 ? (
        <>
          <section className="grid gap-4">
            {/* 循环当前页文章，渲染摘要卡片并链接到详情页。 */}
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
