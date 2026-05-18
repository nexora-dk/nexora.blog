import { asc, eq } from "drizzle-orm";


import { db } from "../db";
import {
  noteComments,
  notes,
  readmeComments,
  users,
  writingComments,
  writings,
} from "../schemas/schema";
import { retryDatabaseRead } from "./retry";

export type AdminCommentItem = {
  id: number;
  parentId: number | null;
  source: "writing" | "note" | "readme";
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorImage: string | null;
  content: string;
  createdAt: Date;
  targetTitle: string;
  targetSlug: string;
};

export async function getAdminComments(): Promise<AdminCommentItem[]> {
  const [writingRows, noteRows, readmeRows] = await Promise.all([
    retryDatabaseRead(() =>
      db
        .select({
          id: writingComments.id,
          parentId: writingComments.parentId,
          authorId: users.id,
          authorName: users.name,
          authorEmail: users.email,
          authorImage: users.image,
          content: writingComments.content,
          createdAt: writingComments.createdAt,
          targetTitle: writings.title,
          targetSlug: writings.slug,
        })
        .from(writingComments)
        .innerJoin(users, eq(writingComments.userId, users.id))
        .innerJoin(writings, eq(writingComments.writingId, writings.id))
        .orderBy(asc(writingComments.createdAt)),
    ),
    retryDatabaseRead(() =>
      db
        .select({
          id: noteComments.id,
          parentId: noteComments.parentId,
          authorId: users.id,
          authorName: users.name,
          authorEmail: users.email,
          authorImage: users.image,
          content: noteComments.content,
          createdAt: noteComments.createdAt,
          targetTitle: notes.title,
          targetSlug: notes.slug,
        })
        .from(noteComments)
        .innerJoin(users, eq(noteComments.userId, users.id))
        .innerJoin(notes, eq(noteComments.noteId, notes.id))
        .orderBy(asc(noteComments.createdAt)),
    ),
    retryDatabaseRead(() =>
      db
        .select({
          id: readmeComments.id,
          parentId: readmeComments.parentId,
          authorId: users.id,
          authorName: users.name,
          authorEmail: users.email,
          authorImage: users.image,
          content: readmeComments.content,
          createdAt: readmeComments.createdAt,
        })
        .from(readmeComments)
        .innerJoin(users, eq(readmeComments.userId, users.id))
        .orderBy(asc(readmeComments.createdAt)),
    ),
  ]);

  const comments: AdminCommentItem[] = [
    ...writingRows.map((comment) => ({
      ...comment,
      source: "writing" as const,
    })),
    ...noteRows.map((comment) => ({
      ...comment,
      source: "note" as const,
    })),
    ...readmeRows.map((comment) => ({
      ...comment,
      source: "readme" as const,
      targetTitle: "自述",
      targetSlug: "Readme",
    })),
  ];

  comments.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());

  return comments;
}


export async function deleteAdminComment(input: {
  id: number;
  source: AdminCommentItem["source"];
}) {
  const table =
    input.source === "writing"
      ? writingComments
      : input.source === "note"
        ? noteComments
        : readmeComments;

  const deletedRows = await db
    .delete(table)
    .where(eq(table.id, input.id))
    .returning({ id: table.id });

  return deletedRows.length > 0;
}
