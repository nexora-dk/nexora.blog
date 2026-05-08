import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// 强制要求环境变量存在，否则报错提醒
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 环境变量未设置');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);