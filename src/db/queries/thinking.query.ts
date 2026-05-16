import { desc, eq } from "drizzle-orm";

import { db } from "../db";
import { thinking } from "../schemas/schema";
import type { ThinkingItem } from "@/components/pages/thinking/thinking-data";
import { retryDatabaseRead } from "./retry";

export type AdminThinkingItem = ThinkingItem & {
  createdAt: Date;
  updatedAt: Date;
};

type CreateThinkingInput = {
  content: string;
  publishedAt: string;
  time: string | null;
  mood: string | null;
  isVisible: boolean;
  sourceKey?: string | null;
};

type UpdateThinkingInput = {
  content: string;
  publishedAt: string;
  time: string | null;
  mood: string | null;
  isVisible: boolean;
};

function mapThinkingItem(row: typeof thinking.$inferSelect): AdminThinkingItem {
  return {
    id: row.id,
    content: row.content,
    publishedAt: row.publishedAt,
    time: row.time ?? undefined,
    mood: row.mood ?? undefined,
    isVisible: row.isVisible,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getThinkingItems(): Promise<ThinkingItem[]> {
  const rows = await retryDatabaseRead(() =>
    db.select().from(thinking).where(eq(thinking.isVisible, true)).orderBy(desc(thinking.id)),
  );

  return rows.map(mapThinkingItem);
}

export async function getAdminThinkingItems(): Promise<AdminThinkingItem[]> {
  const rows = await retryDatabaseRead(() =>
    db.select().from(thinking).orderBy(desc(thinking.id)),
  );

  return rows.map(mapThinkingItem);
}

export async function getAdminThinkingById(id: number) {
  const [thought] = await retryDatabaseRead(() =>
    db.select().from(thinking).where(eq(thinking.id, id)).limit(1),
  );

  return thought ? mapThinkingItem(thought) : undefined;
}

export async function createThinking(input: CreateThinkingInput) {
  const [thought] = await db
    .insert(thinking)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: thinking.sourceKey,
      set: {
        content: input.content,
        publishedAt: input.publishedAt,
        time: input.time,
        mood: input.mood,
        isVisible: input.isVisible,
        updatedAt: new Date(),
      },
    })
    .returning({ id: thinking.id });

  return thought;
}

export async function updateThinkingById(id: number, input: UpdateThinkingInput) {
  const [thought] = await db
    .update(thinking)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(thinking.id, id))
    .returning({ id: thinking.id });

  return thought;
}

export async function deleteThinkingById(id: number) {
  const [thought] = await db
    .delete(thinking)
    .where(eq(thinking.id, id))
    .returning({ id: thinking.id });

  return thought;
}
