"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { runOfficialWebIngestion, runSampleIngestion } from "@/lib/ingestion/runs";

export async function publishItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date()
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/review");
  revalidatePath("/admin/content");
}

export async function rejectItem(id: string) {
  await prisma.intelItem.update({
    where: { id },
    data: { status: "REJECTED" }
  });
  revalidatePath("/admin/review");
  revalidatePath("/admin/content");
}

export async function deleteItem(id: string) {
  await prisma.intelItem.delete({ where: { id } });
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function publishIntelItem(id: string) {
  await publishItem(id);
}

export async function rejectIntelItem(id: string) {
  await rejectItem(id);
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
  revalidateIngestionViews();
}

export async function triggerOfficialIngestion() {
  await runOfficialWebIngestion({ trigger: "manual" });
  revalidateIngestionViews();
}

function revalidateIngestionViews() {
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/admin");
  revalidatePath("/admin/ingestion");
  revalidatePath("/admin/review");
}

export async function createTopic(data: {
  name: string;
  slug: string;
  description: string;
  tags: string;
  sponsored?: boolean;
}) {
  await prisma.topic.create({ data: { ...data, sponsored: data.sponsored ?? false } });
  revalidatePath("/admin/topics-ads");
}

export async function updateTopic(id: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  tags?: string;
  sponsored?: boolean;
}) {
  await prisma.topic.update({ where: { id }, data });
  revalidatePath("/admin/topics-ads");
}

export async function deleteTopic(id: string) {
  await prisma.topic.delete({ where: { id } });
  revalidatePath("/admin/topics-ads");
}

export async function createAdSlot(data: {
  name: string;
  page: string;
  position: string;
  sizeHint?: string;
  enabled?: boolean;
  label?: string;
  content?: string;
}) {
  await prisma.adSlot.create({
    data: {
      name: data.name,
      page: data.page,
      position: data.position,
      sizeHint: data.sizeHint ?? "responsive",
      enabled: data.enabled ?? true,
      label: data.label ?? "广告合作",
      content: data.content,
    }
  });
  revalidatePath("/admin/topics-ads");
}

export async function updateAdSlot(id: string, data: {
  name?: string;
  page?: string;
  position?: string;
  sizeHint?: string;
  enabled?: boolean;
  label?: string;
  content?: string;
}) {
  await prisma.adSlot.update({ where: { id }, data });
  revalidatePath("/admin/topics-ads");
}

export async function deleteAdSlot(id: string) {
  await prisma.adSlot.delete({ where: { id } });
  revalidatePath("/admin/topics-ads");
}

export async function submitInquiry(data: {
  company: string;
  contact: string;
  phone: string;
  email: string;
  type: string;
  message?: string;
  budget?: string;
}) {
  await prisma.inquiry.create({
    data: {
      company: data.company,
      contact: data.contact,
      phone: data.phone,
      email: data.email,
      type: data.type,
      message: data.message,
      budget: data.budget,
    }
  });
  revalidatePath("/admin/inquiries");
}
