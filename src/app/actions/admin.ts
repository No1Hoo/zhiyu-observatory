"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { runSampleIngestion } from "@/lib/ingestion/runs";

export async function publishIntelItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date()
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/review");
}

export async function rejectIntelItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: { status: "REJECTED" }
  });
  revalidatePath("/admin/review");
}

export async function featureIntelItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: { isFeatured: true }
  });
  revalidatePath("/");
  revalidatePath("/admin/review");
}

export async function toggleSource(id: string, enabled: boolean) {
  await prisma.source.update({
    where: { id },
    data: { enabled }
  });
  revalidatePath("/admin/sources");
}

export async function triggerSampleIngestion() {
  await runSampleIngestion({ trigger: "manual" });
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/admin");
  revalidatePath("/admin/ingestion");
  revalidatePath("/admin/review");
}
