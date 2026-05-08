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
