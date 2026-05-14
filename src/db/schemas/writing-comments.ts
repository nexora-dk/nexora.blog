import {
  type AnyPgColumn,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import { writings } from "./writings";

export const writingComments = pgTable("writing_comments", {
  id: serial("id").primaryKey(),

  writingId: integer("writing_id")
    .notNull()
    .references(() => writings.id, { onDelete: "cascade" }),

  parentId: integer("parent_id").references(
    (): AnyPgColumn => writingComments.id,
    { onDelete: "cascade" },
  ),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
