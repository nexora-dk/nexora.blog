import { noteItems } from "@/components/pages/notes/notes-data";
import { articleItems } from "@/components/pages/writing/writing-data";

export type TimelineType = "writing" | "notes" | "memory";

export type TimelineItem = {
  title: string;
  description: string;
  href: string;
  date: string;
  type: TimelineType;
  typeLabel: string;
  meta: string;
};

export const timelineTypeMeta: Record<TimelineType, { label: string; description: string }> = {
  writing: {
    label: "文稿",
    description: "按时间回看写下的长文与技术记录。",
  },
  notes: {
    label: "手记",
    description: "整理日常观察和阶段性想法。",
  },
  memory: {
    label: "回忆",
    description: "收藏朝花夕拾里的生活片段。",
  },
};

export function isTimelineType(value: unknown): value is TimelineType {
  return value === "writing" || value === "notes" || value === "memory";
}

export function getDateParts(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return { year: "近期", shortDate: date, time: 0 };
  }

  const [, year, month, day] = match;
  return {
    year,
    shortDate: `${month}月${day}日`,
    time: new Date(Number(year), Number(month) - 1, Number(day)).getTime(),
  };
}

export function getTimelineItems(type?: TimelineType) {
  const timelineItems: TimelineItem[] = [
    ...articleItems.map((article) => ({
      title: article.title,
      description: article.description,
      href: article.href,
      date: article.date,
      type: "writing" as const,
      typeLabel: timelineTypeMeta.writing.label,
      meta: article.categoryLabel,
    })),
    ...noteItems.map((note) => {
      const noteType: TimelineType = note.column === "memory" ? "memory" : "notes";

      return {
        title: note.title,
        description: note.description,
        href: note.href,
        date: note.publishedAt,
        type: noteType,
        typeLabel: timelineTypeMeta[noteType].label,
        meta: note.columnLabel,
      };
    }),
  ].sort((first, second) => getDateParts(second.date).time - getDateParts(first.date).time);

  return type ? timelineItems.filter((item) => item.type === type) : timelineItems;
}
