// Drizzle 的 PostgreSQL schema 构建器：分别用于声明表、字段类型和约束。
import { pgTable, serial, text, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// posts 表描述博客文章数据结构，供 Drizzle 查询、迁移和类型推导使用。
export const posts = pgTable('posts', {
  // 自增主键，用于数据库内部唯一标识一篇文章。
  id: serial('id').primaryKey(),
  // 文章标题，限制长度为 255，并要求每篇文章都必须填写。
  title: varchar('title', { length: 255 }).notNull(),
  // 文章 slug 用于生成 URL 路径，唯一约束保证不会出现重复详情页。
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  // 文章摘要或描述，可为空，通常用于列表页和 SEO 描述。
  description: text('description'),
  // 文章正文内容，要求非空，保存完整的文章文本或序列化内容。
  content: text('content').notNull(),
  // 发布状态，默认 false，避免新文章在未确认前直接对外展示。
  isPublished: boolean('is_published').default(false).notNull(),
  // 浏览次数，默认从 0 开始，适合后续统计文章热度。
  views: integer('views').default(0).notNull(),
  // 创建时间，默认使用数据库当前时间，记录文章首次入库时间。
  createdAt: timestamp('created_at').defaultNow().notNull(),
  // 更新时间，默认也为当前时间，后续可在更新文章时维护。
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
