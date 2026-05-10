// 文稿列表工具函数集中处理日期截取、分页链接和归档分组逻辑。
import type { ArticleCategory, ArticleItem } from "./writing-data";

// 从中文日期文案中提取年份，用于归档分组；不匹配时归入“未归档”。
function getArticleYear(date: string) {
  return date.match(/^(\d{4})年/)?.[1] ?? "未归档";
}

// 把完整中文日期压缩为月日，用于归档列表右侧的短日期展示。
export function getArticleShortDate(date: string) {
  const match = date.match(/^\d{4}年(\d{1,2})月(\d{1,2})日/);
  return match ? `${match[1]}月${match[2]}日` : date;
}

// 根据页码和可选分类生成文稿列表链接，统一保留分页与筛选查询参数。
export function getWritingPageHref(page: number, category?: ArticleCategory) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/writing?${query}` : "/writing";
}

// 按文章日期年份归档；输入文章顺序会被保留，分组按首次出现顺序生成。
export function groupArticlesByYear(articles: ArticleItem[]) {
  return articles.reduce<Array<{ year: string; items: ArticleItem[] }>>((groups, article) => {
    const year = getArticleYear(article.date);
    const group = groups.find((item) => item.year === year);

    // 已有年份分组时追加文章，否则创建新的年份分组。
    if (group) {
      group.items.push(article);
    } else {
      groups.push({ year, items: [article] });
    }

    return groups;
  }, []);
}
