import { WritingContent } from "@/components/pages/writing/writing-content";
import { isArticleCategory, writingCategories } from "@/components/pages/writing/writing-data";
import { PageShell } from "@/components/ui/page-shell";

type WritingPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
    page?: string | string[];
  }>;
};

export default async function WritingPage({ searchParams }: WritingPageProps) {
  const params = await searchParams;
  const category = Array.isArray(params?.category) ? params.category[0] : params?.category;
  const page = Array.isArray(params?.page) ? params.page[0] : params?.page;
  const activeCategory = isArticleCategory(category) ? category : undefined;
  const categoryLabel = writingCategories.find((item) => item.value === activeCategory)?.label;

  return (
    <PageShell title={categoryLabel ? `分类-${categoryLabel}` : "文稿"} description="沉淀编程、前端和工程化相关的长文章。" hideHeader={Boolean(categoryLabel)}>
      <WritingContent selectedCategory={category} selectedPage={page} />
    </PageShell>
  );
}
