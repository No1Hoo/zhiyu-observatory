import { readFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import Database from "better-sqlite3";
import { resolveSqliteDatabaseDir, resolveSqliteDatabasePath } from "./sqlite-path";

const migrationPath = join(process.cwd(), "prisma", "migrations", "000_init", "migration.sql");

export function applySqliteSchema(databaseUrl = process.env.DATABASE_URL): string {
  const databasePath = resolveSqliteDatabasePath(databaseUrl);
  mkdirSync(resolveSqliteDatabaseDir(databaseUrl), { recursive: true });

  const sql = readFileSync(migrationPath, "utf8");
  const db = new Database(databasePath);

  function tableExists(tableName: string): boolean {
    const row = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(tableName);
    return Boolean(row);
  }

  function columnExists(tableName: string, columnName: string): boolean {
    const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all() as Array<{ name: string }>;
    return columns.some((column) => column.name === columnName);
  }

  try {
    db.exec(sql);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("already exists")) {
      throw error;
    }
  }

  if (tableExists("Source") && !columnExists("Source", "rssUrl")) {
    db.exec('ALTER TABLE "Source" ADD COLUMN "rssUrl" TEXT;');
  }

  db.exec(`
CREATE TABLE IF NOT EXISTS "IngestionRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "sourceId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "itemsSeen" INTEGER NOT NULL DEFAULT 0,
    "itemsCreated" INTEGER NOT NULL DEFAULT 0,
    "duplicates" INTEGER NOT NULL DEFAULT 0,
    "riskCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    CONSTRAINT "IngestionRun_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
`);

  db.exec(`
CREATE TABLE IF NOT EXISTS "Inquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ADVERTISING',
    "message" TEXT,
    "budget" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);
  db.close();

  return databasePath;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const databasePath = applySqliteSchema();
  console.log(`Applied SQLite schema to ${databasePath}`);
}
