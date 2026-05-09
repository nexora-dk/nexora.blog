// 文章互动区组件负责承载详情页点赞入口。
import { ArticleLikeButton } from "./article-like-button";

// articleSlug 用于客户端存储点赞状态，initialLikes 用于初始化展示计数。
type ArticleEngagementProps = {
  articleSlug: string;
  initialLikes: string;
};

// ArticleEngagement 负责布局和提示文案，具体点赞交互委托给 ArticleLikeButton。
export function ArticleEngagement({ articleSlug, initialLikes }: ArticleEngagementProps) {
  return (
    <div className="mt-12 border-t border-zinc-200/70 pt-8 dark:border-white/10">
      {/* 居中排列提示语和点赞按钮，形成正文后的轻量互动区。 */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase dark:text-neutral-500">喜欢这篇文稿吗</p>
        <ArticleLikeButton articleSlug={articleSlug} initialLikes={initialLikes} />
      </div>
    </div>
  );
}
