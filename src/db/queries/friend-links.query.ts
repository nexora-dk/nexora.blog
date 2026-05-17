import { and, asc, eq } from "drizzle-orm";

import { db } from "../db";
import { friendLinks } from "../schemas/schema";
import { retryDatabaseRead } from "./retry";

export type FriendLinkStatus = "pending" | "approved" | "rejected" | "hidden";

export type FriendLinkItem = {
  id: number;
  name: string;
  description: string;
  avatarUrl: string;
  blogUrl: string;
  status: FriendLinkStatus;
  isVisible: boolean;
  sortOrder: number;
  sourceKey: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminFriendLinkItem = FriendLinkItem;

type FriendLinkInput = {
  name: string;
  description: string;
  avatarUrl: string;
  blogUrl: string;
  status: FriendLinkStatus;
  isVisible: boolean;
  sortOrder: number;
  sourceKey?: string | null;
};

type FriendLinkApplicationInput = {
  name: string;
  description: string;
  avatarUrl: string;
  blogUrl: string;
};

function mapFriendLink(row: typeof friendLinks.$inferSelect): FriendLinkItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    avatarUrl: row.avatarUrl,
    blogUrl: row.blogUrl,
    status: row.status,
    isVisible: row.isVisible,
    sortOrder: row.sortOrder,
    sourceKey: row.sourceKey,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getFriendLinks(): Promise<FriendLinkItem[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select()
      .from(friendLinks)
      .where(and(eq(friendLinks.status, "approved"), eq(friendLinks.isVisible, true)))
      .orderBy(asc(friendLinks.sortOrder), asc(friendLinks.id)),
  );

  return rows.map(mapFriendLink);
}

export async function getAdminFriendLinks(): Promise<AdminFriendLinkItem[]> {
  const rows = await retryDatabaseRead(() =>
    db.select().from(friendLinks).orderBy(asc(friendLinks.sortOrder), asc(friendLinks.id)),
  );

  return rows.map(mapFriendLink);
}

export async function getAdminFriendLinkById(id: number) {
  const [friendLink] = await retryDatabaseRead(() =>
    db.select().from(friendLinks).where(eq(friendLinks.id, id)).limit(1),
  );

  return friendLink ? mapFriendLink(friendLink) : undefined;
}

export async function createFriendLink(input: FriendLinkInput) {
  const [friendLink] = await db
    .insert(friendLinks)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .returning({ id: friendLinks.id });

  return friendLink;
}

export async function createFriendLinkApplication(input: FriendLinkApplicationInput) {
  const [friendLink] = await db
    .insert(friendLinks)
    .values({
      ...input,
      status: "pending",
      isVisible: false,
      sortOrder: 0,
      sourceKey: null,
      updatedAt: new Date(),
    })
    .returning({ id: friendLinks.id });

  return friendLink;
}

export async function updateFriendLinkById(id: number, input: FriendLinkInput) {
  const [friendLink] = await db
    .update(friendLinks)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(friendLinks.id, id))
    .returning({ id: friendLinks.id });

  return friendLink;
}

export async function updateFriendLinkStatusById(
  id: number,
  status: FriendLinkStatus,
  isVisible: boolean,
) {
  const [friendLink] = await db
    .update(friendLinks)
    .set({
      status,
      isVisible,
      updatedAt: new Date(),
    })
    .where(eq(friendLinks.id, id))
    .returning({ id: friendLinks.id });

  return friendLink;
}

export async function deleteFriendLinkById(id: number) {
  const [friendLink] = await db
    .delete(friendLinks)
    .where(eq(friendLinks.id, id))
    .returning({ id: friendLinks.id });

  return friendLink;
}
