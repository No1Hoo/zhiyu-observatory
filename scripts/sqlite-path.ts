import { dirname, isAbsolute, join, resolve } from "node:path";

const prismaDir = join(process.cwd(), "prisma");

export function resolveSqliteDatabasePath(databaseUrl = process.env.DATABASE_URL): string {
  const url = databaseUrl || "file:./dev.db";

  if (!url.startsWith("file:")) {
    throw new Error(`Only SQLite file: DATABASE_URL values are supported by this bootstrap script. Received: ${url}`);
  }

  const rawPath = url.slice("file:".length);
  if (!rawPath) {
    throw new Error("DATABASE_URL must include a SQLite file path.");
  }

  if (isAbsolute(rawPath)) {
    return rawPath;
  }

  return resolve(prismaDir, rawPath);
}

export function resolveSqliteDatabaseDir(databaseUrl = process.env.DATABASE_URL): string {
  return dirname(resolveSqliteDatabasePath(databaseUrl));
}
