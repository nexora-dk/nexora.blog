import { existsSync } from "node:fs";
import path from "node:path";
import { desc, eq, or, sql } from "drizzle-orm";

import { db } from "../db";
import { writings } from "../schemas/schema";
import type { ArticleItem } from "@/components/pages/writing/writing-data";
import { retryDatabaseRead } from "./retry";

type CreateWritingInput = {
  slug: string;
  title: string;
  description: string;
  href: string;
  date: string;
  category: ArticleItem["category"];
  categoryLabel: string;
  tags: string[];
  readingTime: string;
  views: number;
  likes: number;
  modifiedTime: string;
  contentPath: string;
};

type UpdateWritingInput = {
  title: string;
  description: string;
  date: string;
  category: ArticleItem["category"];
  categoryLabel: string;
  tags: string[];
  readingTime: string;
  modifiedTime: string;
};

function writingContentExists(writing: typeof writings.$inferSelect) {
  return existsSync(path.join(process.cwd(), "data", "writing", `${writing.slug}.md`));
}

function mapWritingItem(writing: typeof writings.$inferSelect): ArticleItem {
  return {
    title: writing.title,
    slug: writing.slug,
    description: writing.description,
    href: writing.href,
    date: writing.date,
    category: writing.category as ArticleItem["category"],
    categoryLabel: writing.categoryLabel,
    tags: writing.tags,
    readingTime: writing.readingTime,
    views: String(writing.views),
    likes: String(writing.likes),
    modifiedTime: writing.modifiedTime,
  };
}

export async function getWritingExistsBySlugOrHref(input: {
  slug: string;
  href: string;
}) {
  const [writing] = await retryDatabaseRead(() =>
    db
      .select({ id: writings.id })
      .from(writings)
      .where(or(eq(writings.slug, input.slug), eq(writings.href, input.href)))
      .limit(1),
  );

  return Boolean(writing);
}

export async function createWriting(input: CreateWritingInput) {
  const [writing] = await db
    .insert(writings)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .returning({ slug: writings.slug });

  return writing;
}

export async function getAdminWritingBySlug(slug: string) {
  const [writing] = await retryDatabaseRead(() =>
    db.select().from(writings).where(eq(writings.slug, slug)).limit(1),
  );

  return writing;
}

export async function updateWritingBySlug(slug: string, input: UpdateWritingInput) {
  const [writing] = await db
    .update(writings)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(writings.slug, slug))
    .returning({ slug: writings.slug });

  return writing;
}

export async function deleteWritingBySlug(slug: string) {
  const [writing] = await db
    .delete(writings)
    .where(eq(writings.slug, slug))
    .returning({ slug: writings.slug });

  return writing;
}

export async function getWritingItems(): Promise<ArticleItem[]> {
  const rows = await retryDatabaseRead(() => db.select().from(writings).orderBy(desc(writings.id)));

  return rows.filter(writingContentExists).map(mapWritingItem);
}

export async function getWritingItemBySlug(slug: string): Promise<ArticleItem | undefined> {
  const [writing] = await retryDatabaseRead(() => db.select().from(writings).where(eq(writings.slug, slug)).limit(1));

  return writing && writingContentExists(writing) ? mapWritingItem(writing) : undefined;
}

export async function incrementWritingViews(slug: string) {
  await db
    .update(writings)
    .set({
      views: sql`${writings.views} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(writings.slug, slug));
}


export async function updateWritingLikes(slug: string, delta: 1 | -1) {
  await db
    .update(writings)
    .set({
      likes: sql`greatest(${writings.likes} + ${delta}, 0)`,
      updatedAt: new Date(),
    })
    .where(eq(writings.slug, slug));
}



