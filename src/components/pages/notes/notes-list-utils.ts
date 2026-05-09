import type { NoteColumn, NoteItem } from "./notes-data";

// 从中文发布日期中提取归档年份，无法解析时归入“近期”。
export function getNoteYear(date: string) {
  return date.match(/^(\d{4})年/)?.[1] ?? "近期";
}

// 归档列表使用短日期，保留月日以降低列表噪音。
export function getNoteShortDate(date: string) {
  const match = date.match(/^\d{4}年(\d{1,2})月(\d{1,2})日/);
  return match ? `${match[1]}月${match[2]}日` : date;
}

// 生成分页链接时同时保留专栏查询参数；第一页省略 page 以保持 URL 简洁。
export function getNotesPageHref(nextPage: number, activeColumn?: NoteColumn) {
  const params = new URLSearchParams();

  // 当前处于专栏筛选时，上一页/下一页不能丢失 column 条件。
  if (activeColumn) {
    params.set("column", activeColumn);
  }

  // 只有第二页及以后才写入 page，避免 /notes?page=1 这类重复入口。
  if (nextPage > 1) {
    params.set("page", String(nextPage));
  }

  const query = params.toString();
  return query ? `/notes?${query}` : "/notes";
}

// 按发布日期年份把手记顺序聚合，供专栏归档视图分组循环渲染。
export function groupNotesByYear(notes: NoteItem[]) {
  return notes.reduce<Array<{ year: string; items: NoteItem[] }>>((groups, note) => {
    const year = getNoteYear(note.publishedAt);
    const group = groups.find((item) => item.year === year);

    // 已存在年份则追加到该组，否则创建新的年份分组。
    if (group) {
      group.items.push(note);
    } else {
      groups.push({ year, items: [note] });
    }

    return groups;
  }, []);
}
