import { spawnSync } from "node:child_process";
import { prisma } from "@/lib/db";
import { applySqliteSchema } from "./apply-sqlite-schema";

async function main() {
  const databasePath = applySqliteSchema();
  const sourceCount = await prisma.source.count();

  if (sourceCount === 0) {
    await prisma.$disconnect();
    const result = spawnSync("npm", ["run", "db:seed"], { stdio: "inherit" });
    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  } else {
    await prisma.$disconnect();
  }

  console.log(`Production database ready at ${databasePath}`);
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
