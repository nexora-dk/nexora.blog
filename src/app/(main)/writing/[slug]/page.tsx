import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/pages/writing/article-detail";
import { getArticleBySlug, getArticleStaticParams } from "@/components/pages/writing/writing-data";
import { PageShell } from "@/components/ui/page-shell";

type WritingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleStaticParams();
}

export default async function WritingDetailPage({ params }: WritingDetailPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <PageShell title={article.title} description={article.description} hideHeader>
      <ArticleDetail article={article} />
    </PageShell>
  );
}
