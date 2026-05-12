import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL 环境变量未设置");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql); 
