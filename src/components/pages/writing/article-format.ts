// 文章格式化工具集中放置详情页复用的展示格式转换逻辑。
export function formatArticleDate(date: string) {
  // 优先尝试把传入字符串解析为 Date，以便使用中文本地化日期格式。
  const parsedDate = new Date(date);

  // 只有合法日期才交给 Intl 格式化，避免把“未发布”等文案破坏掉。
  if (!Number.isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  }

  // 无法解析的字符串原样返回，保持 frontmatter 中的自定义语义。
  return date;
}
