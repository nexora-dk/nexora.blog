import { and, asc, eq } from "drizzle-orm";

import { db } from "../db";
import { users, writingComments, writings } from "../schemas/schema";

export type WritingCommentItem = {
  id: number;
  parentId: number | null;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  content: string;
  createdAt: Date;
};

export type WritingCommentReplyItem = WritingCommentItem & {
  parentId: number;
};

export type WritingCommentTreeItem = WritingCommentItem & {
  parentId: null;
  replies: WritingCommentReplyItem[];
};

export async function getWritingComments(
  slug: string,
): Promise<WritingCommentTreeItem[]> {
  const rows = await db
    .select({
      id: writingComments.id,
      parentId: writingComments.parentId,
      authorId: users.id,
      authorName: users.name,
      authorImage: users.image,
      content: writingComments.content,
      createdAt: writingComments.createdAt,
    })
    .from(writingComments)
    .innerJoin(writings, eq(writingComments.writingId, writings.id))
    .innerJoin(users, eq(writingComments.userId, users.id))
    .where(eq(writings.slug, slug))
    .orderBy(asc(writingComments.createdAt));

  const roots: WritingCommentTreeItem[] = [];
  const rootsById = new Map<number, WritingCommentTreeItem>();
  const replies: WritingCommentReplyItem[] = [];

  for (const row of rows) {
    if (row.parentId === null) {
      const root: WritingCommentTreeItem = {
        ...row,
        parentId: null,
        replies: [],
      };

      roots.push(root);
      rootsById.set(root.id, root);
    } else {
      replies.push({
        ...row,
        parentId: row.parentId,
      });
    }
  }

  for (const reply of replies) {
    rootsById.get(reply.parentId)?.replies.push(reply);
  }

  roots.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());

  return roots;
}

export async function createWritingComment(input: {
  slug: string;
  userId: string;
  content: string;
  parentId?: number | null;
}) {
  const [writing] = await db
    .select({ id: writings.id })
    .from(writings)
    .where(eq(writings.slug, input.slug))
    .limit(1);

  if (!writing) {
    throw new Error("Writing not found");
  }

  let parentId: number | null = null;

  if (input.parentId !== undefined && input.parentId !== null) {
    const [parentComment] = await db
      .select({
        id: writingComments.id,
        parentId: writingComments.parentId,
      })
      .from(writingComments)
      .where(
        and(
          eq(writingComments.id, input.parentId),
          eq(writingComments.writingId, writing.id),
        ),
      )
      .limit(1);

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    parentId = parentComment.parentId ?? parentComment.id;
  }

  await db.insert(writingComments).values({
    writingId: writing.id,
    parentId,
    userId: input.userId,
    content: input.content,
    updatedAt: new Date(),
  });
}

export async function deleteWritingComment(input: {
  id: number;
  slug: string;
  userId: string;
}) {
  const [writing] = await db
    .select({ id: writings.id })
    .from(writings)
    .where(eq(writings.slug, input.slug))
    .limit(1);

  if (!writing) {
    throw new Error("Writing not found");
  }

  const deletedRows = await db
    .delete(writingComments)
    .where(
      and(
        eq(writingComments.id, input.id),
        eq(writingComments.writingId, writing.id),
        eq(writingComments.userId, input.userId),
      ),
    )
    .returning({ id: writingComments.id });

  return deletedRows.length > 0;
}
