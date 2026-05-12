import { desc, eq, sql } from "drizzle-orm";

import { db } from "../db";
import { notes } from "../schemas/schema";
import type { NoteItem } from "@/components/pages/notes/notes-data";

export async function getNoteItems(): Promise<NoteItem[]> {
  const rows = await db.select().from(notes).orderBy(desc(notes.id));

  return rows.map((note) => ({
    title: note.title,
    description: note.description,
    href: note.href,
    date: note.date,
    column: note.column as NoteItem["column"],
    columnLabel: note.columnLabel,
    mood: note.mood ?? undefined,
    location: note.location ?? undefined,
    tags: note.tags,
    publishedAt: note.publishedAt,
    views: String(note.views),
    likes: String(note.likes),
    readingTime: note.readingTime,
  }));
}

export async function getNoteItemBySlug(slug: string): Promise<NoteItem | undefined> {
  const [note] = await db.select().from(notes).where(eq(notes.slug, slug)).limit(1);

  if (!note) {
    return undefined;
  }

  return {
    title: note.title,
    description: note.description,
    href: note.href,
    date: note.date,
    column: note.column as NoteItem["column"],
    columnLabel: note.columnLabel,
    mood: note.mood ?? undefined,
    location: note.location ?? undefined,
    tags: note.tags,
    publishedAt: note.publishedAt,
    views: String(note.views),
    likes: String(note.likes),
    readingTime: note.readingTime,
  };
}

//浏览量
export async function incrementNoteViews(slug: string) {
  await db
    .update(notes)
    .set({
      views: sql`${notes.views} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(notes.slug, slug));
}

export async function updateNoteLikes(slug: string, delta: 1 | -1) {
  await db
    .update(notes)
    .set({
      likes: sql`greatest(${notes.likes} + ${delta}, 0)`,
      updatedAt: new Date(),
    })
    .where(eq(notes.slug, slug));
}
