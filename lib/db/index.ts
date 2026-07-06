import "server-only";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.local.example to .env.local and configure it.");
  }
  if (!global.__mysqlPool) {
    global.__mysqlPool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      connectTimeout: 20000,
      dateStrings: true,
    });
  }
  return global.__mysqlPool;
}

export const pool = getPool();
export const db = drizzle(pool, { schema, mode: "default" });
export { schema };
