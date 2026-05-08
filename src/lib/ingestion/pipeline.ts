import { prisma } from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { AI_DISCLOSURE } from "@/lib/constants";
import { classifyItem } from "./classify";
import { fingerprintRawItem } from "./dedupe";
import { assessRisk } from "./risk";
import type { IncomingRawItem } from "./types";

export type IngestionResult = {
  itemsSeen: number;
  itemsCreated: number;
  duplicates: number;
  riskCount: number;
  intelItems: Awaited<ReturnType<typeof prisma.intelItem.findMany>>;
};

export async function ingestItems(items: IncomingRawItem[]) {
  const intelItems: IngestionResult["intelItems"] = [];
  const result: IngestionResult = {
    itemsSeen: items.length,
    itemsCreated: 0,
    duplicates: 0,
    riskCount: 0,
    intelItems
  };

  for (const item of items) {
    const fingerprint = fingerprintRawItem(item.sourceId, item.title, item.url);
    const raw = await prisma.rawItem.upsert({
      where: { fingerprint },
      update: {},
      create: {
        sourceId: item.sourceId,
        originalTitle: item.title,
        originalUrl: item.url,
        publishedAt: item.publishedAt,
        rawSummary: item.summary,
        fingerprint
      }
    });

    const existing = await prisma.intelItem.findUnique({ where: { rawItemId: raw.id } });
    if (existing) {
      result.duplicates += 1;
      intelItems.push(existing);
      continue;
    }

    const classification = classifyItem(item.title, item.summary);
    const aiSummary = `${item.summary || item.title}\n\n${AI_DISCLOSURE}`;
    const risk = assessRisk({
      category: classification.category,
      title: item.title,
      summary: item.summary || ""
    });
    if (risk.requiresReview || risk.riskLevel >= 3) {
      result.riskCount += 1;
    }

    const created = await prisma.intelItem.create({
      data: {
        rawItemId: raw.id,
        sourceId: item.sourceId,
        title: item.title,
        slug: `${createSlug(item.title)}-${raw.id.slice(-6)}`,
        aiSummary,
        category: classification.category,
        tags: classification.tags.join(","),
        species: classification.species,
        equipment: classification.equipment,
        region: classification.region,
        status: risk.requiresReview ? "PENDING_REVIEW" : "PUBLISHED",
        riskLevel: risk.riskLevel,
        sourceUrl: item.url,
        sourcePublishedAt: item.publishedAt,
        publishedAt: risk.requiresReview ? null : new Date()
      }
    });

    result.itemsCreated += 1;
    intelItems.push(created);
  }

  return result;
}
