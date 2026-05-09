// 文章头部组件负责展示详情页标题和基础元信息。
import { CalendarDays, Eye, Heart, Timer } from "lucide-react";

import { formatArticleDate } from "./article-format";
import { articleTextColor } from "./article-mdx-components";
import type { ArticleDetail } from "./writing-data";

// ArticleDetail 提供详情页所需完整文章数据，此处只使用标题、日期、阅读时间和反馈数字。
type ArticleHeaderProps = {
  article: ArticleDetail;
};

// ArticleHeader 是详情页顶部的纯展示区，不包含交互状态。
export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="space-y-7 py-1 text-center">
      {/* 标题居中并限制宽度，颜色复用 MDX 正文文本色。 */}
      <h1 className={`mx-auto max-w-[58rem] text-balance font-[ui-sans-serif,system-ui,sans-serif] text-3xl font-semibold leading-tight tracking-normal md:text-[2.6rem] ${articleTextColor}`}>{article.title}</h1>

      {/* dl 用于语义化描述文章元信息，每项通过 sr-only 的 dt 标明含义。 */}
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
