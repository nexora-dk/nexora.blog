import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const friendLinks = pgTable(
  "friend_links",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description").notNull(),
    avatarUrl: text("avatar_url").notNull(),
    blogUrl: text("blog_url").notNull(),
    status: varchar("status", { length: 20 })
      .$type<"pending" | "approved" | "rejected" | "hidden">()
      .notNull()
      .default("approved"),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    sourceKey: varchar("source_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("friend_links_source_key_idx").on(table.sourceKey),
    index("friend_links_status_idx").on(table.status),
    index("friend_links_is_visible_idx").on(table.isVisible),
    index("friend_links_sort_order_idx").on(table.sortOrder),
    index("friend_links_public_idx").on(table.status, table.isVisible, table.sortOrder),
  ],
);
