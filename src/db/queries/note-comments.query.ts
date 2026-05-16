import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "../db";
import { noteComments, notes, users } from "../schemas/schema";
import { isRetryableDatabaseError, retryDatabaseRead } from "./retry";

export type NoteCommentItem = {
  id: number;
  parentId: number | null;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  content: string;
  createdAt: Date;
};

export type NoteCommentReplyItem = NoteCommentItem & {
  parentId: number;
};

export type NoteCommentTreeItem = NoteCommentItem & {
  parentId: null;
  replies: NoteCommentReplyItem[];
};

export async function getNoteComments(
  slug: string,
): Promise<NoteCommentTreeItem[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select({
        id: noteComments.id,
        parentId: noteComments.parentId,
        authorId: users.id,
        authorName: users.name,
        authorImage: users.image,
        content: noteComments.content,
        createdAt: noteComments.createdAt,
      })
      .from(noteComments)
      .innerJoin(notes, eq(noteComments.noteId, notes.id))
      .innerJoin(users, eq(noteComments.userId, users.id))
      .where(eq(notes.slug, slug))
      .orderBy(asc(noteComments.createdAt)),
  );

  const roots: NoteCommentTreeItem[] = [];
  const rootsById = new Map<number, NoteCommentTreeItem>();
  const replies: NoteCommentReplyItem[] = [];

  for (const row of rows) {
    if (row.parentId === null) {
      const root: NoteCommentTreeItem = {
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

export async function createNoteComment(input: {
  slug: string;
  userId: string;
  content: string;
  parentId?: number | null;
}) {
  const [note] = await retryDatabaseRead(() =>
    db
      .select({ id: notes.id })
      .from(notes)
      .where(eq(notes.slug, input.slug))
      .limit(1),
  );

  if (!note) {
    throw new Error("Note not found");
  }

  let parentId: number | null = null;
  const inputParentId = input.parentId;

  if (inputParentId !== undefined && inputParentId !== null) {
    const [parentComment] = await retryDatabaseRead(() =>
      db
        .select({
          id: noteComments.id,
          parentId: noteComments.parentId,
        })
        .from(noteComments)
        .where(
          and(
            eq(noteComments.id, inputParentId),
            eq(noteComments.noteId, note.id),
          ),
        )
        .limit(1),
    );

    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    parentId = parentComment.parentId ?? parentComment.id;
  }

  try {
    await db.insert(noteComments).values({
      noteId: note.id,
      parentId,
      userId: input.userId,
      content: input.content,
      updatedAt: new Date(),
    });
  } catch (error) {
    if (!isRetryableDatabaseError(error)) {
      throw error;
    }

    const parentCondition = parentId === null ? isNull(noteComments.parentId) : eq(noteComments.parentId, parentId);
    const [createdComment] = await retryDatabaseRead(() =>
      db
        .select({ id: noteComments.id })
        .from(noteComments)
        .where(
          and(
            eq(noteComments.noteId, note.id),
            parentCondition,
            eq(noteComments.userId, input.userId),
            eq(noteComments.content, input.content),
          ),
        )
        .limit(1),
    );

    if (!createdComment) {
      throw error;
    }
  }
}

export async function deleteNoteComment(input: {
  id: number;
  slug: string;
  userId: string;
}) {
  const [note] = await retryDatabaseRead(() =>
    db
      .select({ id: notes.id })
      .from(notes)
      .where(eq(notes.slug, input.slug))
      .limit(1),
  );

  if (!note) {
    throw new Error("Note not found");
  }

  const deletedRows = await db
    .delete(noteComments)
    .where(
      and(
        eq(noteComments.id, input.id),
        eq(noteComments.noteId, note.id),
        eq(noteComments.userId, input.userId),
      ),
    )
    .returning({ id: noteComments.id });

  return deletedRows.length > 0;
}
