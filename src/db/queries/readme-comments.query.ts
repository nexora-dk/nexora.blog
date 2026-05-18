import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "../db";
import { readmeComments, users } from "../schemas/schema";
import { isRetryableDatabaseError, retryDatabaseRead } from "./retry";

export type ReadmeCommentItem = {
  id: number;
  parentId: number | null;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  content: string;
  createdAt: Date;
};

export type ReadmeCommentReplyItem = ReadmeCommentItem & {
  parentId: number;
};

export type ReadmeCommentTreeItem = ReadmeCommentItem & {
  parentId: null;
  replies: ReadmeCommentReplyItem[];
};

export async function getReadmeComments(): Promise<ReadmeCommentTreeItem[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select({
        id: readmeComments.id,
        parentId: readmeComments.parentId,
        authorId: users.id,
        authorName: users.name,
        authorImage: users.image,
        content: readmeComments.content,
        createdAt: readmeComments.createdAt,
      })
      .from(readmeComments)
      .innerJoin(users, eq(readmeComments.userId, users.id))
      .orderBy(asc(readmeComments.createdAt)),
  );

  const roots: ReadmeCommentTreeItem[] = [];
  const rootsById = new Map<number, ReadmeCommentTreeItem>();
  const replies: ReadmeCommentReplyItem[] = [];

  for (const row of rows) {
    if (row.parentId === null) {
      const root: ReadmeCommentTreeItem = {
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

  roots.sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
  );

  return roots;
}

export async function createReadmeComment(input: {
  userId: string;
  content: string;
  parentId?: number | null;
}) {
  let parentId: number | null = null;
  const inputParentId = input.parentId;

  if (inputParentId !== undefined && inputParentId !== null) {
    const [parentComment] = await retryDatabaseRead(() =>
      db
        .select({
          id: readmeComments.id,
          parentId: readmeComments.parentId,
        })
        .from(readmeComments)
        .where(eq(readmeComments.id, inputParentId))
        .limit(1),
    );

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    parentId = parentComment.parentId ?? parentComment.id;
  }

  try {
    await db.insert(readmeComments).values({
      parentId,
      userId: input.userId,
      content: input.content,
      updatedAt: new Date(),
    });
  } catch (error) {
    if (!isRetryableDatabaseError(error)) {
      throw error;
    }

    const parentCondition =
      parentId === null
        ? isNull(readmeComments.parentId)
        : eq(readmeComments.parentId, parentId);
    const [createdComment] = await retryDatabaseRead(() =>
      db
        .select({ id: readmeComments.id })
        .from(readmeComments)
        .where(
          and(
            parentCondition,
            eq(readmeComments.userId, input.userId),
            eq(readmeComments.content, input.content),
          ),
        )
        .limit(1),
    );

    if (!createdComment) {
      throw error;
    }
  }
}

export async function deleteReadmeComment(input: {
  id: number;
  userId: string;
}) {
  const deletedRows = await db
    .delete(readmeComments)
    .where(
      and(
        eq(readmeComments.id, input.id),
        eq(readmeComments.userId, input.userId),
      ),
    )
    .returning({ id: readmeComments.id });

  return deletedRows.length > 0;
}
