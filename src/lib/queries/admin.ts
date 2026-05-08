import { prisma } from "@/lib/db";

export async function getAdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [rawToday, pending, published, failedSources, sources] = await Promise.all([
    prisma.rawItem.count({ where: { fetchedAt: { gte: today } } }),
    prisma.intelItem.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.intelItem.count({ where: { status: "PUBLISHED" } }),
    prisma.source.count({ where: { lastStatus: "failed" } }),
    prisma.source.findMany({ orderBy: { updatedAt: "desc" }, take: 6 })
  ]);

  return { rawToday, pending, published, failedSources, sources };
}

export async function getAdminSources() {
  return prisma.source.findMany({ orderBy: [{ enabled: "desc" }, { name: "asc" }] });
}

export async function getReviewQueue() {
  return prisma.intelItem.findMany({
    where: { status: "PENDING_REVIEW" },
    include: { source: true },
    orderBy: [{ riskLevel: "desc" }, { createdAt: "desc" }],
    take: 100
  });
}

export async function getAdminContent() {
  return prisma.intelItem.findMany({
    include: { source: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function getTopicsAndAds() {
  const [topics, adSlots] = await Promise.all([
    prisma.topic.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.adSlot.findMany({ orderBy: { updatedAt: "desc" } })
  ]);
  return { topics, adSlots };
}

export async function getAdminIngestionDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [latestRun, runsToday, createdToday, risksToday, runs, sources] = await Promise.all([
    prisma.ingestionRun.findFirst({ orderBy: { startedAt: "desc" }, include: { source: true } }),
    prisma.ingestionRun.count({ where: { startedAt: { gte: today } } }),
    prisma.ingestionRun.aggregate({
      where: { startedAt: { gte: today } },
      _sum: { itemsCreated: true }
    }),
    prisma.ingestionRun.aggregate({
      where: { startedAt: { gte: today } },
      _sum: { riskCount: true }
    }),
    prisma.ingestionRun.findMany({
      include: { source: true },
      orderBy: { startedAt: "desc" },
      take: 20
    }),
    prisma.source.findMany({
      orderBy: [{ enabled: "desc" }, { lastCrawledAt: "desc" }, { name: "asc" }]
    })
  ]);

  return {
    latestRun,
    runsToday,
    createdToday: createdToday._sum.itemsCreated ?? 0,
    risksToday: risksToday._sum.riskCount ?? 0,
    runs,
    sources
  };
}
