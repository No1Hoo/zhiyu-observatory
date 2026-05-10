import { prisma } from "@/lib/db";

export async function getHomeData() {
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
  return prisma.intelItem.findUnique({
    where: { slug },
    include: { source: true }
  });
}

export async function getPublishedIntelByCategory(category?: string) {
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
  return prisma.source.findMany({ orderBy: [{ trustLevel: "desc" }, { name: "asc" }] });
}

export async function getPriceObservations() {
  return prisma.priceObservation.findMany({
    include: { source: true },
    orderBy: { observedAt: "desc" },
    take: 50
  });
}

export async function getAllPublishedSlugs() {
  return prisma.intelItem.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true }
  });
}
