// Neon Serverless 客户端用于通过 DATABASE_URL 创建 PostgreSQL HTTP 连接。
import { neon } from '@neondatabase/serverless';
// drizzle 负责把 Neon SQL 客户端包装成类型安全的 Drizzle 查询实例。
import { drizzle } from 'drizzle-orm/neon-http';

// 强制要求环境变量存在，否则在应用启动或构建时立即报错，避免后续数据库请求才失败。
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 环境变量未设置');
}

// 使用环境变量里的连接字符串创建 Neon SQL 执行器。
const sql = neon(process.env.DATABASE_URL);
// 导出全站复用的 Drizzle 数据库实例，后续查询都应从这里统一引入。
export const db = drizzle(sql);
