import {
  type AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./auth";

export const guestbookComments = pgTable("guestbook_comments", {
  id: serial("id").primaryKey(),

  parentId: integer("parent_id").references(
    (): AnyPgColumn => guestbookComments.id,
    { onDelete: "cascade" },
  ),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
