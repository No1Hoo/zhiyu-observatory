import { PrismaClient } from "@prisma/client";
import { applySqliteSchema } from "../../scripts/apply-sqlite-schema";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; zhiyuSqliteReady?: boolean };

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.VERCEL ? "file:/tmp/zhiyu-observatory.db" : "file:./dev.db";
}

if (!globalForPrisma.zhiyuSqliteReady && process.env.DATABASE_URL?.startsWith("file:")) {
  try {
    applySqliteSchema(process.env.DATABASE_URL);
    globalForPrisma.zhiyuSqliteReady = true;
  } catch (error) {
    console.error("Failed to bootstrap SQLite database", error);
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
