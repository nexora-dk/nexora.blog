import { desc, eq } from "drizzle-orm";

import { db } from "../db";
import { writingComments, writings } from "../schemas/schema";

export type WritingCommentItem = {
  id: number;
  authorName: string;
  content: string;
  createdAt: Date;
};

export async function getWritingComments(slug: string): Promise<WritingCommentItem[]> {
  const rows = await db
    .select({
      id: writingComments.id,
      authorName: writingComments.authorName,
      content: writingComments.content,
      createdAt: writingComments.createdAt,
    })
    .from(writingComments)
    .innerJoin(writings, eq(writingComments.writingId, writings.id))
    .where(eq(writings.slug, slug))
    .orderBy(desc(writingComments.createdAt));

  return rows;
}

export async function createWritingComment(input: {
  slug: string;
  authorName: string;
  content: string;
}) {
  const [writing] = await db
    .select({ id: writings.id })
    .from(writings)
    .where(eq(writings.slug, input.slug))
    .limit(1);

  if (!writing) {
    throw new Error("Writing not found");
  }

  await db.insert(writingComments).values({
    writingId: writing.id,
    authorName: input.authorName,
    content: input.content,
    updatedAt: new Date(),
  });
}
