import type { ArticleCategory, ArticleItem } from "./writing-data";

export function getArticleYear(date: string) {
  return date.match(/^(\d{4})年/)?.[1] ?? "未归档";
}

export function getArticleShortDate(date: string) {
  const match = date.match(/^\d{4}年(\d{1,2})月(\d{1,2})日/);
  return match ? `${match[1]}月${match[2]}日` : date;
}

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

export function groupArticlesByYear(articles: ArticleItem[]) {
  return articles.reduce<Array<{ year: string; items: ArticleItem[] }>>((groups, article) => {
    const year = getArticleYear(article.date);
    const group = groups.find((item) => item.year === year);

    if (group) {
      group.items.push(article);
    } else {
      groups.push({ year, items: [article] });
    }

    return groups;
  }, []);
}
