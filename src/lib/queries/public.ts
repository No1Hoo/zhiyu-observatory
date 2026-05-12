import { prisma } from "@/lib/db";
import { ensureDemoData } from "@/lib/demo-data";

let publicDataReady = false;
let publicDataPromise: Promise<void> | null = null;

async function ensurePublicData() {
  if (publicDataReady) return;
  if (!publicDataPromise) {
    publicDataPromise = ensureDemoData(prisma)
      .then(() => {
        publicDataReady = true;
      })
      .catch((error) => {
        publicDataPromise = null;
        throw error;
      });
  }
  await publicDataPromise;
}

export async function getHomeData() {
  await ensurePublicData();
  const [featured, latest, prices, adSlots, topics] = await Promise.all([
    prisma.intelItem.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      include: { source: true },
      orderBy: { publishedAt: "desc" },
      take: 5
    }),
    prisma.intelItem.findMany({
      where: { status: "PUBLISHED" },
      include: { source: true },
      orderBy: { publishedAt: "desc" },
      take: 12
    }),
    prisma.priceObservation.findMany({
      include: { source: true },
      orderBy: { observedAt: "desc" },
      take: 6
    }),
    prisma.adSlot.findMany({ where: { enabled: true, page: "home" } }),
    prisma.topic.findMany({ orderBy: { createdAt: "desc" }, take: 4 })
  ]);

  return { featured, latest, prices, adSlots, topics };
}

export async function getIntelBySlug(slug: string) {
  await ensurePublicData();
  return prisma.intelItem.findUnique({
    where: { slug },
    include: { source: true }
  });
}

export async function getPublishedIntelByCategory(category?: string) {
  await ensurePublicData();
  return prisma.intelItem.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category } : {})
    },
    include: { source: true },
    orderBy: { publishedAt: "desc" },
    take: 50
  });
}

export async function getSources() {
  await ensurePublicData();
  return prisma.source.findMany({ orderBy: [{ trustLevel: "desc" }, { name: "asc" }] });
}

export async function getPriceObservations() {
  await ensurePublicData();
  return prisma.priceObservation.findMany({
    include: { source: true },
    orderBy: { observedAt: "desc" },
    take: 50
  });
}

export async function getAllPublishedSlugs() {
  await ensurePublicData();
  return prisma.intelItem.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true }
  });
}

export async function getTopCategories() {
  await ensurePublicData();
  return prisma.intelItem.groupBy({
    by: ["category"],
    where: { status: "PUBLISHED" },
    _count: { category: true },
    orderBy: { _count: { category: "desc" } },
    take: 4
  });
}

export async function getIntelByTag(tag: string) {
  await ensurePublicData();
  return prisma.intelItem.findMany({
    where: {
      status: "PUBLISHED",
      tags: { contains: tag }
    },
    include: { source: true },
    orderBy: { publishedAt: "desc" },
    take: 50
  });
}

export async function getTopicBySlug(slug: string) {
  await ensurePublicData();
  return prisma.topic.findUnique({ where: { slug } });
}

export async function getTopics() {
  await ensurePublicData();
  return prisma.topic.findMany({
    orderBy: { createdAt: "desc" }
  });
}
