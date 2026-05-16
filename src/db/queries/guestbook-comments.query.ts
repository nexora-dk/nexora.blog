import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "../db";
import { guestbookComments, users } from "../schemas/schema";
import { isRetryableDatabaseError, retryDatabaseRead } from "./retry";

export type GuestbookCommentItem = {
  id: number;
  parentId: number | null;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  content: string;
  createdAt: Date;
};

export type GuestbookCommentReplyItem = GuestbookCommentItem & {
  parentId: number;
};

export type GuestbookCommentTreeItem = GuestbookCommentItem & {
  parentId: null;
  replies: GuestbookCommentReplyItem[];
};

export async function getGuestbookComments(): Promise<
  GuestbookCommentTreeItem[]
> {
  const rows = await retryDatabaseRead(() =>
    db
      .select({
        id: guestbookComments.id,
        parentId: guestbookComments.parentId,
        authorId: users.id,
        authorName: users.name,
        authorImage: users.image,
        content: guestbookComments.content,
        createdAt: guestbookComments.createdAt,
      })
      .from(guestbookComments)
      .innerJoin(users, eq(guestbookComments.userId, users.id))
      .orderBy(asc(guestbookComments.createdAt)),
  );

  const roots: GuestbookCommentTreeItem[] = [];
  const rootsById = new Map<number, GuestbookCommentTreeItem>();
  const replies: GuestbookCommentReplyItem[] = [];

  for (const row of rows) {
    if (row.parentId === null) {
      const root: GuestbookCommentTreeItem = {
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

export async function createGuestbookComment(input: {
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
          id: guestbookComments.id,
          parentId: guestbookComments.parentId,
        })
        .from(guestbookComments)
        .where(eq(guestbookComments.id, inputParentId))
        .limit(1),
    );

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    parentId = parentComment.parentId ?? parentComment.id;
  }

  try {
    await db.insert(guestbookComments).values({
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
        ? isNull(guestbookComments.parentId)
        : eq(guestbookComments.parentId, parentId);
    const [createdComment] = await retryDatabaseRead(() =>
      db
        .select({ id: guestbookComments.id })
        .from(guestbookComments)
        .where(
          and(
            parentCondition,
            eq(guestbookComments.userId, input.userId),
            eq(guestbookComments.content, input.content),
          ),
        )
        .limit(1),
    );

    if (!createdComment) {
      throw error;
    }
  }
}

export async function deleteGuestbookComment(input: {
  id: number;
  userId: string;
}) {
  const deletedRows = await db
    .delete(guestbookComments)
    .where(
      and(
        eq(guestbookComments.id, input.id),
        eq(guestbookComments.userId, input.userId),
      ),
    )
    .returning({ id: guestbookComments.id });

  return deletedRows.length > 0;
}


export type AdminGuestbookCommentItem = {
  id: number;
  parentId: number | null;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorImage: string | null;
  content: string;
  createdAt: Date;
};

export async function getAdminGuestbookComments(): Promise<
  AdminGuestbookCommentItem[]
> {
  return retryDatabaseRead(() =>
    db
      .select({
        id: guestbookComments.id,
        parentId: guestbookComments.parentId,
        authorId: users.id,
        authorName: users.name,
        authorEmail: users.email,
        authorImage: users.image,
        content: guestbookComments.content,
        createdAt: guestbookComments.createdAt,
      })
      .from(guestbookComments)
      .innerJoin(users, eq(guestbookComments.userId, users.id))
      .orderBy(asc(guestbookComments.createdAt)),
  );
}



export async function deleteAdminGuestbookComment(input: { id: number }) {
  const deletedRows = await db
    .delete(guestbookComments)
    .where(eq(guestbookComments.id, input.id))
    .returning({ id: guestbookComments.id });

  return deletedRows.length > 0;
}
