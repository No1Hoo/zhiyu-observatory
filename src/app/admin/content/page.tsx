import { getAdminContent } from "@/lib/queries/admin";
import ContentClient from "./ContentClient";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string; page?: string }>;
}) {
  const { q = "", status = "", category = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr, 10));

  const { items, total, totalPages } = await getAdminContent({ q, status, category, page });

  return (
    <ContentClient
      items={items}
      total={total}
      page={page}
      totalPages={totalPages}
      q={q}
      status={status}
      category={category}
    />
  );
}