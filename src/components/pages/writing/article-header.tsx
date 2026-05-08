import { CalendarDays, Eye, Heart, Timer } from "lucide-react";

import { formatArticleDate } from "./article-format";
import { articleTextColor } from "./article-mdx-components";
import type { ArticleDetail } from "./writing-data";

type ArticleHeaderProps = {
  article: ArticleDetail;
};

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="space-y-7 py-1 text-center">
      <h1 className={`mx-auto max-w-[58rem] text-balance font-[ui-sans-serif,system-ui,sans-serif] text-3xl font-semibold leading-tight tracking-normal md:text-[2.6rem] ${articleTextColor}`}>{article.title}</h1>

      <dl className="mx-auto flex max-w-[44rem] flex-wrap items-center justify-center gap-x-8 gap-y-2 font-[ui-sans-serif,system-ui,sans-serif] text-sm font-medium">
        <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
          <dt className="sr-only">发布日期</dt>
          <CalendarDays className="size-3.5" />
          <dd>{formatArticleDate(article.date)}</dd>
        </div>
        <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
          <dt className="sr-only">阅读时间</dt>
          <Timer className="size-3.5" />
          <dd>{article.readingTime}</dd>
        </div>
        <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
          <dt className="sr-only">浏览量</dt>
          <Eye className="size-3.5" />
          <dd>{article.views}</dd>
        </div>
        <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
          <dt className="sr-only">喜欢</dt>
          <Heart className="size-3.5" />
          <dd>{article.likes}</dd>
        </div>
      </dl>
    </header>
  );
}
