// 文稿页面主体组件，负责渲染文章列表、分类和分页。
import { WritingContent } from "@/components/pages/writing/writing-content";
// 文稿分类工具用于校验 URL 查询参数并读取分类展示文案。
import { isArticleCategory, writingCategories } from "@/components/pages/writing/writing-data";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

// 文稿页面接收 URL 查询参数，Next.js 16 中 searchParams 以 Promise 形式传入。
type WritingPageProps = {
  searchParams?: Promise<{
    // category 控制当前筛选的文章分类，可能来自单值参数或重复参数数组。
    category?: string | string[];
    // page 控制当前分页页码，同样需要兼容重复查询参数。
    page?: string | string[];
  }>;
};

/**
 * 文稿列表页面：根据查询参数展示全部文章或某个分类下的文章。
 */
export default async function WritingPage({ searchParams }: WritingPageProps) {
  // 等待 Next.js 提供的查询参数 Promise，未传参时保持 undefined。
  const params = await searchParams;
  // 当同名 category 出现多次时取第一个值作为当前分类。
  const category = Array.isArray(params?.category) ? params.category[0] : params?.category;
  // 当同名 page 出现多次时取第一个值作为当前页码。
  const page = Array.isArray(params?.page) ? params.page[0] : params?.page;
  // 只接受预定义分类，避免任意 URL 参数影响页面标题。
  const activeCategory = isArticleCategory(category) ? category : undefined;
  // 根据有效分类查找中文分类名，用于页面标题显示。
  const categoryLabel = writingCategories.find((item) => item.value === activeCategory)?.label;

  return (
    // 有分类时标题显示为“分类-xxx”，并隐藏默认页头，让分类页更像筛选结果页。
    <PageShell title={categoryLabel ? `分类-${categoryLabel}` : "文稿"} description="沉淀编程、前端和工程化相关的长文章。" hideHeader={Boolean(categoryLabel)}>
      {/* WritingContent 继续接收原始分类和页码，由内部完成列表筛选与分页渲染。 */}
      <WritingContent selectedCategory={category} selectedPage={page} />
    </PageShell>
  );
}
