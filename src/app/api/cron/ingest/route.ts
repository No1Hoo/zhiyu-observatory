import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron/auth";
import { runSampleIngestion } from "@/lib/ingestion/runs";

export async function POST(request: Request) {
  if (!isAuthorizedCronRequest(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const run = await runSampleIngestion({ trigger: "cron" });
    return NextResponse.json({
      id: run.id,
      status: run.status,
      itemsSeen: run.itemsSeen,
      itemsCreated: run.itemsCreated,
      duplicates: run.duplicates,
      riskCount: run.riskCount
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
