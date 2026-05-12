import { desc, eq, sql } from "drizzle-orm";

import { db } from "../db";
import { writings } from "../schemas/schema";
import type { ArticleItem } from "@/components/pages/writing/writing-data";

export async function getWritingItems(): Promise<ArticleItem[]> {
  const rows = await db.select().from(writings).orderBy(desc(writings.id));

  return rows.map((writing) => ({
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
  }));
}

export async function getWritingItemBySlug(slug: string): Promise<ArticleItem | undefined> {
  const [writing] = await db.select().from(writings).where(eq(writings.slug, slug)).limit(1);

  if (!writing) {
    return undefined;
  }

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



