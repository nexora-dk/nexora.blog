import { existsSync } from "node:fs";
import path from "node:path";
import { desc, eq, or, sql } from "drizzle-orm";

import { db } from "../db";
import { notes } from "../schemas/schema";
import type { NoteItem } from "@/components/pages/notes/notes-data";
import { retryDatabaseRead } from "./retry";

type CreateNoteInput = {
  slug: string;
  title: string;
  description: string;
  href: string;
  date: string;
  column: NoteItem["column"];
  columnLabel: string;
  mood: string | null;
  location: string | null;
  tags: string[];
  publishedAt: string;
  views: number;
  likes: number;
  readingTime: string;
  insight: string;
  contentPath: string;
};

type UpdateNoteInput = {
  title: string;
  description: string;
  date: string;
  column: NoteItem["column"];
  columnLabel: string;
  mood: string | null;
  location: string | null;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  insight: string;
};

function noteContentExists(note: typeof notes.$inferSelect) {
  return existsSync(path.join(process.cwd(), "data", "notes", `${note.slug}.md`));
}

function mapNoteItem(note: typeof notes.$inferSelect): NoteItem {
  return {
    title: note.title,
    slug: note.slug,
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

export async function getNoteExistsBySlugOrHref(input: {
  slug: string;
  href: string;
}) {
  const [note] = await retryDatabaseRead(() =>
    db
      .select({ id: notes.id })
      .from(notes)
      .where(or(eq(notes.slug, input.slug), eq(notes.href, input.href)))
      .limit(1),
  );

  return Boolean(note);
}

export async function createNote(input: CreateNoteInput) {
  const [note] = await db
    .insert(notes)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .returning({ slug: notes.slug });

  return note;
}

export async function getAdminNoteBySlug(slug: string) {
  const [note] = await retryDatabaseRead(() =>
    db.select().from(notes).where(eq(notes.slug, slug)).limit(1),
  );

  return note;
}

export async function updateNoteBySlug(slug: string, input: UpdateNoteInput) {
  const [note] = await db
    .update(notes)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(notes.slug, slug))
    .returning({ slug: notes.slug });

  return note;
}

export async function deleteNoteBySlug(slug: string) {
  const [note] = await db
    .delete(notes)
    .where(eq(notes.slug, slug))
    .returning({ slug: notes.slug });

  return note;
}

export async function getNoteItems(): Promise<NoteItem[]> {
  const rows = await retryDatabaseRead(() =>
    db.select().from(notes).orderBy(desc(notes.id)),
  );

  return rows.filter(noteContentExists).map(mapNoteItem);
}

export async function getNoteItemBySlug(slug: string): Promise<NoteItem | undefined> {
  const [note] = await retryDatabaseRead(() =>
    db.select().from(notes).where(eq(notes.slug, slug)).limit(1),
  );

  return note && noteContentExists(note) ? mapNoteItem(note) : undefined;
}

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
