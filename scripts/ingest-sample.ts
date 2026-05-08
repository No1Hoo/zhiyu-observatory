import { prisma } from "@/lib/db";
import { runSampleIngestion } from "@/lib/ingestion/runs";

async function main() {
  const run = await runSampleIngestion({ trigger: "cli" });
  console.log(
    `Ingestion run ${run.status}: seen=${run.itemsSeen}, created=${run.itemsCreated}, duplicates=${run.duplicates}, risks=${run.riskCount}`
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
