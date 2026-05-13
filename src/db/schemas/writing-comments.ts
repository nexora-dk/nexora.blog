import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { writings } from "./writings";

export const writingComments = pgTable("writing_comments", {
  id: serial("id").primaryKey(),

  writingId: integer("writing_id")
    .notNull()
    .references(() => writings.id, { onDelete: "cascade" }),

  authorName: varchar("author_name", { length: 80 }).notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
