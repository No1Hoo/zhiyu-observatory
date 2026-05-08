import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { runSampleIngestion } from "@/lib/ingestion/runs";

async function resetTables() {
  await prisma.ingestionRun.deleteMany();
  await prisma.intelItem.deleteMany();
  await prisma.rawItem.deleteMany();
  await prisma.priceObservation.deleteMany();
  await prisma.source.deleteMany();
}

async function createSource(enabled = true) {
  return prisma.source.create({
    data: {
      name: "测试采集源",
      url: "https://example.com/source",
      type: "TEST",
      country: "中国",
      crawlMethod: "WEB_LIST",
      crawlFrequency: "DAILY",
      enabled,
      trustLevel: 3
    }
  });
}

describe("tracked ingestion runs", () => {
  beforeEach(async () => {
    await resetTables();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("records a successful sample run and updates source health", async () => {
    const source = await createSource();

    const result = await runSampleIngestion({ trigger: "manual" });

    expect(result.status).toBe("success");
    expect(result.trigger).toBe("manual");
    expect(result.sourceId).toBe(source.id);
    expect(result.itemsSeen).toBe(2);
    expect(result.itemsCreated).toBe(2);
    expect(result.duplicates).toBe(0);
    expect(result.riskCount).toBeGreaterThanOrEqual(1);
    expect(result.finishedAt).toBeInstanceOf(Date);

    const updatedSource = await prisma.source.findUniqueOrThrow({ where: { id: source.id } });
    expect(updatedSource.lastStatus).toBe("success");
    expect(updatedSource.lastError).toBeNull();
    expect(updatedSource.lastCrawledAt).toBeInstanceOf(Date);
  });

  it("records a failed run when no enabled source exists", async () => {
    await createSource(false);

    await expect(runSampleIngestion({ trigger: "cron" })).rejects.toThrow("No enabled source found");

    const failedRun = await prisma.ingestionRun.findFirstOrThrow();
    expect(failedRun.trigger).toBe("cron");
    expect(failedRun.status).toBe("failed");
    expect(failedRun.itemsSeen).toBe(0);
    expect(failedRun.errorMessage).toContain("No enabled source found");
    expect(failedRun.finishedAt).toBeInstanceOf(Date);
  });
});
