import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db";
import { runOfficialWebIngestion } from "@/lib/ingestion/runs";
import type { OfficialWebSourceConfig } from "@/lib/ingestion/official-sources";

async function resetTables() {
  await prisma.ingestionRun.deleteMany();
  await prisma.intelItem.deleteMany();
  await prisma.rawItem.deleteMany();
  await prisma.priceObservation.deleteMany();
  await prisma.source.deleteMany();
}

const sources: OfficialWebSourceConfig[] = [
  {
    name: "官方来源 A",
    url: "https://example.com/a",
    type: "OFFICIAL",
    country: "中国",
    categoryHint: "SMART_EQUIPMENT",
    trustLevel: 5,
    limit: 5,
    includeKeywords: ["水产"]
  },
  {
    name: "官方来源 B",
    url: "https://example.com/b",
    type: "OFFICIAL",
    country: "Global",
    categoryHint: "OVERSEAS",
    trustLevel: 4,
    limit: 5,
    includeKeywords: ["market"]
  }
];

describe("official source ingestion runs", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await resetTables();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("records one successful run per official source", async () => {
    const collect = vi
      .fn()
      .mockResolvedValueOnce([
        {
          sourceName: "官方来源 A",
          title: "水产智能养殖设备进展",
          url: "https://example.com/a/1",
          summary: "水产智能养殖设备进展",
          publishedAt: new Date("2026-05-09T00:00:00Z")
        }
      ])
      .mockResolvedValueOnce([
        {
          sourceName: "官方来源 B",
          title: "Seafood market update",
          url: "https://example.com/b/1",
          summary: "Seafood market update",
          publishedAt: new Date("2026-05-09T00:00:00Z")
        }
      ]);

    const result = await runOfficialWebIngestion({ trigger: "manual", sources, collect });

    expect(result.sourcesSeen).toBe(2);
    expect(result.sourcesSucceeded).toBe(2);
    expect(result.sourcesFailed).toBe(0);
    expect(result.itemsSeen).toBe(2);
    expect(result.itemsCreated).toBe(2);

    const runs = await prisma.ingestionRun.findMany({ orderBy: { startedAt: "asc" } });
    expect(runs).toHaveLength(2);
    expect(runs.every((run) => run.status === "success")).toBe(true);

    const storedSources = await prisma.source.findMany({ orderBy: { name: "asc" } });
    expect(storedSources.map((source) => source.crawlMethod)).toEqual(["OFFICIAL_WEB", "OFFICIAL_WEB"]);
  });

  it("continues after one official source fails and records the failure", async () => {
    const collect = vi
      .fn()
      .mockRejectedValueOnce(new Error("source unavailable"))
      .mockResolvedValueOnce([
        {
          sourceName: "官方来源 B",
          title: "Seafood market update",
          url: "https://example.com/b/1",
          summary: "Seafood market update",
          publishedAt: new Date("2026-05-09T00:00:00Z")
        }
      ]);

    const result = await runOfficialWebIngestion({ trigger: "cron", sources, collect });

    expect(result.sourcesSeen).toBe(2);
    expect(result.sourcesSucceeded).toBe(1);
    expect(result.sourcesFailed).toBe(1);
    expect(result.itemsCreated).toBe(1);

    const failed = await prisma.ingestionRun.findFirstOrThrow({ where: { status: "failed" } });
    expect(failed.trigger).toBe("cron");
    expect(failed.errorMessage).toContain("source unavailable");

    const failedSource = await prisma.source.findFirstOrThrow({ where: { name: "官方来源 A" } });
    expect(failedSource.lastStatus).toBe("failed");
    expect(failedSource.lastError).toContain("source unavailable");
  });
});
