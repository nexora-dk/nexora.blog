import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),

  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  href: varchar("href", { length: 255 }).notNull().unique(),

  date: varchar("date", { length: 50 }).notNull(),

  column: varchar("column", { length: 50 }).notNull(),
  columnLabel: varchar("column_label", { length: 50 }).notNull(),

  mood: varchar("mood", { length: 50 }),
  location: varchar("location", { length: 100 }),

  tags: jsonb("tags").$type<string[]>().notNull().default([]),

  publishedAt: varchar("published_at", { length: 50 }).notNull(),

  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),

  readingTime: varchar("reading_time", { length: 50 }).notNull(),
  insight: text("insight").notNull(),

  contentPath: text("content_path").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
