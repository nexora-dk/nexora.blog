import {
  type AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import { notes } from "./notes";

export const noteComments = pgTable("note_comments", {
  id: serial("id").primaryKey(),

  noteId: integer("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),

  parentId: integer("parent_id").references(
    (): AnyPgColumn => noteComments.id,
    { onDelete: "cascade" },
  ),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
