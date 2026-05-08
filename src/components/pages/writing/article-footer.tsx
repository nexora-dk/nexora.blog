import Link from "next/link";

import { formatArticleDate } from "./article-format";

type ArticleFooterProps = {
  modifiedTime: string;
};

export function ArticleFooter({ modifiedTime }: ArticleFooterProps) {
  return (
    <footer className="grid gap-3 border-t border-zinc-200/70 pt-6 text-sm text-zinc-500 dark:border-white/10 dark:text-neutral-400 md:grid-cols-2">
      <Link href="/writing" className="transition hover:text-zinc-950 dark:hover:text-neutral-50">
        返回全部文稿
      </Link>
      <span className="md:text-right">最后修改于 {formatArticleDate(modifiedTime)}</span>
    </footer>
  );
}
