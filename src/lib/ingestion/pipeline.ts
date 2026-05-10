import { prisma } from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { AI_DISCLOSURE } from "@/lib/constants";
import { classifyItem } from "./classify";
import { fingerprintRawItem } from "./dedupe";
import { assessRisk } from "./risk";
import { generateAiSummary } from "@/lib/ai/summarize";
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

    // Try AI summary if API key is configured
    const aiSummary = await buildSummary(item, classification);

    const risk = assessRisk({
      category: classification.category,
      title: item.title,
      summary: aiSummary
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

async function buildSummary(
  item: IncomingRawItem,
  classification: Awaited<ReturnType<typeof classifyItem>>
): Promise<string> {
  const aiResult = await generateAiSummary({
    title: item.title,
    url: item.url,
    originalSummary: item.summary,
    category: classification.category,
    region: classification.region ?? undefined,
  });

  if (aiResult.ok) {
    return `${aiResult.summary}\n\n${AI_DISCLOSURE}`;
  }

  // Fallback to original summary + disclosure
  const fallback = item.summary || item.title;
  return `${fallback}\n\n${AI_DISCLOSURE}`;
}
