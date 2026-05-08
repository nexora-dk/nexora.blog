export function formatArticleDate(date: string) {
  const parsedDate = new Date(date);

  if (!Number.isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  }

  return date;
}
