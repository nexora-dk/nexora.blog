import { ArticleLikeButton } from "./article-like-button";

type ArticleEngagementProps = {
  articleSlug: string;
  initialLikes: string;
};

export function ArticleEngagement({ articleSlug, initialLikes }: ArticleEngagementProps) {
  return (
    <div className="mt-12 border-t border-zinc-200/70 pt-8 dark:border-white/10">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase dark:text-neutral-500">喜欢这篇文稿吗</p>
        <ArticleLikeButton articleSlug={articleSlug} initialLikes={initialLikes} />
      </div>
    </div>
  );
}
