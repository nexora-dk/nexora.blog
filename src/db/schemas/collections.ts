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

export const collectionGroups = pgTable(
  "collection_groups",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    sourceKey: varchar("source_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("collection_groups_slug_idx").on(table.slug),
    uniqueIndex("collection_groups_source_key_idx").on(table.sourceKey),
    index("collection_groups_sort_order_idx").on(table.sortOrder),
  ],
);

export const collectionItems = pgTable(
  "collection_items",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .notNull()
      .references(() => collectionGroups.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 120 }).notNull(),
    description: text("description").notNull(),
    href: text("href"),
    iconType: varchar("icon_type", { length: 20 }).notNull(),
    iconName: varchar("icon_name", { length: 80 }),
    iconSrc: text("icon_src"),
    iconAlt: varchar("icon_alt", { length: 120 }),
    iconClassName: varchar("icon_class_name", { length: 255 }),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    sourceKey: varchar("source_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("collection_items_source_key_idx").on(table.sourceKey),
    index("collection_items_group_id_idx").on(table.groupId),
    index("collection_items_is_visible_idx").on(table.isVisible),
    index("collection_items_sort_order_idx").on(table.sortOrder),
  ],
);
