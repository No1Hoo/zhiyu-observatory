import { prisma } from "@/lib/db";
import { ingestItems } from "./pipeline";
import { buildSampleItems } from "./sample-items";

export type IngestionTrigger = "manual" | "cron" | "cli";

type RunSampleIngestionInput = {
  trigger: IngestionTrigger;
};

export async function runSampleIngestion(input: RunSampleIngestionInput) {
  const run = await prisma.ingestionRun.create({
    data: {
      trigger: input.trigger,
      status: "running"
    }
  });

  try {
    const source = await prisma.source.findFirst({
      where: { enabled: true },
      orderBy: [{ trustLevel: "desc" }, { updatedAt: "desc" }]
    });

    if (!source) {
      throw new Error("No enabled source found. Run npm run db:seed first.");
    }

    const stats = await ingestItems(buildSampleItems(source));
    const finishedAt = new Date();

    await prisma.source.update({
      where: { id: source.id },
      data: {
        lastCrawledAt: finishedAt,
        lastStatus: "success",
        lastError: null
      }
    });

    return prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        sourceId: source.id,
        finishedAt,
        itemsSeen: stats.itemsSeen,
        itemsCreated: stats.itemsCreated,
        duplicates: stats.duplicates,
        riskCount: stats.riskCount
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const finishedAt = new Date();

    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        finishedAt,
        errorMessage: message
      }
    });

    throw error;
  }
}
