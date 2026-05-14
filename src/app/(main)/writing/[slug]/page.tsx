import {
  getWritingItemBySlug,
  incrementWritingViews,
} from "@/db/queries/writings.query";

import { getWritingComments } from "@/db/queries/writing-comments.query";


import { notFound } from "next/navigation";
// 文章详情组件负责展示正文、目录、评论和点赞等具体内容。
import { ArticleDetail } from "@/components/pages/writing/article-detail";
// 文稿数据工具提供通过 slug 查找文章以及生成静态参数的能力。
import {
  getArticleBySlug,
  getArticleStaticParams,
} from "@/components/pages/writing/writing-data";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

// 文章详情页接收动态路由参数，Next.js 16 中 params 是 Promise。
type WritingDetailPageProps = {
  params: Promise<{
    // slug 对应 URL 中的 [slug] 片段，用于查找具体文章。
    slug: string;
  }>;
};

// 禁止访问未在 generateStaticParams 中生成的动态参数，保证文章详情只来自已知内容。
export const dynamicParams = false;

/**
 * 生成文章详情页的静态路径参数，让 Next.js 在构建时预生成所有文章页面。
 */
export function generateStaticParams() {
  // 静态参数由文稿数据文件统一生成，避免路由层重复维护 slug 列表。
  return getArticleStaticParams();
}

/**
 * 文章详情页面：根据 slug 查找文章，存在则渲染详情，不存在则进入 404。
 */
export default async function WritingDetailPage({
  params,
}: WritingDetailPageProps) {
  // 等待动态路由参数 Promise，并取出文章 slug。
  const { slug } = await params;
  // 通过 slug 从本地文章数据中查找对应文章。
  const markdownArticle = getArticleBySlug(slug);

  if (!markdownArticle) {
    notFound();
  }

  await incrementWritingViews(slug);

  const databaseArticle = await getWritingItemBySlug(slug);
const comments = await getWritingComments(slug);

  // 如果没有匹配文章，立即交给 Next.js 渲染 not-found 页面。
  if (!databaseArticle) {
    notFound();
  }

  const article = {
    ...markdownArticle,
    ...databaseArticle,
    content: markdownArticle.content,
    toc: markdownArticle.toc,
  };

  return (
    // 详情页标题和描述来自文章本身；hideHeader 让 ArticleDetail 控制自己的头部排版。
    <PageShell
      title={article.title}
      description={article.description}
      hideHeader
    >
      {/* 文章详情组件负责正文、目录、代码块、互动区等完整展示。 */}
      <ArticleDetail article={article} comments={comments} />
    </PageShell>
  );
}
