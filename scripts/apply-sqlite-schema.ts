import { readFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = join(process.cwd(), "prisma", "dev.db");
const migrationPath = join(process.cwd(), "prisma", "migrations", "000_init", "migration.sql");

mkdirSync(dirname(databasePath), { recursive: true });

const sql = readFileSync(migrationPath, "utf8");
const db = new DatabaseSync(databasePath);

db.exec(sql);
db.close();

console.log(`Applied SQLite schema to ${databasePath}`);
