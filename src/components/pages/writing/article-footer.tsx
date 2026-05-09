// 文章页脚组件展示返回列表入口和最后修改时间。
import Link from "next/link";

import { formatArticleDate } from "./article-format";

// modifiedTime 来自文章详情数据，用统一格式化工具输出。
type ArticleFooterProps = {
  modifiedTime: string;
};

// ArticleFooter 是详情页底部的静态信息区，不包含客户端交互。
export function ArticleFooter({ modifiedTime }: ArticleFooterProps) {
  return (
    <footer className="grid gap-3 border-t border-zinc-200/70 pt-6 text-sm text-zinc-500 dark:border-white/10 dark:text-neutral-400 md:grid-cols-2">
      {/* 左侧链接回到文稿列表页。 */}
      <Link href="/writing" className="transition hover:text-zinc-950 dark:hover:text-neutral-50">
        返回全部文稿
      </Link>
      {/* 右侧展示修改时间，桌面端右对齐。 */}
      <span className="md:text-right">最后修改于 {formatArticleDate(modifiedTime)}</span>
    </footer>
  );
}
