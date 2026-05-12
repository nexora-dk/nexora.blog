import {integer, jsonb, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core"

export const writings = pgTable("writings", { 
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  href: varchar("href", { length: 256 }).notNull().unique(),

  date:varchar("date",{ length: 256 }).notNull(),
  
  category: varchar("category", { length: 50 }).notNull(),
  categoryLabel: varchar("category_label", { length: 50 }).notNull(),

  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  readingTime: varchar("reading_time", { length: 50 }).notNull(),

  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),

  modifiedTime: varchar("modified_time", { length: 50 }).notNull(),

  contentPath: text("content_path").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})