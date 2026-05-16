import { notFound } from "next/navigation";

import { AdminWritingCreateContent } from "@/components/pages/admin/writings/admin-writing-create-content";
import {
  getArticleBySlug,
  writingCategories,
} from "@/components/pages/writing/writing-data";
import { getAdminWritingBySlug } from "@/db/queries/writings.query";

type AdminEditWritingPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminEditWritingPage({
  params,
}: AdminEditWritingPageProps) {
  const { slug } = await params;
  const [writing, article] = await Promise.all([
    getAdminWritingBySlug(slug),
    Promise.resolve(getArticleBySlug(slug)),
  ]);

  if (!writing || !article) {
    notFound();
  }

  return (
    <AdminWritingCreateContent
      mode="edit"
      categories={writingCategories}
      initialValue={{
        title: writing.title,
        slug: writing.slug,
        description: writing.description,
        category: writing.category,
        tags: writing.tags.join(", "),
        date: writing.date,
        readingTime: writing.readingTime,
        content: article.content,
      }}
    />
  );
}
