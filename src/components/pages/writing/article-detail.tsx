import { ArticleBody } from "./article-body";
import { ArticleComments } from "./article-comments";
import { ArticleEngagement } from "./article-engagement";
import { ArticleFooter } from "./article-footer";
import { ArticleHeader } from "./article-header";
import { ArticleToc } from "./article-toc";
import type { ArticleDetail as ArticleDetailData } from "./writing-data";

type ArticleDetailProps = {
  article: ArticleDetailData;
};

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="relative -mx-5 space-y-10 px-5 pt-2 lg:-mx-28 lg:px-28 xl:-mx-72 xl:px-72">
      <ArticleHeader article={article} />

      <div className="mx-auto grid w-full max-w-[52rem] overflow-visible xl:grid-cols-[minmax(0,52rem)_0]">
        <div className="min-w-0 space-y-[17.5px]">
          <ArticleBody content={article.content} />
          <ArticleEngagement articleSlug={article.slug} initialLikes={article.likes} />
          <ArticleFooter modifiedTime={article.modifiedTime} />
        </div>

        <ArticleToc items={article.toc} />
      </div>

      <div className="mx-auto w-full max-w-[52rem]">
        <ArticleComments articleTitle={article.title} />
      </div>
    </article>
  );
}
