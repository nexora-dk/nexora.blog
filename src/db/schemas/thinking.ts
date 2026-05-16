import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const thinking = pgTable(
  "thinking",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    publishedAt: varchar("published_at", { length: 50 }).notNull(),
    time: varchar("time", { length: 20 }),
    mood: varchar("mood", { length: 50 }),
    isVisible: boolean("is_visible").notNull().default(true),
    sourceKey: varchar("source_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("thinking_source_key_idx").on(table.sourceKey)],
);
