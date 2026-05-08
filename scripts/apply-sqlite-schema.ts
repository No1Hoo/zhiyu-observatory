import { readFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = join(process.cwd(), "prisma", "dev.db");
const migrationPath = join(process.cwd(), "prisma", "migrations", "000_init", "migration.sql");

mkdirSync(dirname(databasePath), { recursive: true });

const sql = readFileSync(migrationPath, "utf8");
const db = new DatabaseSync(databasePath);

try {
  db.exec(sql);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (!message.includes("already exists")) {
    throw error;
  }
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
db.close();

console.log(`Applied SQLite schema to ${databasePath}`);
