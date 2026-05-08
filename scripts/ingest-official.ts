import { prisma } from "@/lib/db";
import { runOfficialWebIngestion } from "@/lib/ingestion/runs";

async function main() {
  const result = await runOfficialWebIngestion({ trigger: "cli" });
  console.log(
    `Official ingestion: sources=${result.sourcesSeen}, succeeded=${result.sourcesSucceeded}, failed=${result.sourcesFailed}, seen=${result.itemsSeen}, created=${result.itemsCreated}, duplicates=${result.duplicates}, risks=${result.riskCount}`
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
