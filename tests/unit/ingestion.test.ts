import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { classifyItem } from "@/lib/ingestion/classify";
import { fingerprintRawItem } from "@/lib/ingestion/dedupe";
import { ingestItems } from "@/lib/ingestion/pipeline";

async function resetIngestionTables() {
  await prisma.ingestionRun.deleteMany();
  await prisma.intelItem.deleteMany();
  await prisma.rawItem.deleteMany();
  await prisma.priceObservation.deleteMany();
  await prisma.source.deleteMany();
}

describe("ingestion helpers", () => {
  beforeEach(async () => {
    await resetIngestionTables();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("classifies smart equipment content", () => {
    const result = classifyItem("智能投喂设备在对虾养殖中应用", "水质监测与投喂联动");
    expect(result.category).toBe("SMART_EQUIPMENT");
    expect(result.tags).toContain("智能投喂");
  });

  it("classifies price content", () => {
    const result = classifyItem("南美白对虾价格上涨", "华南市场价格异动");
    expect(result.category).toBe("PRICE_MARKET");
    expect(result.tags).toContain("价格");
  });

  it("creates same fingerprint for equivalent source/title/url", () => {
    const one = fingerprintRawItem("source-a", "Title", "https://example.com/a");
    const two = fingerprintRawItem("source-a", "Title", "https://example.com/a");
    expect(one).toBe(two);
  });

  it("returns ingestion stats for created, duplicate, and risky items", async () => {
    const source = await prisma.source.create({
      data: {
        name: "测试来源",
        url: "https://example.com",
        type: "TEST",
        country: "中国",
        crawlMethod: "WEB_LIST",
        crawlFrequency: "DAILY",
        trustLevel: 3
      }
    });

    const first = await ingestItems([
      {
        sourceId: source.id,
        sourceName: source.name,
        title: "智能投喂设备联动水质监测",
        url: "https://example.com/smart-feeding",
        summary: "智能投喂设备帮助养殖场减少饲料浪费。",
        publishedAt: new Date("2026-05-08T08:00:00Z")
      },
      {
        sourceId: source.id,
        sourceName: source.name,
        title: "水产病害预警提示",
        url: "https://example.com/disease-warning",
        summary: "病害预警内容需要人工复核，避免误导养殖决策。",
        publishedAt: new Date("2026-05-08T09:00:00Z")
      }
    ]);

    expect(first.itemsSeen).toBe(2);
    expect(first.itemsCreated).toBe(2);
    expect(first.duplicates).toBe(0);
    expect(first.riskCount).toBe(1);
    expect(first.intelItems).toHaveLength(2);

    const second = await ingestItems([
      {
        sourceId: source.id,
        sourceName: source.name,
        title: "智能投喂设备联动水质监测",
        url: "https://example.com/smart-feeding",
        summary: "重复样本。",
        publishedAt: new Date("2026-05-08T10:00:00Z")
      }
    ]);

    expect(second.itemsSeen).toBe(1);
    expect(second.itemsCreated).toBe(0);
    expect(second.duplicates).toBe(1);
    expect(second.riskCount).toBe(0);
    expect(second.intelItems).toHaveLength(1);
  });
});
