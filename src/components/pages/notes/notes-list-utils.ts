import type { NoteColumn, NoteItem } from "./notes-data";

export function getNoteYear(date: string) {
  return date.match(/^(\d{4})年/)?.[1] ?? "近期";
}

export function getNoteShortDate(date: string) {
  const match = date.match(/^\d{4}年(\d{1,2})月(\d{1,2})日/);
  return match ? `${match[1]}月${match[2]}日` : date;
}

export function getNotesPageHref(nextPage: number, activeColumn?: NoteColumn) {
  const params = new URLSearchParams();

  if (activeColumn) {
    params.set("column", activeColumn);
  }

  if (nextPage > 1) {
    params.set("page", String(nextPage));
  }

  const query = params.toString();
  return query ? `/notes?${query}` : "/notes";
}

export function groupNotesByYear(notes: NoteItem[]) {
  return notes.reduce<Array<{ year: string; items: NoteItem[] }>>((groups, note) => {
    const year = getNoteYear(note.publishedAt);
    const group = groups.find((item) => item.year === year);

    if (group) {
      group.items.push(note);
    } else {
      groups.push({ year, items: [note] });
    }

    return groups;
  }, []);
}
