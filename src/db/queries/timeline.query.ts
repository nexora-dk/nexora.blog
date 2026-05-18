import { timelineTypeMeta, type TimelineItem, type TimelineType } from "@/components/pages/timeline/timeline-data";
import { getNoteItems } from "./notes.query";
import { getWritingItems } from "./writings.query";

export async function getTimelineItemsFromDb(type?: TimelineType): Promise<TimelineItem[]> {
  const [writingItems, noteItems] = await Promise.all([
    getWritingItems(),
    getNoteItems(),
  ]);

  const timelineItems: TimelineItem[] = [
    ...writingItems.map((writing) => ({
      title: writing.title,
      description: writing.description,
      href: writing.href,
      date: writing.date,
      type: "writing" as const,
      typeLabel: timelineTypeMeta.writing.label,
      meta: writing.categoryLabel,
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
  ].sort((first, second) => getDateTime(second.date) - getDateTime(first.date));

  return type ? timelineItems.filter((item) => item.type === type) : timelineItems;
}

function getDateTime(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return 0;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}
