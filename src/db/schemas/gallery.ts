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

export const galleryPhotos = pgTable(
  "gallery_photos",
  {
    id: serial("id").primaryKey(),
    imageSrc: text("image_src").notNull(),
    alt: varchar("alt", { length: 160 }).notNull(),
    title: varchar("title", { length: 120 }).notNull(),
    location: varchar("location", { length: 120 }).notNull(),
    isFeatured: boolean("is_featured").notNull().default(false),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    sourceKey: varchar("source_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("gallery_photos_source_key_idx").on(table.sourceKey),
    index("gallery_photos_is_visible_idx").on(table.isVisible),
    index("gallery_photos_is_featured_idx").on(table.isFeatured),
    index("gallery_photos_sort_order_idx").on(table.sortOrder),
  ],
);
