import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const [latestRun, sourceCount, publishedCount] = await Promise.all([
    prisma.ingestionRun.findFirst({
      orderBy: { startedAt: "desc" },
      select: {
        id: true,
        trigger: true,
        status: true,
        itemsSeen: true,
        itemsCreated: true,
        duplicates: true,
        riskCount: true,
        errorMessage: true,
        startedAt: true,
        finishedAt: true
      }
    }),
    prisma.source.count(),
    prisma.intelItem.count({ where: { status: "PUBLISHED" } })
  ]);

  return NextResponse.json({
    ok: true,
    service: "zhiyu-observatory-cron",
    cron: {
      enabled: true,
      path: "/api/cron/ingest",
      schedule: "15 22 * * *",
      timezone: "UTC",
      note: "Vercel Cron calls /api/cron/ingest daily. This status endpoint is safe to open in a browser."
    },
    database: {
      sourceCount,
      publishedCount
    },
    latestRun
  });
}
