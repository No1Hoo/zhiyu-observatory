import { prisma } from "@/lib/db";
import { officialWebSources, type OfficialWebSourceConfig } from "./official-sources";
import { collectOfficialWebItems } from "./official-web";
import { ingestItems } from "./pipeline";
import { buildSampleItems } from "./sample-items";
import type { IncomingRawItem } from "./types";

export type IngestionTrigger = "manual" | "cron" | "cli";

type RunSampleIngestionInput = {
  trigger: IngestionTrigger;
};

type OfficialCollect = (config: OfficialWebSourceConfig) => Promise<Array<Omit<IncomingRawItem, "sourceId">>>;

type RunOfficialWebIngestionInput = {
  trigger: IngestionTrigger;
  sources?: OfficialWebSourceConfig[];
  collect?: OfficialCollect;
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

async function upsertOfficialSource(config: OfficialWebSourceConfig) {
  const existing = await prisma.source.findFirst({ where: { name: config.name } });
  const data = {
    name: config.name,
    url: config.url,
    type: config.type,
    country: config.country,
    crawlMethod: "OFFICIAL_WEB",
    crawlFrequency: "DAILY",
    crawlLimit: config.limit,
    trustLevel: config.trustLevel,
    defaultReview: "PENDING_REVIEW"
  };

  if (existing) {
    return prisma.source.update({
      where: { id: existing.id },
      data
    });
  }

  return prisma.source.create({ data });
}

export async function runOfficialWebIngestion(input: RunOfficialWebIngestionInput) {
  const configs = input.sources ?? officialWebSources;
  const collect = input.collect ?? collectOfficialWebItems;
  const summary = {
    trigger: input.trigger,
    sourcesSeen: configs.length,
    sourcesSucceeded: 0,
    sourcesFailed: 0,
    itemsSeen: 0,
    itemsCreated: 0,
    duplicates: 0,
    riskCount: 0
  };

  for (const config of configs) {
    const source = await upsertOfficialSource(config);
    const run = await prisma.ingestionRun.create({
      data: {
        trigger: input.trigger,
        status: "running",
        sourceId: source.id
      }
    });

    try {
      const collected = await collect(config);
      const stats = await ingestItems(
        collected.map((item) => ({
          ...item,
          sourceId: source.id,
          sourceName: source.name
        }))
      );
      const finishedAt = new Date();

      await prisma.source.update({
        where: { id: source.id },
        data: {
          lastCrawledAt: finishedAt,
          lastStatus: "success",
          lastError: null
        }
      });

      await prisma.ingestionRun.update({
        where: { id: run.id },
        data: {
          status: "success",
          finishedAt,
          itemsSeen: stats.itemsSeen,
          itemsCreated: stats.itemsCreated,
          duplicates: stats.duplicates,
          riskCount: stats.riskCount
        }
      });

      summary.sourcesSucceeded += 1;
      summary.itemsSeen += stats.itemsSeen;
      summary.itemsCreated += stats.itemsCreated;
      summary.duplicates += stats.duplicates;
      summary.riskCount += stats.riskCount;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const finishedAt = new Date();

      await prisma.source.update({
        where: { id: source.id },
        data: {
          lastCrawledAt: finishedAt,
          lastStatus: "failed",
          lastError: message
        }
      });

      await prisma.ingestionRun.update({
        where: { id: run.id },
        data: {
          status: "failed",
          finishedAt,
          errorMessage: message
        }
      });

      summary.sourcesFailed += 1;
    }
  }

  return summary;
}
