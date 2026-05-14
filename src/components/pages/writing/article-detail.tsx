// 文章详情页组合组件负责把头部、正文、目录、互动、页脚和评论区串联成完整页面。
import { ArticleBody } from "./article-body";
import { ArticleComments } from "./article-comments";
import { ArticleEngagement } from "./article-engagement";
import { ArticleFooter } from "./article-footer";
import { ArticleHeader } from "./article-header";
import { ArticleToc } from "./article-toc";
import type { ArticleDetail as ArticleDetailData } from "./writing-data";
import type { WritingCommentTreeItem } from "@/db/queries/writing-comments.query";


// article 是从数据层读取出的完整详情结构，包含正文 content、toc 和元信息。
type ArticleDetailProps = {
  article: ArticleDetailData;
  comments: WritingCommentTreeItem[];
};

// ArticleDetail 只做页面区块编排，不直接处理 Markdown 解析或客户端交互。
export function ArticleDetail({ article, comments }: ArticleDetailProps) {
  return (
    <article className="relative -mx-5 space-y-10 px-5 pt-2 lg:-mx-28 lg:px-28 xl:-mx-72 xl:px-72">
      {/* 顶部展示标题和文章元信息。 */}
      <ArticleHeader article={article} />

      {/* 主体网格左侧为正文内容，右侧在大屏显示目录。 */}
      <div className="mx-auto grid w-full max-w-[52rem] overflow-visible xl:grid-cols-[minmax(0,52rem)_0]">
        <div className="min-w-0 space-y-[17.5px]">
          {/* 正文、互动和页脚按阅读顺序纵向排列。 */}
          <ArticleBody content={article.content} />
          <ArticleEngagement articleSlug={article.slug} initialLikes={article.likes} />
          <ArticleFooter modifiedTime={article.modifiedTime} />
        </div>

        {/* 目录使用 toc 数据生成锚点导航；无目录时组件内部返回 null。 */}
        <ArticleToc items={article.toc} />
      </div>

      {/* 评论区与正文同宽，放在详情页末尾。 */}
      <div className="mx-auto w-full max-w-[52rem]">
        <ArticleComments articleTitle={article.title} slug={article.slug} initialComments={comments} />
      </div>
    </article>
  );
}
